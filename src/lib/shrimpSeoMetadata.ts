import type { ShrimpDetail } from "@/types/shrimp";
import { siteShortName } from "./seo";

const metaDescriptionMaxLength = 160;
const metaDescriptionPreferredCut = 150;

function cleanText(value?: string | null) {
  return value?.replace(/\s+/g, " ").trim() ?? "";
}

function stripSpeciesQualifier(value: string) {
  return value
    .replace(/\bsp\.?\b/gi, "")
    .replace(/\bshrimp\b/gi, "")
    .replace(/\s+/g, " ")
    .trim();
}

function truncateAtWord(value: string, maxLength: number) {
  if (value.length <= maxLength) return value;

  const truncated = value.slice(0, Math.max(0, maxLength - 3));
  const lastSpace = truncated.lastIndexOf(" ");
  const cut = lastSpace > 0 ? truncated.slice(0, lastSpace) : truncated;

  return `${cut.replace(/[,\s]+$/, "")}...`;
}

function firstUsefulSentence(value: string) {
  const sentence = value.match(/[^.!?]+[.!?]/)?.[0]?.trim();
  return sentence || value;
}

export function generateShrimpMetaTitle(shrimp: Pick<ShrimpDetail, "name" | "species" | "line" | "meta_title">) {
  const override = cleanText(shrimp.meta_title);
  if (override) return override;

  const category = stripSpeciesQualifier(shrimp.species || shrimp.line || "Aquarium");
  const name = cleanText(shrimp.name);
  const productName = /\bshrimp\b/i.test(name) ? name : `${name} ${category} Shrimp`;

  return `${productName} Australia`;
}

export function generateShrimpMetaDescription(
  shrimp: Pick<ShrimpDetail, "name" | "meta_description">,
  overview?: string,
) {
  const override = cleanText(shrimp.meta_description);
  if (override) return truncateAtWord(override, metaDescriptionMaxLength);

  const fallback = `Buy ${shrimp.name} shrimp from ${siteShortName} in Victoria, Australia.`;
  const base = cleanText(firstUsefulSentence(cleanText(overview)) || fallback);
  const localSuffix = ` From ${siteShortName} in Victoria, Australia.`;
  const hasLocalSignal = /\b(australia|victoria)\b/i.test(base);

  if (!hasLocalSignal) {
    const normalizedBase = base.replace(/[.\s]+$/, ".");
    if (normalizedBase.length + localSuffix.length <= metaDescriptionMaxLength) {
      return normalizedBase + localSuffix;
    }

    return `${truncateAtWord(base, metaDescriptionMaxLength - localSuffix.length)}${localSuffix}`;
  }

  return truncateAtWord(base || fallback, metaDescriptionPreferredCut);
}

export function createShrimpSeoMetadata(shrimp: ShrimpDetail, overview?: string) {
  return {
    title: generateShrimpMetaTitle(shrimp),
    description: generateShrimpMetaDescription(shrimp, overview),
  };
}
