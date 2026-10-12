/* Small shared pieces for the admin panel */
export const STATUSES = ["pending", "confirmed", "completed", "cancelled"];

export function StatusPill({ status }) {
  return <span className={"status " + status}>{status}</span>;
}

/* Status dropdown that is coloured like the pill */
export function StatusSelect({ value, onChange }) {
  return (
    <select
      className={"status-select " + value}
      value={value}
      aria-label="Booking status"
      onChange={(e) => onChange(e.target.value)}
    >
      {STATUSES.map((s) => (
        <option key={s} value={s}>
          {s[0].toUpperCase() + s.slice(1)}
        </option>
      ))}
    </select>
  );
}

export function PageIntro({ eyebrow, title, text, stat, statLabel }) {
  return (
    <div className="feature-card">
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h2>{title}</h2>
        <p className="muted">{text}</p>
      </div>
      {stat !== undefined && (
        <div className="mini-stat">
          <b>{stat}</b>
          <span>{statLabel}</span>
        </div>
      )}
    </div>
  );
}

export const initials = (n = "") =>
  n
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("");
