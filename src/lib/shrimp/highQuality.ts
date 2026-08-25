import type { CartItem } from "@/types/cart";
import type { ShrimpDetail, ShrimpListItem } from "@/types/shrimp";

export const highQualityGrades = ["High Grade", "SS", "SSS"] as const;
export const highQualityGradeFilter = highQualityGrades.join(",");

const highQualityGradeSet = new Set(highQualityGrades.map(normalizeGrade));

export function normalizeGrade(value?: string | null) {
  return (value ?? "").trim().toLowerCase().replace(/\s+/g, " ");
}

export function isHighQualityGrade(value?: string | null) {
  return highQualityGradeSet.has(normalizeGrade(value));
}

export function isHighQualityShrimp(product: Pick<ShrimpListItem | ShrimpDetail, "grade">) {
  return isHighQualityGrade(product.grade);
}

export function isHighQualityCartItem(item: Pick<CartItem, "grade">) {
  return isHighQualityGrade(item.grade);
}
