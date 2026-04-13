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
// Mounted routes (if files exist)
app.use("/gigs", gigs_map_1.gigsMap);
app.use("/gigs", gigs_approval_1.gigsApproval);
app.use("/auth", auth_1.auth);
const port = 4000;
app.listen(port, () => {
    console.log(`GigDesk API running on http://localhost:${port}`);
});
