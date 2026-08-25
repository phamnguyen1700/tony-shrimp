import { AnimatePresence, motion } from "motion/react";
import type { Translations } from "@/i18n";
import { bottomSheetSlide } from "@/lib/config/motionVariants";
import MotionButton from "@/components/common/motion/MotionButton";
import type { ShrimpCollectionLink } from "@/lib/shrimp/collectionConfig";
import type { CatalogOptions, ShopFilters } from "@/types/shrimp";
import ShopFilterPanel from "./ShopFilterPanel";

interface ShopMobileFilterSheetProps {
  open: boolean;
  t: Translations;
  filters: ShopFilters;
  options: Pick<CatalogOptions, "species" | "lines" | "colors" | "grades" | "rarities" | "traits">;
  collectionLinks?: ShrimpCollectionLink[];
  activeCollectionSlug?: string;
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
  collectionLinks,
  activeCollectionSlug,
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
              <div className="mb-6 flex justify-center">
                <span
                  className="h-px w-10 bg-muted-foreground/60"
                  aria-hidden
                />
              </div>
              <ShopFilterPanel
                filters={filters}
                t={t}
                options={options}
                collectionLinks={collectionLinks}
                activeCollectionSlug={activeCollectionSlug}
                showCollections={false}
                onToggle={onToggle}
              />
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
