export function gradeBadgeClass(value?: string | null) {
  const normalized = value?.trim().toLowerCase();

  if (!normalized) return "";
  if (normalized === "sss" || normalized.includes("sss")) return "shrimp-badge-grade-sss";
  if (normalized === "ss" || normalized.includes("ss")) return "shrimp-badge-grade-ss";
  return "shrimp-badge-grade";
}

export function rarityBadgeClass(value?: string | null) {
  const normalized = value?.trim().toLowerCase();

  if (!normalized) return "";
  if (normalized === "common" || normalized === "pho bien" || normalized.includes("phổ biến")) {
    return "";
  }

  if (normalized.includes("extreme") || normalized.includes("cuc") || normalized.includes("cực")) {
    return "shrimp-badge-rarity-extreme";
  }

  if (normalized.includes("rare") || normalized.includes("hiem") || normalized.includes("hiếm")) {
    return "shrimp-badge-rarity-rare";
  }

  return "";
}

export function traitBadgeClass(value?: string | null) {
  return value?.trim() ? "shrimp-badge-trait" : "";
}

export function badgeValues(value?: string | string[] | null) {
  if (Array.isArray(value)) return value.map((item) => item.trim()).filter(Boolean);
  return (
    value
      ?.split(",")
      .map((item) => item.trim())
      .filter(Boolean) ?? []
  );
}
