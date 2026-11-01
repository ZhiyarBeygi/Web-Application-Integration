import { useEffect, useState } from "react";
import { getUserSettings, addBookmark, removeBookmark } from "../api/userSettingsApi.js";
import "./ModuleSidebar.css";

function ModuleIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
      <path
        d="M14.5 4.5 19.5 9.5M13 6l5 5M9.5 10.5l-5 5 4 4 5-5M14 15l5-5M7 21l3.5-3.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="m16.5 3 4.5 4.5-2 2-4.5-4.5 2-2Z" fill="currentColor" />
    </svg>
  );
}

function BookmarkIcon({ bookmarked }) {
  return (
    <svg viewBox="0 0 24 24" width="17" height="17" aria-hidden="true">
      <path
        d="M12 3.8l2.6 5.3 5.8.8-4.2 4.1 1 5.8-5.2-2.7-5.2 2.7 1-5.8-4.2-4.1 5.8-.8L12 3.8Z"
        fill={bookmarked ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function Chevron({ open }) {
  return (
    <svg
      className={`module-sidebar-chevron ${open ? "is-open" : ""}`}
      viewBox="0 0 24 24"
      width="15"
      height="15"
      aria-hidden="true"
    >
      <path
        d="m8 10 4 4 4-4"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function ModuleSidebar({
  modules,
  activeModule,
  onNavigate,
  collapsed,
  onToggleCollapse,
  currentUser,
}) {
  const [openGroups, setOpenGroups] = useState(() =>
    Object.fromEntries(modules.map((module) => [module.label, true])),
  );

  const [bookmarkedItems, setBookmarkedItems] = useState([]);

  useEffect(() => {
    let cancelled = false;

    async function loadSettings() {
      if (!currentUser?.userId) {
        setBookmarkedItems([]);
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
      }
    }

    loadSettings();

    return () => {
      cancelled = true;
    };
  }, [currentUser?.userId]);

  function toggleGroup(label) {
    setOpenGroups((current) => ({
      ...current,
      [label]: !current[label],
    }));
  }

  async function toggleBookmark(path) {
    if (!currentUser?.userId) return;

    const isBookmarked = bookmarkedItems.includes(path);

    setBookmarkedItems((current) =>
      isBookmarked
        ? current.filter((item) => item !== path)
        : [...current, path],
    );

    try {
      if (isBookmarked) {
        await removeBookmark(currentUser.userId, path);
      } else {
        await addBookmark(currentUser.userId, path);
      }
    } catch {
      setBookmarkedItems((current) =>
        isBookmarked
          ? [...current, path]
          : current.filter((item) => item !== path),
      );
    }
  }

  return (
    <aside className={`module-sidebar ${collapsed ? "is-collapsed" : ""}`} dir="rtl">
      <div className="module-sidebar-heading">
        {!collapsed && <span>منوهای در دسترس</span>}

        <button
          type="button"
          className="module-sidebar-toggle"
          onClick={onToggleCollapse}
          aria-expanded={!collapsed}
          aria-label={collapsed ? "باز کردن پنل منوها" : "بستن پنل منوها"}
        >
          <svg
            className={`module-sidebar-toggle-icon ${collapsed ? "is-collapsed" : ""}`}
            viewBox="0 0 24 24"
            width="15"
            height="15"
            aria-hidden="true"
          >
            <path
              d="m14 7-5 5 5 5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>

      <nav className="module-sidebar-nav" aria-label="منوهای در دسترس">
        {modules.map((module) => {
          const isOpen = openGroups[module.label];

          const hasActiveChild = module.children?.some(
            (child) => child.path === activeModule,
          );

          return (
            <div className="module-sidebar-group" key={module.id}>
              <button
                type="button"
                className={`module-sidebar-group-main ${hasActiveChild ? "has-active-child" : ""}`}
                title={collapsed ? module.label : undefined}
                onClick={() => toggleGroup(module.label)}
                aria-expanded={!collapsed && isOpen}
              >
                <span className="module-sidebar-group-icon">
                  <ModuleIcon />
                </span>

                {!collapsed && (
                  <span className="module-sidebar-group-label">{module.label}</span>
                )}

                {!collapsed && <Chevron open={isOpen} />}
              </button>

              {!collapsed && module.children?.length > 0 && (
                <div className={`module-sidebar-children ${isOpen ? "is-expanded" : "is-collapsed"}`}>
                  {module.children.map((child) => {
                    const isBookmarked = bookmarkedItems.includes(child.path);
                    const isActive = child.path === activeModule;

                    return (
                      <div
                        key={child.path}
                        className={`module-sidebar-item-row ${isActive ? "is-active" : ""}`}
                      >
                        <button
                          type="button"
                          className={`module-sidebar-bookmark-button ${isBookmarked ? "is-bookmarked" : ""}`}
                          onClick={(event) => {
                            event.stopPropagation();
                            toggleBookmark(child.path);
                          }}
                          aria-label={
                            isBookmarked
                              ? `حذف بوک‌مارک ${child.label}`
                              : `بوک‌مارک کردن ${child.label}`
                          }
                          title={isBookmarked ? "حذف بوک‌مارک" : "بوک‌مارک کردن"}
                        >
                          <BookmarkIcon bookmarked={isBookmarked} />
                        </button>

                        <button
                          type="button"
                          className="module-sidebar-item"
                          onClick={() => onNavigate(child.path)}
                        >
                          <span>{child.label}</span>
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>
    </aside>
  );
}