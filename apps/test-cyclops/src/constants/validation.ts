
export interface ValidationResult {
  valid: boolean;
  error: string | null;
}

const HOSTNAME_RE = /^[a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?)*$/;
const IP_RE = /^(\d{1,3}\.){3}\d{1,3}$/;

function isValidHostOrIp(s: string): boolean {
  return HOSTNAME_RE.test(s) || IP_RE.test(s);
}

function uint(value: string, min: number, max: number): ValidationResult {
  const n = Number(value);
  if (!/^\d+$/.test(value.trim())) return { valid: false, error: "Must be a whole number" };
  if (n < min || n > max) return { valid: false, error: `Must be between ${min} and ${max}` };
  return { valid: true, error: null };
}

function strLen(value: string, min: number, max: number, label = "characters"): ValidationResult {
  if (value.length < min) return { valid: false, error: `Minimum ${min} ${label}` };
  if (value.length > max) return { valid: false, error: `Maximum ${max} ${label}` };
  return { valid: true, error: null };
}

/** Per-ID validation rules. Returns { valid, error }. */
export function getValidation(id: number, value: string): ValidationResult {
  if (value === "") return { valid: false, error: null }; // empty = no error shown yet

  switch (id) {
    // ── Boolean flags ─────────────────────────────────────────────────────
    case 1:   // BLE Upload Enable
    case 2:   // Wi-Fi Upload Enable
    case 21:  // Wi-Fi NTP Enabled
      if (value !== "0" && value !== "1")
        return { valid: false, error: "Must be 0 (disabled) or 1 (enabled)" };
      return { valid: true, error: null };

    // ── Wi-Fi key management enum ─────────────────────────────────────────
    case 16:
      if (!["0","1","2","3","4"].includes(value))
        return { valid: false, error: "0=None, 1=WEP, 2=WPA, 3=WPA2, 4=EAP" };
      return { valid: true, error: null };

    // ── WPA-EAP protocol enum ─────────────────────────────────────────────
    case 17:
      if (!["0","1","2"].includes(value))
        return { valid: false, error: "0=TLS, 1=PEAP, 2=TTLS" };
      return { valid: true, error: null };

    // ── uint16 bounded ranges ─────────────────────────────────────────────
    case 5:  return uint(value, 1, 65535);   // Measurement period (min ≥ 1)
    case 6:  return uint(value, 1, 65535);   // Upload period (min ≥ 1)
    case 9:  return uint(value, 0, 65535);   // Distance threshold (mm)
    case 10: return uint(value, 0, 1024);    // Orientation threshold
    case 11: return uint(value, 0, 50);      // Laser repeat count
    case 12: return uint(value, 0, 3600);    // Laser repeat interval (s)
    case 13: return uint(value, 0, 65535);   // LED flash interval
    case 14: return uint(value, 20, 10000);  // Advertising interval (BLE min 20ms)
    case 15: return uint(value, 0, 10000);   // Laser timeout (ms)

    // ── uint32 ────────────────────────────────────────────────────────────
    case 129: return uint(value, 0, 4294967295); // Serial number

    // ── Strings ───────────────────────────────────────────────────────────
    case 3: { // Wi-Fi SSID
      const r = strLen(value, 1, 31);
      if (!r.valid) return r;
      if (!/^[\x20-\x7E]+$/.test(value))
        return { valid: false, error: "Printable ASCII characters only" };
      return { valid: true, error: null };
    }
    case 4: { // Wi-Fi PSK
      const r = strLen(value, 8, 31);
      if (!r.valid) return r;
      return { valid: true, error: null };
    }
    case 7: { // Server URL
      const r = strLen(value, 0, 47);
      if (!r.valid) return r;
      if (value.length > 0 && !/^https?:\/\/.+/.test(value))
        return { valid: false, error: "Must start with http:// or https://" };
      return { valid: true, error: null };
    }
    case 8:  return strLen(value, 1, 47);   // API Key (non-empty)
    case 18: return strLen(value, 0, 31);   // EAP Anonymous ID (can be empty)
    case 19: return strLen(value, 0, 31);   // EAP ID (can be empty)
    case 20: { // NTP address
      const r = strLen(value, 1, 43);
      if (!r.valid) return r;
      if (!isValidHostOrIp(value))
        return { valid: false, error: "Must be a valid hostname or IP address" };
      return { valid: true, error: null };
    }
    case 130: { // BLE Advertising Name
      const r = strLen(value, 1, 13);
      if (!r.valid) return r;
      if (!/^[\x20-\x7E]+$/.test(value))
        return { valid: false, error: "Printable ASCII characters only" };
      return { valid: true, error: null };
    }

    // ── Binary (certs/keys) ───────────────────────────────────────────────
    case 209:
    case 210:
    case 211:
      if (value.trim().length === 0)
        return { valid: false, error: "Certificate/key content cannot be empty" };
      return { valid: true, error: null };

    // ── Unknown ─────────────────────────────────────────────
    default:
      return { valid: true, error: null }; 
  }
}