import type { AuthUser } from "@/types/user";

export interface RequestOtpPayload {
  email: string;
}

export interface RequestOtpResponse {
  message: string;
}

export interface VerifyOtpPayload {
  email: string;
  code: string;
}

export interface AuthSessionResponse {
  user: AuthUser;
}

