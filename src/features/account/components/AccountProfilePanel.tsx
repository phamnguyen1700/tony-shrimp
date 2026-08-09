import { motion } from "motion/react";
import Input from "@/shared/ui/Input";
import MotionButton from "@/components/common/motion/MotionButton";

interface AccountProfilePanelProps {
  reduced: boolean | null;
  profileName: string;
  profileEmail: string;
  profilePhone: string;
  onProfileNameChange: (value: string) => void;
  onProfileEmailChange: (value: string) => void;
  onProfilePhoneChange: (value: string) => void;
}

export default function AccountProfilePanel({
  reduced,
  profileName,
  profileEmail,
  profilePhone,
  onProfileNameChange,
  onProfileEmailChange,
  onProfilePhoneChange,
}: AccountProfilePanelProps) {
  return (
    <motion.div
      initial={reduced ? false : { opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={reduced ? undefined : { opacity: 0, y: -6 }}
      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
      className="max-w-md"
    >
      <div className="space-y-5">
        <Input
          label="Full Name"
          value={profileName}
          onChange={(event) => onProfileNameChange(event.target.value)}
          placeholder="Your name"
        />
        <Input
          label="Email"
          type="email"
          value={profileEmail}
          onChange={(event) => onProfileEmailChange(event.target.value)}
          placeholder="you@example.com"
        />
        <Input
          label="Phone"
          type="tel"
          value={profilePhone}
          onChange={(event) => onProfilePhoneChange(event.target.value)}
          placeholder="+61 400 000 000"
        />
        <MotionButton variant="accent" size="md">
          SAVE CHANGES
        </MotionButton>
      </div>
    </motion.div>
  );
}

