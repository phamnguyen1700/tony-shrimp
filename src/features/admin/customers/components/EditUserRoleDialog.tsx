import { useEffect, useState } from "react";
import MotionButton from "@/components/common/motion/MotionButton";
import Dialog from "@/components/ui/Dialog";
import type { ManagedUserRole, OwnerUserListItem } from "@/types/customer";

interface EditUserRoleDialogProps {
  user: OwnerUserListItem | null;
  isSaving?: boolean;
  onSave: (role: ManagedUserRole) => void;
  onClose: () => void;
}

const roleOptions: ManagedUserRole[] = ["customer", "owner", "admin"];

export default function EditUserRoleDialog({
  user,
  isSaving = false,
  onSave,
  onClose,
}: EditUserRoleDialogProps) {
  const [role, setRole] = useState<ManagedUserRole>("customer");

  useEffect(() => {
    if (user) setRole(user.role);
  }, [user]);

  return (
    <Dialog
      open={Boolean(user)}
      onClose={onClose}
      title={user ? `Edit role: ${user.email}` : "Edit role"}
      maxWidth="max-w-sm"
    >
      <label className="admin-filter-field">
        <span className="admin-filter-label">Role</span>
        <select
          value={role}
          onChange={(event) => setRole(event.target.value as ManagedUserRole)}
          className="admin-filter-control"
        >
          {roleOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </label>
      <div className="mt-6 flex gap-3">
        <MotionButton variant="accent" size="sm" disabled={!user || isSaving} onClick={() => onSave(role)}>
          Save
        </MotionButton>
        <MotionButton variant="ghost" size="sm" disabled={isSaving} onClick={onClose}>
          Cancel
        </MotionButton>
      </div>
    </Dialog>
  );
}
