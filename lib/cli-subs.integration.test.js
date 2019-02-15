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
const path_1 = __importDefault(require("path"));
const file_hash_service_1 = require("./file-hash-service");
const subtitle_service_1 = require("./subtitle-service");
describe('cli-subs integration test', () => {
    it('should calculate hash for justified.mp4', () => __awaiter(this, void 0, void 0, function* () {
        // Arrange
        const movieFilePath = path_1.default.join(__dirname, '../samples/justified.mp4');
        // Act
        const hash = yield file_hash_service_1.getFileHash(movieFilePath);
        // Assert
        expect(hash).toEqual('edc1981d6459c6111fe36205b4aff6c2');
    }));
    it('should download subtitles, pt first', () => __awaiter(this, void 0, void 0, function* () {
        // Arrange
        const movieFilePath = path_1.default.join(__dirname, '../samples/justified.mp4');
        const hash = yield file_hash_service_1.getFileHash(movieFilePath);
        // Act
        const result = yield subtitle_service_1.downloadSubtitles(hash, 'pt,en');
        // Assert
        expect(result).not.toBeFalsy();
    }));
    it('should download subtitles, en first', () => __awaiter(this, void 0, void 0, function* () {
        // Arrange
        const movieFilePath = path_1.default.join(__dirname, '../samples/justified.mp4');
        const hash = yield file_hash_service_1.getFileHash(movieFilePath);
        // Act
        const result = yield subtitle_service_1.downloadSubtitles(hash, 'en,pt');
        // Assert
        expect(result).not.toBeFalsy();
    }));
    it('should get languages', () => __awaiter(this, void 0, void 0, function* () {
        // Arrange
        const movieFilePath = path_1.default.join(__dirname, '../samples/justified.mp4');
        const hash = yield file_hash_service_1.getFileHash(movieFilePath);
        // Act
        const result = yield subtitle_service_1.getLanguagesForFile(hash);
        // Assert
        expect(result.length).not.toBeFalsy();
    }));
});
