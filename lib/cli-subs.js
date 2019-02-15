#! /usr/bin/env node
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
const run = () => __awaiter(this, void 0, void 0, function* () {
    const cwd = process.cwd();
    const filesAndDirs = yield fs_1.default.readdir(cwd);
    const filePaths = yield filesAndDirs.reduce((files, currentFileOrDir) => __awaiter(this, void 0, void 0, function* () {
        const resolvedFiles = yield files;
        const currentPath = path_1.default.join(cwd, currentFileOrDir);
        const stats = yield fs_1.default.stat(currentPath);
        if ((stats.isFile() &&
            validMovieFileExtensions.includes(path_1.default.extname(currentPath))) ||
            validSubtitleFileExtensions.includes(path_1.default.extname(currentPath))) {
            return [...resolvedFiles, currentPath];
        }
        return resolvedFiles;
    }), Promise.resolve([]));
    const fileOptions = filePaths.map(filePath => {
        return {
            title: path_1.default.basename(filePath),
            value: filePath,
            disabled: validSubtitleFileExtensions.includes(path_1.default.extname(filePath)),
        };
    });
    const { movieFilePath } = yield prompts_1.default([
        {
            type: 'select',
            name: 'movieFilePath',
            message: 'Select movie file',
            choices: fileOptions,
            initial: 0,
        },
    ]);
    if (!movieFilePath) {
        logger_1.logger.warn('No file selected. Program will exit.');
        process.exit(0);
    }
    const fileHash = yield file_hash_service_1.getFileHash(movieFilePath);
    const movieFileName = path_1.default.basename(movieFilePath);
    logger_1.logger.info(`Searching avaliable languages for "${movieFileName}".`);
    const languages = yield subtitle_service_1.getLanguagesForFile(fileHash);
    if (!languages.length) {
        logger_1.logger.info(`No subtitle languages found for "${movieFileName}".`);
        process.exit(0);
    }
    const { subtitleLanguage } = yield prompts_1.default([
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
    logger_1.logger.info(`Searching for subtitles for "${movieFileName}" and language "${subtitleLanguage}".`);
    const subTitles = yield subtitle_service_1.downloadSubtitles(fileHash, subtitleLanguage);
    if (!subTitles) {
        logger_1.logger.info(`No subtitles found for "${movieFileName}" and language "${subtitleLanguage}".`);
        process.exit(0);
    }
    const subtitlefilePath = yield subtitle_file_create_service_1.createSubTitleFile(movieFilePath, subTitles);
    logger_1.logger.info(`Successfully created subtitle file at "${subtitlefilePath}".`);
});
run();
