import type { ReactNode } from "react";
import Dialog from "@/components/ui/Dialog";
import MotionButton from "@/components/common/motion/MotionButton";

export type ConfirmDialogTone = "alert" | "warning" | "confirm";

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  description: string;
  confirmLabel: string;
  cancelLabel: string;
  tone?: ConfirmDialogTone;
  isConfirming?: boolean;
  children?: ReactNode;
  onConfirm: () => void | Promise<void>;
  onClose: () => void;
}

const toneClassName: Record<ConfirmDialogTone, string> = {
  alert: "bg-red-600 text-white hover:bg-red-700",
  warning: "bg-amber-500 text-black hover:bg-amber-600",
  confirm: "bg-accent text-accent-foreground hover:bg-accent/90",
};

export default function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel,
  cancelLabel,
  tone = "confirm",
  isConfirming = false,
  children,
  onConfirm,
  onClose,
}: ConfirmDialogProps) {
  return (
    <Dialog open={open} onClose={onClose} title={title} maxWidth="max-w-sm">
      <p className="mb-6 font-body text-sm leading-6 text-muted-foreground">{description}</p>
      {children && <div className="mb-6 space-y-4">{children}</div>}
      <div className="flex gap-3">
        <MotionButton
          variant="primary"
          size="sm"
          onClick={onConfirm}
          disabled={isConfirming}
          className={toneClassName[tone]}
        >
          {confirmLabel}
        </MotionButton>
        <MotionButton variant="ghost" size="sm" onClick={onClose} disabled={isConfirming}>
          {cancelLabel}
        </MotionButton>
      </div>
    </Dialog>
  );
}
