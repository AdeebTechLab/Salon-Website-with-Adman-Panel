import { useState } from "react";
import { useStore, money, fmt12, fmtDate, todayISO } from "../../store.jsx";
import Icon from "../Icon.jsx";
import { StatusSelect, STATUSES } from "./ui.jsx";

export default function AppointmentsAdmin() {
  const { appointments, clients, services, barbers, setStatus } = useStore();
  const [fl, setFl] = useState("all");
  const [when, setWhen] = useState("all");
  const [q, setQ] = useState("");
  const today = todayISO();
  const rows = [...appointments]
    .filter((a) => fl === "all" || a.status === fl)
    .filter((a) =>
      when === "today" ? a.date === today : when === "upcoming" ? a.date >= today : when === "past" ? a.date < today : true,
    )
    .filter((a) => {
      const c = clients.find((x) => x.id === a.clientId);
      return `${c?.name || ""} ${c?.phone || ""} ${a.date}`.toLowerCase().includes(q.toLowerCase());
    })
    .sort((a, b) =>
      when === "past"
        ? (b.date + b.time).localeCompare(a.date + a.time)
        : (a.date + a.time).localeCompare(b.date + b.time),
    );
  const rev = appointments
    .filter((a) => a.status === "completed")
    .reduce((t, a) => t + Number(a.total), 0);

  return (
    <div className="admin-stack">
      <div className="kpis">
        <div>
          <span className="kpi-label">Total bookings</span>
          <b>{appointments.length}</b>
        </div>
        <div>
          <span className="kpi-label">Pending</span>
          <b>{appointments.filter((a) => a.status === "pending").length}</b>
        </div>
        <div>
          <span className="kpi-label">Customers</span>
          <b>{clients.length}</b>
        </div>
        <div>
          <span className="kpi-label">Completed revenue</span>
          <b>{money(rev)}</b>
        </div>
      </div>
      <div className="admin-toolbar">
        <label className="search">
          <Icon name="search" size={17} />
          <input
            placeholder="Search customer, phone or date"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </label>
        <select value={when} onChange={(e) => setWhen(e.target.value)} aria-label="Date filter">
          <option value="all">All dates</option>
          <option value="today">Today</option>
          <option value="upcoming">Upcoming</option>
          <option value="past">Past</option>
        </select>
        <select value={fl} onChange={(e) => setFl(e.target.value)} aria-label="Status filter">
          {["all", ...STATUSES].map((s) => (
            <option key={s} value={s}>
              {s === "all" ? "All statuses" : s[0].toUpperCase() + s.slice(1)}
            </option>
          ))}
        </select>
      </div>
      <div className="table-card scroll">
        <table>
          <thead>
            <tr>
              <th>When</th>
              <th>Customer</th>
              <th>Services</th>
              <th>Barber</th>
              <th>Total</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((a) => {
              const c = clients.find((x) => x.id === a.clientId);
              return (
                <tr key={a.id}>
                  <td className="nowrap">
                    <strong>{fmtDate(a.date)}</strong>
                    <small>
                      {fmt12(a.time)} · {a.duration} min
                    </small>
                  </td>
                  <td>
                    <strong>{c?.name || "Unknown"}</strong>
                    <small>{c?.phone}</small>
                  </td>
                  <td>
                    {a.serviceIds
                      .map((id) => services.find((s) => s.id === id)?.name)
                      .filter(Boolean)
                      .join(", ")}
                    {a.note && <small className="note">“{a.note}”</small>}
                  </td>
                  <td>{barbers.find((b) => b.id === a.barberId)?.name || "—"}</td>
                  <td>
                    <strong>{money(a.total)}</strong>
                  </td>
                  <td>
                    <StatusSelect value={a.status} onChange={(s) => setStatus(a.id, s)} />
                  </td>
                </tr>
              );
            })}
            {!rows.length && (
              <tr>
                <td colSpan="6">
                  <div className="empty-state">
                    <strong>No bookings found.</strong>
                    <span>New customer bookings will appear here automatically.</span>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
