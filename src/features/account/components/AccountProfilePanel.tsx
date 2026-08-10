import Input from "@/components/ui/Input";
import MotionButton from "@/components/common/motion/MotionButton";
import { formatAustralianPhoneInput } from "@/lib/australianPhone";
import type { Translations } from "@/i18n";

interface AccountProfilePanelProps {
  t: Translations;
  profileName: string;
  profileEmail: string;
  profilePhone: string;
  onProfileNameChange: (value: string) => void;
  onProfilePhoneChange: (value: string) => void;
  onSaveProfile: () => void;
  isSaving: boolean;
  isDirty: boolean;
}

export default function AccountProfilePanel({
  t,
  profileName,
  profileEmail,
  profilePhone,
  onProfileNameChange,
  onProfilePhoneChange,
  onSaveProfile,
  isSaving,
  isDirty,
}: AccountProfilePanelProps) {
  const labels = t.account.profileFields;

  return (
    <section>
      <h2 className="mb-5 font-mono-label text-xs uppercase tracking-[0.18em] text-foreground">
        {t.account.profile}
      </h2>
      <div className="space-y-5">
        <Input
          label={labels.fullName}
          value={profileName}
          onChange={(event) => onProfileNameChange(event.target.value)}
          placeholder="Your name"
        />
        <Input
          label={labels.email}
          type="email"
          value={profileEmail}
          placeholder="you@example.com"
          readOnly
        />
        <Input
          label={labels.phone}
          type="tel"
          value={profilePhone}
          onChange={(event) => onProfilePhoneChange(formatAustralianPhoneInput(event.target.value))}
          placeholder="+61 400 000 000"
        />
        <MotionButton variant="accent" size="md" onClick={onSaveProfile} disabled={isSaving || !isDirty}>
          {labels.save}
        </MotionButton>
      </div>
    </section>
  );
}

