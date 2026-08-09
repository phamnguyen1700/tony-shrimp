import axios from "axios";
import { apiClient } from "@/config/api";
import { endpoints } from "@/config/endpoints";
import type {
  CatalogOptions,
  CreateShrimpPayload,
  OwnerShrimpListQuery,
  PresignShrimpImageUploadPayload,
  PresignShrimpImageUploadResponse,
  ShrimpCareParameterPayload,
  ShrimpDetail,
  ShrimpImagePayload,
  ShrimpListItem,
  ShrimpListQuery,
  ShrimpVariantPayload,
  UpdateShrimpImagePayload,
  UpdateShrimpPayload,
  UpdateShrimpVariantPayload,
} from "@/types/shrimp";

export const shrimpService = {
  async getCatalogOptions() {
    const response = await apiClient.get<CatalogOptions>(endpoints.catalog.options);
    return response.data;
  },

  async getOwnerCatalogOptions() {
    const response = await apiClient.get<CatalogOptions>(endpoints.ownerCatalog.options);
    return response.data;
  },

  async listShrimp(params?: ShrimpListQuery) {
    const response = await apiClient.get<ShrimpListItem[]>(endpoints.catalog.shrimp, { params });
    return response.data;
  },

  async getShrimpDetail(shrimpId: string) {
    const response = await apiClient.get<ShrimpDetail>(endpoints.catalog.shrimpDetail(shrimpId));
    return response.data;
  },

  async listOwnerShrimp(params?: OwnerShrimpListQuery) {
    const response = await apiClient.get<ShrimpListItem[]>(endpoints.ownerCatalog.shrimp, {
      params,
    });
    return response.data;
  },

  async getOwnerShrimpDetail(shrimpId: string) {
    const response = await apiClient.get<ShrimpDetail>(
      endpoints.ownerCatalog.shrimpDetail(shrimpId),
    );
    return response.data;
  },

  async createShrimp(payload: CreateShrimpPayload) {
    const response = await apiClient.post<ShrimpDetail>(endpoints.ownerCatalog.shrimp, payload);
    return response.data;
  },

  async updateShrimp(shrimpId: string, payload: UpdateShrimpPayload) {
    const response = await apiClient.patch<ShrimpDetail>(
      endpoints.ownerCatalog.shrimpDetail(shrimpId),
      payload,
    );
    return response.data;
  },

  async activateShrimp(shrimpId: string) {
    const response = await apiClient.patch<ShrimpDetail>(
      endpoints.ownerCatalog.activateShrimp(shrimpId),
    );
    return response.data;
  },

  async deactivateShrimp(shrimpId: string) {
    const response = await apiClient.patch<ShrimpDetail>(
      endpoints.ownerCatalog.deactivateShrimp(shrimpId),
    );
    return response.data;
  },

  async hardDeleteShrimp(shrimpId: string) {
    await apiClient.delete<void>(endpoints.ownerCatalog.deleteShrimp(shrimpId));
  },

  async addVariant(shrimpId: string, payload: ShrimpVariantPayload) {
    const response = await apiClient.post<ShrimpDetail>(
      endpoints.ownerCatalog.variants(shrimpId),
      payload,
    );
    return response.data;
  },

  async updateVariant(shrimpId: string, variantId: string, payload: UpdateShrimpVariantPayload) {
    const response = await apiClient.patch<ShrimpDetail>(
      endpoints.ownerCatalog.variant(shrimpId, variantId),
      payload,
    );
    return response.data;
  },

  async deleteVariant(shrimpId: string, variantId: string) {
    const response = await apiClient.delete<ShrimpDetail>(
      endpoints.ownerCatalog.variant(shrimpId, variantId),
    );
    return response.data;
  },

  async upsertCareParameter(shrimpId: string, payload: ShrimpCareParameterPayload) {
    const response = await apiClient.put<ShrimpDetail>(
      endpoints.ownerCatalog.careParameter(shrimpId),
      payload,
    );
    return response.data;
  },

  async deleteCareParameter(shrimpId: string) {
    const response = await apiClient.delete<ShrimpDetail>(
      endpoints.ownerCatalog.careParameter(shrimpId),
    );
    return response.data;
  },

  async presignImageUpload(shrimpId: string, payload: PresignShrimpImageUploadPayload) {
    const response = await apiClient.post<PresignShrimpImageUploadResponse>(
      endpoints.ownerCatalog.presignImage(shrimpId),
      payload,
    );
    return response.data;
  },

  async uploadImageToR2(uploadUrl: string, file: File, headers: Record<string, string>) {
    await axios.put(uploadUrl, file, { headers });
  },

  async addImage(shrimpId: string, payload: ShrimpImagePayload) {
    const response = await apiClient.post<ShrimpDetail>(
      endpoints.ownerCatalog.images(shrimpId),
      payload,
    );
    return response.data;
  },

  async updateImage(shrimpId: string, imageId: string, payload: UpdateShrimpImagePayload) {
    const response = await apiClient.patch<ShrimpDetail>(
      endpoints.ownerCatalog.image(shrimpId, imageId),
      payload,
    );
    return response.data;
  },

  async deleteImage(shrimpId: string, imageId: string) {
    const response = await apiClient.delete<ShrimpDetail>(
      endpoints.ownerCatalog.image(shrimpId, imageId),
    );
    return response.data;
  },
};
