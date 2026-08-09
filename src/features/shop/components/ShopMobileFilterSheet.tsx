import { AnimatePresence, motion } from "motion/react";
import type { Translations } from "@/i18n";
import { bottomSheetSlide } from "@/lib/motionVariants";
import MotionButton from "@/components/common/motion/MotionButton";
import type { CatalogOptions, ShopFilters } from "@/types/shrimp";
import ShopFilterPanel from "./ShopFilterPanel";

interface ShopMobileFilterSheetProps {
  open: boolean;
  t: Translations;
  filters: ShopFilters;
  options: Pick<CatalogOptions, "types" | "colors" | "grades" | "rarities" | "traits">;
  filterCount: number;
  resultCount: number;
  onToggle: (key: keyof ShopFilters, value: string) => void;
  onClear: () => void;
  onClose: () => void;
}

export default function ShopMobileFilterSheet({
  open,
  t,
  filters,
  options,
  filterCount,
  resultCount,
  onToggle,
  onClear,
  onClose,
}: ShopMobileFilterSheetProps) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 z-40 bg-black/40 md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className="fixed inset-x-0 bottom-0 z-50 overflow-y-auto rounded-t-2xl border-t border-border bg-card md:hidden"
            style={{ maxHeight: "85vh" }}
            variants={bottomSheetSlide}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <div className="p-6">
              <div className="mb-6 flex items-center justify-between">
                <p className="font-mono-label text-xs uppercase tracking-[0.16em] text-foreground">
                  {t.shop.filters}
                </p>
                <button
                  onClick={onClose}
                  className="p-1 text-muted-foreground transition-colors hover:text-foreground"
                >
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path
                      d="M1 1L13 13M13 1L1 13"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                  </svg>
                </button>
              </div>
              <ShopFilterPanel filters={filters} t={t} options={options} onToggle={onToggle} />
              <div className="mt-6 flex gap-3">
                {filterCount > 0 && (
                  <button
                    onClick={() => {
                      onClear();
                      onClose();
                    }}
                    className="flex-1 border border-border py-3 font-mono-label text-xs uppercase tracking-widest text-muted-foreground transition-colors hover:text-foreground"
                    style={{ borderRadius: "var(--radius)" }}
                  >
                    {t.shop.clearAll}
                  </button>
                )}
                <MotionButton variant="accent" size="md" className="flex-1" onClick={onClose}>
                  SHOW {resultCount} RESULTS
                </MotionButton>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
