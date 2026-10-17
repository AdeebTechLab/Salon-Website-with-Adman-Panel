import { useState } from "react";
import {
  useStore,
  heroPhoto,
  money,
  CATEGORIES,
  featuredList,
  MAX_FEATURED,
} from "../../store.jsx";
import Icon from "../Icon.jsx";
const blank = {
  name: "",
  category: "Haircut",
  desc: "",
  price: "",
  duration: "",
  image: heroPhoto,
};
const readImageFile = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
const cats = CATEGORIES;
export default function ServicesAdmin() {
  const {
    services,
    addService,
    updateService,
    deleteService,
    featuredServiceIds,
    toggleFeatured,
    moveFeatured,
  } = useStore();
  /* Services shown in the homepage "Our Services" section, in order */
  const featured = featuredList(services, featuredServiceIds);
  const featuredPos = (id) => featured.findIndex((x) => x.id === id) + 1;
  const full = featured.length >= MAX_FEATURED;
  const [f, setF] = useState(blank);
  const [edit, setEdit] = useState(null);
  const [fileName, setFileName] = useState("");
  const save = (e) => {
    e.preventDefault();
    const d = { ...f, price: Number(f.price), duration: Number(f.duration) };
    if (!d.name || !d.price || !d.duration) return;
    edit ? updateService(edit, d) : addService(d);
    setF(blank);
    setEdit(null);
    setFileName("");
  };
  return (
    <div className="admin-stack">
      <div className="feature-card">
        <div>
          <p className="eyebrow">SERVICE MENU</p>
          <h2>Manage services</h2>
          <p className="muted">
            Add new grooming services, update PKR prices or change service
            categories.
          </p>
        </div>
        <div className="mini-stat">
          <b>{services.length}</b>
          <span>Active services</span>
        </div>
      </div>
      <form className="form-panel admin-form large-form" onSubmit={save}>
        <div className="form-heading">
          <div>
            <h3>{edit ? "Edit service" : "Add a new service"}</h3>
            <span className="muted">
              Keep names and prices clear for customers.
            </span>
          </div>
          {edit && (
            <button
              type="button"
              className="btn ghost sm"
              onClick={() => {
                setEdit(null);
                setF(blank);
              }}
            >
              Cancel edit
            </button>
          )}
        </div>
        <div className="admin-form-grid">
          <label>
            Service name
            <input
              placeholder="e.g. Signature Haircut"
              value={f.name}
              onChange={(e) => setF({ ...f, name: e.target.value })}
              required
            />
          </label>
          <label>
            Category
            <select
              value={f.category}
              onChange={(e) => setF({ ...f, category: e.target.value })}
            >
              {cats.map((c) => (
                <option key={c}>{c}</option>
              ))}
              {f.category && !cats.includes(f.category) && (
                <option>{f.category}</option>
              )}
            </select>
          </label>
          <label>
            Price (PKR)
            <input
              type="number"
              min="1"
              placeholder="1200"
              value={f.price}
              onChange={(e) => setF({ ...f, price: e.target.value })}
              required
            />
          </label>
          <label>
            Duration (minutes)
            <input
              type="number"
              min="5"
              step="5"
              placeholder="45"
              value={f.duration}
              onChange={(e) => setF({ ...f, duration: e.target.value })}
              required
            />
          </label>
          <label className="span-2">
            Description
            <input
              placeholder="Short description shown to customers"
              value={f.desc}
              onChange={(e) => setF({ ...f, desc: e.target.value })}
            />
          </label>
          <label className="span-2">
            Service image
            <div className="file-upload-wrap">
              <input
                className="file-input"
                type="file"
                accept="image/*"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  setFileName(file.name);
                  const image = await readImageFile(file);
                  setF({ ...f, image });
                }}
              />
              <span className="file-upload-label">Choose a file</span>
              <small>{fileName || "No file chosen"}</small>
            </div>
            {f.image && (
              <img
                className="admin-image-preview"
                src={f.image}
                alt="Service preview"
              />
            )}
            <span className="form-hint">
              You can upload a local image or keep the current image.
            </span>
          </label>
        </div>
        <button className="btn gold">
          {edit ? "Save service changes" : "Add service"}
        </button>
      </form>
      <section
        className="form-panel featured-panel"
        aria-labelledby="featured-title"
      >
        <div className="form-heading">
          <div>
            <h3 id="featured-title">Homepage “Our Services” section</h3>
            <span className="muted">
              Choose up to {MAX_FEATURED} services to show on the homepage. Use
              “Show on homepage” on any service below. Changes appear on the
              website straight away.
            </span>
          </div>
          <span className={"tag" + (full ? " tag-ok" : "")}>
            {featured.length}/{MAX_FEATURED} selected
          </span>
        </div>
        {featured.length ? (
          <ol className="featured-picks">
            {featured.map((s, i) => (
              <li key={s.id}>
                <span className="featured-pos" aria-hidden="true">
                  {i + 1}
                </span>
                {s.image ? (
                  <img src={s.image} alt="" />
                ) : (
                  <span className="featured-thumb" />
                )}
                <span className="featured-name">
                  <strong>{s.name}</strong>
                  <small>
                    {s.category} · {money(s.price)}
                  </small>
                </span>
                <span className="featured-actions">
                  <button
                    type="button"
                    className="icon-btn"
                    onClick={() => moveFeatured(s.id, -1)}
                    disabled={i === 0}
                    aria-label={`Move ${s.name} earlier`}
                    title="Move earlier"
                  >
                    <Icon name="arrow" size={16} className="rot-up" />
                  </button>
                  <button
                    type="button"
                    className="icon-btn"
                    onClick={() => moveFeatured(s.id, 1)}
                    disabled={i === featured.length - 1}
                    aria-label={`Move ${s.name} later`}
                    title="Move later"
                  >
                    <Icon name="arrow" size={16} className="rot-down" />
                  </button>
                  <button
                    type="button"
                    className="lnk red"
                    onClick={() => toggleFeatured(s.id)}
                  >
                    Remove
                  </button>
                </span>
              </li>
            ))}
          </ol>
        ) : (
          <div className="empty-state">
            <strong>No services on the homepage.</strong>
            <span>
              The “Our Services” section stays hidden until you feature at least
              one service.
            </span>
          </div>
        )}
        {featured.length > 0 && !full && (
          <span className="form-hint">
            Add {MAX_FEATURED - featured.length} more to fill all {MAX_FEATURED}{" "}
            homepage cards.
          </span>
        )}
        {full && (
          <span className="form-hint">
            Homepage is full. Remove a service here to feature a different one.
          </span>
        )}
      </section>
      <div className="service-admin-grid">
        {services.map((s) => (
          <article className="service-admin-card" key={s.id}>
            <div className="service-admin-media">
              <img src={s.image} alt="" />
              {featuredPos(s.id) > 0 && (
                <span className="featured-badge">
                  <Icon name="star" size={13} /> Homepage #{featuredPos(s.id)}
                </span>
              )}
            </div>
            <div>
              <div className="card-line">
                <span className="tag">{s.category}</span>
                <strong>{money(s.price)}</strong>
              </div>
              <h3>{s.name}</h3>
              <p className="muted">{s.desc}</p>
              <small className="service-admin-dur">{s.duration} minutes</small>
              <div className="admin-actions">
                <button
                  type="button"
                  className={
                    "lnk feature-toggle" + (featuredPos(s.id) ? " on" : "")
                  }
                  aria-pressed={featuredPos(s.id) > 0}
                  disabled={!featuredPos(s.id) && full}
                  title={
                    !featuredPos(s.id) && full
                      ? `Homepage already shows ${MAX_FEATURED} services — remove one first`
                      : undefined
                  }
                  onClick={() => toggleFeatured(s.id)}
                >
                  <Icon name="star" size={14} />
                  {featuredPos(s.id) ? "On homepage" : "Show on homepage"}
                </button>
                <button
                  className="lnk"
                  onClick={() => {
                    setEdit(s.id);
                    setF(s);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                >
                  Edit
                </button>
                <button
                  className="lnk red"
                  onClick={() =>
                    window.confirm("Delete " + s.name + "?") &&
                    deleteService(s.id)
                  }
                >
                  Delete
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
