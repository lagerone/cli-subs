"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const file_hash_service_1 = require("./file-hash-service");
async function runTest(filePath, expectedHash) {
    // Act
    const result = await file_hash_service_1.getFileHash(filePath);
    // Assert
    expect(result).toEqual(expectedHash);
}
describe('getFileHash', () => {
    it('should calculate file hash for dexter.mp4', async () => {
        await runTest(path_1.default.join(__dirname, '../samples/dexter.mp4'), 'ffd8d4aa68033dc03d1c8ef373b9028c');
    });
    it('should calculate file hash for justified.mp4', async () => {
        await runTest(path_1.default.join(__dirname, '../samples/justified.mp4'), 'edc1981d6459c6111fe36205b4aff6c2');
    });
});
