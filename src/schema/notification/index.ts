import { z } from "zod";

export const ownerNotificationListQuerySchema = z.object({
  unread_only: z.boolean().optional(),
  limit: z.number().int().min(1).max(100).optional(),
  offset: z.number().int().min(0).optional(),
});
