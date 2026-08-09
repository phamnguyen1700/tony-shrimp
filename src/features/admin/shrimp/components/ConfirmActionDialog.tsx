import Dialog from "@/shared/ui/Dialog";
import MotionButton from "@/components/common/motion/MotionButton";

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
    <Dialog open={open} onClose={onClose} title={title} maxWidth="max-w-sm">
      <p className="mb-6 text-sm text-muted-foreground">{message}</p>
      <div className="flex gap-3">
        <MotionButton variant="primary" size="sm" onClick={onConfirm} className={dangerClassName}>
          {confirmLabel}
        </MotionButton>
        <MotionButton variant="ghost" size="sm" onClick={onClose}>
          {cancelLabel}
        </MotionButton>
      </div>
    </Dialog>
  );
}
