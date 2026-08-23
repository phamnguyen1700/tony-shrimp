import type { FieldErrors, UseFormRegister, UseFormSetValue } from "react-hook-form";
import type { Translations } from "@/i18n";
import type { AdminShrimpCareDraft, AdminShrimpFormInput, CatalogOptions, CareLevel } from "@/types/shrimp";
import Dialog from "@/components/ui/Dialog";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import MotionButton from "@/components/common/motion/MotionButton";
import { badgeValues } from "@/lib/shrimpBadgeStyles";
import { splitTraits } from "@/lib/shrimpAdminUtils";
import {
  catalogStatusOptions,
  lineSuggestions,
  rarityOptions,
  saleQuantityOptions,
  saleUnitOptions,
} from "../selectorElements";
import CareParameterFields from "./CareParameterFields";
import { BadgeInputBox, ComboboxInput } from "./FormControls";

interface ShrimpFormModalProps {
  open: boolean;
  editingId: string | null;
  formLabels: Translations["admin"]["form"];
  adminLabels: Translations["admin"];
  options: CatalogOptions | null | undefined;
  register: UseFormRegister<AdminShrimpFormInput>;
  setValue: UseFormSetValue<AdminShrimpFormInput>;
  errors: FieldErrors<AdminShrimpFormInput>;
  careDraft: AdminShrimpCareDraft;
  watchedSpecies: string;
  watchedLine: string;
  watchedColors: string;
  watchedGrade: string;
  watchedTraits: string;
  speciesSuggestions: string[];
  gradeSuggestions: string[];
  canHardDelete?: boolean;
  onCareChange: (updater: (draft: AdminShrimpCareDraft) => AdminShrimpCareDraft) => void;
  onSubmit: () => void;
  onHardDelete?: () => void;
  onClose: () => void;
}

