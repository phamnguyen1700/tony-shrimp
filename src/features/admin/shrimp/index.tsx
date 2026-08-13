"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useAppRuntime } from "@/providers/AppProviders";
import {
  useActivateShrimp,
  useAddShrimpVariant,
  useCreateShrimp,
  useDeactivateShrimp,
  useDeleteShrimpImage,
  useDeleteShrimpVariant,
  useHardDeleteShrimp,
  useOwnerCatalogOptions,
  useOwnerShrimpDetail,
  useOwnerShrimpDetails,
  useOwnerShrimpList,
  useUpdateShrimp,
  useUpdateShrimpImage,
  useUpdateShrimpVariant,
  useUpsertShrimpCareParameter,
  useUploadShrimpImage,
} from "@/hooks/shrimp";
import { adminShrimpFormSchema } from "@/schema/shrimp";
import { useShrimpOptionsStore } from "@/store/shrimpStore";
import type {
  AdminShrimpCareDraft,
  AdminShrimpFilters,
  AdminShrimpFormInput,
  CreateShrimpPayload,
  OwnerShrimpListQuery,
  SaleUnit,
  ShrimpImage,
  ShrimpListItem,
  ShrimpVariantPayload,
} from "@/types/shrimp";
import { fadeUp, staggerContainer } from "@/lib/motionVariants";
import {
  descriptionDraftToMarkdown,
  markdownToDescriptionDraft,
} from "@/lib/shrimpDescription";
import {
  careParameterPayloadFromDraft,
  emptyAdminShrimpCareDraft,
  emptyAdminShrimpForm,
  emptyUuid,
  splitTraits,
  toInputString,
  toNullableString,
  uniqueItems,
} from "@/lib/shrimpAdminUtils";
import { normalizeRarityValue } from "./selectorElements";
import AdminShrimpFiltersPanel from "./components/AdminShrimpFilters";
import ConfirmActionDialog from "./components/ConfirmActionDialog";
import ShrimpFormModal from "./components/ShrimpFormModal";
import ShrimpTable from "./components/ShrimpTable";
import VariantManagerDialog from "./components/VariantManagerDialog";

const emptyAdminShrimpFilters: AdminShrimpFilters = {
  search: "",
  catalog_status: "",
  line: "",
  color: "",
  grade: "",
  rarity: "",
  trait: "",
  availability: "",
};

