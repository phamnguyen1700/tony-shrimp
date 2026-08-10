"use client";

import { useEffect, useMemo, useState } from "react";
import { useReducedMotion } from "motion/react";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import { ZodError } from "zod";
import PageHero from "@/components/common/layout/PageHero";
import { useAppRuntime } from "@/providers/AppProviders";
import {
  useAddressLocalityCheck,
  useAddressOptions,
  useAddressSuburbSuggestions,
  useCreateUserAddress,
  useCurrentUser,
  useUserAddresses,
  useUserProfile,
} from "@/hooks/user";
import { normalizeAustralianPhone } from "@/lib/australianPhone";
import { createUserAddressSchema } from "@/schema/user";
import { useAuthStore } from "@/store/authStore";
import { useCart } from "@/store/cartStore";
import { useCreateOrder } from "@/hooks/order";
import AppBreadcrumb from "@/components/common/navigation/AppBreadcrumb";
import CartEmptyState from "./components/CartEmptyState";
import CartItemsList from "./components/CartItemsList";
import CartOrderSummary from "./components/CartOrderSummary";
import type { AccountAddressDraft } from "@/components/common/address/AddressForm";
import type { UserAddress } from "@/types/user";

type AddressFieldErrors = Partial<Record<keyof AccountAddressDraft, string>>;

const emptyAddressDraft: AccountAddressDraft = {
  recipient_name: "",
  recipient_phone: "",
  address_line1: "",
  address_line2: "",
  suburb: "",
  state: "VIC",
  postcode: "",
  is_default: false,
};

