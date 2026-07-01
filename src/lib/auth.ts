import { env } from "@/lib/env";

export type SessionUser = { id: string; workspaceId: string; email: string; name: string; role: "OWNER" | "ADMIN" | "MEMBER" };

// MVP adapter. Replace with Auth.js/Clerk before public launch; all server routes must continue using this boundary.
export async function requireUser(): Promise<SessionUser> {
  const e = env();
  return { id: e.DEV_USER_ID, workspaceId: e.DEV_WORKSPACE_ID, email: "demo@adforge.ai", name: "Demo Seller", role: "OWNER" };
}

export function assertAdmin(user: SessionUser) {
  if (!new Set(["OWNER", "ADMIN"]).has(user.role)) throw new Error("FORBIDDEN");
}
