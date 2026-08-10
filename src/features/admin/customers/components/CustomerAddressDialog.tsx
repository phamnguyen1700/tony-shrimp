import Dialog from "@/components/ui/Dialog";
import Badge from "@/components/ui/Badge";
import type { OwnerUserDetail } from "@/types/customer";

interface CustomerAddressDialogProps {
  open: boolean;
  user: OwnerUserDetail | null;
  isLoading?: boolean;
  onClose: () => void;
}

export default function CustomerAddressDialog({ open, user, isLoading = false, onClose }: CustomerAddressDialogProps) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={user ? `Addresses: ${user.full_name || user.email}` : "Addresses"}
      maxWidth="max-w-3xl"
    >
      {isLoading ? (
        <p className="font-mono-label text-xs uppercase tracking-widest text-muted-foreground">
          Loading addresses...
        </p>
      ) : !user ? null : (
        <div className="space-y-4">
          {user.addresses.map((address) => (
            <div key={address.id} className="ui-radius border border-border p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-body text-sm font-semibold text-foreground">{address.recipient_name}</p>
                  <p className="mt-1 font-body text-sm text-muted-foreground">{address.recipient_phone}</p>
                </div>
                {address.is_default && <Badge variant="inStock">Default</Badge>}
              </div>
              <p className="mt-3 font-body text-sm text-foreground">
                {address.address_line1}
                {address.address_line2 ? `, ${address.address_line2}` : ""}
              </p>
              <p className="mt-1 font-body text-sm text-muted-foreground">
                {address.suburb} {address.state} {address.postcode}
              </p>
            </div>
          ))}
          {user.addresses.length === 0 && (
            <p className="font-mono-label text-xs uppercase tracking-widest text-muted-foreground">
              No saved address.
            </p>
          )}
        </div>
      )}
    </Dialog>
  );
}