export default function CartFeature() {
  const { t } = useAppRuntime();
  const router = useRouter();
  const reduced = useReducedMotion();
  const searchParams = useSearchParams();
  const { items, removeItem, updateQuantity, clearCart, subtotal } = useCart();
  const user = useAuthStore((state) => state.user);
  const currentUserQuery = useCurrentUser();
  const profileQuery = useUserProfile();
  const addressesQuery = useUserAddresses();
  const addressOptionsQuery = useAddressOptions();
  const createAddressMutation = useCreateUserAddress();
  const createOrderMutation = useCreateOrder();
  const [lastViewedProduct, setLastViewedProduct] = useState<{ href: string; name: string } | null>(null);
  const [orderPanelOpen, setOrderPanelOpen] = useState(false);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [addressFormOpen, setAddressFormOpen] = useState(false);
  const [addressTouched, setAddressTouched] = useState(false);
  const [addressDraft, setAddressDraft] = useState<AccountAddressDraft>(emptyAddressDraft);
  const [debouncedAddressDraft, setDebouncedAddressDraft] =
    useState<AccountAddressDraft>(emptyAddressDraft);
  const [confirmOrderOpen, setConfirmOrderOpen] = useState(false);
  const [customerNote, setCustomerNote] = useState("");

  const fromProductId = searchParams.get("fromProductId");
  const fromProductName = searchParams.get("fromProductName");
  const shouldUseLastViewed = searchParams.get("fromLastViewed") === "1";
  const queryReturnProduct =
    fromProductId && fromProductName
      ? {
          href: `/products/${fromProductId}`,
          name: fromProductName,
        }
      : null;
  const returnProduct = queryReturnProduct ?? lastViewedProduct;
  const shipping = items.length > 0 ? 25 : 0;
  const total = subtotal + shipping;
  const addresses = addressesQuery.data ?? [];
  const parsedAddressDraft = createUserAddressSchema.safeParse(addressDraft);
  const addressFieldErrors =
    addressTouched && !parsedAddressDraft.success
      ? zodErrorsToAddressFieldErrors(parsedAddressDraft.error)
      : {};

  const addressSuggestionQuery = useMemo(() => {
    const suburb = debouncedAddressDraft.suburb.trim();
    const postcode = debouncedAddressDraft.postcode.trim();
    const search = suburb || postcode;

    if (search.length < 2) return null;
    return { search };
  }, [debouncedAddressDraft]);

  const addressLocalityQuery = useMemo(() => {
    const suburb = debouncedAddressDraft.suburb.trim();
    const postcode = debouncedAddressDraft.postcode.trim();

    if (!suburb || !/^\d{4}$/.test(postcode)) return null;
    return { suburb, postcode };
  }, [debouncedAddressDraft]);

  const addressSuggestionQueryResult = useAddressSuburbSuggestions(addressSuggestionQuery);
  const addressLocalityQueryResult = useAddressLocalityCheck(addressLocalityQuery);

  function order() {
    if (!user) {
      const query = searchParams.toString();
      const redirectTo = `/cart${query ? `?${query}` : ""}`;
      router.push(`/account?redirect=${encodeURIComponent(redirectTo)}`);
      return;
    }

    setOrderPanelOpen(true);
    if (!addressesQuery.isLoading && addresses.length === 0) openNewAddressForm();
  }

  function openNewAddressForm() {
    setAddressTouched(false);
    setAddressDraft({
      ...emptyAddressDraft,
      recipient_name: profileQuery.data?.full_name ?? "",
      recipient_phone: profileQuery.data?.phone ? normalizeAustralianPhone(profileQuery.data.phone) : "",
      state: addressOptionsQuery.data?.states[0] ?? "VIC",
      is_default: addresses.length === 0,
    });
    setAddressFormOpen(true);
    setSelectedAddressId(null);
  }

  function requestPlaceOrder() {
    if (addressFormOpen) {
      setAddressTouched(true);
      if (!parsedAddressDraft.success) return;
    }

    if (!addressFormOpen && !selectedAddressId) return;
    setConfirmOrderOpen(true);
  }

  async function confirmPlaceOrder() {
    try {
      const legacyItem = items.find((item) => !item.variantId);
      if (legacyItem) {
        toast.error(`${legacyItem.name} needs to be added to cart again before ordering.`);
        setConfirmOrderOpen(false);
        return;
      }

      let shippingAddressId = selectedAddressId;

      if (addressFormOpen) {
        const parsedPayload = createUserAddressSchema.safeParse(addressDraft);
        if (!parsedPayload.success) {
          setAddressTouched(true);
          return;
        }
        const createdAddress = await createAddressMutation.mutateAsync(parsedPayload.data);
        shippingAddressId = createdAddress.id;
        setSelectedAddressId(createdAddress.id);
        setAddressFormOpen(false);
        setAddressTouched(false);
      }

      if (!shippingAddressId) return;

      const order = await createOrderMutation.mutateAsync({
        shipping_address_id: shippingAddressId,
        items: items.map((item) => ({
          variant_id: item.variantId,
          quantity: item.quantity,
        })),
        customer_note: customerNote.trim() || null,
      });

      clearCart();
      setConfirmOrderOpen(false);
      router.push(`/orders/${order.id}`);
    } catch {
      // Mutation hooks own the toast messages.
    }
  }

  useEffect(() => {
    if (queryReturnProduct || !shouldUseLastViewed) {
      setLastViewedProduct(null);
      return;
    }

    try {
      const value = sessionStorage.getItem("tony-last-viewed-product");
      if (!value) return;
      const parsed = JSON.parse(value) as { href?: string; name?: string };
      if (parsed.href && parsed.name) setLastViewedProduct({ href: parsed.href, name: parsed.name });
    } catch {
      setLastViewedProduct(null);
    }
  }, [queryReturnProduct, shouldUseLastViewed]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedAddressDraft(addressDraft);
    }, 400);

    return () => window.clearTimeout(timer);
  }, [addressDraft]);

  useEffect(() => {
    if (!orderPanelOpen || addressFormOpen || selectedAddressId || addresses.length === 0) return;
    const defaultAddress = addresses.find((address) => address.is_default) ?? addresses[0];
    setSelectedAddressId(defaultAddress.id);
  }, [addresses, addressFormOpen, orderPanelOpen, selectedAddressId]);

  useEffect(() => {
    if (!orderPanelOpen || addressesQuery.isLoading || addressFormOpen || addresses.length > 0) return;
    openNewAddressForm();
  }, [addresses.length, addressFormOpen, addressesQuery.isLoading, orderPanelOpen]);

  useEffect(() => {
    if (currentUserQuery.error) setOrderPanelOpen(false);
  }, [currentUserQuery.error]);

  return (
    <div className="app-page">
      <div className="app-container">
        <PageHero
          title={t.cart.title}
          reduced={reduced}
          className="md:mb-12"
          eyebrowSlot={
            <AppBreadcrumb
              className="mb-4"
              items={[
                { label: t.nav.shop, href: "/shop" },
                ...(returnProduct ? [{ label: returnProduct.name, href: returnProduct.href }] : []),
                { label: t.cart.title },
              ]}
            />
          }
        />

        {items.length === 0 ? (
          <CartEmptyState t={t} reduced={reduced} returnProduct={returnProduct} />
        ) : (
          <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_460px] lg:gap-14 xl:grid-cols-[minmax(0,1fr)_500px]">
            <CartItemsList
              t={t}
              items={items}
              reduced={reduced}
              returnProduct={returnProduct}
              onRemoveItem={removeItem}
              onUpdateQuantity={updateQuantity}
            />
            <CartOrderSummary
              t={t}
              subtotal={subtotal}
              shipping={shipping}
              total={total}
              reduced={reduced}
              orderPanelOpen={orderPanelOpen}
              addresses={addresses}
              selectedAddressId={selectedAddressId}
              customerNote={customerNote}
              addressDraft={addressDraft}
              addressFormOpen={addressFormOpen}
              states={addressOptionsQuery.data?.states ?? ["ACT", "NSW", "NT", "QLD", "SA", "TAS", "VIC", "WA"]}
              suburbSuggestions={addressSuggestionQueryResult.data?.items ?? []}
              addressLocalityCheck={addressLocalityQueryResult.data}
              addressErrors={addressFieldErrors}
              canSaveAddress={parsedAddressDraft.success}
              isAddressLoading={addressesQuery.isLoading}
              isAddressValidating={addressSuggestionQueryResult.isFetching || addressLocalityQueryResult.isFetching}
              isAddressMutating={createAddressMutation.isPending || createOrderMutation.isPending}
              confirmOrderOpen={confirmOrderOpen}
              onOrder={order}
              onSelectAddress={(addressId) => {
                setSelectedAddressId(addressId);
                setAddressFormOpen(false);
              }}
              onCustomerNoteChange={setCustomerNote}
              onUseNewAddress={openNewAddressForm}
              onAddressDraftChange={(draft) => {
                setAddressTouched(true);
                setAddressDraft(draft);
              }}
              onCancelAddressForm={() => {
                setAddressFormOpen(false);
                setAddressTouched(false);
              }}
              onRequestPlaceOrder={requestPlaceOrder}
              onConfirmPlaceOrder={() => void confirmPlaceOrder()}
              onCloseConfirmOrder={() => setConfirmOrderOpen(false)}
            />
          </div>
        )}
      </div>
    </div>
  );
}

function zodErrorsToAddressFieldErrors(error: ZodError): AddressFieldErrors {
  return error.issues.reduce<AddressFieldErrors>((errors, issue) => {
    const field = issue.path[0] as keyof AccountAddressDraft | undefined;
    if (field && !errors[field]) errors[field] = issue.message;
    return errors;
  }, {});
}
