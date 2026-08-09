import type { Translations } from "@/i18n";
import type { CareLevel, SaleUnit } from "@/types/shrimp";

export const fallbackShrimpTypes = ["Caridina", "Neocaridina"];
export const fallbackSaleUnits: SaleUnit[] = ["each", "pack"];

export const saleQuantityOptions = [
  { value: "1", label: "1" },
  { value: "5", label: "5" },
  { value: "10", label: "10" },
];

export function catalogStatusOptions(formLabels: Translations["admin"]["form"]) {
  return [
    { value: "inactive", label: formLabels.inactive },
    { value: "active", label: formLabels.active },
  ];
}

export function careLevelOptions(formLabels: Translations["admin"]["form"]) {
  return [
    { value: "beginner", label: formLabels.beginner },
    { value: "intermediate", label: formLabels.intermediate },
    { value: "advanced", label: formLabels.advanced },
  ];
}

export function careLevelSuggestions(formLabels: Translations["admin"]["form"]) {
  return careLevelOptions(formLabels).map((option) => option.label);
}

export function careLevelLabel(value: CareLevel, formLabels: Translations["admin"]["form"]) {
  return careLevelOptions(formLabels).find((option) => option.value === value)?.label ?? formLabels.beginner;
}

export function careLevelValueFromInput(input: string, formLabels: Translations["admin"]["form"]): CareLevel {
  const normalized = input.trim().toLowerCase();
  const match = careLevelOptions(formLabels).find(
    (option) => option.value === normalized || option.label.toLowerCase() === normalized,
  );

  return (match?.value ?? "beginner") as CareLevel;
}

export function defaultRarityOptions(formLabels: Translations["admin"]["form"]) {
  return [
    { value: "common", label: formLabels.common },
    { value: "rare", label: formLabels.rare },
    { value: "extremely rare", label: formLabels.extremelyRare },
  ];
}

export function rarityOptions(formLabels: Translations["admin"]["form"], values?: string[]) {
  const defaults = defaultRarityOptions(formLabels);
  const defaultValues = new Set(defaults.map((option) => option.value));
  const extraOptions = (values ?? [])
    .map((value) => value.trim())
    .filter(Boolean)
    .filter((value) => !defaultValues.has(value.toLowerCase()))
    .map((value) => ({ value, label: value }));

  return [...defaults, ...extraOptions];
}

export function normalizeRarityValue(value?: string | null) {
  const normalized = value?.trim().toLowerCase();
  if (!normalized) return "";
  if (normalized === "extremely rare") return "extremely rare";
  if (normalized === "rare") return "rare";
  if (normalized === "common") return "common";
  return value?.trim() ?? "";
}

export function typeSuggestions(values?: string[]) {
  return values?.length ? values : fallbackShrimpTypes;
}

export function saleUnitOptions(values?: SaleUnit[]) {
  return (values?.length ? values : fallbackSaleUnits).map((unit) => ({
    value: unit,
    label: unit,
  }));
}
