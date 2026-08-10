import { AnimatePresence, motion } from "motion/react";
import AddressForm, { type AccountAddressDraft } from "@/components/common/address/AddressForm";
import ConfirmDialog from "@/components/common/dialogs/ConfirmDialog";
import MotionButton from "@/components/common/motion/MotionButton";
import Badge from "@/components/ui/Badge";
import type { Translations } from "@/i18n";
import type { AddressLocalityCheckResponse, AddressSuburbSuggestion, UserAddress } from "@/types/user";

interface CartOrderPanelProps {
  t: Translations;
  open: boolean;
  reduced: boolean | null;
  addresses: UserAddress[];
  selectedAddressId: string | null;
  customerNote: string;
  addressDraft: AccountAddressDraft;
  addressFormOpen: boolean;
  states: string[];
  suburbSuggestions: AddressSuburbSuggestion[];
  localityCheck: AddressLocalityCheckResponse | undefined;
  errors: Partial<Record<keyof AccountAddressDraft, string>>;
  canSaveAddress: boolean;
  isLoading: boolean;
  isValidating: boolean;
  isMutating: boolean;
  confirmOpen: boolean;
  total: number;
  onSelectAddress: (addressId: string) => void;
  onCustomerNoteChange: (note: string) => void;
  onUseNewAddress: () => void;
  onDraftChange: (draft: AccountAddressDraft) => void;
  onCancelAddressForm: () => void;
  onRequestPlaceOrder: () => void;
  onConfirmPlaceOrder: () => void;
  onCloseConfirm: () => void;
}

