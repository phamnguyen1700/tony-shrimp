import { useEffect, useState, type ReactNode } from "react";
import type { Translations } from "@/i18n";
import type {
  AdminShrimpVariantDraft,
  SaleUnit,
  ShrimpListItem,
  ShrimpVariant,
  ShrimpVariantPayload,
} from "@/types/shrimp";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Badge from "@/components/ui/Badge";
import MotionButton from "@/components/common/motion/MotionButton";
import {
  emptyAdminShrimpVariantDraft,
  variantPayloadFromDraft,
  variantToDraft,
} from "@/lib/shrimpAdminUtils";
import { saleQuantityOptions, saleUnitOptions } from "../selectorElements";

interface ShrimpVariantsPanelProps {
  product: ShrimpListItem | null;
  variants: ShrimpVariant[];
  isLoading: boolean;
  formLabels: Translations["admin"]["form"];
  actions: Translations["admin"]["actions"];
  saleUnits?: SaleUnit[];
  isAdding: boolean;
  isUpdating: boolean;
  isDeleting: boolean;
  onAdd: (payload: ShrimpVariantPayload, onSuccess?: () => void) => void;
  onUpdate: (variantId: string, payload: ShrimpVariantPayload) => void;
  onDelete: (variantId: string) => void;
}

function formatPrice(price: string) {
  const value = Number(price);
  if (!Number.isFinite(value)) return price;
  return new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency: "AUD",
  }).format(value);
}

function variantUnitLabel(variant: ShrimpVariant) {
  return variant.sale_unit === "pack"
    ? `Pack x ${variant.sale_quantity}`
    : `${variant.sale_quantity} each`;
}

export default function ShrimpVariantsPanel({
  product,
  variants,
  isLoading,
  formLabels,
  actions,
  saleUnits,
  isAdding,
  isUpdating,
  isDeleting,
  onAdd,
  onUpdate,
  onDelete,
}: ShrimpVariantsPanelProps) {
  const [draft, setDraft] = useState<AdminShrimpVariantDraft>(emptyAdminShrimpVariantDraft);
  const unitOptions = saleUnitOptions(saleUnits);

  useEffect(() => {
    setDraft(emptyAdminShrimpVariantDraft);
  }, [product?.id]);

  function addVariant() {
    const payload = variantPayloadFromDraft(draft);
    if (!payload.name || !payload.price) return;
    onAdd(payload, () => setDraft(emptyAdminShrimpVariantDraft));
  }

  return (
    <aside className="border-t border-border p-6 md:p-8 xl:sticky xl:top-0 xl:h-screen xl:overflow-y-auto xl:border-l xl:border-t-0">
      <div className="mb-5">
        <p className="font-mono-label text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
          {formLabels.variants}
        </p>
        <h2 className="mt-1 font-display text-xl font-semibold text-foreground">
          {product?.name ?? "Select shrimp"}
        </h2>
        <p className="mt-1 font-body text-xs text-muted-foreground">
          Click a shrimp row to view and update stock.
        </p>
      </div>

      {isLoading ? (
        <PanelMessage>Loading variants...</PanelMessage>
      ) : !product ? (
        <PanelMessage>Select a shrimp to view variants.</PanelMessage>
      ) : (
        <div className="space-y-4">
          {variants.length > 0 ? (
            <div className="space-y-3">
              {variants.map((variant) => (
                <VariantEditor
                  key={variant.id}
                  variant={variant}
                  formLabels={formLabels}
                  actions={actions}
                  unitOptions={unitOptions}
                  isUpdating={isUpdating}
                  isDeleting={isDeleting}
                  onUpdate={onUpdate}
                  onDelete={onDelete}
                />
              ))}
            </div>
          ) : (
            <PanelMessage>{actions.noVariants}</PanelMessage>
          )}

          <div className="border-t border-border pt-4">
            <p className="mono-section-label mb-3">{formLabels.addVariant}</p>
            <VariantCompactFields
              draft={draft}
              onChange={setDraft}
              formLabels={formLabels}
              unitOptions={unitOptions}
            />
            <MotionButton
              type="button"
              variant="accent"
              size="sm"
              className="mt-3"
              disabled={isAdding || !draft.name || !draft.price}
              onClick={addVariant}
            >
              {formLabels.addVariant}
            </MotionButton>
          </div>
        </div>
      )}
    </aside>
  );
}

