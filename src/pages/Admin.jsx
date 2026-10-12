import { useState } from "react";
import { Link } from "react-router-dom";
import Dashboard from "../components/admin/Dashboard.jsx";
import AppointmentsAdmin from "../components/admin/AppointmentsAdmin.jsx";
import ServicesAdmin from "../components/admin/ServicesAdmin.jsx";
import ClientsAdmin from "../components/admin/ClientsAdmin.jsx";
import BarbersAdmin from "../components/admin/BarbersAdmin.jsx";
import RecordsAdmin from "../components/admin/RecordsAdmin.jsx";
import ReviewsAdmin from "../components/admin/ReviewsAdmin.jsx";
import SettingsAdmin from "../components/admin/SettingsAdmin.jsx";
import Icon from "../components/Icon.jsx";
import { useStore } from "../store.jsx";

const PASSWORD = "admin123";
const TABS = {
  Dashboard: [Dashboard, "grid"],
  Bookings: [AppointmentsAdmin, "calendar"],
  Customers: [ClientsAdmin, "users"],
  Records: [RecordsAdmin, "clipboard"],
  Services: [ServicesAdmin, "scissors"],
  Barbers: [BarbersAdmin, "user"],
  Reviews: [ReviewsAdmin, "star"],
  Website: [SettingsAdmin, "globe"],
};

export default function Admin() {
  const { appointments } = useStore();
  const [ok, setOk] = useState(() => {
    try {
      return sessionStorage.getItem("legend-admin") === "1";
    } catch {
      return false;
    }
  });
  const [pw, setPw] = useState("");
  const [tab, setTab] = useState("Dashboard");
  const [bad, setBad] = useState(false);
  const pending = appointments.filter((a) => a.status === "pending").length;

  const login = (e) => {
    e.preventDefault();
    if (pw === PASSWORD) {
      try {
        sessionStorage.setItem("legend-admin", "1");
      } catch {
        /* private mode */
      }
      setOk(true);
      setBad(false);
    } else setBad(true);
  };
  const logout = () => {
    try {
      sessionStorage.removeItem("legend-admin");
    } catch {
      /* ignore */
    }
    setOk(false);
    setPw("");
  };
  const go = (t) => {
    setTab(t);
    window.scrollTo({ top: 0 });
  };

  if (!ok)
    return (
      <div className="admin-login">
        <form className="admin-login-card" onSubmit={login}>
          <Link to="/" className="logo">
            LEGEND <small>ADMIN</small>
          </Link>
          <p className="eyebrow">Management Portal</p>
          <h1>Welcome Back.</h1>
          <p className="muted">
            Manage bookings, customers, services, barbers and website details
            from one place.
          </p>
          <label className="field">
            <span className="field-label">Admin password</span>
            <input
              type="password"
              placeholder="Enter password"
              value={pw}
              onChange={(e) => setPw(e.target.value)}
              autoFocus
            />
          </label>
          {bad && <p className="err">Wrong password. Please try again.</p>}
          <button className="btn gold full">Sign In</button>
          <Link to="/" className="login-back">
            <Icon name="arrowLeft" size={15} /> Back to website
          </Link>
        </form>
      </div>
    );

  const [Tab] = TABS[tab];
  return (
    <div className="admin-shell">
      <aside className="admin-side">
        <div className="admin-logo-wrap">
          <Link to="/" className="logo">
            LEGEND <small>ADMIN</small>
          </Link>
          <p>Business control panel</p>
        </div>
        <nav className="admin-nav" aria-label="Admin sections">
          {Object.entries(TABS).map(([t, [, icon]]) => (
            <button
              key={t}
              className={t === tab ? "on" : ""}
              aria-current={t === tab ? "page" : undefined}
              onClick={() => go(t)}
            >
              <Icon name={icon} size={18} />
              <span>{t}</span>
              {t === "Bookings" && pending > 0 && <em className="nav-count">{pending}</em>}
            </button>
          ))}
        </nav>
        <div className="admin-side-bottom">
          <Link to="/" aria-label="View website">
            <Icon name="arrowUpRight" size={17} /> <span className="side-txt">View website</span>
          </Link>
          <button onClick={logout} aria-label="Sign out">
            <Icon name="logout" size={17} /> <span className="side-txt">Sign out</span>
          </button>
        </div>
      </aside>
      <main className="admin-main">
        <div className="admin-topbar">
          <div>
            <p className="eyebrow">Legend Barber Shop</p>
            <h1>{tab}</h1>
          </div>
          <div className="admin-topbar-actions">
            <span className="admin-date">
              <Icon name="calendar" size={16} />
              {new Date().toLocaleDateString("en-GB", {
                weekday: "long",
                day: "numeric",
                month: "long",
              })}
            </span>
            <Link className="btn dark sm" to="/booking">
              New Booking
            </Link>
          </div>
        </div>
        <div className="admin-content">
          <Tab go={go} />
        </div>
      </main>
    </div>
  );
}
