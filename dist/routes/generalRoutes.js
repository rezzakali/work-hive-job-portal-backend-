"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const generalController_1 = require("../controllers/generalController");
const contactValidation_1 = __importDefault(require("../validations/general/contactValidation"));
const router = (0, express_1.Router)();
router.post('/contact', contactValidation_1.default, generalController_1.contactController);
exports.default = router;
