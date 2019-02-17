"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const request_promise_native_1 = __importDefault(require("request-promise-native"));
const logger_1 = require("./logger");
const hostname = 'api.thesubdb.com';
const headers = {
    'Content-Type': 'text/plain;charset=UTF-8',
    'User-Agent': 'SubDB/1.0 (cli-subs/0.1; https://github.com/lagerone/cli-subs)',
};
exports.getLanguagesForFile = async (filehash) => {
    try {
        const csLangs = await request_promise_native_1.default.get({
            url: `http://${hostname}/?action=search&hash=${filehash}`,
            headers,
        });
        return csLangs.split(',');
    }
    catch (error) {
        logger_1.logger.debug(error.message);
        return [];
    }
};
exports.downloadSubtitles = (filehash, language) => {
    return request_promise_native_1.default.get({
        url: `http://${hostname}/?action=download&hash=${filehash}&language=${language}`,
        headers,
    });
};
