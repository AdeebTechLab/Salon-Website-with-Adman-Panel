import { useDeferredValue, useMemo, useState } from "react";
import { useStore, money, fmt12, fmtDate, fmtLongDate } from "../../store.jsx";
import Icon from "../Icon.jsx";
import { PageIntro, StatusPill, STATUSES } from "./ui.jsx";

const PAGE_SIZE = 20;
const digits = (v = "") => String(v).replace(/\D/g, "");
/* "0301 2345678" can also be searched as 03012345678 or 923012345678 */
const phoneKeys = (phone = "") => {
  const d = digits(phone);
  return d.startsWith("0") ? [d, "92" + d.slice(1)] : [d];
};
const dmy = (iso = "") => {
  const [y, m, d] = iso.split("-");
  return y && m && d ? `${d}/${m}/${y} ${d}-${m}-${y}` : "";
};

export default function RecordsAdmin() {
  const { clients, appointments, services, barbers } = useStore();
  const [clientId, setClientId] = useState("");
  const [status, setStatus] = useState("all");
  const [q, setQ] = useState("");
  const [limit, setLimit] = useState(PAGE_SIZE);
  const query = useDeferredValue(q);

  /* One searchable text per booking (read-only — records are never changed here) */
  const rows = useMemo(() => {
    const clientMap = new Map(clients.map((c) => [c.id, c]));
    const serviceMap = new Map(services.map((s) => [s.id, s.name]));
    const barberMap = new Map(barbers.map((b) => [b.id, b.name]));
    return appointments
      .map((a) => {
        const c = clientMap.get(a.clientId);
        const svc = (a.serviceIds || [])
          .map((id) => serviceMap.get(id))
          .filter(Boolean)
          .join(", ");
        const barber = barberMap.get(a.barberId) || "";
        const hay = [
          c?.name,
          c?.phone,
          ...phoneKeys(c?.phone),
          c?.email,
          svc,
          barber,
          a.date,
          fmtDate(a.date),
          fmtLongDate(a.date),
          dmy(a.date),
          fmt12(a.time),
          a.status,
          a.note,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();
        return { a, c, svc, barber, hay };
      })
      .sort((x, y) => (y.a.date + y.a.time).localeCompare(x.a.date + x.a.time));
  }, [appointments, clients, services, barbers]);

  const c = clients.find((x) => x.id === clientId);
  const history = useMemo(
    () => rows.filter((r) => r.a.clientId === clientId),
    [rows, clientId],
  );
  const base = c ? history : rows;

  /* Every word must match (e.g. "ali fade completed"); phone numbers match with or without spaces */
  const terms = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
  const results = useMemo(
    () =>
      base.filter(
        (r) =>
          (status === "all" || r.a.status === status) &&
          terms.every((t) => {
            if (r.hay.includes(t)) return true;
            const d = digits(t);
            return /^[+\d()-]+$/.test(t) && d.length >= 3 && r.hay.includes(d);
          }),
      ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [base, status, query],
  );
  const shown = results.slice(0, limit);
  const filtering = terms.length > 0 || status !== "all";

  const resetPage = () => setLimit(PAGE_SIZE);
  const clearSearch = () => {
    setQ("");
    resetPage();
  };
  const clearAll = () => {
    setQ("");
    setStatus("all");
    resetPage();
  };
  const openCustomer = (id) => {
    setClientId(id);
    resetPage();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const svcLine = (r) => r.svc || "Service removed";

  return (
    <div className="admin-stack">
      <PageIntro
        eyebrow="Track Records"
        title="Customer History"
        text="Search every booking by customer, phone, service, barber, date or status — or pick a customer to see their full history."
        stat={appointments.length}
        statLabel="Booking records"
      />

      <div className="form-panel records-filters">
        <div className="admin-toolbar">
          <label className="search">
            <Icon name="search" size={17} />
            <input
              type="search"
              placeholder="Search customer records..."
              aria-label="Search customer records"
              value={q}
              onChange={(e) => {
                setQ(e.target.value);
                resetPage();
              }}
              onKeyDown={(e) =>
                e.key === "Escape" && q && (e.preventDefault(), clearSearch())
              }
            />
            {q && (
              <button
                type="button"
                className="search-clear"
                onClick={clearSearch}
                aria-label="Clear search"
              >
                <Icon name="close" size={16} />
              </button>
            )}
          </label>
          <select
            value={clientId}
            onChange={(e) => openCustomer(e.target.value)}
            aria-label="Customer"
          >
            <option value="">All customers</option>
            {[...clients]
              .sort((a, b) => a.name.localeCompare(b.name))
              .map((x) => (
                <option key={x.id} value={x.id}>
                  {x.name} · {x.phone}
                </option>
              ))}
          </select>
          <select
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
              resetPage();
            }}
            aria-label="Status filter"
          >
            {["all", ...STATUSES].map((s) => (
              <option key={s} value={s}>
                {s === "all" ? "All statuses" : s[0].toUpperCase() + s.slice(1)}
              </option>
            ))}
          </select>
        </div>
        <p className="records-count" aria-live="polite">
          {filtering
            ? `${results.length} of ${base.length} record${base.length === 1 ? "" : "s"} match`
            : `${base.length} record${base.length === 1 ? "" : "s"}`}
          {c ? ` for ${c.name}` : ""}
          {filtering && (
            <button type="button" className="lnk" onClick={clearAll}>
              Clear filters
            </button>
          )}
        </p>
      </div>

      {c && (
        <div className="kpis three">
          <div>
            <span className="kpi-label">Total bookings</span>
            <b>{history.length}</b>
          </div>
          <div>
            <span className="kpi-label">Completed</span>
            <b>{history.filter((r) => r.a.status === "completed").length}</b>
          </div>
          <div>
            <span className="kpi-label">Lifetime booked value</span>
            <b>{money(history.reduce((t, r) => t + Number(r.a.total), 0))}</b>
          </div>
        </div>
      )}

      <div className="record-card">
        {c ? (
          <div className="record-head">
            <div>
              <h3>{c.name}</h3>
              <p className="muted">
                {c.phone} · {c.email || "No email"}
              </p>
              {c.notes && <p className="record-note">Note: {c.notes}</p>}
            </div>
            <button
              type="button"
              className="btn outline-dark sm"
              onClick={() => openCustomer("")}
            >
              <Icon name="arrowLeft" size={15} /> All records
            </button>
          </div>
        ) : (
          <div className="record-head">
            <div>
              <h3>All booking records</h3>
              <p className="muted">
                Newest first. Tap a customer’s name to open their history.
              </p>
            </div>
          </div>
        )}

        {shown.map((r) => (
          <div
            className={"record-row" + (c ? "" : " with-customer")}
            key={r.a.id}
          >
            <div>
              <strong>{fmtDate(r.a.date)}</strong>
              <span>{fmt12(r.a.time)}</span>
            </div>
            {!c && (
              <div className="record-customer">
                {r.c ? (
                  <button
                    type="button"
                    className="record-name"
                    onClick={() => openCustomer(r.c.id)}
                  >
                    {r.c.name}
                  </button>
                ) : (
                  <strong>Unknown customer</strong>
                )}
                <span>{r.c?.phone}</span>
              </div>
            )}
            <div>
              <strong>{svcLine(r)}</strong>
              <span>with {r.barber || "barber"}</span>
            </div>
            <div className="record-end">
              <strong>{money(r.a.total)}</strong>
              <StatusPill status={r.a.status} />
            </div>
          </div>
        ))}

        {!results.length && (
          <div className="empty-state">
            {filtering ? (
              <>
                <strong>No matching records found.</strong>
                <span>
                  {terms.length
                    ? `Nothing matches “${query.trim()}”${status !== "all" ? ` with status “${status}”` : ""}. Try a name, phone number, service, barber, date or status.`
                    : `No ${status} bookings${c ? ` for ${c.name}` : ""}.`}
                </span>
                <button
                  type="button"
                  className="btn outline-dark sm"
                  onClick={clearAll}
                >
                  Clear search
                </button>
              </>
            ) : c ? (
              "No booking history for this customer."
            ) : (
              "No booking records yet. New bookings will appear here automatically."
            )}
          </div>
        )}

        {results.length > shown.length && (
          <div className="records-more">
            <button
              type="button"
              className="btn outline-dark sm"
              onClick={() => setLimit(limit + PAGE_SIZE)}
            >
              Show more ({results.length - shown.length} left)
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
