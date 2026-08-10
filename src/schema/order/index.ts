import { z } from "zod";

export const orderStatusSchema = z.enum(["processing", "shipped", "delivered", "cancelled"]);

export const orderListQuerySchema = z.object({
  limit: z.number().int().min(1).max(100).optional(),
  offset: z.number().int().min(0).optional(),
});

export const ownerOrderListQuerySchema = orderListQuerySchema.extend({
  status: orderStatusSchema.optional(),
  search: z.string().trim().optional(),
});

export const createOrderSchema = z.object({
  shipping_address_id: z.string().uuid("Shipping address is required."),
  items: z
    .array(
      z.object({
        variant_id: z.string().uuid("Variant is required."),
        quantity: z.number().int().min(1).max(999),
      }),
    )
    .min(1, "Cart is empty."),
  customer_note: z.string().trim().max(1000).nullable().optional(),
});

export const updateOwnerOrderStatusSchema = z.object({
  status: orderStatusSchema,
  message: z.string().trim().max(1000).nullable().optional(),
  status_at: z.string().datetime().nullable().optional(),
});

export const updateOwnerOrderTrackingSchema = z.object({
  carrier: z.string().trim().nullable().optional(),
  tracking_number: z.string().trim().nullable().optional(),
  tracking_url: z.string().trim().url().nullable().optional(),
});
