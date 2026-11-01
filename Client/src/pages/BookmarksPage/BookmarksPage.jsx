import { useEffect, useState } from "react";
import { getUserSettings, removeBookmark as removeBookmarkApi } from "../../api/userSettingsApi.js";
import "./BookmarksPage.css";

function BookmarkIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="18"
      height="18"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M6.5 4.5A2 2 0 0 1 8.5 2.5h7a2 2 0 0 1 2 2v17l-5.5-3.4-5.5 3.4z" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="18"
      height="18"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M4 7h16" />
      <path d="M10 11v6" />
      <path d="M14 11v6" />
      <path d="M6.5 7l.7 13h9.6l.7-13" />
      <path d="M9 7V4h6v3" />
    </svg>
  );
}

export default function BookmarksPage({ modules, onNavigate, currentUser }) {
  const [bookmarkedItems, setBookmarkedItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function loadBookmarks() {
      if (!currentUser?.userId) {
        setBookmarkedItems([]);
        setLoading(false);
        return;
      }

      try {
        const settings = await getUserSettings(currentUser.userId);
        if (!cancelled) {
          setBookmarkedItems(settings?.bookmarkedItems ?? []);
        }
      } catch {
        if (!cancelled) {
          setBookmarkedItems([]);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadBookmarks();

    return () => {
      cancelled = true;
    };
  }, [currentUser?.userId]);

  const bookmarkedModules = modules
    .flatMap((module) => module.children || [])
    .filter((child) => bookmarkedItems.includes(child.path));

  async function removeBookmark(path) {
    if (!currentUser?.userId) return;

    setBookmarkedItems((current) => current.filter((item) => item !== path));

    try {
      await removeBookmarkApi(currentUser.userId, path);
    } catch {
      setBookmarkedItems((current) => [...current, path]);
    }
  }

  if (loading) {
    return (
      <section className="bookmarks-page" dir="rtl">
        <p className="bookmarks-empty">در حال دریافت بوک‌مارک‌ها...</p>
      </section>
    );
  }

  return (
    <section className="bookmarks-page" dir="rtl">
      {bookmarkedModules.length === 0 ? (
        <p className="bookmarks-empty">هنوز هیچ موردی بوک‌مارک نشده است.</p>
      ) : (
        <div className="bookmarks-list">
          {bookmarkedModules.map((item) => (
            <div key={item.path} className="bookmark-item">
              <button
                type="button"
                className="bookmark-item-link"
                onClick={() => onNavigate(item.path)}
              >
                <span className="bookmark-item-icon">
                  <BookmarkIcon />
                </span>

                <span>{item.label}</span>
              </button>

              <button
                type="button"
                className="bookmark-item-remove"
                onClick={() => removeBookmark(item.path)}
                aria-label={`حذف ${item.label} از بوک‌مارک‌ها`}
                title="حذف از بوک‌مارک‌ها"
              >
                <TrashIcon />
              </button>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}