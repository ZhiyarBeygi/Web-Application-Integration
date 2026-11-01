import { Outlet } from "react-router-dom";
import { ParticlesProvider } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import "./tickets.css";

const particlesInit = async (engine) => {
  await loadSlim(engine);
};

export default function TicketsAppShell() {
  return (
    <ParticlesProvider init={particlesInit}>
      <div className="app-content tickets-app">
        <Outlet />
      </div>
    </ParticlesProvider>
  );
}
