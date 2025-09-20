"use client";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const current = document.documentElement.getAttribute("data-theme");
    if (current === "dark" || current === "light") setTheme(current);
  }, []);

  const toggle = () => {
    const next = theme === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    try {
      localStorage.setItem("theme", next);
    } catch {}
    setTheme(next);
  };

  const isDark = theme === "dark";

  return (
    <button
      onClick={toggle}
      role="switch"
      aria-checked={isDark}
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
      type="button"
      className={[
        "relative inline-flex items-center",
        "h-7 w-16 rounded-full",
        "transition-colors duration-300",
        isDark
          ? "bg-indigo-600 border border-indigo-500"
          : "bg-amber-400 border border-amber-300",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/60"
      ].join(" ")}
    >
      {/* Sun (left) */}
      <span
        className={[
          "absolute left-1.5 inline-flex items-center justify-center h-5 w-5",
          "transition-all duration-300",
          isDark ? "opacity-30 scale-90" : "opacity-100 scale-110"
        ].join(" ")}
        aria-hidden
      >
        <SunIcon />
      </span>

      {/* Moon (right) */}
      <span
        className={[
          "absolute right-1.5 inline-flex items-center justify-center h-5 w-5",
          "transition-all duration-300",
          isDark ? "opacity-100 scale-110" : "opacity-30 scale-90"
        ].join(" ")}
        aria-hidden
      >
        <MoonIcon />
      </span>

      {/* Knob */}
      <span
        className={[
          "absolute inline-block h-5 w-5 rounded-full",
          "shadow-md transition-transform duration-300",
          "bg-white dark:bg-zinc-100 z-10", // z-10 ensures it sits above icons
          isDark ? "translate-x-9" : "translate-x-1"
        ].join(" ")}
        aria-hidden
        style={{
          boxShadow:
            "0 1px 2px rgba(0,0,0,.15), 0 4px 12px rgba(0,0,0,.12)"
        }}
      />
    </button>
  );
}

function SunIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
      <circle cx="12" cy="12" r="5" fill="currentColor" className="text-white" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
      <path
        d="M21 12.8A8.2 8.2 0 1 1 11.2 3a6.5 6.5 0 1 0 9.8 9.8Z"
        fill="currentColor"
        className="text-white"
      />
    </svg>
  );
}
