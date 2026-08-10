interface CustomerFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  onClear: () => void;
}

export default function CustomerFilters({ search, onSearchChange, onClear }: CustomerFiltersProps) {
  return (
    <div className="ui-radius border border-border bg-card p-4">
      <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_auto]">
        <label className="admin-filter-field">
          <span className="admin-filter-label">Search name / phone / email</span>
          <input
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            className="admin-filter-control"
            placeholder="Search customers..."
          />
        </label>
        <div className="flex items-end">
          <button type="button" onClick={onClear} disabled={!search.trim()} className="admin-filter-clear">
            Clear
          </button>
        </div>
      </div>
    </div>
  );
}