export default function AdminShrimpFeature() {
  const { t } = useAppRuntime();
  const reduced = useReducedMotion();
  const ownerOptionsQuery = useOwnerCatalogOptions();
  const storedOptions = useShrimpOptionsStore((state) => state.ownerCatalogOptions);
  const [filters, setFilters] = useState<AdminShrimpFilters>(emptyAdminShrimpFilters);
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const shrimpQueryParams: OwnerShrimpListQuery = {
    limit: 100,
    ...(debouncedSearch ? { search: debouncedSearch } : {}),
    ...(filters.catalog_status ? { catalog_status: filters.catalog_status } : {}),
    ...(filters.line ? { line: filters.line } : {}),
    ...(filters.color ? { color: filters.color } : {}),
    ...(filters.grade ? { grade: filters.grade } : {}),
    ...(filters.rarity ? { rarity: filters.rarity } : {}),
    ...(filters.trait ? { trait: filters.trait } : {}),
    ...(filters.availability ? { in_stock: filters.availability === "in_stock" } : {}),
  };
  const shrimpQuery = useOwnerShrimpList(shrimpQueryParams);
  const products = shrimpQuery.data ?? [];
  const detailQueries = useOwnerShrimpDetails(products.map((product) => product.id));

  const createShrimp = useCreateShrimp();
  const activateShrimp = useActivateShrimp();
  const deactivateShrimp = useDeactivateShrimp();
  const hardDeleteShrimp = useHardDeleteShrimp();
  const uploadImage = useUploadShrimpImage();
  const updateImage = useUpdateShrimpImage();
  const deleteImage = useDeleteShrimpImage();

  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [archiveTarget, setArchiveTarget] = useState<string | null>(null);
  const [hardDeleteTarget, setHardDeleteTarget] = useState<string | null>(null);
  const [variantTarget, setVariantTarget] = useState<ShrimpListItem | null>(null);
  const [careDraft, setCareDraft] = useState<AdminShrimpCareDraft>(emptyAdminShrimpCareDraft);
  const editHydratedIdRef = useRef<string | null>(null);

  const updateShrimp = useUpdateShrimp(editingId ?? emptyUuid);
  const updateEditingCareParameter = useUpsertShrimpCareParameter(editingId ?? emptyUuid);
  const editingDetailQuery = useOwnerShrimpDetail(editingId ?? "");
  const variantShrimpId = variantTarget?.id ?? emptyUuid;
  const variantDetailQuery = useOwnerShrimpDetail(variantTarget?.id ?? "");
  const addVariant = useAddShrimpVariant(variantShrimpId);
  const updateVariant = useUpdateShrimpVariant(variantShrimpId);
  const deleteVariant = useDeleteShrimpVariant(variantShrimpId);

  const options = ownerOptionsQuery.data ?? storedOptions;
  const formLabels = t.admin.form;
  const actions = t.admin.actions;
  const {
    register,
    getValues,
    reset,
    setError,
    setValue,
    watch,
    formState: { errors },
  } = useForm<AdminShrimpFormInput>({
    defaultValues: emptyAdminShrimpForm,
  });

  const detailById = new Map(
    detailQueries
      .map((query) => query.data)
      .filter((detail) => Boolean(detail))
      .map((detail) => [detail!.id, detail!]),
  );
  const imagePendingById = Object.fromEntries(
    products.map((product) => [
      product.id,
      uploadImage.isPending || updateImage.isPending || deleteImage.isPending,
    ]),
  );

  const watchedSpecies = watch("species") ?? "";
  const watchedLine = watch("line") ?? "";
  const watchedColors = watch("colors") ?? "";
  const watchedGrade = watch("grade") ?? "";
  const watchedTraits = watch("traits") ?? "";
  const speciesSuggestions = uniqueItems([
    ...(options?.species ?? []),
    ...products.map((product) => product.species ?? ""),
  ]);
  const gradeSuggestions = uniqueItems([
    ...(options?.grades ?? []),
    ...products.map((product) => product.grade ?? ""),
    watchedGrade,
  ]);
  const currentArchiveTarget = products.find((product) => product.id === archiveTarget);
  const currentHardDeleteTarget = products.find((product) => product.id === hardDeleteTarget);

  useEffect(() => {
    const timer = window.setTimeout(() => setDebouncedSearch(filters.search.trim()), 300);
    return () => window.clearTimeout(timer);
  }, [filters.search]);

  useEffect(() => {
    if (!formOpen || !editingId || !editingDetailQuery.data) return;
    if (editHydratedIdRef.current === editingId) return;
    const care = editingDetailQuery.data.care_parameter;
    const detail = editingDetailQuery.data;
    const descriptionDraft = markdownToDescriptionDraft(detail.description);

    reset({
      ...emptyAdminShrimpForm,
      name: detail.name,
      species: detail.species ?? "",
      slug: detail.slug,
      line: detail.line,
      colors: detail.colors.join(", "),
      grade: detail.grade ?? "",
      rarity: normalizeRarityValue(detail.rarity),
      description: detail.description ?? "",
      description_title: descriptionDraft.title,
      description_overview: descriptionDraft.overview,
      description_highlights: descriptionDraft.highlights,
      description_care_notes: descriptionDraft.careNotes,
      catalog_status: detail.catalog_status,
      traits: detail.traits.join(", "),
    });
    setCareDraft({
      ph_min: toInputString(care?.ph_min),
      ph_max: toInputString(care?.ph_max),
      gh_min: toInputString(care?.gh_min),
      gh_max: toInputString(care?.gh_max),
      kh_min: toInputString(care?.kh_min),
      kh_max: toInputString(care?.kh_max),
      tds_min: toInputString(care?.tds_min),
      tds_max: toInputString(care?.tds_max),
      temperature_min: toInputString(care?.temperature_min),
      temperature_max: toInputString(care?.temperature_max),
      care_level: care?.care_level ?? "beginner",
    });
    editHydratedIdRef.current = editingId;
  }, [editingDetailQuery.data, editingId, formOpen, reset]);

  function openAdd() {
    setEditingId(null);
    editHydratedIdRef.current = null;
    setCareDraft(emptyAdminShrimpCareDraft);
    reset(emptyAdminShrimpForm);
    setFormOpen(true);
  }

  function openEdit(product: ShrimpListItem) {
    const descriptionDraft = markdownToDescriptionDraft(detailById.get(product.id)?.description);

    setEditingId(product.id);
    editHydratedIdRef.current = null;
    setCareDraft(emptyAdminShrimpCareDraft);
    reset({
      ...emptyAdminShrimpForm,
      name: product.name,
      species: product.species ?? "",
      slug: product.slug,
      line: product.line,
      colors: product.colors.join(", "),
      grade: product.grade ?? "",
      rarity: normalizeRarityValue(product.rarity),
      description_title: descriptionDraft.title,
      description_overview: descriptionDraft.overview,
      description_highlights: descriptionDraft.highlights,
      description_care_notes: descriptionDraft.careNotes,
      catalog_status: product.catalog_status,
      traits: product.traits.join(", "),
    });
    setFormOpen(true);
  }

  async function saveForm() {
    const parsed = adminShrimpFormSchema.safeParse(getValues());

    if (!parsed.success) {
      for (const issue of parsed.error.issues) {
        const field = issue.path[0];
        if (typeof field === "string") {
          setError(field as keyof AdminShrimpFormInput, { message: issue.message });
        }
      }
      toast.error("Please check the highlighted fields.");
      return;
    }

    const form = parsed.data;
    const description = descriptionDraftToMarkdown({
      title: form.description_title ?? "",
      overview: form.description_overview ?? form.description ?? "",
      highlights: form.description_highlights ?? "",
      careNotes: form.description_care_notes ?? "",
    });
    const basePayload = {
      name: form.name,
      species: toNullableString(form.species),
      slug: toNullableString(form.slug),
      line: form.line,
      colors: splitTraits(form.colors),
      grade: toNullableString(form.grade),
      rarity: toNullableString(form.rarity),
      description: toNullableString(description),
      catalog_status: form.catalog_status,
      traits: splitTraits(form.traits),
    };

    if (editingId) {
      try {
        await updateEditingCareParameter.mutateAsync(careParameterPayloadFromDraft(careDraft));
        await updateShrimp.mutateAsync(basePayload);
        setFormOpen(false);
      } catch {
        // Mutation hooks surface API errors via toast.
      }
      return;
    }

    if (!form.variant_name) {
      setError("variant_name", { message: "Variant name is required" });
      toast.error("Variant name is required.");
      return;
    }

    if (!form.price) {
      setError("price", { message: "Price is required" });
      toast.error("Price is required.");
      return;
    }

    const payload: CreateShrimpPayload = {
      ...basePayload,
      variants: [
        {
          name: form.variant_name,
          sale_unit: form.sale_unit as SaleUnit,
          sale_quantity: form.sale_quantity as 1 | 5 | 10,
          price: form.price,
          stock_quantity: Number(form.stock_quantity),
          is_active: form.variant_active,
        },
      ],
      care_parameter: careParameterPayloadFromDraft(careDraft),
      images: [],
    };

    createShrimp.mutate(payload, {
      onSuccess: () => setFormOpen(false),
    });
  }

  function uploadProductImage(product: ShrimpListItem, file: File | undefined, index: number) {
    if (!file) return;
    const images = detailById.get(product.id)?.images ?? [];
    uploadImage.mutate({
      shrimp_id: product.id,
      file,
      alt_text: product.name,
      sort_order: index,
      is_primary: images.length === 0 || index === 0,
    });
  }

  function reorderProductImages(product: ShrimpListItem, images: ShrimpImage[]) {
    images.forEach((image, index) => {
      if (image.sort_order === index) return;
      updateImage.mutate({
        shrimp_id: product.id,
        image_id: image.id,
        alt_text: image.alt_text ?? null,
        sort_order: index,
      });
    });
  }

  function addNewVariant(payload: ShrimpVariantPayload, onSuccess?: () => void) {
    addVariant.mutate(payload, { onSuccess });
  }

  function updateExistingVariant(variantId: string, payload: ShrimpVariantPayload) {
    updateVariant.mutate({ variant_id: variantId, ...payload });
  }

  function confirmArchive() {
    if (!archiveTarget) return;
    deactivateShrimp.mutate(archiveTarget, {
      onSuccess: () => setArchiveTarget(null),
    });
  }

  function confirmHardDelete() {
    if (!hardDeleteTarget) return;
    hardDeleteShrimp.mutate(hardDeleteTarget, {
      onSuccess: () => setHardDeleteTarget(null),
    });
  }

  return (
    <>
      <motion.div
        variants={reduced ? undefined : staggerContainer}
        initial={reduced ? undefined : "hidden"}
        animate={reduced ? undefined : "visible"}
      >
        <motion.div variants={reduced ? undefined : fadeUp}>
          <ShrimpTable
            products={products}
            detailById={detailById}
            imagePendingById={imagePendingById}
            t={t}
            isLoading={shrimpQuery.isLoading}
            filtersSlot={
              <AdminShrimpFiltersPanel
                filters={filters}
                options={options ?? undefined}
                onChange={setFilters}
                onClear={() => setFilters(emptyAdminShrimpFilters)}
              />
            }
            onAdd={openAdd}
            onEdit={openEdit}
            onViewVariants={setVariantTarget}
            onActivate={(productId) => activateShrimp.mutate(productId)}
            onDeactivate={setArchiveTarget}
            onHardDelete={setHardDeleteTarget}
            onUploadImage={uploadProductImage}
            onDeleteImage={(product, imageId) => deleteImage.mutate({ shrimp_id: product.id, image_id: imageId })}
            onReorderImages={reorderProductImages}
          />
        </motion.div>
      </motion.div>

      <ShrimpFormModal
        open={formOpen}
        editingId={editingId}
        formLabels={formLabels}
        adminLabels={t.admin}
        options={options}
        register={register}
        setValue={setValue}
        errors={errors}
        careDraft={careDraft}
        watchedSpecies={watchedSpecies}
        watchedLine={watchedLine}
        watchedColors={watchedColors}
        watchedGrade={watchedGrade}
        watchedTraits={watchedTraits}
        speciesSuggestions={speciesSuggestions}
        gradeSuggestions={gradeSuggestions}
        onCareChange={setCareDraft}
        onSubmit={() => void saveForm()}
        onClose={() => setFormOpen(false)}
      />

      <VariantManagerDialog
        product={variantTarget}
        variants={variantDetailQuery.data?.variants ?? []}
        open={variantTarget !== null}
        onClose={() => setVariantTarget(null)}
        formLabels={formLabels}
        actions={actions}
        saleUnits={options?.sale_units}
        isAdding={addVariant.isPending}
        isUpdating={updateVariant.isPending}
        isDeleting={deleteVariant.isPending}
        onAdd={addNewVariant}
        onUpdate={updateExistingVariant}
        onDelete={(variantId) => deleteVariant.mutate(variantId)}
      />

      <ConfirmActionDialog
        open={archiveTarget !== null}
        onClose={() => setArchiveTarget(null)}
        title={actions.deactivateTitle}
        message={currentArchiveTarget?.name ? `${actions.deactivate}: ${currentArchiveTarget.name}?` : actions.deactivateConfirm}
        confirmLabel={actions.deactivate}
        cancelLabel={formLabels.cancel}
        dangerClassName="bg-red-500 text-white hover:bg-red-600"
        onConfirm={confirmArchive}
      />

      <ConfirmActionDialog
        open={hardDeleteTarget !== null}
        onClose={() => setHardDeleteTarget(null)}
        title={actions.hardDeleteTitle}
        message={currentHardDeleteTarget?.name ? `${actions.hardDeleteConfirm}: ${currentHardDeleteTarget.name}?` : actions.hardDeleteConfirm}
        confirmLabel={actions.hardDelete}
        cancelLabel={formLabels.cancel}
        dangerClassName="bg-red-600 text-white hover:bg-red-700"
        onConfirm={confirmHardDelete}
      />
    </>
  );
}
