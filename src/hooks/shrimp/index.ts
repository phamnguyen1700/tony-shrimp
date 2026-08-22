import { useMutation, useQueries, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { ApiError, getApiErrorMessage } from "@/config/api";
import {
  createShrimpSchema,
  ownerShrimpListQuerySchema,
  presignShrimpImageUploadSchema,
  shrimpCareParameterSchema,
  shrimpListQuerySchema,
  shrimpVariantSchema,
  updateShrimpImageSchema,
  updateShrimpSchema,
  updateShrimpVariantSchema,
  uuidSchema,
} from "@/schema/shrimp";
import { shrimpService } from "@/services/shrimp";
import type {
  CreateShrimpPayload,
  OwnerShrimpListQuery,
  UploadShrimpImagePayload,
  ShrimpCareParameterPayload,
  ShrimpDetail,
  ShrimpListItem,
  ShrimpListQuery,
  ShrimpVariantPayload,
  UpdateShrimpImagePayload,
  UpdateShrimpPayload,
  UpdateShrimpVariantPayload,
} from "@/types/shrimp";
import { useShrimpOptionsStore } from "@/store/shrimpStore";

export const shrimpQueryKeys = {
  catalogOptions: ["catalog", "options"] as const,
  ownerCatalogOptions: ["owner", "catalog", "options"] as const,
  publicList: (params?: ShrimpListQuery) => ["catalog", "shrimp", params ?? {}] as const,
  publicDetail: (shrimpId: string) => ["catalog", "shrimp", shrimpId] as const,
  publicDetailBySlug: (slug: string) => ["catalog", "shrimp", "slug", slug] as const,
  ownerList: (params?: OwnerShrimpListQuery) => ["owner", "catalog", "shrimp", params ?? {}] as const,
  ownerDetail: (shrimpId: string) => ["owner", "catalog", "shrimp", shrimpId] as const,
};

function validateId(id: string) {
  return uuidSchema.parse(id);
}

export function useCatalogOptions() {
  const setCatalogOptions = useShrimpOptionsStore((state) => state.setCatalogOptions);

  const query = useQuery({
    queryKey: shrimpQueryKeys.catalogOptions,
    queryFn: shrimpService.getCatalogOptions,
  });

  useEffect(() => {
    if (query.data) setCatalogOptions(query.data);
  }, [query.data, setCatalogOptions]);

  return query;
}

export function useOwnerCatalogOptions() {
  const setOwnerCatalogOptions = useShrimpOptionsStore((state) => state.setOwnerCatalogOptions);

  const query = useQuery({
    queryKey: shrimpQueryKeys.ownerCatalogOptions,
    queryFn: shrimpService.getOwnerCatalogOptions,
  });

  useEffect(() => {
    if (query.data) setOwnerCatalogOptions(query.data);
  }, [query.data, setOwnerCatalogOptions]);

  return query;
}

type ShrimpListOptions = {
  enabled?: boolean;
  initialData?: ShrimpListItem[];
};

type ShrimpDetailOptions = {
  enabled?: boolean;
  initialData?: ShrimpDetail;
};

export function useShrimpList(params?: ShrimpListQuery, options?: ShrimpListOptions) {
  const validParams = shrimpListQuerySchema.parse(params ?? {});

  return useQuery({
    queryKey: shrimpQueryKeys.publicList(validParams),
    queryFn: () => shrimpService.listShrimp(validParams),
    ...options,
  });
}

export function useShrimpDetail(shrimpId: string) {
  return useQuery({
    queryKey: shrimpQueryKeys.publicDetail(shrimpId),
    queryFn: () => shrimpService.getShrimpDetail(validateId(shrimpId)),
    enabled: Boolean(shrimpId),
  });
}

export function useShrimpDetailBySlug(slug: string, options?: ShrimpDetailOptions) {
  return useQuery({
    queryKey: shrimpQueryKeys.publicDetailBySlug(slug),
    queryFn: () => shrimpService.getShrimpDetailBySlug(slug),
    enabled: options?.enabled ?? Boolean(slug),
    initialData: options?.initialData,
    retry: (failureCount, error) =>
      !(error instanceof ApiError && error.status === 404) && failureCount < 3,
  });
}

export function useFetchShrimpDetail() {
  const queryClient = useQueryClient();

  return (shrimpId: string) =>
    queryClient.fetchQuery({
      queryKey: shrimpQueryKeys.publicDetail(shrimpId),
      queryFn: () => shrimpService.getShrimpDetail(validateId(shrimpId)),
    });
}

export function useFetchShrimpDetailBySlug() {
  const queryClient = useQueryClient();

  return (slug: string) =>
    queryClient.fetchQuery({
      queryKey: shrimpQueryKeys.publicDetailBySlug(slug),
      queryFn: () => shrimpService.getShrimpDetailBySlug(slug),
    });
}

export function useOwnerShrimpList(params?: OwnerShrimpListQuery) {
  const validParams = ownerShrimpListQuerySchema.parse(params ?? {});

  return useQuery({
    queryKey: shrimpQueryKeys.ownerList(validParams),
    queryFn: () => shrimpService.listOwnerShrimp(validParams),
  });
}

export function useOwnerShrimpDetail(shrimpId: string) {
  return useQuery({
    queryKey: shrimpQueryKeys.ownerDetail(shrimpId),
    queryFn: () => shrimpService.getOwnerShrimpDetail(validateId(shrimpId)),
    enabled: Boolean(shrimpId),
  });
}

export function useOwnerShrimpDetails(shrimpIds: string[]) {
  return useQueries({
    queries: shrimpIds.map((shrimpId) => ({
      queryKey: shrimpQueryKeys.ownerDetail(shrimpId),
      queryFn: () => shrimpService.getOwnerShrimpDetail(validateId(shrimpId)),
      enabled: Boolean(shrimpId),
    })),
  });
}

export function useCreateShrimp() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateShrimpPayload) =>
      shrimpService.createShrimp(createShrimpSchema.parse(payload)),
    onSuccess: (shrimp) => {
      toast.success("Shrimp created.");
      queryClient.setQueryData(shrimpQueryKeys.ownerDetail(shrimp.id), shrimp);
      void queryClient.invalidateQueries({ queryKey: ["owner", "catalog", "shrimp"] });
      void queryClient.invalidateQueries({ queryKey: shrimpQueryKeys.ownerCatalogOptions });
    },
    onError: (error) => toast.error(getApiErrorMessage(error, "Could not create shrimp.")),
  });
}

