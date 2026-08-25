import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { Progress } from "@/components/ui/Progress";
import { useRouteProgress } from "@/hooks/navigation/useRouteProgress";

export default function NavigationProgressBar() {
  const reduced = useReducedMotion();
  const { isNavigating, progress } = useRouteProgress();

  return (
    <AnimatePresence>
      {isNavigating && (
        <motion.div
          className="absolute inset-x-0 bottom-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          aria-hidden="true"
        >
          <Progress
            value={progress}
            className="h-px bg-transparent"
            indicatorClassName="bg-accent shadow-[0_0_12px_rgba(74,124,85,0.75)]"
            reduced={reduced}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
