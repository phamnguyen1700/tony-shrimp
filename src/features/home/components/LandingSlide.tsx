import { motion } from "motion/react";
import { springGentle } from "@/lib/motionVariants";
import { isVideoMediaUrl } from "@/lib/media";
import type { ShrimpListItem } from "@/types/shrimp";

interface LandingSlideProps {
  specimen: ShrimpListItem;
  index: number;
  isActive: boolean;
  reduced: boolean | null;
}

export default function LandingSlide({ specimen, index, isActive, reduced }: LandingSlideProps) {
  const isVideo = isVideoMediaUrl(specimen.primary_image_url);

  return (
    <div
      data-landing-slide={index}
      className="relative w-screen h-screen shrink-0 flex items-center justify-center overflow-hidden"
    >
      <motion.div
        className="absolute inset-0 flex items-center justify-center pointer-events-none translate-x-[7vw] md:translate-x-[12vw]"
        animate={
          reduced
            ? {}
            : {
                scale: isActive ? 1 : 0.88,
                opacity: isActive ? 1 : 0.3,
              }
        }
        transition={springGentle}
      >
        {specimen.primary_image_url && isVideo ? (
          <motion.video
            src={specimen.primary_image_url}
            className="h-[52vh] w-auto max-w-[80vw] object-contain md:h-[65vh] md:max-w-[70vw]"
            style={{ filter: "drop-shadow(0 0 60px rgba(0,0,0,0.8))" }}
            autoPlay={isActive}
            muted
            loop
            playsInline
            preload={isActive ? "auto" : "metadata"}
            animate={
              reduced
                ? {}
                : isActive
                  ? {
                      y: [0, -10, -3, -12, 0],
                      rotate: [0, 0.6, -0.4, 0.9, 0],
                    }
                  : {}
            }
            transition={
              isActive
                ? {
                    duration: 9,
                    ease: "easeInOut",
                    repeat: Infinity,
                    repeatType: "loop",
                  }
                : {}
            }
          />
        ) : specimen.primary_image_url ? (
          <motion.img
            src={specimen.primary_image_url}
            alt={specimen.name}
            className="w-auto h-[52vh] md:h-[65vh] max-w-[80vw] md:max-w-[70vw] object-contain"
            style={{ filter: "drop-shadow(0 0 60px rgba(0,0,0,0.8))" }}
            animate={
              reduced
                ? {}
                : isActive
                  ? {
                      y: [0, -10, -3, -12, 0],
                      rotate: [0, 0.6, -0.4, 0.9, 0],
                    }
                  : {}
            }
            transition={
              isActive
                ? {
                    duration: 9,
                    ease: "easeInOut",
                    repeat: Infinity,
                    repeatType: "loop",
                  }
                : {}
            }
            draggable={false}
          />
        ) : (
          <p className="font-mono-label text-xs uppercase tracking-widest text-white/35">
            No image
          </p>
        )}
      </motion.div>
    </div>
  );
}
