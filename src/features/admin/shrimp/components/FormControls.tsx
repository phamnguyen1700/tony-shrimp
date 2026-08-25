import { useId, useState } from "react";
import { uniqueItems } from "@/lib/shrimp/adminUtils";

interface ComboboxInputProps {
  label: string;
  value: string;
  suggestions?: string[];
  placeholder?: string;
  onChange: (value: string) => void;
  error?: string;
}

export function ComboboxInput({
  label,
  value,
  suggestions,
  placeholder,
  onChange,
  error,
}: ComboboxInputProps) {
  const inputId = useId();
  const [open, setOpen] = useState(false);
  const suggestionItems = uniqueItems(suggestions ?? []);
  const visibleSuggestions = suggestionItems.filter((item) =>
    item.toLowerCase().includes(value.trim().toLowerCase()),
  );

  return (
    <div className="relative flex flex-col gap-1.5">
      <label htmlFor={inputId} className="font-mono-label text-xs uppercase tracking-widest text-muted-foreground">{label}</label>
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
          className="ui-radius w-full appearance-none border border-border bg-card px-3 py-2.5 pr-9 text-sm font-body text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-ring focus:ring-1 focus:ring-ring"
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
          ▼
        </button>
      </div>
      {error && <p className="text-xs text-red-500">{error}</p>}
      {open && visibleSuggestions.length > 0 && (
        <div className="ui-radius absolute left-0 right-0 top-full z-50 mt-1 max-h-48 overflow-y-auto border border-border bg-card py-1 shadow-xl">
          {visibleSuggestions.map((item) => (
            <button
              key={item}
              type="button"
              onMouseDown={(event) => {
                event.preventDefault();
                onChange(item);
                setOpen(false);
              }}
              className="block w-full px-3 py-2 text-left font-body text-sm text-foreground transition-colors hover:bg-secondary"
            >
              {item}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

interface BadgeInputBoxProps {
  label: string;
  values: string[];
  suggestions?: string[];
  placeholder?: string;
  onChange: (values: string[]) => void;
  multiple?: boolean;
}

export function BadgeInputBox({
  label,
  values,
  suggestions,
  placeholder,
  onChange,
  multiple = true,
}: BadgeInputBoxProps) {
  const [inputValue, setInputValue] = useState("");
  const [open, setOpen] = useState(false);
  const suggestionItems = uniqueItems(suggestions ?? []);
  const visibleSuggestions = suggestionItems
    .filter((item) => item.toLowerCase().includes(inputValue.trim().toLowerCase()))
    .filter((item) => !values.includes(item));

  function addValue(value = inputValue) {
    const next = value.trim();
    if (!next) return;
    onChange(multiple ? uniqueItems([...values, next]) : [next]);
    setInputValue("");
  }

  function removeValue(value: string) {
    onChange(values.filter((item) => item !== value));
  }

  return (
    <div className="flex flex-col gap-1.5">
      <label className="font-mono-label text-xs uppercase tracking-widest text-muted-foreground">{label}</label>
      <div className="ui-radius min-h-24 border border-border bg-card p-2">
        <div className="mb-2 flex flex-wrap gap-1.5">
          {values.map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => removeValue(value)}
              className="border border-border bg-secondary px-2 py-1 font-mono-label text-[10px] uppercase tracking-widest text-foreground transition-colors hover:border-accent hover:text-accent"
              style={{ borderRadius: "var(--radius-sm)" }}
            >
              {value} ×
            </button>
          ))}
        </div>
        <div className="relative">
          <input
            value={inputValue}
            placeholder={placeholder}
            onFocus={() => setOpen(true)}
            onChange={(event) => {
              setInputValue(event.target.value);
              setOpen(true);
            }}
            onBlur={() => {
              addValue();
              setOpen(false);
            }}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === ",") {
                event.preventDefault();
                addValue();
                setOpen(false);
              }
            }}
            className="ui-radius w-full border border-border bg-card px-3 py-2.5 pr-9 text-sm font-body text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-ring focus:ring-1 focus:ring-ring"
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
            ▼
          </button>
          {open && visibleSuggestions.length > 0 && (
            <div className="ui-radius absolute left-0 right-0 z-50 mt-1 max-h-48 overflow-y-auto border border-border bg-card py-1 shadow-xl">
              {visibleSuggestions.map((item) => (
                <button
                  key={item}
                  type="button"
                  onMouseDown={(event) => {
                    event.preventDefault();
                    addValue(item);
                    setOpen(false);
                  }}
                  className="block w-full px-3 py-2 text-left font-body text-sm text-foreground transition-colors hover:bg-secondary"
                >
                  {item}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
