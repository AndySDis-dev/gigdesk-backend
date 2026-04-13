import { Router } from "express";
import { prisma } from "../lib/prisma";
import { GigStatus } from "@prisma/client";

export const gigsMap = Router();

gigsMap.get("/map", async (req, res) => {
  const { minLat, minLng, maxLat, maxLng, status } = req.query;

  const where: any = {
    latitude: { gte: Number(minLat), lte: Number(maxLat) },
    longitude: { gte: Number(minLng), lte: Number(maxLng) },
  };

  if (status && Object.values(GigStatus).includes(status as GigStatus)) {
    where.status = status;
  }

  const gigs = await prisma.gig.findMany({
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
