import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useStore, ratingStats, publishedReviews } from "../store.jsx";
import Icon, { Stars } from "./Icon.jsx";
import RatingSummary from "./RatingSummary.jsx";

const initials = (n) =>
  n
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("");

/* Width of one card + the gap, and how many cards fit in view */
const measure = (track) => {
  const card = track?.firstElementChild;
  if (!card) return { step: 0, perView: 1 };
  const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
  const step = card.getBoundingClientRect().width + gap;
  return {
    step,
    perView: Math.max(1, Math.floor((track.clientWidth + gap + 2) / step)),
  };
};

export default function Testimonials() {
  const { reviews, addReview } = useStore();
  const visibleReviews = useMemo(() => publishedReviews(reviews), [reviews]);
  /* Published reviews, newest first */
  const list = useMemo(
    () =>
      [...visibleReviews].sort(
        (a, b) => new Date(b.created) - new Date(a.created),
      ),
    [visibleReviews],
  );
  const stats = useMemo(() => ratingStats(visibleReviews), [visibleReviews]);

  const [form, setForm] = useState({ name: "", rating: 5, message: "" });
  const [sent, setSent] = useState(false);
  const [err, setErr] = useState("");

  /* ---------- Horizontal slider state ---------- */
  const trackRef = useRef(null);
  const [nav, setNav] = useState({ start: true, end: true, first: 1, last: 1 });

  const update = useCallback(() => {
    const t = trackRef.current;
    if (!t) return;
    const { step, perView } = measure(t);
    const max = t.scrollWidth - t.clientWidth;
    const first = step ? Math.round(t.scrollLeft / step) + 1 : 1;
    setNav({
      start: t.scrollLeft <= 2,
      end: t.scrollLeft >= max - 2,
      first: Math.min(first, list.length),
      last: Math.min(first + perView - 1, list.length),
    });
  }, [list.length]);

  useEffect(() => {
    const t = trackRef.current;
    if (!t) return;
    update();
    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(update);
    };
    t.addEventListener("scroll", onScroll, { passive: true });
    const ro =
      typeof ResizeObserver !== "undefined"
        ? new ResizeObserver(onScroll)
        : null;
    ro?.observe(t);
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      t.removeEventListener("scroll", onScroll);
      ro?.disconnect();
      window.removeEventListener("resize", onScroll);
    };
  }, [update]);

  /* Move by one "page" of fully visible cards */
  const slide = (dir) => {
    const t = trackRef.current;
    if (!t) return;
    const { step, perView } = measure(t);
    const reduce = window.matchMedia?.(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    t.scrollBy({
      left: dir * step * perView,
      behavior: reduce ? "auto" : "smooth",
    });
  };

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
    /* New review is first in the list — bring it into view */
    trackRef.current?.scrollTo({ left: 0, behavior: "smooth" });
    setTimeout(() => setSent(false), 3000);
  };

  const scrollable = !(nav.start && nav.end);

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
            <RatingSummary stats={stats} />
          </div>

          {list.length ? (
            <div className="review-slider">
              <div
                className="review-track"
                ref={trackRef}
                tabIndex={0}
                role="region"
                aria-roledescription="carousel"
                aria-label="Customer reviews — scroll sideways or use the arrow buttons"
              >
                {list.map((r, i) => (
                  <blockquote
                    key={r.id}
                    className="review-card"
                    aria-roledescription="slide"
                    aria-label={`Review ${i + 1} of ${list.length}`}
                  >
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
              </div>

              {scrollable && (
                <div className="review-controls">
                  <span className="review-count" aria-live="polite">
                    {nav.first === nav.last
                      ? nav.first
                      : `${nav.first}–${nav.last}`}{" "}
                    of {list.length} reviews
                  </span>
                  <div className="review-arrows">
                    <button
                      type="button"
                      className="slider-btn"
                      onClick={() => slide(-1)}
                      disabled={nav.start}
                      aria-label="Previous reviews"
                    >
                      <Icon name="arrowLeft" size={18} />
                    </button>
                    <button
                      type="button"
                      className="slider-btn"
                      onClick={() => slide(1)}
                      disabled={nav.end}
                      aria-label="Next reviews"
                    >
                      <Icon name="arrow" size={18} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <p className="muted review-empty">
              No reviews yet — be the first to share your experience.
            </p>
          )}
        </div>

        <form className="review-form" onSubmit={submit} noValidate>
          <div className="review-form-intro">
            <h3>Leave a Review</h3>
            <p className="muted">
              Share your experience with us. Your feedback helps us grow.
            </p>
            <div className="field">
              <span className="field-label" id="rating-label">
                Your Rating
              </span>
              <div
                className="rating-input"
                role="radiogroup"
                aria-labelledby="rating-label"
              >
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
