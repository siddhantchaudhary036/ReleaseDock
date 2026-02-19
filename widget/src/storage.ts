const LAST_VISIT_KEY = 'releasedock_last_visit';

export function getLastVisit(): number | null {
  try {
    const value = localStorage.getItem(LAST_VISIT_KEY);
    return value ? parseInt(value, 10) : null;
  } catch {
    return null;
  }
}

export function setLastVisit(timestamp: number): void {
  try {
    localStorage.setItem(LAST_VISIT_KEY, timestamp.toString());
  } catch {
    // localStorage unavailable — silently degrade
  }
}

const FINGERPRINT_KEY = 'releasedock_fingerprint';

export function getFingerprint(): string {
  try {
    let fp = localStorage.getItem(FINGERPRINT_KEY);
    if (!fp) {
      fp = crypto.randomUUID();
      localStorage.setItem(FINGERPRINT_KEY, fp);
    }
    return fp;
  } catch {
    // Fallback: generate a session-only fingerprint
    return Math.random().toString(36).substring(2);
  }
}
