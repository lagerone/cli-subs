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
function runTest(filePath, expectedHash) {
    return __awaiter(this, void 0, void 0, function* () {
        // Act
        const result = yield file_hash_service_1.getFileHash(filePath);
        // Assert
        expect(result).toEqual(expectedHash);
    });
}
describe('getFileHash', () => {
    it('should calculate file hash for dexter.mp4', () => __awaiter(this, void 0, void 0, function* () {
        yield runTest(path_1.default.join(__dirname, '../samples/dexter.mp4'), 'ffd8d4aa68033dc03d1c8ef373b9028c');
    }));
    it('should calculate file hash for justified.mp4', () => __awaiter(this, void 0, void 0, function* () {
        yield runTest(path_1.default.join(__dirname, '../samples/justified.mp4'), 'edc1981d6459c6111fe36205b4aff6c2');
    }));
});
