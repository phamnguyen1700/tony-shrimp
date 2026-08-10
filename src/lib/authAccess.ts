import { routes } from "@/config/routes";
import type { AuthUser, UserRole } from "@/types/user";

const adminRoles = new Set<UserRole>(["admin", "owner"]);

export function normalizeUserRole(role: unknown): UserRole | null {
  if (typeof role !== "string") return null;

  const normalized = role.trim().toLowerCase();
  if (normalized === "customer" || normalized === "staff" || normalized === "admin" || normalized === "owner") {
    return normalized;
  }

  return null;
}

export function canAccessAdmin(user: AuthUser | null) {
  const role = normalizeUserRole(user?.role);
  return Boolean(role && adminRoles.has(role));
}

export function getPostLoginRedirect(user: AuthUser) {
  return canAccessAdmin(user) ? routes.admin.dashboard : routes.account;
}

