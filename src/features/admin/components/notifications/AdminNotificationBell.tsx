import { motion, useReducedMotion } from "motion/react";

const bellBurstParticles = [
  { x: 0, y: -15 },
  { x: 13, y: -8 },
  { x: 15, y: 7 },
  { x: -13, y: 8 },
  { x: -15, y: -6 },
];

interface AdminNotificationBellProps {
  unreadCount: number;
  pulseKey: number;
  onPlay: () => void;
}

export default function AdminNotificationBell({
  unreadCount,
  pulseKey,
  onPlay,
}: AdminNotificationBellProps) {
  const reduced = useReducedMotion();

  return (
    <div className="flex shrink-0 flex-col items-end gap-1">
      <motion.button
        key={pulseKey}
        type="button"
        aria-label="Play notification bell"
        onClick={onPlay}
        className="relative inline-flex h-7 w-7 items-center justify-center text-foreground transition-colors hover:text-accent"
        animate={
          !reduced && pulseKey > 0
            ? {
                rotate: [0, -14, 14, -10, 10, -6, 6, 0],
                scale: [1, 1.08, 1],
              }
            : !reduced && unreadCount > 0
              ? { rotate: [0, -6, 6, 0] }
              : { rotate: 0, scale: 1 }
        }
        transition={
          pulseKey > 0
            ? { duration: 0.75, ease: [0.22, 1, 0.36, 1] }
            : {
                duration: 0.45,
                repeat: Infinity,
                repeatDelay: 1.4,
                ease: [0.22, 1, 0.36, 1],
              }
        }
      >
        <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M15 17h5l-1.4-1.4A2 2 0 0118 14.2V11a6 6 0 10-12 0v3.2a2 2 0 01-.6 1.4L4 17h5m6 0a3 3 0 01-6 0m6 0H9"
          />
        </svg>
        {pulseKey > 0 &&
          bellBurstParticles.map((particle, index) => (
            <motion.span
              key={`${pulseKey}-${index}`}
              aria-hidden
              className="absolute left-1/2 top-1/2 h-1 w-1 rounded-full bg-accent"
              initial={{ x: "-50%", y: "-50%", scale: 0.4, opacity: 0 }}
              animate={{
                x: `calc(-50% + ${particle.x}px)`,
                y: `calc(-50% + ${particle.y}px)`,
                scale: [0.4, 1, 0.2],
                opacity: [0, 0.95, 0],
              }}
              transition={{
                duration: 0.55,
                delay: index * 0.025,
                ease: [0.22, 1, 0.36, 1],
              }}
            />
          ))}
        {pulseKey > 0 && (
          <motion.span
            key={`ring-${pulseKey}`}
            aria-hidden
            className="absolute inset-1 rounded-full border border-accent"
            initial={{ scale: 0.45, opacity: 0 }}
            animate={{ scale: 1.8, opacity: [0, 0.55, 0] }}
            transition={{ duration: 0.55, ease: "easeOut" }}
          />
        )}
      </motion.button>
      <span className="font-mono-label text-[10px] uppercase tracking-widest text-muted-foreground">
        {unreadCount} unread
      </span>
    </div>
  );
}
