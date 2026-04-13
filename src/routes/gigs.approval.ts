import { Router } from "express";
import { prisma } from "../lib/prisma";

export const gigsApproval = Router();

gigsApproval.post("/:id/approve", async (req, res) => {
  const { id } = req.params;
  const gig = await prisma.gig.update({ where: { id }, data: { status: "APPROVED" } });
  const packet = await prisma.gigPacket.upsert({
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
