import { motion } from "motion/react";

interface AccountAddressesPanelProps {
  reduced: boolean | null;
}

export default function AccountAddressesPanel({ reduced }: AccountAddressesPanelProps) {
  return (
    <motion.div
      initial={reduced ? false : { opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={reduced ? undefined : { opacity: 0, y: -6 }}
      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
      className="space-y-4"
    >
      <div className="ui-radius border border-border p-5">
        <div className="flex items-start justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <p className="font-body text-sm font-medium text-foreground">Alex Nguyen</p>
              <span className="ui-radius border border-accent/20 bg-accent/10 px-1.5 py-0.5 font-mono-label text-xs uppercase tracking-widest text-accent">
                DEFAULT
              </span>
            </div>
            <p className="font-body text-sm text-muted-foreground">42 Botanical Ave</p>
            <p className="font-body text-sm text-muted-foreground">Melbourne VIC 3000</p>
            <p className="font-body text-sm text-muted-foreground">Australia</p>
          </div>
          <button className="font-mono-label text-[11px] uppercase tracking-widest text-muted-foreground underline underline-offset-2 transition-colors hover:text-foreground">
            Edit
          </button>
        </div>
      </div>

      <button className="flex items-center gap-2 py-2 font-mono-label text-xs uppercase tracking-[0.16em] text-accent transition-colors hover:text-accent/80">
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path
            d="M6 1V11M1 6H11"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
        Add Address
      </button>
    </motion.div>
  );
}

