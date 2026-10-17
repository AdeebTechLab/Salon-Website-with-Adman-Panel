import { useStore, ratingStats } from "../../store.jsx";
import { Stars } from "../Icon.jsx";
import { PageIntro } from "./ui.jsx";

export default function ReviewsAdmin() {
  const { reviews, deleteReview, setReviewVisibility } = useStore();
  const list = [...reviews].sort(
    (a, b) => new Date(b.created) - new Date(a.created),
  );
  const rating = ratingStats(reviews.filter((review) => !review.hidden));
  const hiddenCount =
    reviews.length - reviews.filter((review) => !review.hidden).length;
  return (
    <div className="admin-stack">
      <PageIntro
        eyebrow="Customer Feedback"
        title="Manage Reviews"
        text={`Reviews marked visible appear on the website and contribute to its overall rating. ${rating.count ? `Current website rating: ${rating.label}/5 from ${rating.count} visible review${rating.count === 1 ? "" : "s"}.` : "The website has no visible reviews yet."}`}
        stat={reviews.length}
        statLabel="Total reviews"
      />
      <div className="review-admin-grid">
        {list.map((r) => (
          <article className="review-admin-card" key={r.id}>
            <div className="review-admin-top">
              <Stars value={Number(r.rating)} />
              {r.demo && <span className="tag">Demo</span>}
              {r.hidden && <span className="tag">Hidden</span>}
            </div>
            <p>“{r.message}”</p>
            <div className="review-admin-meta">
              <span>
                <strong>{r.name}</strong>
                <small>
                  {new Date(r.created).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </small>
              </span>
              <button
                className="lnk"
                onClick={() => setReviewVisibility(r.id, !r.hidden)}
              >
                {r.hidden ? "Show" : "Hide"}
              </button>
              <button
                className="lnk red"
                onClick={() =>
                  window.confirm("Delete this review?") && deleteReview(r.id)
                }
              >
                Delete
              </button>
            </div>
          </article>
        ))}
        {!list.length && <div className="empty-state">No reviews yet.</div>}
      </div>
      {hiddenCount > 0 && (
        <p className="muted">
          {hiddenCount} hidden review{hiddenCount === 1 ? "" : "s"} are excluded
          from the website and its rating.
        </p>
      )}
    </div>
  );
}
