"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("mz/fs"));
const path_1 = __importDefault(require("path"));
const createSubtitleFilePath = (movieFilePath) => {
    const fileExtension = path_1.default.extname(movieFilePath);
    return movieFilePath.replace(fileExtension, '.srt');
};
exports.createSubTitleFile = async (movieFilePath, subTitleFileContent) => {
    const subTitleFilePath = createSubtitleFilePath(movieFilePath);
    await fs_1.default.writeFile(subTitleFilePath, subTitleFileContent, {
        encoding: 'utf8',
    });
    return subTitleFilePath;
};
