import { useState } from "react";
import { ParticlesProvider } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import ParticlesBackground from "../../components/ParticlesBackground";
import { login } from "../../api/authApi";
import ThemeToggle from "../../components/ThemeToggle";
import "./LoginPage.css";

// defined outside the component so it's a stable reference across re-renders
const particlesInit = async (engine) => {
  await loadSlim(engine);
};

export default function LoginPage({ onLoginSuccess }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const result = await login(username, password);
      onLoginSuccess?.(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-page">
      <div className="login-theme-toggle">
        <ThemeToggle />
      </div>

      <ParticlesProvider init={particlesInit}>
        <ParticlesBackground />
      </ParticlesProvider>

      <form className="login-card" onSubmit={handleSubmit} dir="rtl">
        <h1 className="login-title">ورود به سیستم</h1>
        <div className="login-divider" />

        <div className="login-field">
          <label htmlFor="username">نام کاربری</label>
          <input id="username" value={username}
            onChange={(e) => setUsername(e.target.value)} required />
        </div>

        <div className="login-field">
          <label htmlFor="password">رمز عبور</label>
          <input id="password" type="password" value={password}
            onChange={(e) => setPassword(e.target.value)} required />
        </div>

        {error && <p className="login-error">{error}</p>}

        <button type="submit" disabled={loading}>
          {loading ? "در حال ورود..." : "ورود"}
        </button>
      </form>
    </div>
  );
}