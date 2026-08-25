const AU_COUNTRY_CODE = "61";
const AU_NATIONAL_LENGTH = 9;
const AU_AREA_PREFIXES = new Set(["2", "3", "4", "7", "8"]);

export function toAustralianNationalDigits(value: string) {
  let digits = value.replace(/\D/g, "");

  if (digits.startsWith(AU_COUNTRY_CODE)) {
    digits = digits.slice(AU_COUNTRY_CODE.length);
  }

  if (digits.startsWith("0")) {
    digits = digits.slice(1);
  }

  return digits.slice(0, AU_NATIONAL_LENGTH);
}

export function formatAustralianPhone(value: string) {
  const national = toAustralianNationalDigits(value);
  if (!national) return "";

  if (national.startsWith("4")) {
    return joinPhoneParts([national.slice(0, 3), national.slice(3, 6), national.slice(6)]);
  }

  return joinPhoneParts([national.slice(0, 1), national.slice(1, 5), national.slice(5)]);
}

export function normalizeAustralianPhone(value: string) {
  const formatted = formatAustralianPhone(value);
  return formatted ? `+${AU_COUNTRY_CODE} ${formatted}` : "";
}

export function formatAustralianPhoneInput(value: string) {
  const national = toAustralianNationalDigits(value);
  if (national.length < AU_NATIONAL_LENGTH) return value;
  return normalizeAustralianPhone(value);
}

export function isValidAustralianPhone(value: string) {
  const national = toAustralianNationalDigits(value);
  return national.length === AU_NATIONAL_LENGTH && AU_AREA_PREFIXES.has(national[0]);
}

function joinPhoneParts(parts: string[]) {
  return parts.filter(Boolean).join(" ");
}
