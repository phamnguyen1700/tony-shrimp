import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "motion/react";
import type { ShrimpDetail } from "@/types/shrimp";

interface ProductMediaGalleryProps {
  product: ShrimpDetail;
}

export default function ProductMediaGallery({ product }: ProductMediaGalleryProps) {
  const sortedImages = [...product.images].sort((a, b) => a.sort_order - b.sort_order);
  const primaryIndex = Math.max(
    0,
    sortedImages.findIndex((image) => image.is_primary),
  );
  const [activeImageIndex, setActiveImageIndex] = useState(primaryIndex);
  const activeImage = sortedImages[activeImageIndex] ?? sortedImages[0];
  const hasMultipleImages = sortedImages.length > 1;

  function showPreviousImage() {
    setActiveImageIndex((index) => (index - 1 + sortedImages.length) % sortedImages.length);
  }

  function showNextImage() {
    setActiveImageIndex((index) => (index + 1) % sortedImages.length);
  }

  return (
    <div className="shrimp-image-frame relative">
      {activeImage?.url ? (
        <img
          src={activeImage.url}
          alt={activeImage.alt_text ?? product.name}
          className="h-full w-full object-contain"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center">
          <p className="mono-meta uppercase">No image</p>
        </div>
      )}
      {hasMultipleImages && (
        <>
          <motion.button
            type="button"
            onClick={showPreviousImage}
            whileHover={{ x: -2 }}
            whileTap={{ scale: 0.94 }}
            className="absolute left-4 top-[calc(50%-1.25rem)] flex h-10 w-10 items-center justify-center border border-white/20 bg-black/30 text-white transition-colors hover:bg-black/45"
            aria-label="View previous image"
          >
            <ChevronLeft className="h-4 w-4" aria-hidden="true" />
          </motion.button>
          <motion.button
            type="button"
            onClick={showNextImage}
            whileHover={{ x: 2 }}
            whileTap={{ scale: 0.94 }}
            className="absolute right-4 top-[calc(50%-1.25rem)] flex h-10 w-10 items-center justify-center border border-white/20 bg-black/30 text-white transition-colors hover:bg-black/45"
            aria-label="View next image"
          >
            <ChevronRight className="h-4 w-4" aria-hidden="true" />
          </motion.button>
          <div className="absolute inset-x-4 bottom-4 flex justify-center gap-2">
            {sortedImages.map((image, index) => (
              <button
                key={image.id}
                type="button"
                onClick={() => setActiveImageIndex(index)}
                className={`h-2 w-2 rounded-full transition-colors ${
                  index === activeImageIndex ? "bg-white" : "bg-white/30 hover:bg-white/60"
                }`}
                aria-label={`View image ${index + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
