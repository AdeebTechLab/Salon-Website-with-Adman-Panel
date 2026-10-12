import { useEffect, useState } from "react";
import { useStore } from "../../store.jsx";
export default function SettingsAdmin() {
  const { settings, updateSettings, clients, appointments, reviews, clearDemo } = useStore();
  const demoCount =
    clients.filter((c) => c.demo).length +
    appointments.filter((a) => a.demo).length +
    reviews.filter((r) => r.demo).length;
  const [f, setF] = useState(settings);
  const [saved, setSaved] = useState(false);
  useEffect(() => setF(settings), [settings]);
  const save = (e) => {
    e.preventDefault();
    updateSettings(f);
    setSaved(true);
    setTimeout(() => setSaved(false), 1800);
  };
  return (
    <div className="admin-stack">
      <div className="feature-card">
        <div>
          <p className="eyebrow">WEBSITE SETTINGS</p>
          <h2>Contact & social media</h2>
          <p className="muted">
            These details appear across the public website and booking
            experience.
          </p>
        </div>
      </div>
      <form className="form-panel admin-form large-form" onSubmit={save}>
        <div className="form-heading">
          <div>
            <h3>Business information</h3>
            <span className="muted">Update without touching the code.</span>
          </div>
          {saved && <span className="ok-text">Saved successfully.</span>}
        </div>
        <div className="admin-form-grid">
          <label>
            Phone number
            <input
              value={f.phone}
              onChange={(e) => setF({ ...f, phone: e.target.value })}
            />
          </label>
          <label>
            WhatsApp number
            <input
              value={f.whatsapp}
              onChange={(e) => setF({ ...f, whatsapp: e.target.value })}
            />
          </label>
          <label>
            Email address
            <input
              type="email"
              value={f.email}
              onChange={(e) => setF({ ...f, email: e.target.value })}
            />
          </label>
          <label>
            Opening hours
            <input
              value={f.hours}
              onChange={(e) => setF({ ...f, hours: e.target.value })}
            />
          </label>
          <label className="span-2">
            Address
            <input
              value={f.address}
              onChange={(e) => setF({ ...f, address: e.target.value })}
            />
          </label>
          <label>
            Instagram URL
            <input
              value={f.instagram}
              onChange={(e) => setF({ ...f, instagram: e.target.value })}
            />
          </label>
          <label>
            Facebook URL
            <input
              value={f.facebook}
              onChange={(e) => setF({ ...f, facebook: e.target.value })}
            />
          </label>
          <label>
            TikTok URL
            <input
              value={f.tiktok}
              onChange={(e) => setF({ ...f, tiktok: e.target.value })}
            />
          </label>
        </div>
        <button className="btn gold">Save website details</button>
      </form>
      <div className="form-panel demo-panel">
        <div className="form-heading">
          <div>
            <h3>Demo data</h3>
            <span className="muted">
              Sample customers, bookings and reviews are included so the panel
              looks realistic. Remove them before going live — your real data
              stays untouched.
            </span>
          </div>
          <button
            type="button"
            className="btn outline-dark sm"
            disabled={!demoCount}
            onClick={() =>
              window.confirm("Remove all sample customers, bookings and reviews?") && clearDemo()
            }
          >
            {demoCount ? `Remove demo data (${demoCount})` : "No demo data left"}
          </button>
        </div>
      </div>
    </div>
  );
}
