import "./AppCard.css";

export default function AppCard({ title, onClick }) {
  return (
    <button type="button" className="app-card" onClick={onClick}>
      <span className="app-card-icon" aria-hidden="true">
        <svg viewBox="0 0 24 24" width="28" height="28">
          <rect
            x="4"
            y="4"
            width="16"
            height="16"
            rx="3"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
          />
          <path
            d="M9 8v8M15 8v8"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
        </svg>
      </span>
      <span className="app-card-label">{title}</span>
    </button>
  );
}
