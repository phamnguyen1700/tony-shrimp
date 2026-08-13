import { useState } from "react";
import { ChevronLeft, ChevronRight, Play } from "lucide-react";
import { motion } from "motion/react";
import { isVideoMediaUrl } from "@/lib/media";
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
  const selectorImages = sortedImages.slice(0, 4);

  function showPreviousImage() {
    setActiveImageIndex((index) => (index - 1 + sortedImages.length) % sortedImages.length);
  }

  function showNextImage() {
    setActiveImageIndex((index) => (index + 1) % sortedImages.length);
  }

  return (
    <div className="shrimp-image-frame relative">
      {activeImage?.url && isVideoMediaUrl(activeImage.url) ? (
        <video
          key={activeImage.id}
          src={activeImage.url}
          className="h-full w-full object-contain"
          autoPlay
          controls
          loop
          muted
          playsInline
          preload="auto"
        />
      ) : activeImage?.url ? (
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
          <div className="absolute left-3 top-3 flex flex-col gap-2 sm:left-4 sm:top-4">
            {selectorImages.map((image, index) => (
              <MediaThumb
                key={image.id}
                image={image}
                index={index}
                name={product.name}
                isActive={index === activeImageIndex}
                onClick={() => setActiveImageIndex(index)}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function MediaThumb({
  image,
  index,
  name,
  isActive,
  onClick,
}: {
  image: ShrimpDetail["images"][number];
  index: number;
  name: string;
  isActive: boolean;
  onClick: () => void;
}) {
  const isVideo = isVideoMediaUrl(image.url);

  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative h-14 w-14 overflow-hidden border bg-black/40 transition-colors sm:h-16 sm:w-16 ${
        isActive ? "border-white" : "border-white/25 hover:border-white/60"
      }`}
      aria-label={`View media ${index + 1}`}
    >
      {image.url && isVideo ? (
        <>
          <video
            src={image.url}
            className="h-full w-full object-cover"
            muted
            playsInline
            preload="metadata"
          />
          <span className="absolute inset-0 flex items-center justify-center bg-black/20 text-white">
            <Play className="h-4 w-4 fill-current" aria-hidden="true" />
          </span>
        </>
      ) : image.url ? (
        <img
          src={image.url}
          alt={image.alt_text ?? name}
          className="h-full w-full object-cover"
        />
      ) : (
        <span className="flex h-full w-full items-center justify-center font-mono-label text-[10px] uppercase text-white/45">
          Empty
        </span>
      )}
    </button>
  );
}
