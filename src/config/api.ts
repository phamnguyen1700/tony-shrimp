import axios from "axios";
import { env } from "@/config/env";
import { endpoints } from "@/config/endpoints";

const LEGACY_ACCESS_TOKEN_KEY = "tony_access_token";
const LEGACY_REFRESH_TOKEN_KEY = "tony_refresh_token";

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

export interface InsufficientStockItem {
  variant_id: string;
  requested: number;
  available: number;
}

interface RetriableRequestConfig {
  _retry?: boolean;
  headers?: Record<string, unknown>;
}

let refreshPromise: Promise<unknown> | null = null;

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

export function getInsufficientStockItems(
  error: unknown,
): InsufficientStockItem[] | null {
  if (!(error instanceof ApiError)) return null;
  const detail = error.detail as
    | { error?: string; items?: InsufficientStockItem[] }
    | undefined;
  if (detail?.error === "INSUFFICIENT_STOCK" && Array.isArray(detail.items)) {
    return detail.items;
  }
  return null;
}

export function isOrderActionUnavailableError(error: unknown) {
  if (!(error instanceof ApiError) || error.status !== 400) return false;
  if (typeof error.detail !== "string") return false;

  return [
    "Order cannot continue payment.",
    "Only pending payment orders can be cancelled.",
  ].includes(error.detail);
}

export function clearLegacyAuthTokens() {
  if (!isBrowser()) return;
  window.localStorage.removeItem(LEGACY_ACCESS_TOKEN_KEY);
  window.localStorage.removeItem(LEGACY_REFRESH_TOKEN_KEY);
}

async function refreshAccessToken() {
  refreshPromise ??= axios
    .post(`${env.apiBaseUrl}${endpoints.auth.refresh}`, null, {
      withCredentials: true,
    })
    .then((response) => response.data)
    .finally(() => {
      refreshPromise = null;
    });

  return refreshPromise;
}

export function normalizeApiError(error: unknown) {
  if (error instanceof ApiError) return error;

  if (axios.isAxiosError(error)) {
    const status = error.response?.status;
    const data = error.response?.data as
      | { detail?: unknown; message?: unknown }
      | undefined;
    if (
      data?.detail &&
      typeof data.detail === "object" &&
      !Array.isArray(data.detail)
    ) {
      const structured = data.detail as {
        error?: string;
        items?: unknown;
        message?: unknown;
      };
      if (structured.error === "INSUFFICIENT_STOCK") {
        return new ApiError(
          structured.error,
          status,
          structured,
        );
      }
      if (structured.error === "CONTACT_ONLY_ITEM") {
        return new ApiError(structured.error, status, structured);
      }
    }
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

export function getApiErrorMessage(
  error: unknown,
  fallback = "Something went wrong.",
) {
  if (error instanceof ApiError) return error.message;
  if (error instanceof Error && error.message) return error.message;
  return fallback;
}

export const apiClient = axios.create({
  baseURL: env.apiBaseUrl,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (
      axios.isAxiosError(error) &&
      error.response?.status === 401 &&
      error.config
    ) {
      const config = error.config as typeof error.config &
        RetriableRequestConfig;
      const requestUrl = config.url ?? "";
      const isAuthRefreshRequest = requestUrl.includes(endpoints.auth.refresh);
      const isAuthLogoutRequest = requestUrl.includes(endpoints.auth.logout);

      if (!config._retry && !isAuthRefreshRequest && !isAuthLogoutRequest) {
        config._retry = true;

        try {
          await refreshAccessToken();
          return apiClient(config);
        } catch {
          clearLegacyAuthTokens();
        }
      }
    }

    return Promise.reject(normalizeApiError(error));
  },
);
