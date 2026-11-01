import { useEffect, useRef, useState } from "react";
import ThemeToggle from "./ThemeToggle";
import "./SiteHeader.css";

function HomeIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="21"
      height="21"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M3 10.8 12 3l9 7.8" />
      <path d="M5.5 9.5V21h13V9.5" />
      <path d="M9.5 21v-6.5h5V21" />
    </svg>
  );
}

function ChevronIcon({ open, className = "" }) {
  return (
    <svg
      className={`${className} ${open ? "is-open" : ""}`}
      viewBox="0 0 24 24"
      width="17"
      height="17"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="m7 10 5 5 5-5" />
    </svg>
  );
}

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

function LogoutIcon() {
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
      <path d="M10 5H5.5A1.5 1.5 0 0 0 4 6.5v11A1.5 1.5 0 0 0 5.5 19H10" />
      <path d="M14 8l4 4-4 4" />
      <path d="M9 12h9" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="16"
      height="16"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

function TenderCreateIcon() {
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
      <rect x="3.5" y="7.5" width="17" height="12" rx="2" />
      <path d="M8.5 7.5V6a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v1.5" />
      <path d="M3.5 12.5h17" />
    </svg>
  );
}

export default function SiteHeader({
  title,
  icon,
  onLogout,
  onNavigate,
  currentUser,
}) {
  const currentUserName = String(currentUser?.username ?? currentUser?.Username ?? "کاربر").trim() || "کاربر";
  const avatarText = Array.from(currentUserName).slice(0, 2).join("").toUpperCase();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [createMenuOpen, setCreateMenuOpen] = useState(false);
  const userMenuRef = useRef(null);
  const createMenuRef = useRef(null);

  useEffect(() => {
    function handleOutsideClick(event) {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target)
      ) {
        setUserMenuOpen(false);
      }

      if (
        createMenuRef.current &&
        !createMenuRef.current.contains(event.target)
      ) {
        setCreateMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  function handleHome() {
    setUserMenuOpen(false);
    onNavigate?.("/");
  }

  function handleBookmarks() {
    setUserMenuOpen(false);
    onNavigate?.("/bookmarks");
  }

  function handleLogout() {
    setUserMenuOpen(false);
    onLogout?.();
  }

  function toggleCreateMenu() {
    setUserMenuOpen(false);
    setCreateMenuOpen((current) => !current);
  }

  function toggleUserMenu() {
    setCreateMenuOpen(false);
    setUserMenuOpen((current) => !current);
  }

  function handleCreateTender() {
    setCreateMenuOpen(false);
    onNavigate?.("/tendermenu/new");
  }
  return (
    <header className="site-header" dir="rtl">
      <button
        type="button"
        className="site-header-title site-header-title-button"
        onClick={handleHome}
        aria-label="بازگشت به صفحه اصلی"
      >
        {icon && (
          <span className="site-header-icon">
            {icon}
          </span>
        )}

        <h1>{title}</h1>
      </button>

      <div className="site-header-actions">
        <div
          className="site-header-create-wrapper"
          ref={createMenuRef}
        >
          <button
            type="button"
            className="site-header-create-button"
            onClick={toggleCreateMenu}
            aria-expanded={createMenuOpen}
            aria-haspopup="menu"
          >
            <span className="site-header-create-button-plus">
              <PlusIcon />
            </span>
            <span>ایجاد</span>
            <ChevronIcon
              open={createMenuOpen}
              className="site-header-create-chevron"
            />
          </button>

          {createMenuOpen && (
            <div
              className="site-header-create-menu"
              role="menu"
            >
              <div className="site-header-create-menu-heading">
                ایجاد سریع
              </div>

              <button
                type="button"
                className="site-header-create-item"
                onClick={handleCreateTender}
                role="menuitem"
              >
                <span className="site-header-create-item-icon">
                  <TenderCreateIcon />
                </span>

                <span className="site-header-create-item-text">
                  <span className="site-header-create-item-title">
                    مناقصه جدید
                  </span>
                  <span className="site-header-create-item-desc">
                    ورود به فهرست مناقصات
                  </span>
                </span>
              </button>
            </div>
          )}
        </div>

        <span className="site-header-divider" aria-hidden="true" />

        <button
          type="button"
          className="site-header-icon-button"
          onClick={handleHome}
          aria-label="خانه"
          title="خانه"
        >
          <HomeIcon />
        </button>

        <ThemeToggle currentUser={currentUser} />

        <div
          className="site-header-user-wrapper"
          ref={userMenuRef}
        >
          <button
            type="button"
            className="site-header-user"
            onClick={toggleUserMenu}
            aria-expanded={userMenuOpen}
            aria-haspopup="menu"
          >
            <ChevronIcon open={userMenuOpen} className="site-header-user-chevron" />

            <span className="site-header-user-info">
              <span className="site-header-user-label">
                کاربر جاری
              </span>

              <span className="site-header-user-name">
                {currentUserName}
              </span>
            </span>

            <span className="site-header-user-avatar">
              {avatarText}
              <span className="site-header-user-status" />
            </span>
          </button>

          {userMenuOpen && (
            <div
              className="site-header-user-menu"
              role="menu"
            >
              <button
                type="button"
                className="site-header-menu-item"
                onClick={handleBookmarks}
                role="menuitem"
              >
                <BookmarkIcon />
                <span>مشاهده بوک‌مارک‌ها</span>
              </button>

              <button
                type="button"
                className="site-header-menu-item site-header-menu-logout"
                onClick={handleLogout}
                role="menuitem"
              >
                <LogoutIcon />
                <span>خروج</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}