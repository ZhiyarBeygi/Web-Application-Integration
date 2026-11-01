import { useEffect, useState } from "react";
import LoginPage from "../pages/LoginPage/LoginPage";
import HomePage from "../pages/HomePage/HomePage";
import TenderListPage from "../pages/TenderListPage/TenderListPage";
import TenderDetailPage from "../pages/TenderListPage/TenderDetail/TenderDetailPage";
import TenderCreatePage from "../pages/TenderListPage/TenderCreate/TenderCreatePage";
import TenderEditPage from "../pages/TenderListPage/TenderEdit/TenderEditPage";
import BookmarksPage from "../pages/BookmarksPage/BookmarksPage";
import MainLayout from "../layouts/MainLayout";

const HOME_PATH = "/";
const TENDER_PATH = "/tendermenu";
const TENDER_CREATE_PATH = `${TENDER_PATH}/new`;
const TENDER_EDIT_REGEX = /^\/tendermenu\/(\d+)\/edit$/;
const TENDER_DETAIL_REGEX = /^\/tendermenu\/(\d+)$/;
const BOOKMARKS_PATH = "/bookmarks";
const CURRENT_USER_KEY = "currentUser";

const modules = [
  {
    id: "tenders",
    label: "مناقصه‌ها",
    children: [
      {
        label: "لیست مناقصه‌ها",
        path: TENDER_PATH,
      },
    ],
  },
];

function getTenderIdFromPath(path) {
  const editMatch = path.match(TENDER_EDIT_REGEX);
  if (editMatch) {
    return editMatch[1];
  }

  const detailMatch = path.match(TENDER_DETAIL_REGEX);
  return detailMatch ? detailMatch[1] : null;
}

function getInitialPath() {
  const path = window.location.pathname;

  if (path === TENDER_PATH) {
    return TENDER_PATH;
  }

  if (path === TENDER_CREATE_PATH) {
    return TENDER_CREATE_PATH;
  }

  if (getTenderIdFromPath(path)) {
    return path;
  }

  if (path === BOOKMARKS_PATH) {
    return BOOKMARKS_PATH;
  }

  return HOME_PATH;
}

function getStoredUser() {
  try {
    const raw = sessionStorage.getItem(CURRENT_USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export default function AppRoutes() {
  const [path, setPath] = useState(getInitialPath);
  const [currentUser, setCurrentUser] = useState(getStoredUser);

  useEffect(() => {
    const handlePopState = () => {
      setPath(getInitialPath());
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  function navigate(to) {
    window.history.pushState({}, "", to);
    setPath(to);
  }

  function handleLoginSuccess(result) {
    const user = {
      userId: result.userId ?? result.UserId,
      username: result.username ?? result.Username,
    };

    sessionStorage.setItem(
      CURRENT_USER_KEY,
      JSON.stringify(user),
    );

    setCurrentUser(user);
    navigate(HOME_PATH);
  }

  function handleLogout() {
    sessionStorage.removeItem(CURRENT_USER_KEY);
    setCurrentUser(null);
    navigate(HOME_PATH);
  }

  if (!currentUser) {
    return (
      <LoginPage
        onLoginSuccess={handleLoginSuccess}
      />
    );
  }

  const isTenderCreatePath = path === TENDER_CREATE_PATH;
  const isTenderEditPath = TENDER_EDIT_REGEX.test(path);
  const tenderId = getTenderIdFromPath(path);
  const isTenderDetailPath = tenderId !== null && !isTenderEditPath;
  const isTenderPath = path === TENDER_PATH;
  const isBookmarksPath = path === BOOKMARKS_PATH;

  return (
    <MainLayout
      title={"Web App"}
      modules={modules}
      activePath={
        isTenderPath || isTenderDetailPath || isTenderCreatePath || isTenderEditPath
          ? TENDER_PATH
          : null
      }
      onNavigate={navigate}
      onLogout={handleLogout}
      currentUser={currentUser}
    >
      {isTenderCreatePath ? (
        <TenderCreatePage onNavigate={navigate} />
      )
      :isTenderEditPath ? (
        <TenderEditPage tenderId={tenderId} onNavigate={navigate} />
      )
      : isTenderDetailPath ? (
        <TenderDetailPage
          tenderId={tenderId}
          onNavigate={navigate}
        />
      ) : isTenderPath ? (
        <TenderListPage onNavigate={navigate} />
      ) : isBookmarksPath ? (
        <BookmarksPage
          modules={modules}
          onNavigate={navigate}
          currentUser={currentUser}
        />
      ) : (
        <HomePage onNavigate={navigate} />
      )}
    </MainLayout>
  );
}