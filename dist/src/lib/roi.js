"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.roiScore = roiScore;
function roiScore({ pay, minutes, hoursToDue }) {
    const eph = pay / (minutes / 60);
    const urgency = Math.max(0.25, Math.min(2, 24 / Math.max(1, hoursToDue)));
    return eph * urgency;
}
