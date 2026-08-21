import { useState, type ReactNode } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import type { Translations } from "@/i18n";
import type { ShrimpDetail } from "@/types/shrimp";

interface ProductAccordionsProps {
  t: Translations;
  product: ShrimpDetail;
}

type ProductCopySegment = {
  text: string;
  strong?: boolean;
  href?: string;
};

function AccordionSection({
  title,
  children,
  defaultOpen = false,
}: {
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="accordion-row">
      <button className="accordion-trigger" onClick={() => setOpen((value) => !value)}>
        <span className="accordion-title">{title}</span>
        <span className="accordion-symbol">{open ? "-" : "+"}</span>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="pb-5 font-body text-sm leading-relaxed text-muted-foreground">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function ProductAccordions({ t, product }: ProductAccordionsProps) {
  return (
    <div className="space-y-0">
      <AccordionSection title={t.product.description} defaultOpen>
        <MarkdownDescription value={product.description} />
        {product.traits.length > 0 && (
          <ul className="mt-3 list-inside list-disc space-y-1">
            {product.traits.map((trait) => (
              <li key={trait}>{trait}</li>
            ))}
          </ul>
        )}
      </AccordionSection>
      <AccordionSection title={t.product.shipping}>
        <TranslatedPolicyContent section={t.about.sections.shipping} />
      </AccordionSection>
      <AccordionSection title={t.product.doaPolicy}>
        <TranslatedPolicyContent section={t.about.sections.doa} />
      </AccordionSection>
    </div>
  );
}

function TranslatedPolicyContent({
  section,
}: {
  section: {
    overview: ProductCopySegment[];
    highlights?: ProductCopySegment[][];
    note?: ProductCopySegment[];
  };
}) {
  return (
    <div className="space-y-3">
      <p>{renderSegments(section.overview)}</p>
      {section.highlights?.map((highlight, index) => (
        <p key={index}>{renderSegments(highlight)}</p>
      ))}
      {section.note ? <p>{renderSegments(section.note)}</p> : null}
    </div>
  );
}

function renderSegments(segments: ProductCopySegment[]) {
  return segments.map((segment, index) => {
    if (segment.href) {
      return (
        <Link
          key={index}
          href={segment.href}
          className="font-semibold text-foreground underline underline-offset-4 transition-colors hover:text-accent"
        >
          {segment.text}
        </Link>
      );
    }

    if (segment.strong) {
      return (
        <strong key={index} className="font-semibold text-foreground">
          {segment.text}
        </strong>
      );
    }

    return <span key={index}>{segment.text}</span>;
  });
}

function MarkdownDescription({ value }: { value?: string | null }) {
  if (!value?.trim()) return <p>N/A</p>;

  const blocks = value.replace(/\r\n/g, "\n").split(/\n{2,}/).map((block) => block.trim()).filter(Boolean);

  return (
    <div className="space-y-4">
      {blocks.map((block, index) => {
        if (block.startsWith("## ")) {
          return (
            <h3 key={index} className="font-display text-lg font-semibold italic text-foreground">
              {block.replace(/^##\s+/, "")}
            </h3>
          );
        }

        if (block.startsWith("### ")) {
          return (
            <h4 key={index} className="font-mono-label text-xs uppercase tracking-[0.16em] text-foreground">
              {block.replace(/^###\s+/, "")}
            </h4>
          );
        }

        const lines = block.split("\n").map((line) => line.trim()).filter(Boolean);
        if (lines.every((line) => /^[-*]\s+/.test(line))) {
          return (
            <ul key={index} className="list-inside list-disc space-y-1">
              {lines.map((line) => (
                <li key={line}>{renderInlineMarkdown(line.replace(/^[-*]\s+/, ""))}</li>
              ))}
            </ul>
          );
        }

        return (
          <p key={index} className="leading-relaxed">
            {renderInlineMarkdown(block)}
          </p>
        );
      })}
    </div>
  );
}

function renderInlineMarkdown(value: string) {
  const parts = value.split(/(\*\*[^*]+\*\*)/g);

  return parts.map((part, index) =>
    part.startsWith("**") && part.endsWith("**") ? (
      <strong key={index} className="font-semibold text-foreground">
        {part.slice(2, -2)}
      </strong>
    ) : (
      <span key={index}>{part}</span>
    ),
  );
}
