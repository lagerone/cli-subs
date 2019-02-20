#! /usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("mz/fs"));
const path_1 = __importDefault(require("path"));
const prompts_1 = __importDefault(require("prompts"));
const file_hash_service_1 = require("./file-hash-service");
const logger_1 = require("./logger");
const subtitle_file_create_service_1 = require("./subtitle-file-create-service");
const subtitle_service_1 = require("./subtitle-service");
const validMovieFileExtensions = ['.mkv', '.mp4', '.avi'];
const validSubtitleFileExtensions = ['.srt', '.sub'];
const getValidFilePathsFromDirectory = async (dirPath) => {
    const filesAndDirs = await fs_1.default.readdir(dirPath);
    return await filesAndDirs.reduce(async (files, currentFileOrDir) => {
        const resolvedFiles = await files;
        const currentPath = path_1.default.join(dirPath, currentFileOrDir);
        const stats = await fs_1.default.stat(currentPath);
        if ((stats.isFile() &&
            validMovieFileExtensions.includes(path_1.default.extname(currentPath))) ||
            validSubtitleFileExtensions.includes(path_1.default.extname(currentPath))) {
            return [...resolvedFiles, currentPath];
        }
        return resolvedFiles;
    }, Promise.resolve([]));
};
const run = async () => {
    const cwd = process.cwd();
    const validFilePaths = await getValidFilePathsFromDirectory(cwd);
    if (!validFilePaths) {
        logger_1.logger.warn(`No valid files found at "${cwd}".`);
        process.exit(0);
    }
    const fileOptions = validFilePaths.map(filePath => {
        return {
            title: path_1.default.basename(filePath),
            value: filePath,
            disabled: validSubtitleFileExtensions.includes(path_1.default.extname(filePath)),
        };
    });
    const { movieFilePath } = await prompts_1.default([
        {
            type: 'select',
            name: 'movieFilePath',
            message: 'Select movie file',
            choices: fileOptions,
            initial: 0,
        },
    ]);
    if (!movieFilePath) {
        logger_1.logger.warn('No file selected.');
        process.exit(0);
    }
    const fileHash = await file_hash_service_1.getFileHash(movieFilePath);
    const movieFileName = path_1.default.basename(movieFilePath);
    logger_1.logger.info(`Searching avaliable languages for "${movieFileName}".`);
    const languages = await subtitle_service_1.getLanguagesForFile(fileHash);
    if (!languages.length) {
        logger_1.logger.info(`No subtitle languages found for "${movieFileName}".`);
        process.exit(0);
    }
    const { subtitleLanguage } = await prompts_1.default([
        {
            type: 'select',
            name: 'subtitleLanguage',
            message: 'Select subtitle language',
            choices: languages.map(lang => {
                return { title: lang, value: lang };
            }),
            initial: 0,
        },
    ]);
    if (!subtitleLanguage) {
        logger_1.logger.warn('No subtitle language selected.');
        process.exit(0);
    }
    logger_1.logger.info(`Searching for subtitles for "${movieFileName}" and language "${subtitleLanguage}".`);
    const subTitles = await subtitle_service_1.downloadSubtitles(fileHash, subtitleLanguage);
    if (!subTitles) {
        logger_1.logger.info(`No subtitles found for "${movieFileName}" and language "${subtitleLanguage}".`);
        process.exit(0);
    }
    const subtitlefilePath = await subtitle_file_create_service_1.createSubTitleFile(movieFilePath, subTitles);
    logger_1.logger.info(`Successfully created subtitle file at "${subtitlefilePath}".`);
};
run();
