import {
  useStore,
  todayISO,
  dayISO,
  money,
  fmt12,
  fmtDate,
  ratingStats,
  publishedReviews,
} from "../../store.jsx";
import Icon from "../Icon.jsx";
import { StatusPill, initials } from "./ui.jsx";

export default function Dashboard({ go }) {
  const { appointments, clients, services, barbers, reviews, setStatus } =
    useStore();
  const today = todayISO();
  const from30 = dayISO(-30);
  const svcName = (a) =>
    a.serviceIds
      .map((id) => services.find((s) => s.id === id)?.name)
      .filter(Boolean)
      .join(", ") || "Service";
  const client = (id) => clients.find((c) => c.id === id);
  const barber = (id) => barbers.find((b) => b.id === id);
  const byTime = (a, b) => (a.date + a.time).localeCompare(b.date + b.time);
  const active = appointments.filter((a) => a.status !== "cancelled");

  const todays = appointments.filter((a) => a.date === today).sort(byTime);
  const pending = appointments
    .filter((a) => a.status === "pending" && a.date >= today)
    .sort(byTime);
  const upcoming = active
    .filter((a) => a.date > today)
    .sort(byTime)
    .slice(0, 6);
  const revenue30 = appointments
    .filter(
      (a) => a.status === "completed" && a.date >= from30 && a.date <= today,
    )
    .reduce((t, a) => t + Number(a.total), 0);
  const rating = ratingStats(publishedReviews(reviews));
  const avg = rating.label ? `${rating.label}/5` : "—";

  const counts = {};
  active.forEach((a) =>
    a.serviceIds.forEach((id) => (counts[id] = (counts[id] || 0) + 1)),
  );
  const popular = Object.entries(counts)
    .map(([id, n]) => ({ name: services.find((s) => s.id === id)?.name, n }))
    .filter((x) => x.name)
    .sort((a, b) => b.n - a.n)
    .slice(0, 5);
  const maxN = Math.max(1, ...popular.map((p) => p.n));

  const team = barbers.map((b) => {
    const mine = appointments.filter((a) => a.barberId === b.id);
    return {
      ...b,
      upcoming: mine.filter((a) => a.date >= today && a.status !== "cancelled")
        .length,
      done: mine.filter((a) => a.status === "completed").length,
      earned: mine
        .filter((a) => a.status === "completed")
        .reduce((t, a) => t + Number(a.total), 0),
    };
  });

  const kpis = [
    [
      "calendar",
      "Today’s appointments",
      todays.filter((a) => a.status !== "cancelled").length,
      `${todays.filter((a) => a.status === "confirmed").length} confirmed`,
    ],
    ["clock", "Pending requests", pending.length, "Need confirmation"],
    [
      "users",
      "Total customers",
      clients.length,
      `${appointments.length} bookings overall`,
    ],
    ["money", "Revenue (30 days)", money(revenue30), "Completed bookings"],
    [
      "star",
      "Average rating",
      avg,
      rating.count ? `${rating.count} reviews` : "No reviews yet",
    ],
  ];

  return (
    <div className="admin-stack">
      <div className="kpi-grid">
        {kpis.map(([icon, label, value, sub]) => (
          <div className="kpi" key={label}>
            <span className="kpi-icon">
              <Icon name={icon} size={20} />
            </span>
            <span className="kpi-label">{label}</span>
            <b>{value}</b>
            <small>{sub}</small>
          </div>
        ))}
      </div>

      <div className="dash-grid">
        <section className="panel">
          <div className="panel-head">
            <h3>Today’s Schedule</h3>
            <button className="lnk" onClick={() => go("Bookings")}>
              All bookings
            </button>
          </div>
          {todays.length ? (
            <ul className="schedule">
              {todays.map((a) => (
                <li key={a.id}>
                  <span className="schedule-time">{fmt12(a.time)}</span>
                  <span className="schedule-main">
                    <strong>{client(a.clientId)?.name || "Walk-in"}</strong>
                    <small>
                      {svcName(a)} · {barber(a.barberId)?.name || "—"}
                    </small>
                  </span>
                  <StatusPill status={a.status} />
                </li>
              ))}
            </ul>
          ) : (
            <div className="empty-state">No appointments today.</div>
          )}
        </section>

        <section className="panel">
          <div className="panel-head">
            <h3>Pending Requests</h3>
            <span className="count-chip">{pending.length}</span>
          </div>
          {pending.length ? (
            <ul className="pending-list">
              {pending.slice(0, 5).map((a) => (
                <li key={a.id}>
                  <span className="avatar sm">
                    {initials(client(a.clientId)?.name)}
                  </span>
                  <span className="schedule-main">
                    <strong>{client(a.clientId)?.name || "Customer"}</strong>
                    <small>
                      {fmtDate(a.date)} · {fmt12(a.time)} · {svcName(a)}
                    </small>
                  </span>
                  <button
                    className="btn gold sm"
                    onClick={() => setStatus(a.id, "confirmed")}
                  >
                    Confirm
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <div className="empty-state">
              All caught up — no pending requests.
            </div>
          )}
        </section>

        <section className="panel">
          <div className="panel-head">
            <h3>Upcoming Bookings</h3>
            <button className="lnk" onClick={() => go("Bookings")}>
              View all
            </button>
          </div>
          <div className="table-card flat scroll">
            <table>
              <thead>
                <tr>
                  <th>When</th>
                  <th>Customer</th>
                  <th>Barber</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {upcoming.map((a) => (
                  <tr key={a.id}>
                    <td className="nowrap">
                      <strong>{fmtDate(a.date)}</strong>
                      <small>{fmt12(a.time)}</small>
                    </td>
                    <td>
                      <strong>{client(a.clientId)?.name || "—"}</strong>
                      <small>{svcName(a)}</small>
                    </td>
                    <td className="nowrap">
                      {barber(a.barberId)?.name || "—"}
                    </td>
                    <td>
                      <StatusPill status={a.status} />
                    </td>
                  </tr>
                ))}
                {!upcoming.length && (
                  <tr>
                    <td colSpan="4">
                      <div className="empty-state">
                        No upcoming bookings yet.
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        <section className="panel">
          <div className="panel-head">
            <h3>Popular Services</h3>
            <small className="muted">By bookings</small>
          </div>
          {popular.length ? (
            <ul className="bar-list">
              {popular.map((p) => (
                <li key={p.name}>
                  <div className="bar-label">
                    <span>{p.name}</span>
                    <strong>{p.n}</strong>
                  </div>
                  <div
                    className="bar-track"
                    title={`${p.name}: ${p.n} bookings`}
                  >
                    <i style={{ width: `${(p.n / maxN) * 100}%` }}></i>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="empty-state">Bookings will appear here.</div>
          )}
        </section>
      </div>

      <section className="panel">
        <div className="panel-head">
          <h3>Team Overview</h3>
          <button className="lnk" onClick={() => go("Barbers")}>
            Manage barbers
          </button>
        </div>
        <div className="team-grid">
          {team.map((b) => (
            <div className="team-card" key={b.id}>
              <img src={b.image} alt="" />
              <div>
                <strong>{b.name}</strong>
                <small>{b.role}</small>
                <div className="team-stats">
                  <span>
                    <b>{b.upcoming}</b> upcoming
                  </span>
                  <span>
                    <b>{b.done}</b> done
                  </span>
                  <span>
                    <b>{money(b.earned)}</b>
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
