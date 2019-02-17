"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const crypto_1 = __importDefault(require("crypto"));
const fs_1 = __importDefault(require("fs"));
const util_1 = require("util");
const statAsync = util_1.promisify(fs_1.default.stat);
const openAsync = util_1.promisify(fs_1.default.open);
const bytesToRead = 64 * 1024;
exports.getFileHash = async (filePath) => {
    const { size } = await statAsync(filePath);
    const fileDescriptor = await openAsync(filePath, 'r');
    const buffer = new Buffer(bytesToRead * 2);
    [0, size - bytesToRead].reduce((bytesRead, currentOffset) => {
        return fs_1.default.readSync(fileDescriptor, buffer, bytesRead, bytesToRead, currentOffset);
    }, 0);
    return crypto_1.default
        .createHash('md5')
        .update(buffer)
        .digest('hex');
};
