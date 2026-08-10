import { z } from "zod";

export const ownerUserRoleSchema = z.enum(["customer", "owner", "admin"]);
export const ownerUserStatusSchema = z.enum(["active", "inactive"]);

export const ownerUserListQuerySchema = z.object({
  search: z.string().trim().optional(),
  role: ownerUserRoleSchema.optional(),
  status: ownerUserStatusSchema.optional(),
  limit: z.number().int().min(1).max(100).optional(),
  offset: z.number().int().min(0).optional(),
});

export const updateOwnerUserRoleSchema = z.object({
  role: ownerUserRoleSchema,
});

