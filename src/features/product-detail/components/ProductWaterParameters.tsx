import type { Translations } from "@/i18n";
import type { ShrimpDetail } from "@/types/shrimp";
import Badge from "@/components/ui/Badge";

interface ProductWaterParametersProps {
  t: Translations;
  product: ShrimpDetail;
}

function formatRange(
  min?: string | number | null,
  max?: string | number | null,
  suffix = "",
) {
  if (min === null || min === undefined || max === null || max === undefined)
    return "N/A";
  return `${min}-${max}${suffix}`;
}

function formatCareLevel(value?: string | null) {
  if (!value) return "N/A";
  return value
    .replace(/-/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function careLevelBadgeClass(value?: string | null) {
  const normalized = value?.trim().toLowerCase();
  if (normalized === "beginner") return "care-level-badge-beginner";
  if (normalized === "intermediate") return "care-level-badge-intermediate";
  if (normalized === "advanced") return "care-level-badge-advanced";
  return "";
}

export default function ProductWaterParameters({
  t,
  product,
}: ProductWaterParametersProps) {
  const care = product.care_parameter;
  const rows = [
    {
      label: t.product.temperature,
      value: formatRange(care?.temperature_min, care?.temperature_max, "°F"),
    },
    { label: t.product.ph, value: formatRange(care?.ph_min, care?.ph_max) },
    {
      label: t.product.gh,
      value: formatRange(care?.gh_min, care?.gh_max, " dGH"),
    },
    {
      label: t.product.kh,
      value: formatRange(care?.kh_min, care?.kh_max, " dKH"),
    },
    {
      label: t.product.tds,
      value: formatRange(care?.tds_min, care?.tds_max, " ppm"),
    },
    {
      label: t.product.careLevel,
      value: formatCareLevel(care?.care_level),
    },
  ];

  return (
    <div className="space-y-4 border-t border-border pt-6">
      <p className="font-mono-label text-[13px] font-semibold uppercase tracking-[0.2em] text-foreground">
        {t.product.waterParams}
      </p>
      <div className="grid grid-cols-[auto_minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-x-3 gap-y-3 sm:gap-x-4 md:gap-x-6">
        {" "}
        {rows.map(({ label, value }) => (
          <div key={label} className="contents">
            <p className="mono-meta uppercase">{label}</p>
            {label === t.product.careLevel ? (
              <Badge
                variant="muted"
                className={`w-fit justify-self-start ${careLevelBadgeClass(care?.care_level)}`}
              >
                {value}
              </Badge>
            ) : (
              <p className="w-fit justify-self-start font-mono-label text-xs font-semibold leading-none text-foreground md:text-[13px]">
                {value}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
