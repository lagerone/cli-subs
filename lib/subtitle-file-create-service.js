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
const createSubtitleFilePath = (movieFilePath) => {
    const fileExtension = path_1.default.extname(movieFilePath);
    return movieFilePath.replace(fileExtension, '.srt');
};
exports.createSubTitleFile = (movieFilePath, subTitleFileContent) => __awaiter(this, void 0, void 0, function* () {
    const subTitleFilePath = createSubtitleFilePath(movieFilePath);
    yield fs_1.default.writeFile(subTitleFilePath, subTitleFileContent, {
        encoding: 'utf8',
    });
    return subTitleFilePath;
});
