import { Router } from "express";
import { prisma } from "../lib/prisma";

export const auth = Router();

auth.post("/login", async (req, res) => {
  const { email } = req.body;
  const user = await prisma.user.upsert({ where: { email }, update: {}, create: { email } });
  res.json(user);
});
