import { z } from "zod";

const optionalTrimmedString = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .optional()
    .nullable()
    .transform((value) => (value === "" ? null : value));

export const catalogStatusSchema = z.enum(["active", "inactive"]);
export const careLevelSchema = z.enum(["beginner", "intermediate", "advanced"]);
export const imageContentTypeSchema = z.enum([
  "image/jpeg",
  "image/png",
  "image/webp",
  "video/mp4",
  "video/webm",
  "video/quicktime",
]);
export const saleUnitSchema = z.enum(["each", "pack"]);
export const saleQuantitySchema = z.union([z.literal(1), z.literal(5), z.literal(10)]);
export const moneyStringSchema = z
  .string()
  .trim()
  .regex(/^\d{1,8}(\.\d{1,2})?$/, "Enter a valid price.");
export const uuidSchema = z.string().uuid("Invalid shrimp id.");

export const shrimpListQuerySchema = z
  .object({
    search: z.string().trim().optional(),
    species: z.string().trim().optional(),
    line: z.string().trim().optional(),
    color: z.string().trim().optional(),
    grade: z.string().trim().optional(),
    rarity: z.string().trim().optional(),
    trait: z.string().trim().optional(),
    min_price: z.union([z.number().min(0), moneyStringSchema]).optional(),
    max_price: z.union([z.number().min(0), moneyStringSchema]).optional(),
    in_stock: z.boolean().optional(),
    limit: z.number().int().min(1).max(100).optional(),
    offset: z.number().int().min(0).optional(),
  })
  .partial();

export const ownerShrimpListQuerySchema = shrimpListQuerySchema.extend({
  catalog_status: catalogStatusSchema.optional(),
});

export const shrimpVariantSchema = z.object({
  name: z.string().trim().min(1).max(255),
  sale_unit: saleUnitSchema,
  sale_quantity: saleQuantitySchema,
  price: moneyStringSchema,
  stock_quantity: z.number().int().min(0),
  is_active: z.boolean(),
});

export const updateShrimpVariantSchema = shrimpVariantSchema.partial();

export const shrimpCareParameterSchema = z.object({
  ph_min: moneyStringSchema.optional().nullable(),
  ph_max: moneyStringSchema.optional().nullable(),
  gh_min: moneyStringSchema.optional().nullable(),
  gh_max: moneyStringSchema.optional().nullable(),
  kh_min: moneyStringSchema.optional().nullable(),
  kh_max: moneyStringSchema.optional().nullable(),
  tds_min: z.number().min(0).optional().nullable(),
  tds_max: z.number().min(0).optional().nullable(),
  temperature_min: moneyStringSchema.optional().nullable(),
  temperature_max: moneyStringSchema.optional().nullable(),
  care_level: careLevelSchema.optional(),
});

export const shrimpImageSchema = z.object({
  r2_key: z.string().trim().min(1).max(500),
  url: z.string().trim().url().optional().nullable(),
  alt_text: optionalTrimmedString(255),
  sort_order: z.number().int().min(0),
  is_primary: z.boolean(),
});

export const updateShrimpImageSchema = shrimpImageSchema
  .pick({
    alt_text: true,
    sort_order: true,
  })
  .partial();

export const presignShrimpImageUploadSchema = z.object({
  filename: z.string().trim().min(1).max(255),
  content_type: imageContentTypeSchema,
  file_size_bytes: z.number().int().positive().optional(),
});

export const createShrimpSchema = z.object({
  name: z.string().trim().min(1).max(255),
  slug: z
    .string()
    .trim()
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers, and hyphens.")
    .optional()
    .nullable()
    .transform((value) => (value === "" ? null : value)),
  species: optionalTrimmedString(255),
  line: z.string().trim().min(1).max(64),
  colors: z.array(z.string().trim().min(1).max(64)).max(10).optional(),
  grade: optionalTrimmedString(64),
  rarity: optionalTrimmedString(64),
  meta_title: optionalTrimmedString(255),
  meta_description: optionalTrimmedString(320),
  description: z.string().trim().optional().nullable(),
  catalog_status: catalogStatusSchema.optional(),
  traits: z.array(z.string().trim().min(1)).optional(),
  variants: z.array(shrimpVariantSchema).min(1),
  care_parameter: shrimpCareParameterSchema.optional().nullable(),
  images: z.array(shrimpImageSchema).optional(),
});

export const updateShrimpSchema = createShrimpSchema
  .pick({
    name: true,
    slug: true,
    species: true,
    line: true,
    colors: true,
    grade: true,
    rarity: true,
    meta_title: true,
    meta_description: true,
    description: true,
    catalog_status: true,
    traits: true,
  })
  .partial()
  .extend({
    grade: z.string().trim().max(64).optional().nullable(),
    meta_title: optionalTrimmedString(255),
    meta_description: optionalTrimmedString(320),
  });

export const adminShrimpFormSchema = z.object({
  name: z.string().trim().min(1, "Product name is required"),
  slug: z
    .string()
    .trim()
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers, and hyphens.")
    .optional()
    .or(z.literal("")),
  species: z.string().trim().optional(),
  line: z.string().trim().min(1, "Line is required"),
  colors: z.string().trim().optional(),
  grade: z.string().trim().optional(),
  rarity: z.string().trim().optional(),
  meta_title: z.string().trim().max(255).optional(),
  meta_description: z.string().trim().max(320).optional(),
  description: z.string().trim().optional(),
  description_title: z.string().trim().optional(),
  description_overview: z.string().trim().optional(),
  description_highlights: z.string().trim().optional(),
  description_care_notes: z.string().trim().optional(),
  catalog_status: catalogStatusSchema,
  traits: z.string().trim().optional(),
  variant_name: z.string().trim().optional(),
  sale_unit: saleUnitSchema,
  sale_quantity: z.coerce.number().refine((value) => [1, 5, 10].includes(value), {
    message: "Sale quantity must be 1, 5, or 10",
  }),
  price: z.string().trim().optional(),
  stock_quantity: z.coerce.number().int().min(0),
  variant_active: z.boolean(),
});
