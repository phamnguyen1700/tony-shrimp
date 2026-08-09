import { useState } from "react";
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
      {sortedImages.length > 1 && (
        <div className="absolute inset-x-4 bottom-4 flex justify-center gap-2">
          {sortedImages.map((image, index) => (
            <button
              key={image.id}
              type="button"
              onClick={() => setActiveImageIndex(index)}
              className={`h-1.5 w-8 transition-colors ${
                index === activeImageIndex ? "bg-white" : "bg-white/30 hover:bg-white/60"
              }`}
              aria-label={`View image ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
