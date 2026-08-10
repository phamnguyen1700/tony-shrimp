import type { Translations } from "@/i18n";
import type { UserAddress } from "@/types/user";

interface AccountAddressCardProps {
  t: Translations;
  address: UserAddress;
  onEdit: () => void;
  onDelete: () => void;
  onSetDefault: () => void;
  isMutating: boolean;
}

export default function AccountAddressCard({
  t,
  address,
  onEdit,
  onDelete,
  onSetDefault,
  isMutating,
}: AccountAddressCardProps) {
  const labels = t.account.addressFields;

  return (
    <div className="border border-border p-5" style={{ borderRadius: "var(--radius)" }}>
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <p className="font-body text-sm font-medium text-foreground">{address.recipient_name}</p>
            {address.is_default && (
              <span className="ui-radius border border-accent/20 bg-accent/10 px-1.5 py-0.5 font-mono-label text-xs uppercase tracking-widest text-accent">
                {labels.default}
              </span>
            )}
          </div>
          <p className="font-body text-sm text-muted-foreground">{address.recipient_phone}</p>
          <p className="mt-2 font-body text-sm text-muted-foreground">{address.address_line1}</p>
          {address.address_line2 && (
            <p className="font-body text-sm text-muted-foreground">{address.address_line2}</p>
          )}
          <p className="font-body text-sm text-muted-foreground">
            {[address.suburb, address.state, address.postcode].filter(Boolean).join(" ")}
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-3">
          {!address.is_default && (
            <button
              type="button"
              onClick={onSetDefault}
              disabled={isMutating}
              className="font-mono-label text-[11px] uppercase tracking-widest text-accent transition-colors hover:text-accent/80 disabled:opacity-40"
            >
              {labels.setDefault}
            </button>
          )}
          <button
            type="button"
            onClick={onEdit}
            className="font-mono-label text-[11px] uppercase tracking-widest text-muted-foreground underline underline-offset-2 transition-colors hover:text-foreground"
          >
            {labels.edit}
          </button>
          <button
            type="button"
            onClick={onDelete}
            disabled={isMutating}
            className="font-mono-label text-[11px] uppercase tracking-widest text-muted-foreground transition-colors hover:text-red-500 disabled:opacity-40"
          >
            {labels.delete}
          </button>
        </div>
      </div>
    </div>
  );
}
