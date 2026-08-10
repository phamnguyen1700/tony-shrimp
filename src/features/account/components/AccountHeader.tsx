import PageHero from "@/components/common/layout/PageHero";
import type { Translations } from "@/i18n";

interface AccountHeaderProps {
  t: Translations;
  reduced: boolean | null;
}

export default function AccountHeader({ t, reduced }: AccountHeaderProps) {
  return <PageHero title={t.account.title} reduced={reduced} />;
}

