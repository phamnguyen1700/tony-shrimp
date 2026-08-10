import Badge from "@/components/ui/Badge";
import type { OwnerUserListItem } from "@/types/customer";

interface AdminUsersBoxProps {
  users: OwnerUserListItem[];
  isLoading?: boolean;
}

export default function AdminUsersBox({ users, isLoading = false }: AdminUsersBoxProps) {
  return (
    <aside className="ui-radius border border-border bg-card p-5">
      <div className="mb-4">
        <h2 className="font-display text-lg font-semibold text-foreground">Owner / Admin</h2>
        <p className="mt-1 font-mono-label text-xs uppercase tracking-widest text-muted-foreground">
          {users.length} users
        </p>
      </div>

      <div className="space-y-3">
        {users.map((user) => (
          <div key={user.id} className="border-b border-border pb-3 last:border-0 last:pb-0">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="truncate font-body text-sm font-medium text-foreground">
                  {user.full_name || "N/A"}
                </p>
                <p className="mt-1 truncate font-body text-xs text-muted-foreground">{user.email}</p>
              </div>
              <Badge variant={user.role === "admin" ? "accent" : "inStock"}>{user.role}</Badge>
            </div>
          </div>
        ))}

        {(isLoading || users.length === 0) && (
          <p className="py-6 text-center font-mono-label text-xs uppercase tracking-widest text-muted-foreground">
            {isLoading ? "Loading users..." : "No admin users."}
          </p>
        )}
      </div>
    </aside>
  );
}