export default function ShrimpFormModal({
  open,
  editingId,
  formLabels,
  adminLabels,
  options,
  register,
  setValue,
  errors,
  careDraft,
  watchedSpecies,
  watchedLine,
  watchedColors,
  watchedGrade,
  watchedTraits,
  speciesSuggestions,
  gradeSuggestions,
  canHardDelete = false,
  onCareChange,
  onSubmit,
  onHardDelete,
  onClose,
}: ShrimpFormModalProps) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={editingId ? adminLabels.editShrimp : adminLabels.addShrimp}
      maxWidth="max-w-6xl"
    >
      <form
        noValidate
        onSubmit={(event) => {
          event.preventDefault();
          onSubmit();
        }}
      >
        <div className="max-h-[72vh] space-y-5 overflow-y-auto pr-1">
          <div className="grid gap-5 xl:grid-cols-2">
            <div className="border border-border bg-secondary/20 p-4" style={{ borderRadius: "var(--radius)" }}>
              <p className="mono-section-label mb-4">{formLabels.shrimpInfo}</p>
              <div className="grid gap-3 md:grid-cols-2">
                <Input label={formLabels.name} error={errors.name?.message} {...register("name")} />
                <ComboboxInput
                  label={formLabels.species}
                  value={watchedSpecies}
                  suggestions={speciesSuggestions}
                  onChange={(value) => setValue("species", value, { shouldDirty: true })}
                />
                <ComboboxInput
                  label={formLabels.type}
                  value={watchedLine}
                  suggestions={lineSuggestions(options?.lines)}
                  error={errors.line?.message}
                  onChange={(value) => setValue("line", value, { shouldDirty: true, shouldValidate: true })}
                />
                <Input label="Slug" error={errors.slug?.message} {...register("slug")} />
                <Select
                  label={formLabels.catalogStatus}
                  {...register("catalog_status")}
                  options={catalogStatusOptions(formLabels)}
                />
                <ComboboxInput
                  label={formLabels.grade}
                  value={watchedGrade}
                  suggestions={gradeSuggestions}
                  onChange={(value) => setValue("grade", value, { shouldDirty: true })}
                />
                <Select
                  label={formLabels.rarity}
                  {...register("rarity")}
                  options={rarityOptions(formLabels, options?.rarities)}
                />
              </div>

              <div className="mt-3 grid gap-3 md:grid-cols-2">
                <BadgeInputBox
                  label={formLabels.color}
                  values={badgeValues(watchedColors)}
                  suggestions={options?.colors}
                  placeholder={formLabels.color}
                  onChange={(values) => setValue("colors", values.join(", "), { shouldDirty: true })}
                />
                <BadgeInputBox
                  label={formLabels.traits}
                  values={splitTraits(watchedTraits) ?? []}
                  suggestions={options?.traits}
                  placeholder={options?.traits.join(", ") || "BOA, ORANGE EYE"}
                  onChange={(values) => setValue("traits", values.join(", "), { shouldDirty: true })}
                />
              </div>

              <div className="mt-3 space-y-3">
                <Input label="Description title" {...register("description_title")} />
                <div className="flex flex-col gap-1.5">
                  <label className="font-mono-label text-xs uppercase tracking-widest text-muted-foreground">
                    Overview
                  </label>
                  <textarea
                    {...register("description_overview")}
                    rows={4}
                    className="ui-radius w-full resize-none border border-border bg-card px-3 py-2.5 text-sm font-body text-foreground placeholder:text-muted-foreground transition-colors duration-150 focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="font-mono-label text-xs uppercase tracking-widest text-muted-foreground">
                    Highlights
                  </label>
                  <textarea
                    {...register("description_highlights")}
                    rows={3}
                    placeholder="One highlight per line"
                    className="ui-radius w-full resize-none border border-border bg-card px-3 py-2.5 text-sm font-body text-foreground placeholder:text-muted-foreground transition-colors duration-150 focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="font-mono-label text-xs uppercase tracking-widest text-muted-foreground">
                    Care notes
                  </label>
                  <textarea
                    {...register("description_care_notes")}
                    rows={3}
                    className="ui-radius w-full resize-none border border-border bg-card px-3 py-2.5 text-sm font-body text-foreground placeholder:text-muted-foreground transition-colors duration-150 focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring"
                  />
                </div>
                <div className="border border-border bg-card/60 p-3" style={{ borderRadius: "var(--radius-sm)" }}>
                  <p className="mono-section-label mb-3">SEO override</p>
                  <div className="space-y-3">
                    <Input label="Meta title" error={errors.meta_title?.message} {...register("meta_title")} />
                    <div className="flex flex-col gap-1.5">
                      <label className="font-mono-label text-xs uppercase tracking-widest text-muted-foreground">
                        Meta description
                      </label>
                      <textarea
                        {...register("meta_description")}
                        rows={3}
                        className="ui-radius w-full resize-none border border-border bg-card px-3 py-2.5 text-sm font-body text-foreground placeholder:text-muted-foreground transition-colors duration-150 focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring"
                      />
                      {errors.meta_description?.message && (
                        <p className="text-xs text-red-500">{errors.meta_description.message}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="border border-border bg-secondary/20 p-4" style={{ borderRadius: "var(--radius)" }}>
              <p className="mono-section-label mb-4">{formLabels.careParameters}</p>
              <CareParameterFields careDraft={careDraft} formLabels={formLabels} onChange={onCareChange} />
              {editingId && canHardDelete && onHardDelete && (
                <div className="mt-5 border-t border-border pt-4">
                  <MotionButton
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="text-red-500 hover:bg-red-500/10"
                    onClick={onHardDelete}
                  >
                    {adminLabels.actions.hardDelete}
                  </MotionButton>
                </div>
              )}
            </div>
          </div>

          {!editingId && (
            <div className="border border-border bg-secondary/20 p-4" style={{ borderRadius: "var(--radius)" }}>
              <p className="mono-section-label mb-4">{formLabels.firstVariant}</p>
              <div className="grid gap-3 md:grid-cols-3 xl:grid-cols-6">
                <Input label={formLabels.variantName} error={errors.variant_name?.message} {...register("variant_name")} />
                <Select
                  label={formLabels.saleUnit}
                  {...register("sale_unit")}
                  options={saleUnitOptions(options?.sale_units)}
                />
                <Select
                  label={formLabels.saleQuantity}
                  {...register("sale_quantity", { valueAsNumber: true })}
                  options={saleQuantityOptions}
                />
                <Input label={formLabels.price} type="number" step="0.01" error={errors.price?.message} {...register("price")} />
                <Input label={formLabels.stock} type="number" error={errors.stock_quantity?.message} {...register("stock_quantity", { valueAsNumber: true })} />
                <label className="flex items-center gap-2 pt-6">
                  <input type="checkbox" {...register("variant_active")} className="h-4 w-4 accent-[var(--accent)]" />
                  <span className="font-mono-label text-xs uppercase tracking-widest text-muted-foreground">{formLabels.variantActive}</span>
                </label>
              </div>
            </div>
          )}
        </div>

        <div className="mt-6 flex gap-3 border-t border-border pt-4">
          <button
            type="button"
            onClick={onSubmit}
            className="ui-radius inline-flex cursor-pointer items-center justify-center gap-2 bg-accent px-3 py-1.5 font-body text-xs font-medium uppercase tracking-widest text-accent-foreground transition-colors duration-150 hover:bg-accent/90 focus-visible:outline-ring"
          >
            {formLabels.save}
          </button>
          <MotionButton type="button" variant="ghost" size="sm" onClick={onClose}>
            {formLabels.cancel}
          </MotionButton>
        </div>
      </form>
    </Dialog>
  );
}
