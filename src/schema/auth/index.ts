import { z } from "zod";

export const requestOtpSchema = z.object({
  email: z.string().trim().email("Enter a valid email address."),
});

export const verifyOtpSchema = z.object({
  email: z.string().trim().email("Enter a valid email address."),
  code: z.string().trim().length(6, "Enter the 6 digit code."),
});

export const refreshTokenSchema = z.object({
  refresh_token: z.string().trim().min(1, "Refresh token is required."),
});

export const loginEmailSchema = requestOtpSchema;
export const loginCodeSchema = verifyOtpSchema.pick({ code: true });

export type RequestOtpFormValues = z.infer<typeof requestOtpSchema>;
export type VerifyOtpFormValues = z.infer<typeof verifyOtpSchema>;
export type LoginEmailFormValues = z.infer<typeof loginEmailSchema>;
export type LoginCodeFormValues = z.infer<typeof loginCodeSchema>;

