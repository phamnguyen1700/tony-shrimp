import { useState, type ReactNode } from "react";
import type { Translations } from "@/i18n";
import type { SaleUnit, ShrimpListItem, ShrimpVariant, ShrimpVariantPayload } from "@/types/shrimp";
import Dialog from "@/components/ui/Dialog";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import MotionButton from "@/components/common/motion/MotionButton";
import { saleQuantityOptions, saleUnitOptions } from "../selectorElements";
import {
  emptyAdminShrimpVariantDraft,
  variantPayloadFromDraft,
  variantToDraft,
} from "@/lib/shrimpAdminUtils";
import type { AdminShrimpVariantDraft } from "@/types/shrimp";

interface VariantManagerDialogProps {
  product: ShrimpListItem | null;
  variants: ShrimpVariant[];
  open: boolean;
  formLabels: Translations["admin"]["form"];
  actions: Translations["admin"]["actions"];
  saleUnits?: SaleUnit[];
  isAdding: boolean;
  isUpdating: boolean;
  isDeleting: boolean;
  onClose: () => void;
  onAdd: (payload: ShrimpVariantPayload, onSuccess?: () => void) => void;
  onUpdate: (variantId: string, payload: ShrimpVariantPayload) => void;
  onDelete: (variantId: string) => void;
}

export default function VariantManagerDialog({
  product,
  variants,
  open,
  formLabels,
  actions,
  saleUnits,
  isAdding,
  isUpdating,
  isDeleting,
  onClose,
  onAdd,
  onUpdate,
  onDelete,
}: VariantManagerDialogProps) {
  const [draft, setDraft] = useState<AdminShrimpVariantDraft>(emptyAdminShrimpVariantDraft);
  const unitOptions = saleUnitOptions(saleUnits);

  function addNewVariant() {
    const payload = variantPayloadFromDraft(draft);
    if (!payload.name || !payload.price) return;
    onAdd(payload, () => setDraft(emptyAdminShrimpVariantDraft));
  }

  return (
    <Dialog open={open} onClose={onClose} title={`${formLabels.variants}: ${product?.name ?? ""}`} maxWidth="max-w-4xl">
      <div className="max-h-[70vh] space-y-5 overflow-y-auto pr-1">
        <div className="space-y-3">
          {variants.length ? (
            variants.map((variant) => (
              <VariantRow
                key={variant.id}
                variant={variant}
                formLabels={formLabels}
                actions={actions}
                unitOptions={unitOptions}
                quantityOptions={saleQuantityOptions}
                isUpdating={isUpdating}
                isDeleting={isDeleting}
                onUpdate={onUpdate}
                onDelete={onDelete}
              />
            ))
          ) : (
            <p className="mono-section-label">{actions.noVariants}</p>
          )}
        </div>

        <div className="border-t border-border pt-5">
          <p className="mono-section-label mb-3">{formLabels.addVariant}</p>
          <VariantDraftFields
            draft={draft}
            onChange={setDraft}
            formLabels={formLabels}
            unitOptions={unitOptions}
            quantityOptions={saleQuantityOptions}
          />
          <div className="mt-4">
            <MotionButton type="button" variant="accent" size="sm" onClick={addNewVariant} disabled={isAdding || !draft.name || !draft.price}>
              {formLabels.addVariant}
            </MotionButton>
          </div>
        </div>
      </div>
    </Dialog>
  );
}

function VariantRow({
  variant,
  formLabels,
  actions,
  unitOptions,
  quantityOptions,
  isUpdating,
  isDeleting,
  onUpdate,
  onDelete,
}: {
  variant: ShrimpVariant;
  formLabels: Translations["admin"]["form"];
  actions: Translations["admin"]["actions"];
  unitOptions: { value: string; label: string }[];
  quantityOptions: { value: string; label: string }[];
  isUpdating: boolean;
  isDeleting: boolean;
  onUpdate: (variantId: string, payload: ShrimpVariantPayload) => void;
  onDelete: (variantId: string) => void;
}) {
  const [draft, setDraft] = useState<AdminShrimpVariantDraft>(() => variantToDraft(variant));

  return (
    <div className="border border-border bg-secondary/30 p-4" style={{ borderRadius: "var(--radius)" }}>
      <VariantDraftFields
        draft={draft}
        onChange={setDraft}
        formLabels={formLabels}
        unitOptions={unitOptions}
        quantityOptions={quantityOptions}
      />
      <div className="mt-4 flex flex-wrap gap-3">
        <MotionButton
          type="button"
          variant="accent"
          size="sm"
          disabled={isUpdating || !draft.name || !draft.price}
          onClick={() => onUpdate(variant.id, variantPayloadFromDraft(draft))}
        >
          {formLabels.save}
        </MotionButton>
        <MotionButton
          type="button"
          variant="ghost"
          size="sm"
          disabled={isDeleting}
          onClick={() => onDelete(variant.id)}
        >
          {actions.deleteVariant}
        </MotionButton>
      </div>
    </div>
  );
}

export function VariantDraftFields({
  draft,
  onChange,
  formLabels,
  unitOptions,
  quantityOptions,
}: {
  draft: AdminShrimpVariantDraft;
  onChange: (next: AdminShrimpVariantDraft) => void;
  formLabels: Translations["admin"]["form"];
  unitOptions: { value: string; label: string }[];
  quantityOptions: { value: string; label: string }[];
}) {
  return (
    <div className="grid gap-3 md:grid-cols-3">
      <VariantFieldRow label={formLabels.variantName}>
        <Input value={draft.name} onChange={(event) => onChange({ ...draft, name: event.target.value })} />
      </VariantFieldRow>
      <VariantFieldRow label={formLabels.saleUnit}>
        <Select
          value={draft.sale_unit}
          onChange={(event) => onChange({ ...draft, sale_unit: event.target.value as SaleUnit })}
          options={unitOptions}
        />
      </VariantFieldRow>
      <VariantFieldRow label={formLabels.saleQuantity}>
        <Select
          value={draft.sale_quantity}
          onChange={(event) => onChange({ ...draft, sale_quantity: event.target.value })}
          options={quantityOptions}
        />
      </VariantFieldRow>
      <VariantFieldRow label={formLabels.price}>
        <Input type="number" step="0.01" value={draft.price} onChange={(event) => onChange({ ...draft, price: event.target.value })} />
      </VariantFieldRow>
      <VariantFieldRow label={formLabels.stock}>
        <Input
          type="number"
          value={draft.stock_quantity}
          onChange={(event) => onChange({ ...draft, stock_quantity: event.target.value })}
        />
      </VariantFieldRow>
      <label className="flex items-center gap-2 md:min-h-10 md:pt-0">
        <input
          type="checkbox"
          checked={draft.is_active}
          onChange={(event) => onChange({ ...draft, is_active: event.target.checked })}
          className="h-4 w-4 accent-[var(--accent)]"
        />
        <span className="font-mono-label text-xs uppercase tracking-widest text-muted-foreground">{formLabels.variantActive}</span>
      </label>
    </div>
  );
}

function VariantFieldRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="grid gap-2 md:grid-cols-[96px_minmax(0,1fr)] md:items-center">
      <span className="font-mono-label text-[11px] uppercase tracking-widest text-muted-foreground">{label}</span>
      {children}
    </label>
  );
}
