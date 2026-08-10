import type { ReactNode } from "react";
import type { Translations } from "@/i18n";
import type { CareLevel } from "@/types/shrimp";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import { careLevelOptions } from "../selectorElements";
import type { AdminShrimpCareDraft } from "@/types/shrimp";

interface CareParameterFieldsProps {
  careDraft: AdminShrimpCareDraft;
  formLabels: Translations["admin"]["form"];
  onChange: (updater: (draft: AdminShrimpCareDraft) => AdminShrimpCareDraft) => void;
}

export default function CareParameterFields({
  careDraft,
  formLabels,
  onChange,
}: CareParameterFieldsProps) {
  return (
    <div className="space-y-3">
      <CareRangeRow
        label={formLabels.ph}
        fromLabel={formLabels.from}
        toLabel={formLabels.to}
        fromInput={<Input value={careDraft.ph_min} onChange={(event) => onChange((draft) => ({ ...draft, ph_min: event.target.value }))} />}
        toInput={<Input value={careDraft.ph_max} onChange={(event) => onChange((draft) => ({ ...draft, ph_max: event.target.value }))} />}
      />
      <CareRangeRow
        label={formLabels.gh}
        fromLabel={formLabels.from}
        toLabel={formLabels.to}
        unit="dGH"
        fromInput={<Input value={careDraft.gh_min} onChange={(event) => onChange((draft) => ({ ...draft, gh_min: event.target.value }))} />}
        toInput={<Input value={careDraft.gh_max} onChange={(event) => onChange((draft) => ({ ...draft, gh_max: event.target.value }))} />}
      />
      <CareRangeRow
        label={formLabels.kh}
        fromLabel={formLabels.from}
        toLabel={formLabels.to}
        unit="dKH"
        fromInput={<Input value={careDraft.kh_min} onChange={(event) => onChange((draft) => ({ ...draft, kh_min: event.target.value }))} />}
        toInput={<Input value={careDraft.kh_max} onChange={(event) => onChange((draft) => ({ ...draft, kh_max: event.target.value }))} />}
      />
      <CareRangeRow
        label={formLabels.tds}
        fromLabel={formLabels.from}
        toLabel={formLabels.to}
        unit="ppm"
        fromInput={<Input inputMode="decimal" value={careDraft.tds_min} onChange={(event) => onChange((draft) => ({ ...draft, tds_min: event.target.value }))} />}
        toInput={<Input inputMode="decimal" value={careDraft.tds_max} onChange={(event) => onChange((draft) => ({ ...draft, tds_max: event.target.value }))} />}
      />
      <CareRangeRow
        label={formLabels.temperature}
        fromLabel={formLabels.from}
        toLabel={formLabels.to}
        unit="°F"
        fromInput={<Input value={careDraft.temperature_min} onChange={(event) => onChange((draft) => ({ ...draft, temperature_min: event.target.value }))} />}
        toInput={<Input value={careDraft.temperature_max} onChange={(event) => onChange((draft) => ({ ...draft, temperature_max: event.target.value }))} />}
      />
      <CareSingleRow
        label={formLabels.careLevel}
        input={
          <Select
            value={careDraft.care_level}
            onChange={(event) => onChange((draft) => ({ ...draft, care_level: event.target.value as CareLevel }))}
            options={careLevelOptions(formLabels)}
          />
        }
      />
    </div>
  );
}

function CareRangeRow({
  label,
  fromLabel,
  toLabel,
  unit,
  fromInput,
  toInput,
}: {
  label: string;
  fromLabel: string;
  toLabel: string;
  unit?: string;
  fromInput: ReactNode;
  toInput: ReactNode;
}) {
  return (
    <div className="grid gap-2 md:grid-cols-[88px_44px_minmax(0,1fr)_28px_minmax(0,1fr)_36px] md:items-center">
      <p className="font-mono-label text-xs uppercase tracking-widest text-muted-foreground">{label}</p>
      <span className="font-mono-label text-xs uppercase tracking-widest text-muted-foreground">{fromLabel}</span>
      {fromInput}
      <span className="font-mono-label text-xs uppercase tracking-widest text-muted-foreground">{toLabel}</span>
      {toInput}
      <span className="font-mono-label text-xs uppercase tracking-widest text-muted-foreground">{unit ?? ""}</span>
    </div>
  );
}

function CareSingleRow({ label, input }: { label: string; input: ReactNode }) {
  return (
    <div className="grid gap-2 md:grid-cols-[88px_minmax(0,1fr)] md:items-center">
      <p className="font-mono-label text-xs uppercase tracking-widest text-muted-foreground">{label}</p>
      {input}
    </div>
  );
}
