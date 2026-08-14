import AdminDataTable, { type AdminDataTableColumn } from "@/components/common/table/AdminDataTable";
import Badge from "@/components/ui/Badge";
import type { OwnerUserListItem } from "@/types/customer";

interface CustomerTableProps {
  users: OwnerUserListItem[];
  emptyText: string;
  mode: "active" | "inactive" | "admin";
  isLoading?: boolean;
  onViewAddresses: (user: OwnerUserListItem) => void;
  onEditRole: (user: OwnerUserListItem) => void;
  onActivate: (user: OwnerUserListItem) => void;
  onDeactivate: (user: OwnerUserListItem) => void;
  onDelete: (user: OwnerUserListItem) => void;
}

export default function CustomerTable({
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
      key: "role",
      header: "Role",
      align: "center",
      className: "min-w-[130px]",
      render: (user) => <Badge variant={user.role === "admin" ? "accent" : "inStock"}>{user.role}</Badge>,
    },
    {
      key: "status",
      header: "Status",
      align: "center",
      className: "min-w-[130px] font-mono-label text-xs uppercase tracking-widest text-muted-foreground",
      render: (user) => user.status,
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
          {mode === "active" || (mode === "admin" && user.status === "active") ? (
            <button
              type="button"
              className="font-mono-label text-xs uppercase tracking-widest text-red-500 transition-colors hover:text-red-600"
              onClick={() => onDeactivate(user)}
            >
              Deactivate
            </button>
          ) : user.status === "inactive" ? (
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
          ) : null}
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

  if (mode === "inactive" || mode === "admin") {
    columns.push({
      key: "deactivated",
      header: "Deactivated",
      align: "center",
      className: "min-w-[170px] font-mono-label text-xs uppercase tracking-widest text-muted-foreground",
      render: (user) => formatDate(user.deactivated_at ?? ""),
    });
  }

  return (
    <section>
      <AdminDataTable
        rows={users}
        columns={columns}
        getRowKey={(user) => user.id}
        emptyText={emptyText}
        loadingText="Loading users..."
        isLoading={isLoading}
        pageSize={10}
        minWidth="1120px"
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
