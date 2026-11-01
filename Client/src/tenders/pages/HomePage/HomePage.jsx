import AppCard from "../../components/AppCard";
import "./HomePage.css";

export default function HomePage({ onNavigate }) {
  return (
    <section className="home-launcher">
      <h2 className="home-launcher-title">انتخاب ماژول</h2>

      <div className="home-launcher-grid">
        <AppCard
          title="مدیریت مناقصات"
          onClick={() => onNavigate("/tendermenu")}
        />
        <AppCard
          title="مدیریت ارتباط با مشتری"
          onClick={() => onNavigate("/tickets")}
        />
      </div>
    </section>
  );
}
