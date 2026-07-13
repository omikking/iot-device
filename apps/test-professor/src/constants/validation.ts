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

function strLen(value: string, max: number): ValidationResult {
  if (value.length > max) return { valid: false, error: `Maximum ${max} characters` };
  return { valid: true, error: null };
}

export function getValidation(id: number, value: string): ValidationResult {
  if (value === "") return { valid: false, error: null };

  switch (id) {
    case 1:   return uint(value, 0, 4294967295);
    case 6: {
      if (!/^https?:\/\/.+/.test(value))
        return { valid: false, error: "Must start with http:// or https://" };
      return { valid: true, error: null };
    }
    case 7:   return uint(value, 5, 13000);
    case 8:   return uint(value, 10, 3600);
    case 9:   return uint(value, 1, 3600);
    case 10:  return uint(value, 10, 500);
    case 11:  return uint(value, 1, 60);
    case 12:  return uint(value, 5, 600);
    case 13:  return uint(value, 5, 600);
    case 14:  return uint(value, 1, 4);
    case 15:  return strLen(value, 63);
    case 16:  return strLen(value, 63);
    case 17:
      if (!["0","1","2","3","4"].includes(value))
        return { valid: false, error: "0=NONE, 1=WEP, 2=WPA, 3=WPA2, 4=WPA-EAP" };
      return { valid: true, error: null };
    case 18:
      if (!["0","1","2"].includes(value))
        return { valid: false, error: "0=TLS, 1=PEAP, 2=TTLS" };
      return { valid: true, error: null };
    case 19:  return strLen(value, 63);
    case 20:  return strLen(value, 63);
    case 129: return uint(value, 0, 4294967295);
    case 4:
      if (!/^[A-Za-z0-9_-]*$/.test(value))
        return { valid: false, error: "Only A-Z, a-z, 0-9, _ and - allowed" };
      return { valid: true, error: null };
    case 212: {
      try { JSON.parse(value); return { valid: true, error: null }; }
      catch { return { valid: false, error: "Must be valid JSON" }; }
    }
    default:
      return { valid: true, error: null };
  }
}
