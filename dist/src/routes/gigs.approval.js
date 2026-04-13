"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.gigsApproval = void 0;
const express_1 = require("express");
const prisma_1 = require("../lib/prisma");
exports.gigsApproval = (0, express_1.Router)();
exports.gigsApproval.post("/:id/approve", async (req, res) => {
    const { id } = req.params;
    const gig = await prisma_1.prisma.gig.update({ where: { id }, data: { status: "APPROVED" } });
    const packet = await prisma_1.prisma.gigPacket.upsert({
        where: { gigId: id },
        update: {},
        create: {
            gigId: id,
            steps: [{ k: "Arrive", done: false }, { k: "Complete", done: false }, { k: "Submit", done: false }],
            requirements: { photos: true, receipt: false }
        }
    });
    res.json({ gig, packet });
});
