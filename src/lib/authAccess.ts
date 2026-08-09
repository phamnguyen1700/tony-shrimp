import { routes } from "@/config/routes";
import type { AuthUser, UserRole } from "@/types/user";

const adminRoles = new Set<UserRole>(["admin", "owner"]);

export function canAccessAdmin(user: AuthUser | null) {
  return Boolean(user && adminRoles.has(user.role));
}

export function getPostLoginRedirect(user: AuthUser) {
  return canAccessAdmin(user) ? routes.admin.dashboard : routes.account;
}

