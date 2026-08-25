import { AnimatePresence, motion } from "motion/react";
import AddressForm, { type AccountAddressDraft } from "@/components/common/address/AddressForm";
import FallbackImage from "@/components/common/images/FallbackImage";
import MotionButton from "@/components/common/motion/MotionButton";
import Dialog from "@/components/ui/Dialog";
import Badge from "@/components/ui/Badge";
import { isVideoMediaUrl } from "@/lib/config/media";
import type { Translations } from "@/i18n";
import type { CartItem } from "@/types/cart";
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
  items: CartItem[];
  subtotal: number;
  shipping: number;
  total: number;
  hasOutOfStockItems: boolean;
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
  items,
  subtotal,
  shipping,
  total,
  hasOutOfStockItems,
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
  const canPlaceOrder =
    !hasOutOfStockItems && (addressFormOpen ? canSaveAddress : Boolean(selectedAddressId));
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
                  {labels.customerNote}
                </label>
                <textarea
                  value={customerNote}
                  maxLength={1000}
                  rows={4}
                  onChange={(event) => onCustomerNoteChange(event.target.value)}
                  className="ui-radius-sm mt-2 w-full border border-border bg-background px-3 py-2 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-accent"
                  placeholder={labels.customerNotePlaceholder}
                />
              </div>

              {!addressFormOpen && (
                <>
                  {hasOutOfStockItems && (
                    <p className="mt-4 font-body text-sm leading-6 text-red-500">
                      {t.cart.outOfStockCheckout}
                    </p>
                  )}
                <MotionButton
                  variant="accent"
                  size="lg"
                  className="mt-6 w-full"
                  disabled={!canPlaceOrder || isMutating}
                  onClick={onRequestPlaceOrder}
                >
                  {labels.placeOrder}
                </MotionButton>
                </>
              )}
            </motion.section>
          </motion.div>
        )}
      </AnimatePresence>

      <OrderInvoiceDialog
        open={confirmOpen}
        t={t}
        title={labels.confirmTitle}
        confirmLabel={labels.confirm}
        cancelLabel={addressLabels.cancel}
        items={items}
        selectedAddress={addresses.find((address) => address.id === selectedAddressId) ?? null}
        addressDraft={addressDraft}
        addressFormOpen={addressFormOpen}
        customerNote={customerNote}
        subtotal={subtotal}
        shipping={shipping}
        total={total}
        isConfirming={isMutating}
        onConfirm={onConfirmPlaceOrder}
        onClose={onCloseConfirm}
      />
    </>
  );
}

function OrderInvoiceDialog({
  open,
  t,
  title,
  confirmLabel,
  cancelLabel,
  items,
  selectedAddress,
  addressDraft,
  addressFormOpen,
  customerNote,
  subtotal,
  shipping,
  total,
  isConfirming,
  onConfirm,
  onClose,
}: {
  open: boolean;
  t: Translations;
  title: string;
  confirmLabel: string;
  cancelLabel: string;
  items: CartItem[];
  selectedAddress: UserAddress | null;
  addressDraft: AccountAddressDraft;
  addressFormOpen: boolean;
  customerNote: string;
  subtotal: number;
  shipping: number;
  total: number;
  isConfirming: boolean;
  onConfirm: () => void;
  onClose: () => void;
}) {
  const address = addressFormOpen
    ? {
        recipient_name: addressDraft.recipient_name,
        recipient_phone: addressDraft.recipient_phone,
        address_line1: addressDraft.address_line1,
        address_line2: addressDraft.address_line2,
        suburb: addressDraft.suburb,
        state: addressDraft.state,
        postcode: addressDraft.postcode,
      }
    : selectedAddress;

  return (
    <Dialog open={open} onClose={onClose} title={title} maxWidth="max-w-2xl">
      <div className="space-y-5">
        <div className="border-b border-border pb-5">
          <p className="font-mono-label text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
            {t.cart.invoiceItems}
          </p>
          <div className="mt-3 max-h-[222px] space-y-3 overflow-y-auto pr-2">
            {items.map((item) => (
              <div key={item.lineId} className="grid grid-cols-[56px_minmax(0,1fr)] items-center gap-3">
                <div className="h-14 w-14 overflow-hidden bg-[#080b08]" style={{ borderRadius: "var(--radius-sm)" }}>
                  {item.imageUrl && isVideoMediaUrl(item.imageUrl) ? (
                    <video src={item.imageUrl} className="h-full w-full object-contain" muted playsInline preload="metadata" />
                  ) : (
                    <FallbackImage src={item.imageUrl} alt={item.name} className="h-full w-full object-contain" />
                  )}
                </div>
                <div className="min-w-0">
                  <div className="flex min-w-0 items-baseline justify-between gap-3">
                    <p className="truncate font-display text-sm font-semibold italic text-foreground">
                      {item.name}
                    </p>
                    <p className="shrink-0 font-display text-sm font-medium text-foreground">
                      A${item.price * item.quantity}
                    </p>
                  </div>
                  <p className="mt-0.5 truncate font-mono-label text-[11px] uppercase tracking-widest text-muted-foreground">
                    {item.variantName ?? "Each"} · x{item.quantity}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid gap-5 border-b border-border pb-5 md:grid-cols-[minmax(0,1fr)_minmax(240px,320px)]">
          <div>
            <p className="font-mono-label text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
            {t.cart.shipTo}
            </p>
            {address ? (
              <div className="mt-3 space-y-1 font-body text-sm leading-5 text-muted-foreground">
                <p className="font-medium text-foreground">{address.recipient_name}</p>
                <p>{address.recipient_phone}</p>
                <p>
                  {address.address_line1}
                  {address.address_line2 ? `, ${address.address_line2}` : ""}
                </p>
                <p>
                  {address.suburb} {address.state} {address.postcode}
                </p>
              </div>
            ) : (
              <p className="mt-3 font-body text-sm text-muted-foreground">{t.cart.noAddressSelected}</p>
            )}
          </div>

          <div className="space-y-2">
            <InvoiceRow label={t.cart.subtotal} value={subtotal} />
            <InvoiceRow label={t.cart.shipping} value={shipping} />
            <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
              <p className="font-mono-label text-xs uppercase tracking-[0.16em] text-foreground">
                {t.cart.total}
              </p>
              <p className="font-display text-2xl font-semibold text-foreground">A${total}</p>
            </div>
          </div>
        </div>

        {customerNote.trim() && (
          <div className="border-b border-border pb-5">
            <p className="font-mono-label text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
              {t.cart.orderForm.customerNote}
            </p>
            <p className="mt-2 font-body text-sm leading-6 text-muted-foreground">{customerNote}</p>
          </div>
        )}

        <div className="flex flex-col-reverse gap-3 border-t border-border pt-5 sm:flex-row sm:items-center sm:justify-end">
          <MotionButton variant="ghost" size="sm" onClick={onClose} disabled={isConfirming}>
            {cancelLabel}
          </MotionButton>
          <MotionButton
            variant="accent"
            size="md"
            onClick={onConfirm}
            disabled={isConfirming}
            className="sm:min-w-44"
          >
            {confirmLabel}
          </MotionButton>
        </div>
      </div>
    </Dialog>
  );
}

function InvoiceRow({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center justify-between">
      <p className="font-body text-sm text-muted-foreground">{label}</p>
      <p className="font-display text-sm font-medium text-foreground">A${value}</p>
    </div>
  );
}
