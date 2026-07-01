import { PrismaClient, Plan, Role } from "../src/lib/prisma-runtime";
const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.upsert({
    where: { email: "demo@adforge.ai" },
    update: {},
    create: { id: "dev-user", email: "demo@adforge.ai", name: "Demo Seller" }
  });
  const workspace = await prisma.workspace.upsert({
    where: { slug: "demo-shop" },
    update: {},
    create: { id: "dev-workspace", slug: "demo-shop", name: "Demo Shop", plan: Plan.PRO }
  });
  await prisma.membership.upsert({
    where: { userId_workspaceId: { userId: user.id, workspaceId: workspace.id } },
    update: { role: Role.OWNER },
    create: { userId: user.id, workspaceId: workspace.id, role: Role.OWNER }
  });
  await prisma.creditWallet.upsert({
    where: { workspaceId: workspace.id },
    update: {},
    create: { workspaceId: workspace.id, balance: 1200 }
  });
}
main().finally(() => prisma.$disconnect());
