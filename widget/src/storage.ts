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
