import { useStore } from "../../store.jsx";
import { Stars } from "../Icon.jsx";
import { PageIntro } from "./ui.jsx";

export default function ReviewsAdmin() {
  const { reviews, deleteReview } = useStore();
  const list = [...reviews].sort((a, b) => new Date(b.created) - new Date(a.created));
  const avg = reviews.length
    ? (reviews.reduce((t, r) => t + Number(r.rating), 0) / reviews.length).toFixed(1)
    : "—";
  return (
    <div className="admin-stack">
      <PageIntro
        eyebrow="Customer Feedback"
        title="Manage Reviews"
        text={`Newest review appears first. Only the latest 3 show on the website. Average rating: ${avg}.`}
        stat={reviews.length}
        statLabel="Total reviews"
      />
      <div className="review-admin-grid">
        {list.map((r, i) => (
          <article className="review-admin-card" key={r.id}>
            <div className="review-admin-top">
              <Stars value={Number(r.rating)} />
              {i < 3 && <span className="tag">On website</span>}
            </div>
            <p>“{r.message}”</p>
            <div className="review-admin-meta">
              <span>
                <strong>{r.name}</strong>
                <small>{new Date(r.created).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}</small>
              </span>
              <button
                className="lnk red"
                onClick={() => window.confirm("Delete this review?") && deleteReview(r.id)}
              >
                Delete
              </button>
            </div>
          </article>
        ))}
        {!list.length && <div className="empty-state">No reviews yet.</div>}
      </div>
    </div>
  );
}
