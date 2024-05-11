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
/**
 * Middleware to check if the user's role is "employer".
 * If the user's role is not "employer", returns a 403 Forbidden error.
 */
const checkUserRole = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // Check if the user's role is "employer"
    const userId = req.user._id;
    const user = yield userModel_1.default.findById(userId);
    if (user && user.role === 'employer') {
        // User is an employer, proceed to the next middleware/route handler
        next();
    }
    else {
        // User is not an employer, return a 403 Forbidden error
        return res.status(403).json({
            success: false,
            message: 'Access forbidden. Only employers can perform operation on jobs.',
        });
    }
});
exports.default = checkUserRole;
//# sourceMappingURL=checkUserRole.js.map