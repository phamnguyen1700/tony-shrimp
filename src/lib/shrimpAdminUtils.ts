import type {
  AdminShrimpCareDraft,
  AdminShrimpFormInput,
  AdminShrimpVariantDraft,
  CatalogStatus,
  ShrimpCareParameterPayload,
  ShrimpVariant,
  ShrimpVariantPayload,
} from "@/types/shrimp";

export const emptyUuid = "00000000-0000-0000-0000-000000000000";

export const emptyAdminShrimpForm: AdminShrimpFormInput = {
  name: "",
  species: "",
  line: "",
  colors: "",
  grade: "",
  rarity: "",
  description: "",
  description_title: "",
  description_overview: "",
  description_highlights: "",
  description_care_notes: "",
  catalog_status: "inactive",
  traits: "",
  variant_name: "Each",
  sale_unit: "each",
  sale_quantity: 1,
  price: "",
  stock_quantity: 0,
  variant_active: true,
};

export const emptyAdminShrimpCareDraft: AdminShrimpCareDraft = {
  ph_min: "",
  ph_max: "",
  gh_min: "",
  gh_max: "",
  kh_min: "",
  kh_max: "",
  tds_min: "",
  tds_max: "",
  temperature_min: "",
  temperature_max: "",
  care_level: "beginner",
};

export const emptyAdminShrimpVariantDraft: AdminShrimpVariantDraft = {
  name: "Each",
  sale_unit: "each",
  sale_quantity: "1",
  price: "",
  stock_quantity: "0",
  is_active: true,
};

export function toInputString(value: unknown) {
  if (value == null) return "";
  return String(value);
}

export function toNullableString(value: unknown) {
  const next = toInputString(value).trim();
  return next ? next : null;
}

export function toNullableNumber(value: unknown) {
  const next = toInputString(value).trim();
  return next ? Number(next) : null;
}

export function splitTraits(value?: string) {
  return value
    ?.split(",")
    .map((trait) => trait.trim())
    .filter(Boolean);
}

export function statusVariant(status: CatalogStatus) {
  return status === "active" ? "inStock" : "outOfStock";
}

export function uniqueItems(values: string[]) {
  return Array.from(new Set(values.map((value) => value.trim()).filter(Boolean)));
}

export function variantToDraft(variant: ShrimpVariant): AdminShrimpVariantDraft {
  return {
    name: variant.name,
    sale_unit: variant.sale_unit,
    sale_quantity: String(variant.sale_quantity),
    price: variant.price,
    stock_quantity: String(variant.stock_quantity),
    is_active: variant.is_active,
  };
}

export function variantPayloadFromDraft(draft: AdminShrimpVariantDraft): ShrimpVariantPayload {
  const saleQuantity = Number(draft.sale_quantity);

  return {
    name: draft.name.trim(),
    sale_unit: draft.sale_unit,
    sale_quantity: (saleQuantity === 5 || saleQuantity === 10 ? saleQuantity : 1) as 1 | 5 | 10,
    price: draft.price.trim(),
    stock_quantity: Number(draft.stock_quantity || 0),
    is_active: draft.is_active,
  };
}

export function careParameterPayloadFromDraft(draft: AdminShrimpCareDraft): ShrimpCareParameterPayload {
  return {
    ph_min: toNullableString(draft.ph_min),
    ph_max: toNullableString(draft.ph_max),
    gh_min: toNullableString(draft.gh_min),
    gh_max: toNullableString(draft.gh_max),
    kh_min: toNullableString(draft.kh_min),
    kh_max: toNullableString(draft.kh_max),
    tds_min: toNullableNumber(draft.tds_min),
    tds_max: toNullableNumber(draft.tds_max),
    temperature_min: toNullableString(draft.temperature_min),
    temperature_max: toNullableString(draft.temperature_max),
    care_level: draft.care_level,
  };
}
