import { endpoints } from "@/config/endpoints";
import {
  apiClient,
  clearLegacyAuthTokens,
} from "@/config/api";
import type {
  AuthSessionResponse,
  RequestOtpPayload,
  RequestOtpResponse,
  VerifyOtpPayload,
} from "@/types/auth";

export const authService = {
  async requestOtp(payload: RequestOtpPayload) {
    const response = await apiClient.post<RequestOtpResponse>(endpoints.auth.requestOtp, {
      email: payload.email,
    });

    return response.data;
  },

  async verifyOtp(payload: VerifyOtpPayload) {
    const response = await apiClient.post<AuthSessionResponse>(endpoints.auth.verifyOtp, {
      email: payload.email,
      code: payload.code,
    });

    return response.data;
  },

  async refresh() {
    const response = await apiClient.post<AuthSessionResponse>(endpoints.auth.refresh);
    return response.data;
  },

  async logout() {
    try {
      await apiClient.post<void>(endpoints.auth.logout);
    } finally {
      clearLegacyAuthTokens();
    }
  },

  clearSession() {
    clearLegacyAuthTokens();
  },
};
