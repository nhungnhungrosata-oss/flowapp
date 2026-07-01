import { db } from "@/lib/db";

export const CREDIT_COST = { COMPOSITE_IMAGE: 4, VIDEO_FAST_8S: 25, VIDEO_QUALITY_8S: 80, VOICE: 5, EXPORT: 2 } as const;

export async function reserveCredits(workspaceId: string, amount: number) {
  return db.$transaction(async (tx: any) => {
    const wallet = await tx.creditWallet.findUnique({ where: { workspaceId } });
    if (!wallet || wallet.balance - wallet.reserved < amount) throw new Error("INSUFFICIENT_CREDITS");
    return tx.creditWallet.update({ where: { workspaceId }, data: { reserved: { increment: amount } } });
  });
}
export async function captureCredits(workspaceId: string, amount: number, generationId: string) {
  return db.$transaction(async (tx: any) => {
    const wallet = await tx.creditWallet.update({ where: { workspaceId }, data: { reserved: { decrement: amount }, balance: { decrement: amount } } });
    await tx.creditTransaction.create({ data: { walletId: wallet.id, amount, direction: "DEBIT", reason: "GENERATION", generationId } });
  });
}
export async function releaseCredits(workspaceId: string, amount: number) { await db.creditWallet.update({ where: { workspaceId }, data: { reserved: { decrement: amount } } }); }
