import { Stars } from "./Icon.jsx";

/* Stars that can show part of a star, e.g. 4.7 → four and a bit gold stars */
export function StarMeter({ value = 0, size = 16 }) {
  const pct = Math.max(0, Math.min(5, Number(value) || 0)) * 20;
  return (
    <span
      className="star-meter"
      style={{ "--pct": `${pct}%` }}
      aria-hidden="true"
    >
      <Stars value={0} size={size} />
      <span className="star-meter-fill">
        <Stars value={5} size={size} />
      </span>
    </span>
  );
}

/* Overall rating box shown in the reviews section.
   `stats` comes from ratingStats(reviews) in store.jsx, so it is always
   calculated from the real reviews and updates when reviews change. */
export default function RatingSummary({ stats }) {
  if (!stats.count)
    return (
      <div className="rating-summary empty" role="status">
        <StarMeter value={0} size={18} />
        <span className="rating-summary-text">
          <strong>No ratings yet</strong>
          <small>Be the first to leave a review.</small>
        </span>
      </div>
    );

  return (
    <div className="rating-summary">
      <b className="rating-summary-score">
        {stats.label}
        <small>/5</small>
      </b>
      <span className="rating-summary-text">
        <StarMeter value={stats.average} size={18} />
        <small>
          Based on {stats.count} review{stats.count === 1 ? "" : "s"}
        </small>
      </span>
    </div>
  );
}
