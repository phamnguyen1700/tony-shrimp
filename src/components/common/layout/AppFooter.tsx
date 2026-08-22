import Link from "next/link";
import { routes } from "@/config/routes";
import type { Translations } from "@/i18n";
import GoogleMapEmbed from "@/components/common/location/GoogleMapEmbed";
import BrandMark from "./BrandMark";

interface AppFooterProps {
  t: Translations;
}

export default function AppFooter({ t }: AppFooterProps) {
  const storeLinks = [
    { label: t.nav.shop, href: routes.shop },
    { label: "Order Tracking", href: "/account" },
  ];

  const infoLinks = [
    { label: t.nav.shipping, href: "/about#shipping" },
    { label: "Live Arrival", href: "/about#live-arrival" },
    { label: "DOA Policy", href: "/about#doa" },
    { label: t.nav.contact, href: "/about#contact" },
    { label: "Facebook", href: "https://facebook.com/thang.pham.790508" },
  ];

  return (
    <section className="relative z-20 bg-[#0d110d] text-[#edeae3]">
      <div className="mx-auto max-w-[1440px] px-6 py-16 md:px-10 md:py-20">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1.05fr)_minmax(260px,0.7fr)_minmax(320px,0.9fr)] lg:gap-14">
          <div>
            <div className="mb-5">
              <BrandMark tagline={t.tagline} tone="light" size="footer" />
            </div>
            <p className="max-w-sm font-body text-sm leading-relaxed text-[#b7b9b0]">
              Quality Caridina and Neocaridina from Victoria, Australia. Fair
              prices, reliable stock, and the occasional rare shrimp that
              probably won&apos;t hang around for long.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-8">
            <div>
              <p className="mb-4 font-mono-label text-xs uppercase tracking-widest text-[#9da29a]">
                Store
              </p>
              <div className="flex flex-col gap-2.5">
                {storeLinks.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    className="font-body text-xs text-[#d4d6ce]/75 transition-colors hover:text-[#f7f3ea]"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
            <div>
              <p className="mb-4 font-mono-label text-xs uppercase tracking-widest text-[#9da29a]">
                Info
              </p>
              <div className="flex flex-col gap-2.5">
                {infoLinks.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    className="font-body text-xs text-[#d4d6ce]/75 transition-colors hover:text-[#f7f3ea]"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
          <div className="min-h-48 overflow-hidden border border-white/10 bg-[#080b08]" style={{ borderRadius: "var(--radius)" }}>
            <GoogleMapEmbed className="h-48 w-full border-0 grayscale md:h-full" />
          </div>
        </div>
        <div className="mt-12 flex flex-col justify-between gap-3 border-t border-white/10 pt-8 md:flex-row">
          <p className="font-mono-label text-xs uppercase tracking-widest text-[#9da29a]/75">
            © 2026 Tony Shrimp Australia. All rights reserved.
          </p>
          <p className="font-mono-label text-xs uppercase tracking-widest text-[#9da29a]/65">
            Australia-wide shipping · Live arrival guarantee
          </p>
        </div>
      </div>
    </section>
  );
}
