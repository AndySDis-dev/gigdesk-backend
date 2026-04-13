"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.gigsMap = void 0;
const express_1 = require("express");
const prisma_1 = require("../lib/prisma");
const client_1 = require("@prisma/client");
exports.gigsMap = (0, express_1.Router)();
exports.gigsMap.get("/map", async (req, res) => {
    const { minLat, minLng, maxLat, maxLng, status } = req.query;
    const where = {
        latitude: { gte: Number(minLat), lte: Number(maxLat) },
        longitude: { gte: Number(minLng), lte: Number(maxLng) },
    };
    if (status && Object.values(client_1.GigStatus).includes(status)) {
        where.status = status;
    }
    const gigs = await prisma_1.prisma.gig.findMany({
        where,
        select: {
            id: true,
            title: true,
            pay: true,
            status: true,
            latitude: true,
            longitude: true,
            dueDate: true,
            createdAt: true,
            platform: true,
        },
    });
    res.json(gigs);
});