export function useUpdateShrimp(shrimpId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateShrimpPayload) =>
      shrimpService.updateShrimp(validateId(shrimpId), updateShrimpSchema.parse(payload)),
    onSuccess: (shrimp) => {
      toast.success("Shrimp updated.");
      queryClient.setQueryData(shrimpQueryKeys.ownerDetail(shrimp.id), shrimp);
      void queryClient.invalidateQueries({ queryKey: ["owner", "catalog", "shrimp"] });
      void queryClient.invalidateQueries({ queryKey: ["catalog", "shrimp"] });
    },
    onError: (error) => toast.error(getApiErrorMessage(error, "Could not update shrimp.")),
  });
}

export function useActivateShrimp() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (shrimpId: string) => shrimpService.activateShrimp(validateId(shrimpId)),
    onSuccess: (shrimp) => {
      toast.success("Shrimp activated.");
      queryClient.setQueryData(shrimpQueryKeys.ownerDetail(shrimp.id), shrimp);
      void queryClient.invalidateQueries({ queryKey: ["owner", "catalog", "shrimp"] });
      void queryClient.invalidateQueries({ queryKey: ["catalog", "shrimp"] });
    },
    onError: (error) => toast.error(getApiErrorMessage(error, "Could not activate shrimp.")),
  });
}

export function useDeactivateShrimp() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (shrimpId: string) => shrimpService.deactivateShrimp(validateId(shrimpId)),
    onSuccess: (shrimp) => {
      toast.success("Shrimp deactivated.");
      queryClient.setQueryData(shrimpQueryKeys.ownerDetail(shrimp.id), shrimp);
      void queryClient.invalidateQueries({ queryKey: ["owner", "catalog", "shrimp"] });
      void queryClient.invalidateQueries({ queryKey: ["catalog", "shrimp"] });
    },
    onError: (error) => toast.error(getApiErrorMessage(error, "Could not deactivate shrimp.")),
  });
}

export function useHardDeleteShrimp() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (shrimpId: string) => shrimpService.hardDeleteShrimp(validateId(shrimpId)),
    onSuccess: (_data, shrimpId) => {
      toast.success("Shrimp permanently deleted.");
      queryClient.removeQueries({ queryKey: shrimpQueryKeys.ownerDetail(shrimpId) });
      queryClient.removeQueries({ queryKey: shrimpQueryKeys.publicDetail(shrimpId) });
      void queryClient.invalidateQueries({ queryKey: ["owner", "catalog", "shrimp"] });
      void queryClient.invalidateQueries({ queryKey: ["catalog", "shrimp"] });
      void queryClient.invalidateQueries({ queryKey: shrimpQueryKeys.ownerCatalogOptions });
    },
    onError: (error) => toast.error(getApiErrorMessage(error, "Could not permanently delete shrimp.")),
  });
}

