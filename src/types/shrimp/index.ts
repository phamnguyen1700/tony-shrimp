export type CatalogStatus = "active" | "inactive";
export type CareLevel = "beginner" | "intermediate" | "advanced";
export type ImageContentType =
  | "image/jpeg"
  | "image/png"
  | "image/webp"
  | "video/mp4"
  | "video/webm"
  | "video/quicktime";
export type SaleUnit = "each" | "pack";
export type ShrimpType = "Caridina" | "Neocaridina" | string;

export interface CatalogOptions {
  species?: string[];
  catalog_statuses: CatalogStatus[];
  sale_units: SaleUnit[];
  lines: string[];
  colors: string[];
  grades: string[];
  rarities: string[];
  traits: string[];
}

export interface ShrimpListQuery {
  search?: string;
  species?: string;
  line?: string;
  color?: string;
  grade?: string;
  rarity?: string;
  trait?: string;
  min_price?: string | number;
  max_price?: string | number;
  in_stock?: boolean;
  limit?: number;
  offset?: number;
}

export interface ShopFilters {
  species: string[];
  lines: string[];
  colors: string[];
  grades: string[];
  rarities: string[];
  traits: string[];
  availability: string[];
}

export interface AdminShrimpFilters {
  search: string;
  catalog_status: "" | CatalogStatus;
  line: string;
  color: string;
  grade: string;
  rarity: string;
  trait: string;
  availability: "" | "in_stock" | "out_of_stock";
}

export interface OwnerShrimpListQuery extends ShrimpListQuery {
  catalog_status?: CatalogStatus;
}

export interface ShrimpListItem {
  id: string;
  name: string;
  slug: string;
  species: string | null;
  line: string;
  colors: string[];
  grade: string | null;
  rarity: string | null;
  meta_title: string | null;
  meta_description: string | null;
  catalog_status: CatalogStatus;
  traits: string[];
  created_at: string;
  updated_at: string;
  is_available: boolean;
  min_price: string | null;
  total_stock: number;
  primary_image_url: string | null;
  first_variant?: ShrimpVariant | null;
  variants?: ShrimpVariant[];
}

export interface ShrimpVariant {
  id: string;
  shrimp_id: string;
  name: string;
  sale_unit: SaleUnit;
  sale_quantity: 1 | 5 | 10;
  price: string;
  stock_quantity: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ShrimpCareParameter {
  id: string;
  shrimp_id: string;
  ph_min: string | null;
  ph_max: string | null;
  gh_min: string | null;
  gh_max: string | null;
  kh_min: string | null;
  kh_max: string | null;
  tds_min: number | null;
  tds_max: number | null;
  temperature_min: string | null;
  temperature_max: string | null;
  care_level: CareLevel;
}

export interface ShrimpImage {
  id: string;
  shrimp_id: string;
  r2_key: string;
  url: string | null;
  alt_text: string | null;
  sort_order: number;
  is_primary: boolean;
  created_at: string;
}

export interface ShrimpDetail extends Omit<ShrimpListItem, "min_price" | "total_stock" | "primary_image_url"> {
  description: string | null;
  variants: ShrimpVariant[];
  care_parameter: ShrimpCareParameter | null;
  images: ShrimpImage[];
}

export interface ShrimpVariantPayload {
  name: string;
  sale_unit: SaleUnit;
  sale_quantity: 1 | 5 | 10;
  price: string;
  stock_quantity: number;
  is_active: boolean;
}

export type UpdateShrimpVariantPayload = Partial<ShrimpVariantPayload>;

export interface ShrimpCareParameterPayload {
  ph_min?: string | null;
  ph_max?: string | null;
  gh_min?: string | null;
  gh_max?: string | null;
  kh_min?: string | null;
  kh_max?: string | null;
  tds_min?: number | null;
  tds_max?: number | null;
  temperature_min?: string | null;
  temperature_max?: string | null;
  care_level?: CareLevel;
}

export interface ShrimpImagePayload {
  r2_key: string;
  url?: string | null;
  alt_text?: string | null;
  sort_order: number;
  is_primary: boolean;
}

export type UpdateShrimpImagePayload = Partial<Pick<ShrimpImagePayload, "alt_text" | "sort_order">>;

export interface PresignShrimpImageUploadPayload {
  filename: string;
  content_type: ImageContentType;
  file_size_bytes?: number;
}

export interface PresignShrimpImageUploadResponse {
  upload_url: string;
  r2_key: string;
  public_url: string;
  method: "PUT";
  headers: Record<string, string>;
  expires_in: number;
}

export interface UploadShrimpImagePayload {
  file: File;
  alt_text?: string | null;
  sort_order: number;
  is_primary: boolean;
}

export interface CreateShrimpPayload {
  name: string;
  slug?: string | null;
  species?: string | null;
  line: string;
  colors?: string[];
  grade?: string | null;
  rarity?: string | null;
  meta_title?: string | null;
  meta_description?: string | null;
  description?: string | null;
  catalog_status?: CatalogStatus;
  traits?: string[];
  variants: ShrimpVariantPayload[];
  care_parameter?: ShrimpCareParameterPayload | null;
  images?: ShrimpImagePayload[];
}

export type UpdateShrimpPayload = Partial<
  Pick<
    CreateShrimpPayload,
    "name" | "slug" | "species" | "line" | "colors" | "grade" | "rarity" | "meta_title" | "meta_description" | "description" | "catalog_status" | "traits"
  >
>;

export interface AdminShrimpFormInput {
  name: string;
  slug?: string;
  species?: string;
  line: string;
  colors?: string;
  grade?: string;
  rarity?: string;
  meta_title?: string;
  meta_description?: string;
  description?: string;
  description_title?: string;
  description_overview?: string;
  description_highlights?: string;
  description_care_notes?: string;
  catalog_status: CatalogStatus;
  traits?: string;
  variant_name?: string;
  sale_unit: SaleUnit;
  sale_quantity: number;
  price?: string;
  stock_quantity: number;
  variant_active: boolean;
}

export interface AdminShrimpCareDraft {
  ph_min: string;
  ph_max: string;
  gh_min: string;
  gh_max: string;
  kh_min: string;
  kh_max: string;
  tds_min: string;
  tds_max: string;
  temperature_min: string;
  temperature_max: string;
  care_level: CareLevel;
}

export interface AdminShrimpVariantDraft {
  name: string;
  sale_unit: SaleUnit;
  sale_quantity: string;
  price: string;
  stock_quantity: string;
  is_active: boolean;
}
