export interface ValidationResult {
  valid: boolean;
  error: string | null;
}

function uint(value: string, min: number, max: number): ValidationResult {
  const n = Number(value);
  if (!/^\d+$/.test(value.trim())) return { valid: false, error: "Must be a whole number" };
  if (n < min || n > max) return { valid: false, error: `Must be between ${min} and ${max}` };
  return { valid: true, error: null };
}

function strLen(value: string, min: number, max: number): ValidationResult {
  if (value.length < min) return { valid: false, error: `Minimum ${min} characters` };
  if (value.length > max) return { valid: false, error: `Maximum ${max} characters` };
  return { valid: true, error: null };
}

export function getValidation(id: number, value: string): ValidationResult {
  if (value === "") return { valid: false, error: null };

  switch (id) {
    case 1:
    case 2:
    case 21:
    case 32:
      if (value !== "0" && value !== "1")
        return { valid: false, error: "Must be 0 (disabled) or 1 (enabled)" };
      return { valid: true, error: null };
    case 16:
      if (!["0", "1", "2", "3", "4"].includes(value))
        return { valid: false, error: "0=None, 1=WEP, 2=WPA, 3=WPA2, 4=EAP" };
      return { valid: true, error: null };
    case 17:
      if (!["0", "1", "2"].includes(value))
        return { valid: false, error: "0=TLS, 1=PEAP, 2=TTLS" };
      return { valid: true, error: null };
    case 23:
      if (!["0", "1", "2"].includes(value))
        return { valid: false, error: "0=Config, 1=Static, 2=Dynamic" };
      return { valid: true, error: null };
    case 5:
      return uint(value, 10, 604800);
    case 6:
    case 13:
    case 14:
    case 31:
      return uint(value, 0, 65535);
    case 9:
    case 10:
    case 24:
    case 25:
    case 26:
    case 27:
      return uint(value, 0, 4294967295);
    case 129:
      return uint(value, 0, 4294967295);
    case 3:
      return strLen(value, 0, 31);
    case 4:
    case 18:
    case 19:
      return strLen(value, 0, 31);
    case 7:
      return strLen(value, 0, 47);
    case 8:
      return strLen(value, 0, 47);
    case 20:
      return strLen(value, 0, 43);
    case 28:
    case 29:
    case 30:
      return strLen(value, 0, 152);
    case 130:
      return strLen(value, 0, 13);
    default:
      return { valid: true, error: null };
  }
}
