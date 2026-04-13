"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.auth = void 0;
const express_1 = require("express");
const prisma_1 = require("../lib/prisma");
exports.auth = (0, express_1.Router)();
exports.auth.post("/login", async (req, res) => {
    const { email } = req.body;
    const user = await prisma_1.prisma.user.upsert({ where: { email }, update: {}, create: { email } });
    res.json(user);
});
