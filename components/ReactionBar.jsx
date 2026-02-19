"use client";

import { useState, useEffect } from "react";
import theme from "@/constants/theme";

const REACTION_EMOJIS = ["👍", "🎉", "❤️"];
const FP_KEY = "releasedock_fingerprint";

function getFingerprint() {
  try {
    let fp = localStorage.getItem(FP_KEY);
    if (!fp) {
      fp = crypto.randomUUID();
      localStorage.setItem(FP_KEY, fp);
    }
    return fp;
  } catch {
    return Math.random().toString(36).substring(2);
  }
}

export default function ReactionBar({ changelogId }) {
  const [counts, setCounts] = useState({});
  const [userReactions, setUserReactions] = useState([]);
  const [loading, setLoading] = useState(false);

  const siteUrl = process.env.NEXT_PUBLIC_CONVEX_SITE_URL;

  useEffect(() => {
    if (!siteUrl || !changelogId) return;
    const fp = getFingerprint();
    fetch(`${siteUrl}/api/reactions/${changelogId}?fp=${encodeURIComponent(fp)}`)
      .then((r) => r.ok ? r.json() : { counts: {}, userReactions: [] })
      .then((data) => {
        setCounts(data.counts || {});
        setUserReactions(data.userReactions || []);
      })
      .catch(() => {});
  }, [changelogId, siteUrl]);

  const handleToggle = async (emoji) => {
    if (loading || !siteUrl) return;
    setLoading(true);
    const fp = getFingerprint();
    const wasActive = userReactions.includes(emoji);

    // Optimistic update
    setUserReactions((prev) =>
      wasActive ? prev.filter((e) => e !== emoji) : [...prev, emoji]
    );
    setCounts((prev) => ({
      ...prev,
      [emoji]: (prev[emoji] || 0) + (wasActive ? -1 : 1),
    }));

    try {
      await fetch(`${siteUrl}/api/reactions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ changelogId, emoji, fingerprint: fp }),
      });
    } catch {
      // Revert
      setUserReactions((prev) =>
        wasActive ? [...prev, emoji] : prev.filter((e) => e !== emoji)
      );
      setCounts((prev) => ({
        ...prev,
        [emoji]: (prev[emoji] || 0) + (wasActive ? 1 : -1),
      }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: "flex", gap: "8px", marginTop: "16px" }}>
      {REACTION_EMOJIS.map((emoji) => {
        const isActive = userReactions.includes(emoji);
        const count = counts[emoji] || 0;
        return (
          <button
            key={emoji}
            onClick={() => handleToggle(emoji)}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "5px",
              padding: "5px 12px",
              borderRadius: theme.radius.full,
              border: isActive
                ? `1.5px solid ${theme.brand.primary}`
                : `1.5px solid ${theme.neutral.border}`,
              backgroundColor: isActive ? theme.brand.primaryLight : theme.neutral.white,
              color: isActive ? theme.brand.primary : theme.text.muted,
              fontSize: "14px",
              cursor: "pointer",
              transition: "all 0.15s ease",
              fontFamily: "inherit",
            }}
            aria-label={`React with ${emoji}`}
            aria-pressed={isActive}
          >
            <span>{emoji}</span>
            {count > 0 && (
              <span style={{ fontSize: "12px", fontWeight: 500 }}>{count}</span>
            )}
          </button>
        );
      })}
    </div>
  );
}
