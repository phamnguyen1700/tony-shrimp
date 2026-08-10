import type { AdminShrimpFilters as AdminShrimpFiltersValue, CatalogOptions } from "@/types/shrimp";

interface AdminShrimpFiltersProps {
  filters: AdminShrimpFiltersValue;
  options?: CatalogOptions;
  onChange: (filters: AdminShrimpFiltersValue) => void;
  onClear: () => void;
}

export default function AdminShrimpFilters({
  filters,
  options,
  onChange,
  onClear,
}: AdminShrimpFiltersProps) {
  const hasActiveFilter = Object.values(filters).some(Boolean);

  function updateFilter<Key extends keyof AdminShrimpFiltersValue>(
    key: Key,
    value: AdminShrimpFiltersValue[Key],
  ) {
    onChange({ ...filters, [key]: value });
  }

  return (
    <div className="mb-5 border border-border bg-card p-4" style={{ borderRadius: "var(--radius)" }}>
      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-[1.4fr_repeat(7,minmax(0,1fr))_auto]">
        <label className="admin-filter-field md:col-span-2 lg:col-span-1">
          <span className="admin-filter-label">Search</span>
          <input
            value={filters.search}
            onChange={(event) => updateFilter("search", event.target.value)}
            placeholder="Name, species, type..."
            className="admin-filter-control"
          />
        </label>

        <AdminFilterSelect
          label="Status"
          value={filters.catalog_status}
          options={options?.catalog_statuses ?? []}
          onChange={(value) => updateFilter("catalog_status", value as AdminShrimpFiltersValue["catalog_status"])}
        />
        <AdminFilterSelect
          label="Type"
          value={filters.type}
          options={options?.types ?? []}
          onChange={(value) => updateFilter("type", value)}
        />
        <AdminFilterSelect
          label="Color"
          value={filters.color}
          options={options?.colors ?? []}
          onChange={(value) => updateFilter("color", value)}
        />
        <AdminFilterSelect
          label="Grade"
          value={filters.grade}
          options={options?.grades ?? []}
          onChange={(value) => updateFilter("grade", value)}
        />
        <AdminFilterSelect
          label="Rarity"
          value={filters.rarity}
          options={options?.rarities ?? []}
          onChange={(value) => updateFilter("rarity", value)}
        />
        <AdminFilterSelect
          label="Trait"
          value={filters.trait}
          options={options?.traits ?? []}
          onChange={(value) => updateFilter("trait", value)}
        />
        <AdminFilterSelect
          label="Stock"
          value={filters.availability}
          options={[
            { value: "in_stock", label: "In Stock" },
            { value: "out_of_stock", label: "Out of Stock" },
          ]}
          onChange={(value) => updateFilter("availability", value as AdminShrimpFiltersValue["availability"])}
        />

        <div className="flex items-end">
          <button
            type="button"
            onClick={onClear}
            disabled={!hasActiveFilter}
            className="admin-filter-clear"
          >
            Clear
          </button>
        </div>
      </div>
    </div>
  );
}

interface AdminFilterSelectProps {
  label: string;
  value: string;
  options: string[] | Array<{ value: string; label: string }>;
  onChange: (value: string) => void;
}

function AdminFilterSelect({ label, value, options, onChange }: AdminFilterSelectProps) {
  const normalizedOptions = options.map((option) =>
    typeof option === "string" ? { value: option, label: option } : option,
  );

  return (
    <label className="admin-filter-field">
      <span className="admin-filter-label">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="admin-filter-control"
      >
        <option value="">All</option>
        {normalizedOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}
