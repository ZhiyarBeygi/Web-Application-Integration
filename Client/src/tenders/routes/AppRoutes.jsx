import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../tenders.css";
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

function getStoredUser() {
  try {
    const raw = sessionStorage.getItem(CURRENT_USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export default function AppRoutes() {
  const [currentUser, setCurrentUser] = useState(getStoredUser);
  const routerNavigate = useNavigate();
  const path = useLocation().pathname;

  function navigate(to, options) {
    routerNavigate(to, options);
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
      <div className="tenders-app">
        <LoginPage onLoginSuccess={handleLoginSuccess} />
      </div>
    );
  }

  const isTenderCreatePath = path === TENDER_CREATE_PATH;
  const isTenderEditPath = TENDER_EDIT_REGEX.test(path);
  const tenderId = getTenderIdFromPath(path);
  const isTenderDetailPath = tenderId !== null && !isTenderEditPath;
  const isTenderPath = path === TENDER_PATH;
  const isBookmarksPath = path === BOOKMARKS_PATH;

  return (
    <div className="tenders-app">
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
    </div>
  );
}