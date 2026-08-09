import { useEffect, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";

interface AboutAccordionProps {
  id?: string;
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
  forceOpen?: boolean;
}

export default function AboutAccordion({
  id,
  title,
  children,
  defaultOpen = false,
  forceOpen = false,
}: AboutAccordionProps) {
  const [open, setOpen] = useState(defaultOpen);

  useEffect(() => {
    if (forceOpen) setOpen(true);
  }, [forceOpen]);

  return (
    <section id={id} className="accordion-row scroll-mt-24">
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
    </section>
  );
}
