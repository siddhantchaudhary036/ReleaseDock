"use client";

import { useRef, useEffect, useCallback, useState } from "react";

/**
 * useAutoSave — debounces editor state and silently persists drafts.
 *
 * @param {Function} saveFn  - async function that performs the actual save
 * @param {number}   delay   - debounce delay in ms (default 5000)
 * @param {boolean}  enabled - whether auto-save is active
 * @returns {{ autoSaveStatus: "idle"|"saving"|"saved"|"error", triggerAutoSave: Function, flushAutoSave: Function }}
 */
export function useAutoSave(saveFn, delay = 5000, enabled = true) {
  const [autoSaveStatus, setAutoSaveStatus] = useState("idle");
  const timerRef = useRef(null);
  const saveFnRef = useRef(saveFn);
  const isMountedRef = useRef(true);

  // Keep saveFn ref current without re-triggering effects
  useEffect(() => {
    saveFnRef.current = saveFn;
  }, [saveFn]);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const triggerAutoSave = useCallback(() => {
    if (!enabled) return;
    if (timerRef.current) clearTimeout(timerRef.current);

    timerRef.current = setTimeout(async () => {
      if (!isMountedRef.current) return;
      setAutoSaveStatus("saving");
      try {
        await saveFnRef.current();
        if (isMountedRef.current) setAutoSaveStatus("saved");
      } catch (err) {
        console.error("Auto-save failed:", err);
        if (isMountedRef.current) setAutoSaveStatus("error");
      }
    }, delay);
  }, [enabled, delay]);

  // Immediately flush any pending auto-save (useful before manual save/publish)
  const flushAutoSave = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  return { autoSaveStatus, triggerAutoSave, flushAutoSave };
}
