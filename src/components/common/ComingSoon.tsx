"use client";

import type { ReactNode } from "react";
import { useState } from "react";
import { defaultFallbackImage } from "@/components/common/images/FallbackImage";

interface ComingSoonProps {
  children: ReactNode;
  title?: string;
  description?: string;
  label?: string;
  imageSrc?: string;
  imageAlt?: string;
}

export default function ComingSoon({
  children,
  title = "Coming soon",
  description = "This section is being prepared and will be available soon.",
  label = "Preview",
  imageSrc = defaultFallbackImage,
  imageAlt = "Coming soon preview",
}: ComingSoonProps) {
  const [imageFailed, setImageFailed] = useState(false);
  const shouldShowImage = Boolean(imageSrc && !imageFailed);

  return (
    <div className="relative min-h-screen">
      <div className="pointer-events-none select-none opacity-30 blur-[1px]" aria-hidden="true">
        {children}
      </div>
      <div className="absolute inset-0 z-10 flex min-h-screen items-start justify-center bg-background/55 px-4 py-24 backdrop-blur-sm md:items-center md:py-12">
        <section className="grid w-full max-w-4xl overflow-hidden border border-border bg-card shadow-sm md:grid-cols-[1.05fr_.95fr]">
          <div className="min-h-56 bg-secondary">
            {shouldShowImage ? (
              <img
                src={imageSrc}
                alt={imageAlt}
                className="h-full min-h-56 w-full object-cover"
                onError={() => setImageFailed(true)}
              />
            ) : (
              <div className="flex h-full min-h-56 flex-col justify-end bg-[linear-gradient(135deg,var(--secondary),var(--card))] p-6">
                <p className="font-mono-label text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                  Tony Shrimp
                </p>
                <p className="mt-3 font-display text-3xl font-semibold leading-none text-foreground">
                  Coming soon
                </p>
              </div>
            )}
          </div>
          <div className="p-6 md:p-8">
            <p className="font-mono-label text-[10px] uppercase tracking-[0.22em] text-muted-foreground">{label}</p>
            <h1 className="mt-4 font-display text-4xl font-semibold leading-none text-foreground md:text-5xl">{title}</h1>
            <p className="mt-4 max-w-md text-sm leading-6 text-muted-foreground">{description}</p>
          </div>
        </section>
      </div>
    </div>
  );
}
