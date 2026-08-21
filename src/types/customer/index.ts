import type { UserAddress } from "@/types/user";

export type ManagedUserRole = "customer" | "admin" | "owner";
export type ManagedUserStatus = "active" | "inactive";

export interface OwnerUserListQuery {
  search?: string;
  role?: ManagedUserRole;
  role_in?: string;
  status?: ManagedUserStatus;
  limit?: number;
  offset?: number;
}

export interface OwnerUserListItem {
  id: string;
  email: string;
  full_name: string;
  phone: string;
  role: ManagedUserRole;
  status: ManagedUserStatus;
  created_at: string;
  updated_at: string;
  deactivated_at: string | null;
}

export interface OwnerUserListResponse {
  items: OwnerUserListItem[];
  total: number;
  limit: number;
  offset: number;
}

export interface OwnerUserDetail extends OwnerUserListItem {
  addresses: UserAddress[];
}

export interface UpdateOwnerUserRolePayload {
  role: ManagedUserRole;
}
