"use client";

import { useRef, useState } from "react";

const landingBackgroundVideoSrc = "/background-vid/background-swife.mp4";
const landingBackgroundPosterSrc = "/background-vid/bg-image.png";

export default function LandingBackgroundVideo() {
  const [videoSrc, setVideoSrc] = useState(landingBackgroundVideoSrc);
  const fallbackLoadedRef = useRef(false);

  async function loadInlineFallback() {
    if (fallbackLoadedRef.current) return;
    fallbackLoadedRef.current = true;

    const fallback = await import("./landingBackgroundVideoData");
    setVideoSrc(fallback.landingBackgroundVideoSrc);
  }

  return (
    <div
      className="fixed inset-0 z-0 pointer-events-none overflow-hidden bg-cover bg-center"
      style={{ backgroundImage: `url(${landingBackgroundPosterSrc})` }}
    >
      <video
        key={videoSrc}
        className="h-full w-full object-cover opacity-95"
        autoPlay
        muted
        loop
        playsInline
        poster={landingBackgroundPosterSrc}
        preload="metadata"
        aria-hidden="true"
        onError={() => void loadInlineFallback()}
      >
        <source src={videoSrc} type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-[#080b08]/5" />
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(90deg, rgba(8,11,8,0.82) 0%, rgba(8,11,8,0.36) 42%, rgba(8,11,8,0.62) 100%)",
        }}
      />
    </div>
  );
}
