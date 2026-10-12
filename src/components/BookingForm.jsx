import { useState, useMemo, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  useStore,
  toTime,
  toMin,
  todayISO,
  money,
  fmt12,
  fmtDate,
  CATEGORIES,
  OPEN,
  CLOSE,
  STEP,
} from "../store.jsx";
import Icon from "./Icon.jsx";

/* <option> list grouped by category — shared with the homepage booking strip */
export function ServiceOptions({ services }) {
  const cats = [
    ...CATEGORIES,
    ...new Set(services.map((s) => s.category).filter((c) => !CATEGORIES.includes(c))),
  ];
  return cats.map((c) => {
    const list = services.filter((s) => s.category === c);
    if (!list.length) return null;
    return (
      <optgroup key={c} label={c}>
        {list.map((s) => (
          <option key={s.id} value={s.id}>
            {s.name} — {money(s.price)}
          </option>
        ))}
      </optgroup>
    );
  });
}

const ANY = "any";

export default function BookingForm({ initial = {} }) {
  const { services, barbers, isFree, book, settings } = useStore();
  const [serviceId, setService] = useState(
    services.some((s) => s.id === initial.service) ? initial.service : "",
  );
  const [barberId, setBarber] = useState(
    barbers.some((b) => b.id === initial.barber) ? initial.barber : ANY,
  );
  const [date, setDate] = useState(
    initial.date && initial.date >= todayISO() ? initial.date : todayISO(),
  );
  const [time, setTime] = useState(initial.time || "");
  const [f, setF] = useState({
    name: initial.name || "",
    phone: initial.phone || "",
    email: "",
    notes: "",
  });
  const [err, setErr] = useState("");
  const [notice, setNotice] = useState("");
  const [done, setDone] = useState(null);

  const service = services.find((s) => s.id === serviceId);
  const barber = barbers.find((b) => b.id === barberId);
  const need = Math.max(Number(service?.duration) || 0, STEP);

  const freeBarber = (m) =>
    barberId === ANY
      ? barbers.find((b) => isFree(b.id, date, m, need))
      : isFree(barberId, date, m, need) && barber;

  const slots = useMemo(() => {
    const r = [];
    const now = new Date();
    const isToday = date === todayISO();
    for (let m = OPEN; m + need <= CLOSE; m += STEP) {
      if (isToday && m <= now.getHours() * 60 + now.getMinutes()) continue; // already passed
      r.push({ t: toTime(m), ok: !!freeBarber(m) });
    }
    return r;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [date, barberId, need, isFree, barbers]);

  /* Drop a pre-selected time that is no longer available */
  useEffect(() => {
    if (!time || !service) return;
    const slot = slots.find((s) => s.t === time);
    if (!slot || !slot.ok) {
      setTime("");
      setNotice(`${fmt12(time)} isn’t available for this choice — please pick another time.`);
    }
  }, [slots, time, service]);

  const submit = (e) => {
    e.preventDefault();
    setErr("");
    if (!service) return setErr("Please select a service.");
    if (!time) return setErr("Please choose an available time.");
    if (!f.name.trim()) return setErr("Please enter your full name.");
    if (!/^[+\d][\d\s-]{6,}$/.test(f.phone.trim()))
      return setErr("Please enter a valid phone number, e.g. 0300 1234567.");
    if (f.email && !/^\S+@\S+\.\S+$/.test(f.email))
      return setErr("Please enter a valid email or leave it empty.");
    const assigned = freeBarber(toMin(time));
    if (!assigned) return setErr("That time was just taken — please choose another.");
    book(
      { ...f, name: f.name.trim(), phone: f.phone.trim() },
      [service.id],
      assigned.id,
      date,
      time,
    );
    setDone({ service: service.name, date, time, barber: assigned.name, total: service.price });
    setTime("");
    setF({ name: "", phone: "", email: "", notes: "" });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (done)
    return (
      <div className="booking-success">
        <span className="success-icon">
          <Icon name="check" size={30} />
        </span>
        <p className="eyebrow">Appointment Request Received</p>
        <h2>You’re Booked.</h2>
        <p>
          <strong>{done.service}</strong> with <strong>{done.barber}</strong>
          <br />
          {fmtDate(done.date)} at {fmt12(done.time)}
        </p>
        <div className="success-meta">
          <span>
            Total <strong>{money(done.total)}</strong>
          </span>
          <span>We’ll confirm your slot by phone or WhatsApp.</span>
        </div>
        <div className="row center">
          <button className="btn gold" onClick={() => setDone(null)}>
            Book Another
          </button>
          <Link className="btn outline-dark" to="/">
            Back to Home
          </Link>
          <a
            className="btn outline-dark"
            href={`https://wa.me/${settings.whatsapp.replace(/\D/g, "")}`}
            target="_blank"
            rel="noreferrer"
          >
            <Icon name="whatsapp" size={16} /> WhatsApp Us
          </a>
        </div>
      </div>
    );

  return (
    <form className="booking-form" onSubmit={submit} noValidate>
      <div className="booking-main">
        <fieldset>
          <legend>
            <span>1</span> Service
          </legend>
          <label className="field">
            <span className="field-label">Select a service</span>
            <select
              value={serviceId}
              onChange={(e) => {
                setService(e.target.value);
                setNotice("");
              }}
            >
              <option value="">Choose a service…</option>
              <ServiceOptions services={services} />
            </select>
          </label>
          {service && (
            <p className="service-info">
              <span>{service.desc}</span>
              <span className="service-info-meta">
                <Icon name="clock" size={15} /> {service.duration} min
                <Icon name="tag" size={15} /> {money(service.price)}
              </span>
            </p>
          )}
        </fieldset>

        <fieldset>
          <legend>
            <span>2</span> Barber
          </legend>
          <div className="barber-choice-grid">
            {[{ id: ANY, name: "Any Available", role: "First free barber" }, ...barbers].map((b) => (
              <button
                type="button"
                key={b.id}
                aria-pressed={barberId === b.id}
                className={"barber-choice" + (barberId === b.id ? " selected" : "")}
                onClick={() => {
                  setBarber(b.id);
                  setNotice("");
                }}
              >
                {b.image ? (
                  <img src={b.image} alt="" />
                ) : (
                  <span className="any-avatar">
                    <Icon name="users" size={18} />
                  </span>
                )}
                <span>
                  <strong>{b.name}</strong>
                  <small>{b.role}</small>
                </span>
              </button>
            ))}
          </div>
        </fieldset>

        <fieldset>
          <legend>
            <span>3</span> Date &amp; Time
          </legend>
          <div className="date-row">
            <label className="field">
              <span className="field-label">Date</span>
              <input
                type="date"
                min={todayISO()}
                value={date}
                onChange={(e) => {
                  setDate(e.target.value || todayISO());
                  setNotice("");
                }}
              />
            </label>
            <div className="field">
              <span className="field-label">Available time</span>
              {!service ? (
                <p className="field-note">Select a service to see available times.</p>
              ) : !slots.some((s) => s.ok) ? (
                <p className="field-note">No free slots on this day — please try another date or barber.</p>
              ) : (
                <div className="time-grid">
                  {slots.map((s) => (
                    <button
                      type="button"
                      key={s.t}
                      disabled={!s.ok}
                      aria-pressed={time === s.t}
                      className={"time-chip" + (time === s.t ? " selected" : "")}
                      onClick={() => {
                        setTime(s.t);
                        setNotice("");
                      }}
                    >
                      {fmt12(s.t)}
                    </button>
                  ))}
                </div>
              )}
              {notice && <p className="field-note warn">{notice}</p>}
            </div>
          </div>
        </fieldset>

        <fieldset>
          <legend>
            <span>4</span> Your Details
          </legend>
          <div className="two">
            <label className="field">
              <span className="field-label">
                Full Name <em>*</em>
              </span>
              <input
                placeholder="e.g. Muhammad Hassan"
                value={f.name}
                autoComplete="name"
                onChange={(e) => setF({ ...f, name: e.target.value })}
                required
              />
            </label>
            <label className="field">
              <span className="field-label">
                Phone Number <em>*</em>
              </span>
              <input
                type="tel"
                placeholder="03XX XXXXXXX"
                value={f.phone}
                autoComplete="tel"
                onChange={(e) => setF({ ...f, phone: e.target.value })}
                required
              />
            </label>
            <label className="field span-2">
              <span className="field-label">
                Email <small>(optional)</small>
              </span>
              <input
                type="email"
                placeholder="you@example.com"
                value={f.email}
                autoComplete="email"
                onChange={(e) => setF({ ...f, email: e.target.value })}
              />
            </label>
            <label className="field span-2">
              <span className="field-label">
                Additional Notes <small>(optional)</small>
              </span>
              <textarea
                rows="3"
                placeholder="Any special request?"
                value={f.notes}
                onChange={(e) => setF({ ...f, notes: e.target.value })}
              ></textarea>
            </label>
          </div>
        </fieldset>
      </div>

      <aside className="booking-summary">
        <p className="eyebrow">Your Summary</p>
        <h3>Appointment Details</h3>
        <dl className="summary-lines">
          <div>
            <dt>Service</dt>
            <dd>{service?.name || "Not selected"}</dd>
          </div>
          <div>
            <dt>Barber</dt>
            <dd>{barber?.name || "Any available"}</dd>
          </div>
          <div>
            <dt>Date</dt>
            <dd>{fmtDate(date)}</dd>
          </div>
          <div>
            <dt>Time</dt>
            <dd>{time ? fmt12(time) : "Not selected"}</dd>
          </div>
          <div>
            <dt>Duration</dt>
            <dd>{service ? `${service.duration} min` : "—"}</dd>
          </div>
        </dl>
        <div className="summary-total">
          <span>Total</span>
          <strong>{money(service?.price || 0)}</strong>
        </div>
        {err && (
          <p className="err" role="alert">
            {err}
          </p>
        )}
        <button className="btn gold full">
          Confirm Booking <Icon name="arrow" size={15} />
        </button>
        <p className="summary-note">
          Pay at the shop. We’ll confirm your booking by phone or WhatsApp.
        </p>
      </aside>
    </form>
  );
}
