"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const prisma_1 = require("./lib/prisma");
const gigs_map_1 = require("./routes/gigs.map");
const gigs_approval_1 = require("./routes/gigs.approval");
const auth_1 = require("./routes/auth");
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.get("/health", (_req, res) => res.json({ ok: true }));
// Platforms (SAFE SELECT: avoids reading missing Gig.ownerId column)
app.get("/platforms", async (_req, res) => {
    const platforms = await prisma_1.prisma.platform.findMany({
        select: {
            id: true,
            name: true,
            description: true,
            avgPay: true,
            difficulty: true,
            createdAt: true,
            gigs: {
                select: {
                    id: true,
                    title: true,
                    pay: true,
                    status: true,
                    latitude: true,
                    longitude: true,
                    dueDate: true,
                    createdAt: true
                }
            }
        }
    });
    res.json(platforms);
});
app.post("/platforms", async (req, res) => {
    const { name, description, avgPay, difficulty } = req.body;
    const created = await prisma_1.prisma.platform.create({
        data: { name, description, avgPay, difficulty: Number(difficulty) }
    });
    res.json(created);
});
// Gigs (basic list)
app.get("/gigs", async (_req, res) => {
    const gigs = await prisma_1.prisma.gig.findMany({
        select: {
            id: true,
            title: true,
            pay: true,
            status: true,
            latitude: true,
            longitude: true,
            dueDate: true,
            createdAt: true,
            platform: { select: { id: true, name: true } }
        }
    });
    res.json(gigs);
});
// Gig by id
app.get("/gigs/:id", async (req, res) => {
    const gig = await prisma_1.prisma.gig.findUnique({
        where: { id: req.params.id },
        include: { platform: true, packet: true }
    });
    if (!gig)
        return res.status(404).json({ error: "Not found" });
    res.json(gig);
});
// Create gig
app.post("/gigs", async (req, res) => {
    const { platformId, title, pay, latitude, longitude, dueDate } = req.body;
    const gig = await prisma_1.prisma.gig.create({
        data: {
            platformId,
            title,
            pay: Number(pay),
            latitude: Number(latitude),
            longitude: Number(longitude),
            dueDate: dueDate ? new Date(dueDate) : undefined
        },
        include: { platform: { select: { id: true, name: true } } }
    });
    res.status(201).json(gig);
});
// Update gig status
app.patch("/gigs/:id", async (req, res) => {
    const { status } = req.body;
    const gig = await prisma_1.prisma.gig.update({
        where: { id: req.params.id },
        data: { status },
        include: { platform: { select: { id: true, name: true } }, packet: true }
    });
    res.json(gig);
});
// Mounted routes (if files exist)
app.use("/gigs", gigs_map_1.gigsMap);
app.use("/gigs", gigs_approval_1.gigsApproval);
app.use("/auth", auth_1.auth);
const port = 4000;
app.listen(port, () => {
    console.log(`GigDesk API running on http://localhost:${port}`);
});
