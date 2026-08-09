import { endpoints } from "@/config/endpoints";
import {
  apiClient,
  clearAuthTokens,
  getAuthTokens,
  getRefreshToken,
  setAuthTokens,
  type AuthTokens,
} from "@/config/api";
import type {
  AuthTokenResponse,
  RequestOtpPayload,
  RequestOtpResponse,
  VerifyOtpPayload,
} from "@/types/auth";

export { clearAuthTokens, getAuthTokens, getRefreshToken, setAuthTokens };
export type { AuthTokens };

export const authService = {
  async requestOtp(payload: RequestOtpPayload) {
    const response = await apiClient.post<RequestOtpResponse>(endpoints.auth.requestOtp, {
      email: payload.email,
    });

    return response.data;
  },

  async verifyOtp(payload: VerifyOtpPayload) {
    const response = await apiClient.post<AuthTokenResponse>(endpoints.auth.verifyOtp, {
      email: payload.email,
      code: payload.code,
    });

    setAuthTokens(response.data);
    return response.data;
  },

  async refresh(refreshToken = getRefreshToken()) {
    if (!refreshToken) throw new Error("Missing refresh token.");

    const response = await apiClient.post<AuthTokenResponse>(endpoints.auth.refresh, {
      refresh_token: refreshToken,
    });

    setAuthTokens(response.data);
    return response.data;
  },

  async logout(refreshToken = getRefreshToken()) {
    try {
      if (refreshToken) {
        await apiClient.post<void>(endpoints.auth.logout, {
          refresh_token: refreshToken,
        });
      }
    } finally {
      clearAuthTokens();
    }
  },

  clearSession() {
    clearAuthTokens();
  },
};