export function useAddShrimpVariant(shrimpId: string) {
  return useShrimpDetailMutation(
    (payload: ShrimpVariantPayload) =>
      shrimpService.addVariant(validateId(shrimpId), shrimpVariantSchema.parse(payload)),
    "Variant added.",
    "Could not add variant.",
  );
}

type UpdateShrimpVariantMutationPayload = UpdateShrimpVariantPayload & {
  variant_id: string;
};

export function useUpdateShrimpVariant(shrimpId: string) {
  return useShrimpDetailMutation(
    ({ variant_id, ...payload }: UpdateShrimpVariantMutationPayload) =>
      shrimpService.updateVariant(
        validateId(shrimpId),
        validateId(variant_id),
        updateShrimpVariantSchema.parse(payload),
      ),
    "Variant updated.",
    "Could not update variant.",
  );
}

export function useDeleteShrimpVariant(shrimpId: string) {
  return useShrimpDetailMutation(
    (variantId: string) => shrimpService.deleteVariant(validateId(shrimpId), validateId(variantId)),
    "Variant deleted.",
    "Could not delete variant.",
  );
}

export function useUpsertShrimpCareParameter(shrimpId: string) {
  return useShrimpDetailMutation(
    (payload: ShrimpCareParameterPayload) =>
      shrimpService.upsertCareParameter(validateId(shrimpId), shrimpCareParameterSchema.parse(payload)),
    "Care parameters saved.",
    "Could not save care parameters.",
  );
}

type UploadShrimpImageMutationPayload = UploadShrimpImagePayload & {
  shrimp_id?: string;
};

export function useUploadShrimpImage(shrimpId?: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: UploadShrimpImageMutationPayload) => {
      const targetShrimpId = validateId(payload.shrimp_id ?? shrimpId ?? "");
      const presignPayload = presignShrimpImageUploadSchema.parse({
        filename: payload.file.name,
        content_type: payload.file.type,
        file_size_bytes: payload.file.size,
      });
      const presigned = await shrimpService.presignImageUpload(targetShrimpId, presignPayload);
      await shrimpService.uploadImageToR2(presigned.upload_url, payload.file, presigned.headers);
      return shrimpService.addImage(targetShrimpId, {
        r2_key: presigned.r2_key,
        url: presigned.public_url || null,
        alt_text: payload.alt_text ?? null,
        sort_order: payload.sort_order,
        is_primary: payload.is_primary,
      });
    },
    onSuccess: (shrimp) => {
      queryClient.setQueryData(shrimpQueryKeys.ownerDetail(shrimp.id), shrimp);
      void queryClient.invalidateQueries({ queryKey: ["owner", "catalog", "shrimp"] });
      void queryClient.invalidateQueries({ queryKey: ["catalog", "shrimp"] });
    },
  });
}

type UpdateShrimpImageMutationPayload = UpdateShrimpImagePayload & {
  shrimp_id?: string;
  image_id: string;
};

// Keep for image metadata controls. Primary is derived from the smallest sort_order.
export function useUpdateShrimpImage(shrimpId?: string) {
  return useShrimpDetailMutation(
    ({ shrimp_id, image_id, ...payload }: UpdateShrimpImageMutationPayload) =>
      shrimpService.updateImage(
        validateId(shrimp_id ?? shrimpId ?? ""),
        validateId(image_id),
        updateShrimpImageSchema.parse(payload),
      ),
    "Image updated.",
    "Could not update image.",
  );
}

type DeleteShrimpImageMutationPayload = {
  shrimp_id?: string;
  image_id: string;
};

export function useDeleteShrimpImage(shrimpId?: string) {
  return useShrimpDetailMutation(
    (payload: DeleteShrimpImageMutationPayload) =>
      shrimpService.deleteImage(
        validateId(payload.shrimp_id ?? shrimpId ?? ""),
        validateId(payload.image_id),
      ),
    "Image deleted.",
    "Could not delete image.",
  );
}

function useShrimpDetailMutation<TPayload>(
  mutationFn: (payload: TPayload) => ReturnType<typeof shrimpService.createShrimp>,
  successMessage: string,
  errorMessage: string,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn,
    onSuccess: (shrimp) => {
      toast.success(successMessage);
      queryClient.setQueryData(shrimpQueryKeys.ownerDetail(shrimp.id), shrimp);
      void queryClient.invalidateQueries({ queryKey: ["owner", "catalog", "shrimp"] });
      void queryClient.invalidateQueries({ queryKey: ["catalog", "shrimp"] });
    },
    onError: (error) => toast.error(getApiErrorMessage(error, errorMessage)),
  });
}
