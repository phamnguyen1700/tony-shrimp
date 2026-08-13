import { useId, useState } from "react";
import MotionButton from "@/components/common/motion/MotionButton";
import { formatAustralianPhoneInput } from "@/lib/australianPhone";
import Input from "@/components/ui/Input";
import type { Translations } from "@/i18n";
import type { AddressLocalityCheckResponse, AddressSuburbSuggestion } from "@/types/user";

export interface AccountAddressDraft {
  recipient_name: string;
  recipient_phone: string;
  address_line1: string;
  address_line2: string;
  suburb: string;
  state: string;
  postcode: string;
  is_default: boolean;
}

interface AddressFormProps {
  t: Translations;
  draft: AccountAddressDraft;
  states: string[];
  suburbSuggestions: AddressSuburbSuggestion[];
  localityCheck: AddressLocalityCheckResponse | undefined;
  errors: Partial<Record<keyof AccountAddressDraft, string>>;
  canSave: boolean;
  isValidating: boolean;
  isSaving: boolean;
  saveLabel?: string;
  onDraftChange: (draft: AccountAddressDraft) => void;
  onSave: () => void;
  onCancel: () => void;
}

export default function AddressForm({
  t,
  draft,
  states,
  suburbSuggestions,
  localityCheck,
  errors,
  canSave,
  isValidating,
  isSaving,
  saveLabel,
  onDraftChange,
  onSave,
  onCancel,
}: AddressFormProps) {
  const labels = t.account.addressFields;

  function setField<Key extends keyof AccountAddressDraft>(key: Key, value: AccountAddressDraft[Key]) {
    onDraftChange({ ...draft, [key]: value });
  }

  return (
    <div className="space-y-5">
      <Input
        label={labels.recipientName}
        value={draft.recipient_name}
        onChange={(event) => setField("recipient_name", event.target.value)}
        placeholder="Alex Nguyen"
        error={errors.recipient_name}
      />
      <Input
        label={labels.recipientPhone}
        type="tel"
        value={draft.recipient_phone}
        onChange={(event) => setField("recipient_phone", formatAustralianPhoneInput(event.target.value))}
        placeholder="+61 400 000 000"
        error={errors.recipient_phone}
      />
      <Input
        label={labels.addressLine}
        value={draft.address_line1}
        onChange={(event) => setField("address_line1", event.target.value)}
        placeholder="Unit 2 / 42"
        error={errors.address_line1}
      />
      <Input
        label={labels.street}
        value={draft.address_line2}
        onChange={(event) => setField("address_line2", event.target.value)}
        placeholder="Botanical Ave"
      />
      <div className="grid gap-4 sm:grid-cols-2">
        <AddressComboboxInput
          label={labels.suburb}
          value={draft.suburb}
          suggestions={suburbSuggestions}
          placeholder="Melbourne"
          error={errors.suburb}
          onChange={(value) => setField("suburb", value)}
          onSelectSuggestion={(suggestion) =>
            onDraftChange({
              ...draft,
              suburb: titleCase(suggestion.suburb),
              state: suggestion.state,
              postcode: suggestion.postcode,
            })
          }
        />
        <AddressComboboxInput
          label={labels.state}
          value={draft.state}
          suggestions={states.map((state) => ({ suburb: state, state, postcode: "" }))}
          placeholder="State"
          error={errors.state}
          onChange={(value) => setField("state", value.toUpperCase())}
        />
      </div>
      <Input
        label={labels.postcode}
        value={draft.postcode}
        inputMode="numeric"
        onChange={(event) => setField("postcode", event.target.value)}
        placeholder="3000"
        error={errors.postcode}
      />
      <AddressValidationHint t={t} localityCheck={localityCheck} isValidating={isValidating} />
      <label className="flex items-center gap-2 font-mono-label text-xs uppercase tracking-[0.16em] text-muted-foreground">
        <input
          type="checkbox"
          checked={draft.is_default}
          onChange={(event) => setField("is_default", event.target.checked)}
          className="h-4 w-4 accent-accent"
        />
        {labels.makeDefault}
      </label>
      <div className="flex items-center gap-4">
        <MotionButton variant="secondary" size="md" onClick={onSave} disabled={isSaving || !canSave}>
          {saveLabel ?? labels.save}
        </MotionButton>
        <button
          type="button"
          onClick={onCancel}
          className="font-mono-label text-xs uppercase tracking-[0.16em] text-muted-foreground transition-colors hover:text-foreground"
        >
          {labels.cancel}
        </button>
      </div>
    </div>
  );
}

