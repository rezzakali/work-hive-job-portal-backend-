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
Object.defineProperty(exports, "__esModule", { value: true });
const firebase_admin_config_1 = require("../config/firebase.admin.config");
const sendNotification = (tokens, title, body) => __awaiter(void 0, void 0, void 0, function* () {
    if (!tokens.length) {
        console.warn('No FCM tokens provided.');
        return;
    }
    const message = {
        notification: {
            title,
            body,
        },
        tokens,
    };
    try {
        const response = yield firebase_admin_config_1.messaging.sendEachForMulticast(message);
        console.log('Notifications sent:', response);
    }
    catch (error) {
        console.error('Error sending notifications:', error);
    }
});
exports.default = sendNotification;
