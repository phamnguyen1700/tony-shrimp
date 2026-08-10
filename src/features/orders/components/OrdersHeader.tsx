import PageHero from "@/components/common/layout/PageHero";
import type { Translations } from "@/i18n";

interface OrdersHeaderProps {
  t: Translations;
  reduced: boolean | null;
}

export default function OrdersHeader({ t, reduced }: OrdersHeaderProps) {
  return <PageHero title={t.account.myOrders} reduced={reduced} />;
}
