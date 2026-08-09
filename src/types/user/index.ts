export type UserRole = "customer" | "staff" | "admin" | "owner";

export interface AuthUser {
  id: string;
  email: string;
  role: UserRole;
  created_at: string;
  updated_at: string;
}
