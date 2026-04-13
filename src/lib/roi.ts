export function roiScore({ pay, minutes, hoursToDue }: { pay: number; minutes: number; hoursToDue: number }) {
  const eph = pay / (minutes / 60);
  const urgency = Math.max(0.25, Math.min(2, 24 / Math.max(1, hoursToDue)));
  return eph * urgency;
}
