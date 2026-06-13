// Small display helpers shared across the UI.

export const formatViews = (n = 0) => {
  n = Number(n) || 0;
  if (n >= 1e9) return (n / 1e9).toFixed(1).replace(/\.0$/, "") + "B";
  if (n >= 1e6) return (n / 1e6).toFixed(1).replace(/\.0$/, "") + "M";
  if (n >= 1e3) return (n / 1e3).toFixed(1).replace(/\.0$/, "") + "K";
  return String(n);
};

export const formatDuration = (secs = 0) => {
  secs = Math.max(0, Math.floor(Number(secs) || 0));
  const h = Math.floor(secs / 3600);
  const m = Math.floor((secs % 3600) / 60);
  const s = secs % 60;
  const mm = h ? String(m).padStart(2, "0") : String(m);
  return (h ? `${h}:` : "") + `${mm}:${String(s).padStart(2, "0")}`;
};

export const timeAgo = (date) => {
  if (!date) return "";
  const then = new Date(date).getTime();
  if (Number.isNaN(then)) return "";
  const diff = Math.max(0, (Date.now() - then) / 1000);
  const units = [
    ["year", 31536000],
    ["month", 2592000],
    ["week", 604800],
    ["day", 86400],
    ["hour", 3600],
    ["minute", 60],
  ];
  for (const [name, sec] of units) {
    const v = Math.floor(diff / sec);
    if (v >= 1) return `${v} ${name}${v > 1 ? "s" : ""} ago`;
  }
  return "just now";
};

// Deterministic accent for letter-avatar fallbacks.
export const colorFromString = (str = "") => {
  const palette = [
    "#ff2d55",
    "#7c5cff",
    "#0ea5e9",
    "#10b981",
    "#f59e0b",
    "#ec4899",
    "#06b6d4",
    "#8b5cf6",
  ];
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) >>> 0;
  return palette[h % palette.length];
};

export const initials = (name = "") =>
  name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() || "")
    .join("") || "?";
