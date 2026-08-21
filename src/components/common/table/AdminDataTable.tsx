import { useEffect, useMemo, useState, type ReactNode } from "react";

export interface AdminDataTableColumn<T> {
  key: string;
  header: ReactNode;
  align?: "left" | "center" | "right";
  className?: string;
  render: (row: T) => ReactNode;
}

interface AdminDataTableProps<T> {
  rows: T[];
  columns: AdminDataTableColumn<T>[];
  getRowKey: (row: T) => string;
  emptyText: string;
  loadingText?: string;
  isLoading?: boolean;
  pageSize?: number;
  page?: number;
  totalRows?: number;
  onPageChange?: (page: number) => void;
  minWidth?: string;
  className?: string;
}

const alignClassName = {
  left: "text-left",
  center: "text-center",
  right: "text-right",
};

export default function AdminDataTable<T>({
  rows,
  columns,
  getRowKey,
  emptyText,
  loadingText = "Loading...",
  isLoading = false,
  pageSize = 10,
  page: controlledPage,
  totalRows,
  onPageChange,
  minWidth = "920px",
  className = "",
}: AdminDataTableProps<T>) {
  const [page, setPage] = useState(1);
  const currentPage = controlledPage ?? page;
  const rowCount = totalRows ?? rows.length;
  const isServerPaginated = typeof totalRows === "number";
  const totalPages = Math.max(1, Math.ceil(rowCount / pageSize));

  useEffect(() => {
    if (!isServerPaginated) setPage(1);
  }, [isServerPaginated, rows.length, pageSize]);

  useEffect(() => {
    if (!isServerPaginated) {
      setPage((current) => Math.min(current, totalPages));
    }
  }, [isServerPaginated, totalPages]);

  const paginatedRows = useMemo(
    () =>
      isServerPaginated
        ? rows
        : rows.slice((currentPage - 1) * pageSize, currentPage * pageSize),
    [currentPage, isServerPaginated, pageSize, rows],
  );

  const from = rowCount === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const to = Math.min(currentPage * pageSize, rowCount);
  const changePage = (nextPage: number) => {
    if (onPageChange) {
      onPageChange(nextPage);
      return;
    }
    setPage(nextPage);
  };

  return (
    <div className={className}>
      <div className="ui-radius overflow-x-auto border border-border bg-card">
        <table className="w-full" style={{ minWidth }}>
          <thead>
            <tr className="border-b border-border">
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={`admin-data-th ${alignClassName[column.align ?? "left"]}`}
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedRows.map((row, index) => (
              <tr
                key={getRowKey(row)}
                className={`admin-data-row ${
                  index % 2 === 0 ? "admin-data-row-even" : "admin-data-row-odd"
                }`}
              >
                {columns.map((column) => (
                  <td
                    key={column.key}
                    className={`admin-data-cell ${alignClassName[column.align ?? "left"]} ${column.className ?? ""}`}
                  >
                    {column.render(row)}
                  </td>
                ))}
              </tr>
            ))}
            {(isLoading || paginatedRows.length === 0) && (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-4 py-10 text-center font-mono-label text-xs uppercase tracking-widest text-muted-foreground"
                >
                  {isLoading ? loadingText : emptyText}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {rowCount > 0 && (
        <div className="mt-4 flex items-center justify-between gap-4">
          <p className="font-mono-label text-xs uppercase tracking-widest text-muted-foreground">
            Showing {from}-{to} of {rowCount}
          </p>
          {totalPages > 1 && (
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => changePage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="ui-radius-sm border border-border px-3 py-1.5 font-mono-label text-xs uppercase tracking-widest text-foreground transition-colors hover:bg-accent/10 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Prev
              </button>
              <button
                type="button"
                onClick={() =>
                  changePage(Math.min(totalPages, currentPage + 1))
                }
                disabled={currentPage === totalPages}
                className="ui-radius-sm border border-border px-3 py-1.5 font-mono-label text-xs uppercase tracking-widest text-foreground transition-colors hover:bg-accent/10 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Next
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