export default function CartOrderPanel({
  t,
  open,
  reduced,
  addresses,
  selectedAddressId,
  customerNote,
  addressDraft,
  addressFormOpen,
  states,
  suburbSuggestions,
  localityCheck,
  errors,
  canSaveAddress,
  isLoading,
  isValidating,
  isMutating,
  confirmOpen,
  total,
  onSelectAddress,
  onCustomerNoteChange,
  onUseNewAddress,
  onDraftChange,
  onCancelAddressForm,
  onRequestPlaceOrder,
  onConfirmPlaceOrder,
  onCloseConfirm,
}: CartOrderPanelProps) {
  const labels = t.cart.orderForm;
  const addressLabels = t.account.addressFields;
  const isEnglish = t.cart.title === "CART";
  const customerNoteLabel = labels.customerNote ?? (isEnglish ? "Customer note" : "Ghi chú của khách");
  const customerNotePlaceholder =
    labels.customerNotePlaceholder ??
    (isEnglish
      ? "Delivery notes, preferred time, or anything we should know..."
      : "Ghi chú giao hàng, thời gian mong muốn hoặc thông tin cần lưu ý...");
  const canPlaceOrder = addressFormOpen ? canSaveAddress : Boolean(selectedAddressId);
  const showSavedAddresses = !isLoading && addresses.length > 0 && !addressFormOpen;
  const showAddressForm = !isLoading && (addresses.length === 0 || addressFormOpen);

  return (
    <>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={reduced ? false : "collapsed"}
            animate="expanded"
            exit={reduced ? undefined : "collapsed"}
            variants={{
              collapsed: {
                height: 0,
                transition: { delay: 0.16, duration: 0.34, ease: [0.22, 1, 0.36, 1] },
              },
              expanded: {
                height: "auto",
                transition: { duration: 0.46, ease: [0.22, 1, 0.36, 1] },
              },
            }}
            className="overflow-hidden"
          >
            <motion.section
              initial={reduced ? false : "hidden"}
              animate="visible"
              exit={reduced ? undefined : "hidden"}
              variants={{
                hidden: {
                  opacity: 0,
                  y: 6,
                  transition: { duration: 0.2, ease: [0.22, 1, 0.36, 1] },
                },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: { delay: 0.34, duration: 0.3, ease: [0.22, 1, 0.36, 1] },
                },
              }}
              className="mt-6 w-full border-t border-border pt-6"
            >
              <div className="mb-5 flex flex-col gap-3">
                <div>
                  <p className="font-mono-label text-xs uppercase tracking-[0.16em] text-foreground">
                    {labels.title}
                  </p>
                  <p className="mt-1 font-body text-sm text-muted-foreground">{labels.description}</p>
                </div>
                {addresses.length > 0 && !addressFormOpen && (
                  <MotionButton variant="ghost" size="sm" className="w-full" onClick={onUseNewAddress}>
                    {labels.useNewAddress}
                  </MotionButton>
                )}
              </div>

              {isLoading && (
                <p className="font-mono-label text-xs uppercase tracking-widest text-muted-foreground">
                  {addressLabels.loading}
                </p>
              )}

              <AnimatePresence initial={false} mode="wait">
                {showSavedAddresses && (
                  <motion.div
                    key="saved-addresses"
                    initial={reduced ? false : { opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={reduced ? undefined : { opacity: 0, y: -6 }}
                    transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                    className="grid gap-3"
                  >
                    {addresses.map((address) => {
                      const selected = selectedAddressId === address.id;
                      return (
                        <button
                          key={address.id}
                          type="button"
                          onClick={() => onSelectAddress(address.id)}
                          className={`ui-radius border p-4 text-left transition-colors ${
                            selected
                              ? "border-accent bg-accent/10"
                              : "border-border bg-card hover:border-accent/50"
                          }`}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <p className="font-body text-sm font-medium text-foreground">
                              {address.recipient_name}
                            </p>
                            {address.is_default && <Badge variant="inStock">{addressLabels.default}</Badge>}
                          </div>
                          <p className="mt-2 font-body text-sm text-muted-foreground">
                            {address.recipient_phone}
                          </p>
                          <p className="mt-1 font-body text-sm text-muted-foreground">
                            {address.address_line1}
                            {address.address_line2 ? `, ${address.address_line2}` : ""}
                          </p>
                          <p className="font-body text-sm text-muted-foreground">
                            {address.suburb} {address.state} {address.postcode}
                          </p>
                        </button>
                      );
                    })}
                  </motion.div>
                )}

                {showAddressForm && (
                  <motion.div
                    key="new-address-form"
                    initial={reduced ? false : "collapsed"}
                    animate="expanded"
                    exit={reduced ? undefined : "collapsed"}
                    variants={{
                      collapsed: {
                        height: 0,
                        transition: { delay: 0.12, duration: 0.32, ease: [0.22, 1, 0.36, 1] },
                      },
                      expanded: {
                        height: "auto",
                        transition: { duration: 0.44, ease: [0.22, 1, 0.36, 1] },
                      },
                    }}
                    className="overflow-hidden"
                  >
                    <motion.div
                      initial={reduced ? false : "hidden"}
                      animate="visible"
                      exit={reduced ? undefined : "hidden"}
                      variants={{
                        hidden: {
                          opacity: 0,
                          y: 8,
                          transition: { duration: 0.18, ease: [0.22, 1, 0.36, 1] },
                        },
                        visible: {
                          opacity: 1,
                          y: 0,
                          transition: { delay: 0.3, duration: 0.28, ease: [0.22, 1, 0.36, 1] },
                        },
                      }}
                      className="ui-radius border border-border p-5"
                    >
                      <AddressForm
                        t={t}
                        draft={addressDraft}
                        states={states}
                        suburbSuggestions={suburbSuggestions}
                        localityCheck={localityCheck}
                        errors={errors}
                        canSave={canSaveAddress}
                        isValidating={isValidating}
                        isSaving={isMutating}
                        saveLabel={labels.placeOrder}
                        onDraftChange={onDraftChange}
                        onSave={onRequestPlaceOrder}
                        onCancel={onCancelAddressForm}
                      />
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="mt-5">
                <label className="font-mono-label text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                  {customerNoteLabel}
                </label>
                <textarea
                  value={customerNote}
                  maxLength={1000}
                  rows={4}
                  onChange={(event) => onCustomerNoteChange(event.target.value)}
                  className="ui-radius-sm mt-2 w-full border border-border bg-background px-3 py-2 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-accent"
                  placeholder={customerNotePlaceholder}
                />
              </div>

              {!addressFormOpen && (
                <MotionButton
                  variant="accent"
                  size="lg"
                  className="mt-6 w-full"
                  disabled={!canPlaceOrder || isMutating}
                  onClick={onRequestPlaceOrder}
                >
                  {labels.placeOrder}
                </MotionButton>
              )}
            </motion.section>
          </motion.div>
        )}
      </AnimatePresence>

      <ConfirmDialog
        open={confirmOpen}
        title={labels.confirmTitle}
        description={`${labels.confirmDescription} A$${total}.`}
        confirmLabel={labels.confirm}
        cancelLabel={addressLabels.cancel}
        tone="confirm"
        isConfirming={isMutating}
        onConfirm={onConfirmPlaceOrder}
        onClose={onCloseConfirm}
      />
    </>
  );
}
