import axios from "axios";
import { env } from "@/config/env";
import { endpoints } from "@/config/endpoints";
import type { AuthTokenResponse } from "@/types/auth";

const ACCESS_TOKEN_KEY = "tony_access_token";
const REFRESH_TOKEN_KEY = "tony_refresh_token";

interface BackendValidationDetail {
  msg?: unknown;
  message?: unknown;
}

export class ApiError extends Error {
  status?: number;
  detail?: unknown;

  constructor(message: string, status?: number, detail?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.detail = detail;
  }
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

interface RetriableRequestConfig {
  _retry?: boolean;
  headers?: Record<string, unknown>;
}

let refreshPromise: Promise<AuthTokenResponse> | null = null;

function isBrowser() {
  return typeof window !== "undefined";
}

function getDetailMessage(detail: unknown) {
  if (typeof detail === "string") return detail;

  if (Array.isArray(detail) && detail.length > 0) {
    const first = detail[0] as BackendValidationDetail;
    if (typeof first.msg === "string") return first.msg;
    if (typeof first.message === "string") return first.message;
  }

  return null;
}

export function getAccessToken() {
  if (!isBrowser()) return null;
  return window.localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function getRefreshToken() {
  if (!isBrowser()) return null;
  return window.localStorage.getItem(REFRESH_TOKEN_KEY);
}

export function getAuthTokens(): AuthTokens | null {
  const accessToken = getAccessToken();
  const refreshToken = getRefreshToken();

  if (!accessToken || !refreshToken) return null;
  return { accessToken, refreshToken };
}

export function setAuthTokens(tokens: AuthTokenResponse) {
  if (!isBrowser()) return;
  window.localStorage.setItem(ACCESS_TOKEN_KEY, tokens.access_token);
  window.localStorage.setItem(REFRESH_TOKEN_KEY, tokens.refresh_token);
}

export function clearAuthTokens() {
  if (!isBrowser()) return;
  window.localStorage.removeItem(ACCESS_TOKEN_KEY);
  window.localStorage.removeItem(REFRESH_TOKEN_KEY);
}

async function refreshAccessToken() {
  const refreshToken = getRefreshToken();
  if (!refreshToken) throw new ApiError("Missing refresh token.", 401);

  refreshPromise ??= axios
    .post<AuthTokenResponse>(`${env.apiBaseUrl}${endpoints.auth.refresh}`, {
      refresh_token: refreshToken,
    })
    .then((response) => {
      setAuthTokens(response.data);
      return response.data;
    })
    .finally(() => {
      refreshPromise = null;
    });

  return refreshPromise;
}

export function normalizeApiError(error: unknown) {
  if (error instanceof ApiError) return error;

  if (axios.isAxiosError(error)) {
    const status = error.response?.status;
    const data = error.response?.data as { detail?: unknown; message?: unknown } | undefined;
    const detailMessage = getDetailMessage(data?.detail);
    const message =
      detailMessage ??
      (typeof data?.message === "string" ? data.message : null) ??
      error.message ??
      "Something went wrong.";

    return new ApiError(message, status, data?.detail ?? data);
  }

  if (error instanceof Error) return error;

  return new ApiError("Something went wrong.");
}

export function getApiErrorMessage(error: unknown, fallback = "Something went wrong.") {
  if (error instanceof ApiError) return error.message;
  if (error instanceof Error && error.message) return error.message;
  return fallback;
}

export const apiClient = axios.create({
  baseURL: env.apiBaseUrl,
  headers: { "Content-Type": "application/json" },
});

apiClient.interceptors.request.use((config) => {
  const accessToken = getAccessToken();

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (axios.isAxiosError(error) && error.response?.status === 401 && error.config) {
      const config = error.config as typeof error.config & RetriableRequestConfig;
      const requestUrl = config.url ?? "";
      const isAuthRefreshRequest = requestUrl.includes(endpoints.auth.refresh);
      const isAuthLogoutRequest = requestUrl.includes(endpoints.auth.logout);

      if (!config._retry && !isAuthRefreshRequest && !isAuthLogoutRequest && getRefreshToken()) {
        config._retry = true;

        try {
          const tokens = await refreshAccessToken();
          config.headers.set("Authorization", `Bearer ${tokens.access_token}`);
          return apiClient(config);
        } catch {
          clearAuthTokens();
        }
      }
    }

    return Promise.reject(normalizeApiError(error));
  },
);
