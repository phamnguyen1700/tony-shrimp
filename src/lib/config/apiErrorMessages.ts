import { ApiError, getApiErrorMessage } from "@/config/api";
import type { Translations } from "@/i18n";

type StructuredApiError = {
  error?: string;
  message?: unknown;
};

function getStructuredErrorCode(error: unknown) {
  if (!(error instanceof ApiError)) return null;
  if (!error.detail || typeof error.detail !== "object" || Array.isArray(error.detail)) return null;

  const detail = error.detail as StructuredApiError;
  return detail.error ?? null;
}

export function getLocalizedApiErrorMessage(
  error: unknown,
  t: Translations,
  fallback: string,
) {
  const code = getStructuredErrorCode(error);

  if (code === "INSUFFICIENT_STOCK") return t.apiErrors.insufficientStock;
  if (code === "CONTACT_ONLY_ITEM") return t.product.highQualityContactOnly;

  return getApiErrorMessage(error, fallback);
}
