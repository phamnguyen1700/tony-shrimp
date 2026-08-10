import { z } from "zod";
import { isValidAustralianPhone, normalizeAustralianPhone } from "@/lib/australianPhone";

const nullableTrimmedString = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .optional()
    .nullable()
    .transform((value) => (value === "" ? null : value));

const requiredTrimmedString = (field: string, max: number) =>
  z.string().trim().min(1, `${field} is required.`).max(max);

const optionalAustralianPhone = z
  .string()
  .trim()
  .optional()
  .nullable()
  .transform((value) => (value ? normalizeAustralianPhone(value) : null))
  .refine((value) => !value || isValidAustralianPhone(value), "Enter a valid Australian phone number.");

const requiredAustralianPhone = z
  .string()
  .trim()
  .min(1, "Delivery phone is required.")
  .transform((value) => normalizeAustralianPhone(value))
  .refine((value) => isValidAustralianPhone(value), "Enter a valid Australian phone number.");

export const userProfileSchema = z.object({
  full_name: nullableTrimmedString(255),
  phone: optionalAustralianPhone,
});

export const updateUserProfileSchema = userProfileSchema.partial();

export const userAddressSchema = z.object({
  recipient_name: requiredTrimmedString("Recipient name", 255),
  recipient_phone: requiredAustralianPhone,
  address_line1: requiredTrimmedString("Address", 255),
  address_line2: nullableTrimmedString(255),
  suburb: requiredTrimmedString("Suburb", 100),
  state: requiredTrimmedString("State", 50),
  postcode: requiredTrimmedString("Postcode", 16),
  is_default: z.boolean().optional(),
});

export const createUserAddressSchema = userAddressSchema;
export const updateUserAddressSchema = userAddressSchema.partial();

export const addressLocalityCheckQuerySchema = z.object({
  suburb: requiredTrimmedString("Suburb", 100),
  postcode: z.string().trim().regex(/^\d{4}$/, "Australian postcode must be 4 digits."),
});

export const addressSuburbsQuerySchema = z.object({
  search: z.string().trim().min(2).max(100),
});

export type UserProfileFormValues = z.infer<typeof userProfileSchema>;
export type UserAddressFormValues = z.infer<typeof userAddressSchema>;
