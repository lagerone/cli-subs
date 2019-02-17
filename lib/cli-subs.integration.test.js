"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const file_hash_service_1 = require("./file-hash-service");
const subtitle_service_1 = require("./subtitle-service");
describe('cli-subs integration test', () => {
    it('should calculate hash for justified.mp4', async () => {
        // Arrange
        const movieFilePath = path_1.default.join(__dirname, '../samples/justified.mp4');
        // Act
        const hash = await file_hash_service_1.getFileHash(movieFilePath);
        // Assert
        expect(hash).toEqual('edc1981d6459c6111fe36205b4aff6c2');
    });
    it('should download subtitles, pt first', async () => {
        // Arrange
        const movieFilePath = path_1.default.join(__dirname, '../samples/justified.mp4');
        const hash = await file_hash_service_1.getFileHash(movieFilePath);
        // Act
        const result = await subtitle_service_1.downloadSubtitles(hash, 'pt,en');
        // Assert
        expect(result).not.toBeFalsy();
    });
    it('should download subtitles, en first', async () => {
        // Arrange
        const movieFilePath = path_1.default.join(__dirname, '../samples/justified.mp4');
        const hash = await file_hash_service_1.getFileHash(movieFilePath);
        // Act
        const result = await subtitle_service_1.downloadSubtitles(hash, 'en,pt');
        // Assert
        expect(result).not.toBeFalsy();
    });
    it('should get languages', async () => {
        // Arrange
        const movieFilePath = path_1.default.join(__dirname, '../samples/justified.mp4');
        const hash = await file_hash_service_1.getFileHash(movieFilePath);
        // Act
        const result = await subtitle_service_1.getLanguagesForFile(hash);
        // Assert
        expect(result.length).not.toBeFalsy();
    });
});
