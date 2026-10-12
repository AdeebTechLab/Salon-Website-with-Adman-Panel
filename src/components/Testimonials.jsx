import { useState } from "react";
import { useStore } from "../store.jsx";
import Icon, { Stars } from "./Icon.jsx";

const initials = (n) =>
  n
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("");

export default function Testimonials() {
  const { reviews, addReview } = useStore();
  const latest = [...reviews]
    .sort((a, b) => new Date(b.created) - new Date(a.created))
    .slice(0, 3);
  const [form, setForm] = useState({ name: "", rating: 5, message: "" });
  const [sent, setSent] = useState(false);
  const [err, setErr] = useState("");

  const submit = (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.message.trim())
      return setErr("Please add your name and a short review.");
    addReview({
      name: form.name.trim(),
      rating: Number(form.rating),
      message: form.message.trim(),
    });
    setForm({ name: "", rating: 5, message: "" });
    setErr("");
    setSent(true);
    setTimeout(() => setSent(false), 3000);
  };

  return (
    <section id="reviews" className="light sec reviews-sec">
      <div className="wrap reviews-layout">
        <div className="reviews-main">
          <div className="section-head">
            <div>
              <p className="eyebrow">Real Clients</p>
              <h2>What People Say</h2>
              <p className="section-sub">Real stories. Real satisfaction.</p>
            </div>
          </div>
          <div className="review-grid">
            {latest.map((r) => (
              <blockquote key={r.id} className="review-card">
                <Stars value={Number(r.rating)} />
                <p>“{r.message}”</p>
                <footer>
                  <span className="avatar" aria-hidden="true">
                    {initials(r.name)}
                  </span>
                  <span>
                    <strong>{r.name}</strong>
                    <small>Verified client</small>
                  </span>
                </footer>
              </blockquote>
            ))}
            {!latest.length && <p className="muted">No reviews yet.</p>}
          </div>
        </div>

        <form className="review-form" onSubmit={submit} noValidate>
          <div className="review-form-intro">
          <h3>Leave a Review</h3>
          <p className="muted">Share your experience with us. Your feedback helps us grow.</p>
          <div className="field">
            <span className="field-label" id="rating-label">
              Your Rating
            </span>
            <div className="rating-input" role="radiogroup" aria-labelledby="rating-label">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  type="button"
                  key={n}
                  role="radio"
                  aria-checked={form.rating === n}
                  aria-label={`${n} star${n > 1 ? "s" : ""}`}
                  className={n <= form.rating ? "on" : ""}
                  onClick={() => setForm({ ...form, rating: n })}
                >
                  <Icon name="star" size={22} />
                </button>
              ))}
            </div>
          </div>
          </div>
          <div className="review-form-fields">
          <label className="field">
            <span className="field-label">
              Your Name <em>*</em>
            </span>
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Enter your name"
              maxLength={60}
              required
            />
          </label>
          <label className="field">
            <span className="field-label">
              Your Review <em>*</em>
            </span>
            <textarea
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              rows="3"
              placeholder="Write your review..."
              maxLength={400}
              required
            ></textarea>
          </label>
          {err && (
            <p className="err" role="alert">
              {err}
            </p>
          )}
          <button className="btn gold">
            Submit Review <Icon name="arrow" size={15} />
          </button>
          {sent && (
            <p className="ok-text" role="status">
              Thank you! Your review has been added.
            </p>
          )}
          </div>
        </form>
      </div>
    </section>
  );
}