function VariantEditor({
  variant,
  formLabels,
  actions,
  unitOptions,
  isUpdating,
  isDeleting,
  onUpdate,
  onDelete,
}: {
  variant: ShrimpVariant;
  formLabels: Translations["admin"]["form"];
  actions: Translations["admin"]["actions"];
  unitOptions: { value: string; label: string }[];
  isUpdating: boolean;
  isDeleting: boolean;
  onUpdate: (variantId: string, payload: ShrimpVariantPayload) => void;
  onDelete: (variantId: string) => void;
}) {
  const [draft, setDraft] = useState<AdminShrimpVariantDraft>(() => variantToDraft(variant));

  useEffect(() => {
    setDraft(variantToDraft(variant));
  }, [variant]);

  return (
    <div className="border border-border bg-card p-3" style={{ borderRadius: "var(--radius)" }}>
      <div className="mb-3 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate font-body text-sm text-foreground">{variant.name}</p>
          <p className="mt-1 font-mono-label text-[10px] uppercase tracking-widest text-muted-foreground">
            {formatPrice(variant.price)} / {variantUnitLabel(variant)}
          </p>
        </div>
        <Badge variant={variant.is_active ? "inStock" : "outOfStock"}>
          {variant.is_active ? formLabels.active : formLabels.inactive}
        </Badge>
      </div>

      <VariantCompactFields
        draft={draft}
        onChange={setDraft}
        formLabels={formLabels}
        unitOptions={unitOptions}
      />

      <div className="mt-3 flex flex-wrap gap-2">
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

function VariantCompactFields({
  draft,
  onChange,
  formLabels,
  unitOptions,
}: {
  draft: AdminShrimpVariantDraft;
  onChange: (next: AdminShrimpVariantDraft) => void;
  formLabels: Translations["admin"]["form"];
  unitOptions: { value: string; label: string }[];
}) {
  return (
    <div className="grid gap-3">
      <Input
        label={formLabels.variantName}
        value={draft.name}
        onChange={(event) => onChange({ ...draft, name: event.target.value })}
      />
      <div className="grid grid-cols-2 gap-2">
        <Field label={formLabels.saleUnit}>
          <Select
            value={draft.sale_unit}
            onChange={(event) => onChange({ ...draft, sale_unit: event.target.value as SaleUnit })}
            options={unitOptions}
          />
        </Field>
        <Field label={formLabels.saleQuantity}>
          <Select
            value={draft.sale_quantity}
            onChange={(event) => onChange({ ...draft, sale_quantity: event.target.value })}
            options={saleQuantityOptions}
          />
        </Field>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <Input
          label={formLabels.price}
          type="number"
          step="0.01"
          value={draft.price}
          onChange={(event) => onChange({ ...draft, price: event.target.value })}
        />
        <Input
          label={formLabels.stock}
          type="number"
          value={draft.stock_quantity}
          onChange={(event) => onChange({ ...draft, stock_quantity: event.target.value })}
        />
      </div>
      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={draft.is_active}
          onChange={(event) => onChange({ ...draft, is_active: event.target.checked })}
          className="h-4 w-4 accent-[var(--accent)]"
        />
        <span className="font-mono-label text-xs uppercase tracking-widest text-muted-foreground">
          {formLabels.variantActive}
        </span>
      </label>
    </div>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="grid gap-2">
      <span className="font-mono-label text-[11px] uppercase tracking-widest text-muted-foreground">
        {label}
      </span>
      {children}
    </label>
  );
}

function PanelMessage({ children }: { children: ReactNode }) {
  return (
    <p className="py-10 text-center font-mono-label text-xs uppercase tracking-widest text-muted-foreground">
      {children}
    </p>
  );
}
