import type { ThemeMode } from "@/hooks/useTheme";
import type { Translations } from "@/i18n";
import SettingsSection from "@/components/common/sections/SettingsSection";
import SettingsOptionButton from "@/components/common/buttons/SettingsOptionButton";

interface ThemeSettingsSectionProps {
  t: Translations;
  theme: ThemeMode;
  setTheme: (mode: ThemeMode) => void;
}

const themeOptions: { value: ThemeMode; icon: string }[] = [
  { value: "light", icon: "☀" },
  { value: "dark", icon: "☾" },
  { value: "system", icon: "◑" },
];

function themeLabel(value: ThemeMode, t: Translations) {
  if (value === "light") return t.theme.light;
  if (value === "dark") return t.theme.dark;
  return t.theme.system;
}

export default function ThemeSettingsSection({
  t,
  theme,
  setTheme,
}: ThemeSettingsSectionProps) {
  return (
    <SettingsSection
      title={t.admin.settingsPage.appearance}
      description={t.admin.settingsPage.appearanceDescription}
    >
      <div className="grid gap-3 sm:grid-cols-3">
        {themeOptions.map((option) => (
          <SettingsOptionButton
            key={option.value}
            icon={option.icon}
            label={themeLabel(option.value, t)}
            description={
              t.admin.settingsPage.themeOptionDescriptions[option.value]
            }
            isActive={theme === option.value}
            onClick={() => setTheme(option.value)}
          />
        ))}
      </div>
    </SettingsSection>
  );
}
