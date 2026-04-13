import express from "express";
import cors from "cors";
import { prisma } from "./lib/prisma";
import { gigsMap } from "./routes/gigs.map";
import { gigsApproval } from "./routes/gigs.approval";
import { auth } from "./routes/auth";

const app = express();
app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => res.json({ ok: true }));

// Platforms (SAFE SELECT: avoids reading missing Gig.ownerId column)
app.get("/platforms", async (_req, res) => {
  const platforms = await prisma.platform.findMany({
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
  const created = await prisma.platform.create({
    data: { name, description, avgPay, difficulty: Number(difficulty) }
  });
  res.json(created);
});

// Gigs (basic list)
app.get("/gigs", async (_req, res) => {
  const gigs = await prisma.gig.findMany({
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
  const gig = await prisma.gig.findUnique({
    where: { id: req.params.id },
    include: { platform: true, packet: true }
  });
  if (!gig) return res.status(404).json({ error: "Not found" });
  res.json(gig);
});

// Create gig
app.post("/gigs", async (req, res) => {
  const { platformId, title, pay, latitude, longitude, dueDate } = req.body;
  const gig = await prisma.gig.create({
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
  const gig = await prisma.gig.update({
    where: { id: req.params.id },
    data: { status },
    include: { platform: { select: { id: true, name: true } }, packet: true }
  });
  res.json(gig);
});

// Mounted routes (if files exist)
app.use("/gigs", gigsMap);
app.use("/gigs", gigsApproval);
app.use("/auth", auth);

const port = 4000;
app.listen(port, () => {
  console.log(`GigDesk API running on http://localhost:${port}`);
});
