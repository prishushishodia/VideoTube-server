import { useState } from "react";
import { colorFromString, initials } from "../utils/format";

/**
 * Avatar with graceful letter-fallback when the image is missing or fails.
 * `size` keeps the original Tailwind sizing API (e.g. "w-10 h-10").
 */
const Avatar = ({ src, name = "", size = "w-10 h-10", ring = false }) => {
  const [broken, setBroken] = useState(false);
  const ringCls = ring ? "ring-2 ring-white/10" : "";

  if (!src || broken) {
    return (
      <span
        className={`inline-flex items-center justify-center rounded-full font-semibold text-white select-none ${size} ${ringCls}`}
        style={{ background: colorFromString(name || "?"), fontSize: "0.8em" }}
        aria-hidden="true"
      >
        {initials(name)}
      </span>
    );
  }

  return (
    <img
      src={src}
      alt={name ? `${name}'s avatar` : "Avatar"}
      onError={() => setBroken(true)}
      loading="lazy"
      className={`rounded-full object-cover bg-panel-2 ${size} ${ringCls}`}
    />
  );
};

export default Avatar;
