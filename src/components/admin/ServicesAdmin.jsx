import { useState } from "react";
import { useStore, heroPhoto, money, CATEGORIES } from "../../store.jsx";
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
  const { services, addService, updateService, deleteService } = useStore();
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
      <div className="service-admin-grid">
        {services.map((s) => (
          <article className="service-admin-card" key={s.id}>
            <img src={s.image} alt="" />
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
