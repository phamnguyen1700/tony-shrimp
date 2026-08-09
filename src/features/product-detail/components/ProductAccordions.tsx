import { useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import type { Translations } from "@/i18n";
import type { ShrimpDetail } from "@/types/shrimp";

interface ProductAccordionsProps {
  t: Translations;
  product: ShrimpDetail;
}

function AccordionSection({ title, children }: { title: string; children: ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="accordion-row">
      <button className="accordion-trigger" onClick={() => setOpen((value) => !value)}>
        <span className="accordion-title">{title}</span>
        <span className="accordion-symbol">{open ? "-" : "+"}</span>
      </button>
      <AnimatePresence initial={false}>
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
      <AccordionSection title={t.product.description}>
        <p>{product.description ?? "N/A"}</p>
        {product.traits.length > 0 && (
          <ul className="mt-3 list-inside list-disc space-y-1">
            {product.traits.map((trait) => (
              <li key={trait}>{trait}</li>
            ))}
          </ul>
        )}
      </AccordionSection>
      <AccordionSection title={t.product.shipping}>
        <p>
          All shrimp are shipped live via Australia Post Express Post or StarTrack overnight
          courier. Orders are dispatched Monday to Wednesday to ensure safe arrival. A flat shipping
          rate of A$15 applies to all orders Australia-wide.
        </p>
      </AccordionSection>
      <AccordionSection title={t.product.doaPolicy}>
        <p>
          We guarantee live arrival on all orders. If any shrimp arrive deceased, please photograph
          the unopened bag within 2 hours of delivery and contact us. We will arrange a replacement
          or refund. Our DOA policy does not cover transit delays outside our control.
        </p>
      </AccordionSection>
    </div>
  );
}
