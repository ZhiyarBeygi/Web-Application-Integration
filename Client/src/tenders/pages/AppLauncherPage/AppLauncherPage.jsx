import AppCard from "../../components/AppCard";
import SiteFooter from "../../components/SiteFooter";
import SiteHeader from "../../components/SiteHeader";
import "./AppLauncherPage.css";

export default function AppLauncherPage({ onNavigate, onLogout }) {
  return (
    <div className="app-launcher-page" dir="rtl">
      <SiteHeader title= "" onLogout={onLogout} />

      <main className="app-launcher-main">
        <section className="app-launcher-card">
          <h2></h2>

          <div className="app-launcher-grid"> 
            <AppCard
              title="مدیریت مناقصات"
              onClick={() => onNavigate("/tendermenu")}
            />
          </div>
          <div class="app-launcher-grid">
            <Appcard
            title="مدیریت ارتباط با مشتری"/>
            onClick={() => onNavigate("/tickets")}
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
