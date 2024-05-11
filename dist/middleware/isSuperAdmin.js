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
const userModel_1 = __importDefault(require("../models/userModel"));
const isSuperAdmin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user._id;
    const user = yield userModel_1.default.findById(userId);
    if (user && user.role === 'super-admin') {
        next();
    }
    else {
        return res.status(403).json({
            success: false,
            message: 'Access forbidden. Only Admin can access',
        });
    }
});
exports.default = isSuperAdmin;
//# sourceMappingURL=isSuperAdmin.js.map