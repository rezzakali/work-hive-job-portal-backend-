"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const imageKitConfig_1 = __importDefault(require("../config/imageKitConfig"));
const uploadToImageKit = (file, folderPath) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield imageKitConfig_1.default.upload({
            file: file.buffer,
            fileName: file.originalname,
            useUniqueFileName: true,
            folder: folderPath,
        });
        return response;
    }
    catch (error) {
        throw new Error(`Image upload failed: ${error.message}`);
    }
});
exports.default = uploadToImageKit;