interface AddressComboboxInputProps {
  label: string;
  value: string;
  suggestions: AddressSuburbSuggestion[];
  placeholder: string;
  error?: string;
  onChange: (value: string) => void;
  onSelectSuggestion?: (suggestion: AddressSuburbSuggestion) => void;
}

function AddressComboboxInput({
  label,
  value,
  suggestions,
  placeholder,
  error,
  onChange,
  onSelectSuggestion,
}: AddressComboboxInputProps) {
  const inputId = useId();
  const [open, setOpen] = useState(false);
  const visibleSuggestions = suggestions.filter((item) =>
    `${item.suburb} ${item.state} ${item.postcode}`.toLowerCase().includes(value.trim().toLowerCase()),
  );

  return (
    <div className="relative flex flex-col gap-1.5">
      <label htmlFor={inputId} className="font-mono-label text-xs uppercase tracking-widest text-muted-foreground">
        {label}
      </label>
      <div className="relative">
        <input
          id={inputId}
          value={value}
          placeholder={placeholder}
          onFocus={() => setOpen(true)}
          onBlur={() => setOpen(false)}
          onChange={(event) => {
            onChange(event.target.value);
            setOpen(true);
          }}
          className={`ui-radius w-full appearance-none border bg-card px-3 py-2.5 pr-9 text-sm font-body text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:ring-1 ${
            error
              ? "border-red-500 focus:border-red-500 focus:ring-red-500"
              : "border-border focus:border-ring focus:ring-ring"
          }`}
        />
        <button
          type="button"
          onMouseDown={(event) => {
            event.preventDefault();
            setOpen((current) => !current);
          }}
          className="absolute inset-y-0 right-2 flex items-center px-1 font-mono-label text-xs text-foreground"
          aria-label={`Toggle ${label} suggestions`}
        >
          v
        </button>
      </div>
      {open && visibleSuggestions.length > 0 && (
        <div className="ui-radius absolute left-0 right-0 top-full z-50 mt-1 max-h-48 overflow-y-auto border border-border bg-card py-1 shadow-xl">
          {visibleSuggestions.map((item) => (
            <button
              key={`${item.suburb}-${item.state}-${item.postcode}`}
              type="button"
              onMouseDown={(event) => {
                event.preventDefault();
                if (onSelectSuggestion) {
                  onSelectSuggestion(item);
                } else {
                  onChange(getSuggestionValue(item));
                }
                setOpen(false);
              }}
              className="block w-full px-3 py-2 text-left font-body text-sm text-foreground transition-colors hover:bg-secondary"
            >
              {getSuggestionLabel(item)}
            </button>
          ))}
        </div>
      )}
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}

interface AddressValidationHintProps {
  t: Translations;
  localityCheck: AddressLocalityCheckResponse | undefined;
  isValidating: boolean;
}

function AddressValidationHint({ t, localityCheck, isValidating }: AddressValidationHintProps) {
  const labels = t.account.addressFields;

  if (isValidating) {
    return <p className="font-body text-xs text-muted-foreground">{labels.validating}</p>;
  }

  if (!localityCheck) return null;

  return (
    <p className={`font-body text-xs ${localityCheck.found ? "text-accent" : "text-amber-600"}`}>
      {localityCheck.message ?? (localityCheck.found ? labels.addressValid : labels.addressInvalid)}
    </p>
  );
}

function titleCase(value: string) {
  return value.toLowerCase().replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function getSuggestionLabel(item: AddressSuburbSuggestion) {
  if (!item.postcode) return item.state;
  return `${titleCase(item.suburb)} · ${item.state} ${item.postcode}`;
}

function getSuggestionValue(item: AddressSuburbSuggestion) {
  return item.postcode ? item.suburb : item.state;
}
