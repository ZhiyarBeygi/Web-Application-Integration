import { useEffect, useState } from "react";
import { getUserSettings, setTheme as saveTheme } from "../api/userSettingsApi.js";
import "./ThemeToggle.css";

const SunIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
  </svg>
);

const MoonIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </svg>
);

export default function ThemeToggle({ currentUser }) {
  const [isLightMode, setIsLightMode] = useState(
    () => localStorage.getItem("theme") === "light",
  );

  // Apply + cache locally on every change, so a reload paints the
  // right theme instantly, before the server round trip below finishes.
  useEffect(() => {
    const theme = isLightMode ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [isLightMode]);

  // Once we know who's logged in, fetch their saved preference and
  // correct the local guess if it's different.
  useEffect(() => {
    let cancelled = false;

    async function loadSavedTheme() {
      if (!currentUser?.userId) return;

      try {
        const settings = await getUserSettings(currentUser.userId);
        if (!cancelled && settings?.theme) {
          setIsLightMode(settings.theme === "light");
        }
      } catch {
        // Keep whatever theme is already applied locally if this fails.
      }
    }

    loadSavedTheme();

    return () => {
      cancelled = true;
    };
  }, [currentUser?.userId]);

  async function handleToggle() {
    const next = !isLightMode;
    setIsLightMode(next);

    if (currentUser?.userId) {
      try {
        await saveTheme(currentUser.userId, next ? "light" : "dark");
      } catch {
      }
    }
  }

  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={handleToggle}
      aria-label={isLightMode ? "فعال کردن حالت تاریک" : "فعال کردن حالت روشن"}
      title={isLightMode ? "حالت تاریک" : "حالت روشن"}
    >
      <span className="theme-toggle-icon" aria-hidden="true">
        {isLightMode ? <MoonIcon /> : <SunIcon />}
      </span>
    </button>
  );
}