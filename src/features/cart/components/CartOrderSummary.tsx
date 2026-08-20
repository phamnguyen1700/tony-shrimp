import { motion } from "motion/react";
import type { AccountAddressDraft } from "@/components/common/address/AddressForm";
import type { Translations } from "@/i18n";
import MotionButton from "@/components/common/motion/MotionButton";
import type {
  AddressLocalityCheckResponse,
  AddressSuburbSuggestion,
  UserAddress,
} from "@/types/user";
import type { CartItem } from "@/types/cart";
import CartOrderPanel from "./CartOrderPanelView";

interface CartOrderSummaryProps {
  t: Translations;
  subtotal: number;
  shipping: number;
  total: number;
  items: CartItem[];
  hasOutOfStockItems: boolean;
  reduced: boolean | null;
  orderPanelOpen: boolean;
  addresses: UserAddress[];
  selectedAddressId: string | null;
  customerNote: string;
  addressDraft: AccountAddressDraft;
  addressFormOpen: boolean;
  states: string[];
  suburbSuggestions: AddressSuburbSuggestion[];
  addressLocalityCheck: AddressLocalityCheckResponse | undefined;
  addressErrors: Partial<Record<keyof AccountAddressDraft, string>>;
  canSaveAddress: boolean;
  isAddressLoading: boolean;
  isAddressValidating: boolean;
  isAddressMutating: boolean;
  confirmOrderOpen: boolean;
  onOrder: () => void;
  onSelectAddress: (addressId: string) => void;
  onCustomerNoteChange: (note: string) => void;
  onUseNewAddress: () => void;
  onAddressDraftChange: (draft: AccountAddressDraft) => void;
  onCancelAddressForm: () => void;
  onRequestPlaceOrder: () => void;
  onConfirmPlaceOrder: () => void;
  onCloseConfirmOrder: () => void;
}

export default function CartOrderSummary({
  t,
  subtotal,
  shipping,
  total,
  items,
  hasOutOfStockItems,
  reduced,
  orderPanelOpen,
  addresses,
  selectedAddressId,
  customerNote,
  addressDraft,
  addressFormOpen,
  states,
  suburbSuggestions,
  addressLocalityCheck,
  addressErrors,
  canSaveAddress,
  isAddressLoading,
  isAddressValidating,
  isAddressMutating,
  confirmOrderOpen,
  onOrder,
  onSelectAddress,
  onCustomerNoteChange,
  onUseNewAddress,
  onAddressDraftChange,
  onCancelAddressForm,
  onRequestPlaceOrder,
  onConfirmPlaceOrder,
  onCloseConfirmOrder,
}: CartOrderSummaryProps) {
  return (
    <motion.div
      layout
      className="w-full lg:sticky lg:top-24"
      initial={reduced ? false : { opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
    >
      <motion.div
        layout
        className="ui-radius space-y-4 border border-border p-6"
      >
        <p className="font-mono-label text-xs uppercase tracking-[0.16em] text-foreground">
          ORDER SUMMARY
        </p>
        <div className="space-y-3 border-t border-border pt-4">
          <div className="flex items-center justify-between">
            <p className="font-body text-sm text-muted-foreground">
              {t.cart.subtotal}
            </p>
            <p className="font-display text-sm font-medium text-foreground">
              A${subtotal}
            </p>
          </div>
          <div className="flex items-center justify-between">
            <p className="font-body text-sm text-muted-foreground">
              {t.cart.shipping}
            </p>
            <p className="font-display text-sm font-medium text-foreground">
              A${shipping}
            </p>
          </div>
        </div>
        <div className="flex items-center justify-between border-t border-border pt-4">
          <p className="font-mono-label text-xs uppercase tracking-[0.16em] text-foreground">
            {t.cart.total}
          </p>
          <p className="font-display text-xl font-semibold text-foreground">
            A${total}
          </p>
        </div>
        {!orderPanelOpen && (
          <MotionButton
            variant="accent"
            size="lg"
            className="mt-2 w-full"
            onClick={onOrder}
            disabled={hasOutOfStockItems}
          >
            {t.cart.order}
          </MotionButton>
        )}
        <CartOrderPanel
          t={t}
          open={orderPanelOpen}
          reduced={reduced}
          addresses={addresses}
          selectedAddressId={selectedAddressId}
          customerNote={customerNote}
          addressDraft={addressDraft}
          addressFormOpen={addressFormOpen}
          states={states}
          suburbSuggestions={suburbSuggestions}
          localityCheck={addressLocalityCheck}
          errors={addressErrors}
          canSaveAddress={canSaveAddress}
          isLoading={isAddressLoading}
          isValidating={isAddressValidating}
          isMutating={isAddressMutating}
          confirmOpen={confirmOrderOpen}
          items={items}
          subtotal={subtotal}
          shipping={shipping}
          total={total}
          hasOutOfStockItems={hasOutOfStockItems}
          onSelectAddress={onSelectAddress}
          onCustomerNoteChange={onCustomerNoteChange}
          onUseNewAddress={onUseNewAddress}
          onDraftChange={onAddressDraftChange}
          onCancelAddressForm={onCancelAddressForm}
          onRequestPlaceOrder={onRequestPlaceOrder}
          onConfirmPlaceOrder={onConfirmPlaceOrder}
          onCloseConfirm={onCloseConfirmOrder}
        />
      </motion.div>
    </motion.div>
  );
}
