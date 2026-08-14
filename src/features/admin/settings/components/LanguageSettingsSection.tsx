import type { Lang, Translations } from "@/i18n";
import SettingsSection from "@/components/common/sections/SettingsSection";
import SettingsOptionButton from "@/components/common/buttons/SettingsOptionButton";

interface LanguageSettingsSectionProps {
  t: Translations;
  lang: Lang;
  setLang: (lang: Lang) => void;
}

const languageOptions: { value: Lang; icon: string }[] = [
  { value: "en", icon: "EN" },
  { value: "vi", icon: "VI" },
];

export default function LanguageSettingsSection({
  t,
  lang,
  setLang,
}: LanguageSettingsSectionProps) {
  const section = t.admin.settingsPage.language;

  return (
    <SettingsSection title={section.title} description={section.description}>
      <div className="grid gap-3 sm:grid-cols-2">
        {languageOptions.map((option) => (
          <SettingsOptionButton
            key={option.value}
            icon={option.icon}
            label={section.options[option.value].label}
            description={section.options[option.value].description}
            isActive={lang === option.value}
            onClick={() => setLang(option.value)}
          />
        ))}
      </div>
    </SettingsSection>
  );
}
