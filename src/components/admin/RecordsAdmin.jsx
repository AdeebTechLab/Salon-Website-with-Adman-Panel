import { useMemo, useState } from "react";
import { useStore, money, fmt12, fmtDate } from "../../store.jsx";
import { PageIntro, StatusPill } from "./ui.jsx";

export default function RecordsAdmin() {
  const { clients, appointments, services, barbers } = useStore();
  const [clientId, setClientId] = useState("");
  const c = clients.find((x) => x.id === clientId);
  const history = useMemo(
    () =>
      appointments
        .filter((a) => a.clientId === clientId)
        .sort((a, b) => (b.date + b.time).localeCompare(a.date + a.time)),
    [appointments, clientId],
  );
  return (
    <div className="admin-stack">
      <PageIntro
        eyebrow="Track Records"
        title="Customer History"
        text="Review every booking, service, barber, status and amount for a selected customer."
      />
      <div className="form-panel">
        <label className="field">
          <span className="field-label">Select customer</span>
          <select value={clientId} onChange={(e) => setClientId(e.target.value)}>
            <option value="">Choose a customer…</option>
            {[...clients]
              .sort((a, b) => a.name.localeCompare(b.name))
              .map((x) => (
                <option key={x.id} value={x.id}>
                  {x.name} · {x.phone}
                </option>
              ))}
          </select>
        </label>
      </div>
      {c && (
        <>
          <div className="kpis three">
            <div>
              <span className="kpi-label">Total bookings</span>
              <b>{history.length}</b>
            </div>
            <div>
              <span className="kpi-label">Completed</span>
              <b>{history.filter((a) => a.status === "completed").length}</b>
            </div>
            <div>
              <span className="kpi-label">Lifetime booked value</span>
              <b>{money(history.reduce((t, a) => t + Number(a.total), 0))}</b>
            </div>
          </div>
          <div className="record-card">
            <div className="record-head">
              <div>
                <h3>{c.name}</h3>
                <p className="muted">
                  {c.phone} · {c.email || "No email"}
                </p>
                {c.notes && <p className="record-note">Note: {c.notes}</p>}
              </div>
              <span className="tag">Customer record</span>
            </div>
            {history.map((a) => (
              <div className="record-row" key={a.id}>
                <div>
                  <strong>{fmtDate(a.date)}</strong>
                  <span>{fmt12(a.time)}</span>
                </div>
                <div>
                  <strong>
                    {a.serviceIds
                      .map((id) => services.find((s) => s.id === id)?.name)
                      .filter(Boolean)
                      .join(", ")}
                  </strong>
                  <span>with {barbers.find((b) => b.id === a.barberId)?.name || "barber"}</span>
                </div>
                <div className="record-end">
                  <strong>{money(a.total)}</strong>
                  <StatusPill status={a.status} />
                </div>
              </div>
            ))}
            {!history.length && <div className="empty-state">No booking history for this customer.</div>}
          </div>
        </>
      )}
    </div>
  );
}
