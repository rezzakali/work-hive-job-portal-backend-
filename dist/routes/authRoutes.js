"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authController_1 = require("../controllers/authController");
const checkAuth_1 = __importDefault(require("../middleware/checkAuth"));
const imageUploader_1 = __importDefault(require("../utils/imageUploader"));
const validateAddAddressData_1 = __importDefault(require("../validations/auth/validateAddAddressData"));
const validatePasswordChangeData_1 = __importDefault(require("../validations/auth/validatePasswordChangeData"));
const validateSigninData_1 = __importDefault(require("../validations/auth/validateSigninData"));
const validateSignupData_1 = __importDefault(require("../validations/auth/validateSignupData"));
const router = (0, express_1.Router)();
// signup
router.post('/signup', validateSignupData_1.default, authController_1.signupController);
// signin
router.post('/signin', validateSigninData_1.default, authController_1.signinController);
// password change
router.patch('/password-change', checkAuth_1.default, validatePasswordChangeData_1.default, authController_1.passwordChange);
// add address
router.patch('/change-address', checkAuth_1.default, validateAddAddressData_1.default, authController_1.addAddressController);
// add resume
router.patch('/add-resume', checkAuth_1.default, imageUploader_1.default.single('file'), authController_1.addResumeController);
exports.default = router;
//# sourceMappingURL=authRoutes.js.map