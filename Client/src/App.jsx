import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import TenderAppRoutes from "./tenders/routes/AppRoutes";

import TicketsAppShell from "./tickets/AppShell";
import TicketsLoginPage from "./tickets/pages/LoginPage";
import TicketsLayout from "./tickets/components/Layout";
import ProtectedRoute from "./tickets/components/ProtectedRoute";
import MyTicketsPage from "./tickets/pages/UserTickets/MyTicketsPage";
import CreateTicketPage from "./tickets/pages/UserTickets/CreateTicketsPage";
import AdminPage from "./tickets/pages/AdminPage/AdminPage";
import RequestsPage from "./tickets/pages/RequestsPage/RequestsPage";
import ExpertPage from "./tickets/pages/ExpertPage/ExpertPage";
import TicketsParticlesBackground from "./tickets/components/ParticlesBackground";
import TicketsThemeToggle from "./tickets/components/ThemeToggle";

function TicketsLogin() {
  return (
    <>
      <TicketsParticlesBackground />
      <TicketsThemeToggle floating />
      <TicketsLoginPage />
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Tender Management module */}
        <Route path="/" element={<TenderAppRoutes />} />
        <Route path="/tendermenu/*" element={<TenderAppRoutes />} />
        <Route path="/bookmarks" element={<TenderAppRoutes />} />

        {/* CRM / Support Tickets module. Its styles are scoped to .tickets-app. */}
        <Route element={<TicketsAppShell />}>
          <Route path="/login" element={<TicketsLogin />} />

          <Route element={<TicketsLayout />}>
            <Route
              path="/tickets"
              element={
                <ProtectedRoute>
                  <MyTicketsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/createTicket"
              element={
                <ProtectedRoute>
                  <CreateTicketPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <ProtectedRoute adminOnly>
                  <AdminPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/requests"
              element={
                <ProtectedRoute adminOnly>
                  <RequestsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/expert"
              element={
                <ProtectedRoute expertOnly>
                  <ExpertPage />
                </ProtectedRoute>
              }
            />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
