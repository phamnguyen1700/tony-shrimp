import Link from "next/link";
import { motion } from "motion/react";
import { routes } from "@/config/routes";
import { cn } from "@/lib/config/utils";
import { springGentle } from "@/lib/config/motionVariants";
import { isVideoMediaUrl } from "@/lib/config/media";
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
        <Link
          href={routes.product(specimen.slug)}
          aria-label={`View ${specimen.name}`}
          className={cn(
            "block",
            isActive ? "pointer-events-auto cursor-pointer" : "pointer-events-none",
          )}
        >
          <motion.div
            className="flex aspect-[16/9] w-[82vw] max-w-[860px] items-center justify-center overflow-hidden bg-black md:w-[68vw] md:max-w-[980px]"
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
          >
            {specimen.primary_image_url && isVideo ? (
              <video
                src={specimen.primary_image_url}
                className="h-full w-full object-cover"
                autoPlay={isActive}
                muted
                loop
                playsInline
                preload={isActive ? "auto" : "metadata"}
              />
            ) : (
              <img
                src={specimen.primary_image_url || "/coming-soon/comming-soon.png"}
                alt={specimen.name}
                className="h-full w-full object-cover"
                onError={(event) => {
                  event.currentTarget.src = "/coming-soon/comming-soon.png";
                }}
                draggable={false}
              />
            )}
          </motion.div>
        </Link>
      </motion.div>
    </div>
  );
}
