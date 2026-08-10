import AdminDataTable, { type AdminDataTableColumn } from "@/components/common/table/AdminDataTable";
import type { OwnerUserListItem } from "@/types/customer";

interface CustomerTableProps {
  title: string;
  users: OwnerUserListItem[];
  emptyText: string;
  mode: "active" | "inactive";
  isLoading?: boolean;
  onViewAddresses: (user: OwnerUserListItem) => void;
  onEditRole: (user: OwnerUserListItem) => void;
  onActivate: (user: OwnerUserListItem) => void;
  onDeactivate: (user: OwnerUserListItem) => void;
  onDelete: (user: OwnerUserListItem) => void;
}

export default function CustomerTable({
  title,
  users,
  emptyText,
  mode,
  isLoading = false,
  onViewAddresses,
  onEditRole,
  onActivate,
  onDeactivate,
  onDelete,
}: CustomerTableProps) {
  const columns: AdminDataTableColumn<OwnerUserListItem>[] = [
    {
      key: "name",
      header: "Name",
      className: "admin-data-name-cell",
      render: (user) => (
        <>
          <p className="font-body text-sm font-medium text-foreground">{user.full_name || "N/A"}</p>
          <p className="mt-1 font-body text-xs text-muted-foreground">{user.email}</p>
        </>
      ),
    },
    {
      key: "phone",
      header: "Phone",
      align: "center",
      className: "min-w-[160px] font-body text-sm text-muted-foreground",
      render: (user) => user.phone || "N/A",
    },
    {
      key: "address",
      header: "Address",
      align: "center",
      className: "min-w-[150px]",
      render: (user) => (
        <button
          type="button"
          onClick={() => onViewAddresses(user)}
          className="font-mono-label text-xs uppercase tracking-widest text-accent transition-colors hover:text-foreground disabled:cursor-not-allowed disabled:opacity-40"
        >
          View
        </button>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      align: "center",
      className: "min-w-[220px]",
      render: (user) => (
        <div className="flex justify-center gap-3">
          <button
            type="button"
            className="font-mono-label text-xs uppercase tracking-widest text-accent transition-colors hover:text-foreground"
            onClick={() => onEditRole(user)}
          >
            Edit
          </button>
          {mode === "active" ? (
            <button
              type="button"
              className="font-mono-label text-xs uppercase tracking-widest text-red-500 transition-colors hover:text-red-600"
              onClick={() => onDeactivate(user)}
            >
              Deactivate
            </button>
          ) : (
            <>
              <button
                type="button"
                className="font-mono-label text-xs uppercase tracking-widest text-accent transition-colors hover:text-foreground"
                onClick={() => onActivate(user)}
              >
                Activate
              </button>
              <button
                type="button"
                className="font-mono-label text-xs uppercase tracking-widest text-red-500 transition-colors hover:text-red-600"
                onClick={() => onDelete(user)}
              >
                Delete
              </button>
            </>
          )}
        </div>
      ),
    },
    {
      key: "created",
      header: "Created",
      align: "center",
      className: "min-w-[150px] font-mono-label text-xs uppercase tracking-widest text-muted-foreground",
      render: (user) => formatDate(user.created_at),
    },
  ];

  if (mode === "inactive") {
    columns.push({
      key: "deactivated",
      header: "Deactivated",
      align: "center",
      className: "min-w-[170px] font-mono-label text-xs uppercase tracking-widest text-muted-foreground",
      render: (user) => formatDate(user.deactivated_at ?? ""),
    });
  }

  return (
    <section className="space-y-4">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h2 className="font-display text-xl font-semibold text-foreground">{title}</h2>
          <p className="mt-1 font-mono-label text-xs uppercase tracking-widest text-muted-foreground">
            {users.length} users
          </p>
        </div>
      </div>

      <AdminDataTable
        rows={users}
        columns={columns}
        getRowKey={(user) => user.id}
        emptyText={emptyText}
        loadingText="Loading users..."
        isLoading={isLoading}
        pageSize={10}
        minWidth={mode === "active" ? "920px" : "1060px"}
      />
    </section>
  );
}

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "N/A";
  return date.toLocaleDateString("en-AU", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}
