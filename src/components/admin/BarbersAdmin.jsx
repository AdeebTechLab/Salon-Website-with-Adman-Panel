import { useState } from "react";
import { useStore, heroPhoto } from "../../store.jsx";
const blank = {
  name: "",
  role: "",
  experience: "",
  specialty: "",
  image: heroPhoto,
};
const readImageFile = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
export default function BarbersAdmin() {
  const { barbers, addBarber, updateBarber, deleteBarber } = useStore();
  const [f, setF] = useState(blank);
  const [edit, setEdit] = useState(null);
  const [fileName, setFileName] = useState("");
  const save = (e) => {
    e.preventDefault();
    if (!f.name.trim() || !f.role.trim()) return;
    edit ? updateBarber(edit, f) : addBarber(f);
    setF(blank);
    setEdit(null);
    setFileName("");
  };
  return (
    <div className="admin-stack">
      <div className="feature-card">
        <div>
          <p className="eyebrow">TEAM MANAGEMENT</p>
          <h2>Manage barbers</h2>
          <p className="muted">
            Control the public team profiles and specialist information used
            during booking.
          </p>
        </div>
        <div className="mini-stat">
          <b>{barbers.length}</b>
          <span>Barbers</span>
        </div>
      </div>
      <form className="form-panel admin-form large-form" onSubmit={save}>
        <div className="form-heading">
          <div>
            <h3>{edit ? "Edit barber" : "Add a barber"}</h3>
            <span className="muted">
              A professional profile helps customers choose confidently.
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
            Full name
            <input
              placeholder="e.g. Ahmad Raza"
              value={f.name}
              onChange={(e) => setF({ ...f, name: e.target.value })}
              required
            />
          </label>
          <label>
            Role
            <input
              placeholder="Master Barber"
              value={f.role}
              onChange={(e) => setF({ ...f, role: e.target.value })}
              required
            />
          </label>
          <label>
            Experience
            <input
              placeholder="8+ years"
              value={f.experience}
              onChange={(e) => setF({ ...f, experience: e.target.value })}
            />
          </label>
          <label>
            Specialty
            <input
              placeholder="Fades & Modern Cuts"
              value={f.specialty}
              onChange={(e) => setF({ ...f, specialty: e.target.value })}
            />
          </label>
          <label className="span-2">
            Barber photo
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
                alt="Barber preview"
              />
            )}
            <span className="form-hint">
              Upload a clear barber portrait from your computer.
            </span>
          </label>
        </div>
        <button className="btn gold">
          {edit ? "Save barber changes" : "Add barber"}
        </button>
      </form>
      <div className="barber-admin-grid">
        {barbers.map((b) => (
          <article className="barber-admin-card" key={b.id}>
            <img src={b.image} alt="" />
            <div>
              <p className="eyebrow gold-t">{b.role}</p>
              <h3>{b.name}</h3>
              <p className="muted">
                {b.specialty || "Professional grooming"} · {b.experience || "—"}
              </p>
              <div className="admin-actions">
                <button
                  className="lnk"
                  onClick={() => {
                    setEdit(b.id);
                    setF(b);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                >
                  Edit
                </button>
                <button
                  className="lnk red"
                  onClick={() =>
                    window.confirm("Remove " + b.name + "?") &&
                    deleteBarber(b.id)
                  }
                >
                  Remove
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
