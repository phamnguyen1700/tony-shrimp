import { AnimatePresence, motion } from "motion/react";
import type { Translations } from "@/i18n";
import type { AddressLocalityCheckResponse, AddressSuburbSuggestion, UserAddress } from "@/types/user";
import AccountAddressCard from "./AccountAddressCard";
import AccountAddressForm, { type AccountAddressDraft } from "./AccountAddressForm";

interface AccountAddressesPanelProps {
  t: Translations;
  reduced: boolean | null;
  addresses: UserAddress[];
  formDraft: AccountAddressDraft;
  formOpen: boolean;
  editingAddressId: string | null;
  states: string[];
  suburbSuggestions: AddressSuburbSuggestion[];
  localityCheck: AddressLocalityCheckResponse | undefined;
  errors: Partial<Record<keyof AccountAddressDraft, string>>;
  canSave: boolean;
  isLoading: boolean;
  isValidating: boolean;
  isMutating: boolean;
  onAddAddress: () => void;
  onEditAddress: (address: UserAddress) => void;
  onDeleteAddress: (addressId: string) => void;
  onSetDefaultAddress: (addressId: string) => void;
  onDraftChange: (draft: AccountAddressDraft) => void;
  onSaveAddress: () => void;
  onCancelForm: () => void;
}

export default function AccountAddressesPanel({
  t,
  reduced,
  addresses,
  formDraft,
  formOpen,
  editingAddressId,
  states,
  suburbSuggestions,
  localityCheck,
  errors,
  canSave,
  isLoading,
  isValidating,
  isMutating,
  onAddAddress,
  onEditAddress,
  onDeleteAddress,
  onSetDefaultAddress,
  onDraftChange,
  onSaveAddress,
  onCancelForm,
}: AccountAddressesPanelProps) {
  const labels = t.account.addressFields;

  return (
    <section>
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="font-mono-label text-xs uppercase tracking-[0.18em] text-foreground">
          {labels.title}
        </h2>
      </div>

      <div className="space-y-4">
        {isLoading && (
          <p className="font-mono-label text-xs uppercase tracking-widest text-muted-foreground">
            {labels.loading}
          </p>
        )}
        {!isLoading && addresses.length === 0 && !formOpen && (
          <p className="font-body text-sm text-muted-foreground">{labels.empty}</p>
        )}
        {addresses.map((address) => (
          <AccountAddressCard
            key={address.id}
            t={t}
            address={address}
            onEdit={() => onEditAddress(address)}
            onDelete={() => onDeleteAddress(address.id)}
            onSetDefault={() => onSetDefaultAddress(address.id)}
            isMutating={isMutating}
          />
        ))}
      </div>

      <button
        type="button"
        onClick={onAddAddress}
        className="mt-5 flex items-center gap-2 py-2 font-mono-label text-xs uppercase tracking-[0.16em] text-accent transition-colors hover:text-accent/80"
      >
        {labels.add}
      </button>

      <AnimatePresence initial={false}>
        {formOpen && (
          <motion.div
            key={editingAddressId ?? "new-address-form"}
            initial={reduced ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduced ? undefined : { opacity: 0, y: -6 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="mt-4 border border-border p-5"
            style={{ borderRadius: "var(--radius)" }}
          >
            <AccountAddressForm
              t={t}
              draft={formDraft}
              states={states}
              suburbSuggestions={suburbSuggestions}
              localityCheck={localityCheck}
              errors={errors}
              canSave={canSave}
              isValidating={isValidating}
              isSaving={isMutating}
              onDraftChange={onDraftChange}
              onSave={onSaveAddress}
              onCancel={onCancelForm}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
