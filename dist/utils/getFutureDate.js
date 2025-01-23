"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const getFutureDate = (days) => {
    const date = new Date();
    date.setDate(date.getDate() + days);
    return date;
};
exports.default = getFutureDate;
