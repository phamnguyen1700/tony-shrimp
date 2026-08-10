import ConfirmDialog from "@/components/common/dialogs/ConfirmDialog";

interface ConfirmActionDialogProps {
  open: boolean;
  title: string;
  message: string;
  confirmLabel: string;
  cancelLabel: string;
  dangerClassName: string;
  onConfirm: () => void;
  onClose: () => void;
}

export default function ConfirmActionDialog({
  open,
  title,
  message,
  confirmLabel,
  cancelLabel,
  dangerClassName,
  onConfirm,
  onClose,
}: ConfirmActionDialogProps) {
  return (
    <ConfirmDialog
      open={open}
      title={title}
      description={message}
      confirmLabel={confirmLabel}
      cancelLabel={cancelLabel}
      tone={dangerClassName.includes("red") ? "alert" : "warning"}
      onConfirm={onConfirm}
      onClose={onClose}
    />
  );
}
