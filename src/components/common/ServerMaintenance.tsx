"use client";

import type { ReactNode } from "react";
import { defaultFallbackImage } from "@/components/common/images/FallbackImage";
import type { Translations } from "@/i18n";

interface ServerMaintenanceProps {
  t: Translations;
  children?: ReactNode;
}

export default function ServerMaintenance({ t, children }: ServerMaintenanceProps) {
  const copy = t.maintenance;

  return (
    <div className="relative min-h-screen bg-background">
      {children ? (
        <div className="pointer-events-none select-none opacity-25 blur-[1px]" aria-hidden="true">
          {children}
        </div>
      ) : null}
      <div className="absolute inset-0 z-10 flex min-h-screen items-start justify-center bg-background/70 px-4 py-24 backdrop-blur-sm md:items-center md:py-12">
        <section className="grid w-full max-w-4xl overflow-hidden border border-border bg-card shadow-sm md:grid-cols-[1.05fr_.95fr]">
          <div className="min-h-56 bg-secondary">
            <img
              src={defaultFallbackImage}
              alt={copy.imageAlt}
              className="h-full min-h-56 w-full object-cover"
            />
          </div>
          <div className="p-6 md:p-8">
            <p className="font-mono-label text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
              {copy.label}
            </p>
            <h1 className="mt-4 font-display text-4xl font-semibold leading-none text-foreground md:text-5xl">
              {copy.title}
            </h1>
            <p className="mt-4 max-w-md text-sm leading-6 text-muted-foreground">
              {copy.description}
            </p>
            <p className="mt-5 font-mono-label text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
              {copy.retryHint}
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
