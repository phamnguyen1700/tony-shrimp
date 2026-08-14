"use client";

import { useState } from "react";

export const defaultFallbackImage = "/coming-soon/comming-soon.png";

interface FallbackImageProps {
  src?: string | null;
  alt: string;
  className?: string;
  fallbackSrc?: string;
  fallbackAlt?: string;
  draggable?: boolean;
}

export default function FallbackImage({
  src,
  alt,
  className = "h-full w-full object-contain",
  fallbackSrc = defaultFallbackImage,
  fallbackAlt = "Coming soon",
  draggable,
}: FallbackImageProps) {
  const [failed, setFailed] = useState(false);
  const imageSrc = src && !failed ? src : fallbackSrc;

  return (
    <img
      src={imageSrc}
      alt={src && !failed ? alt : fallbackAlt}
      className={className}
      onError={() => {
        if (imageSrc !== fallbackSrc) setFailed(true);
      }}
      draggable={draggable}
    />
  );
}
