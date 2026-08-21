"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import ConfirmDialog from "@/components/common/dialogs/ConfirmDialog";
import {
  useActivateOwnerUser,
  useDeactivateOwnerUser,
  useHardDeleteOwnerUser,
  useOwnerUserDetail,
  useOwnerUsers,
  useUpdateOwnerUserRole,
} from "@/hooks/customer";
import { normalizeUserRole } from "@/lib/authAccess";
import { useAppRuntime } from "@/providers/AppProviders";
import { useAuthStore } from "@/store/authStore";
import CustomerAddressDialog from "./components/CustomerAddressDialog";
import CustomerFilters from "./components/CustomerFilters";
import CustomerTable from "./components/CustomerTable";
import CustomerTabs, { type CustomerTab } from "./components/CustomerTabs";
import EditUserRoleDialog from "./components/EditUserRoleDialog";
import type { ManagedUserRole, OwnerUserListItem } from "@/types/customer";

type PendingAction =
  | { type: "activate"; user: OwnerUserListItem }
  | { type: "deactivate"; user: OwnerUserListItem }
  | { type: "delete"; user: OwnerUserListItem }
  | null;

const PAGE_SIZE = 10;

export default function AdminCustomersFeature() {
  const { t } = useAppRuntime();
  const currentUser = useAuthStore((state) => state.user);
  const currentRole = normalizeUserRole(currentUser?.role);
  const canViewAdminUsers = currentRole === "admin" || currentRole === "owner";
  const reduced = useReducedMotion();
  const [search, setSearch] = useState("");
  const [addressUserId, setAddressUserId] = useState<string | null>(null);
  const [roleUser, setRoleUser] = useState<OwnerUserListItem | null>(null);
  const [pendingAction, setPendingAction] = useState<PendingAction>(null);
  const [activeTab, setActiveTab] = useState<CustomerTab>("active");
  const [pages, setPages] = useState<Record<CustomerTab, number>>({
    active: 1,
    inactive: 1,
    admin: 1,
  });
  const searchParam = search.trim() || undefined;
  const activePage = pages.active;
  const inactivePage = pages.inactive;
  const adminPage = pages.admin;

  useEffect(() => {
    setPages({ active: 1, inactive: 1, admin: 1 });
  }, [searchParam]);

  const activeUsersQuery = useOwnerUsers({
    search: searchParam,
    role: "customer",
    status: "active",
    limit: PAGE_SIZE,
    offset: (activePage - 1) * PAGE_SIZE,
  });
  const inactiveUsersQuery = useOwnerUsers({
    search: searchParam,
    role: "customer",
    status: "inactive",
    limit: PAGE_SIZE,
    offset: (inactivePage - 1) * PAGE_SIZE,
  });
  const adminUsersQuery = useOwnerUsers(
    {
      search: searchParam,
      role_in: "owner,admin",
      limit: PAGE_SIZE,
      offset: (adminPage - 1) * PAGE_SIZE,
    },
    canViewAdminUsers,
  );
  const userDetailQuery = useOwnerUserDetail(addressUserId);
  const activateUserMutation = useActivateOwnerUser();
  const deactivateUserMutation = useDeactivateOwnerUser();
  const deleteUserMutation = useHardDeleteOwnerUser();
  const updateRoleMutation = useUpdateOwnerUserRole();

  const activeCustomerUsers = activeUsersQuery.data?.items ?? [];
  const inactiveCustomerUsers = inactiveUsersQuery.data?.items ?? [];
  const adminUsers = adminUsersQuery.data?.items ?? [];
  const tabCounts = {
    active: activeUsersQuery.data?.total ?? 0,
    inactive: inactiveUsersQuery.data?.total ?? 0,
    admin: adminUsersQuery.data?.total ?? 0,
  };
  const visibleTotal = tabCounts[activeTab];
  const visiblePage = pages[activeTab];
  const visibleUsers =
    activeTab === "active"
      ? activeCustomerUsers
      : activeTab === "inactive"
        ? inactiveCustomerUsers
        : adminUsers;
  const emptyText =
    activeTab === "active"
      ? "No active customers found."
      : activeTab === "inactive"
        ? "No inactive customers found."
        : "No admin users found.";
  const isLoading =
    activeTab === "active"
      ? activeUsersQuery.isLoading
      : activeTab === "inactive"
        ? inactiveUsersQuery.isLoading
        : adminUsersQuery.isLoading;
  const isMutating =
    activateUserMutation.isPending ||
    deactivateUserMutation.isPending ||
    deleteUserMutation.isPending ||
    updateRoleMutation.isPending;

  async function confirmAction() {
    if (!pendingAction) return;

    if (pendingAction.type === "activate") {
      await activateUserMutation.mutateAsync(pendingAction.user.id);
    }

    if (pendingAction.type === "deactivate") {
      await deactivateUserMutation.mutateAsync(pendingAction.user.id);
    }

    if (pendingAction.type === "delete") {
      await deleteUserMutation.mutateAsync(pendingAction.user.id);
    }

    setPendingAction(null);
  }

  async function saveRole(role: ManagedUserRole) {
    if (!roleUser) return;
    await updateRoleMutation.mutateAsync({
      userId: roleUser.id,
      payload: { role },
    });
    setRoleUser(null);
  }

  return (
    <motion.div
      className="space-y-8 p-6 md:p-8"
      initial={reduced ? false : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
    >
      <div>
        <h1 className="font-display text-2xl font-semibold text-foreground md:text-3xl">
          {t.admin.customers}
        </h1>
      </div>

      <CustomerFilters
        search={search}
        onSearchChange={setSearch}
        onClear={() => setSearch("")}
      />

      <section className="space-y-4">
        <CustomerTabs
          activeTab={activeTab}
          counts={tabCounts}
          onTabChange={setActiveTab}
        />
        <CustomerTable
          users={visibleUsers}
          emptyText={emptyText}
          mode={activeTab}
          isLoading={isLoading}
          totalUsers={visibleTotal}
          page={visiblePage}
          onPageChange={(page) =>
            setPages((current) => ({ ...current, [activeTab]: page }))
          }
          onViewAddresses={(user) => setAddressUserId(user.id)}
          onEditRole={setRoleUser}
          onActivate={(user) => setPendingAction({ type: "activate", user })}
          onDeactivate={(user) =>
            setPendingAction({ type: "deactivate", user })
          }
          onDelete={(user) => setPendingAction({ type: "delete", user })}
        />
      </section>

      <CustomerAddressDialog
        open={Boolean(addressUserId)}
        user={userDetailQuery.data ?? null}
        isLoading={userDetailQuery.isLoading}
        onClose={() => setAddressUserId(null)}
      />
      <EditUserRoleDialog
        user={roleUser}
        isSaving={updateRoleMutation.isPending}
        onSave={saveRole}
        onClose={() => setRoleUser(null)}
      />
      <ConfirmDialog
        open={Boolean(pendingAction)}
        title={
          pendingAction ? `${pendingAction.type} user` : "Confirm user action"
        }
        description={pendingAction ? actionDescription(pendingAction) : ""}
        confirmLabel={pendingAction?.type === "delete" ? "Delete" : "Confirm"}
        cancelLabel="Cancel"
        tone={
          pendingAction?.type === "delete" ||
          pendingAction?.type === "deactivate"
            ? "alert"
            : "confirm"
        }
        isConfirming={isMutating}
        onConfirm={() => void confirmAction()}
        onClose={() => setPendingAction(null)}
      />
    </motion.div>
  );
}

function actionDescription(action: NonNullable<PendingAction>) {
  if (action.type === "activate") return `Activate ${action.user.email}?`;
  if (action.type === "deactivate") return `Deactivate ${action.user.email}?`;
  return `Permanently delete ${action.user.email}? This requires the user to be inactive.`;
}
