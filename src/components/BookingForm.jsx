import { useState, useMemo, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
  useStore,
  toTime,
  toMin,
  todayISO,
  money,
  fmt12,
  fmtDate,
  fmtLongDate,
  waLink,
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
    ...new Set(
      services.map((s) => s.category).filter((c) => !CATEGORIES.includes(c)),
    ),
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

/* WhatsApp message built from the customer's real form selections */
export function bookingMessage({
  salonName,
  name,
  services,
  phone,
  barber,
  date,
  time,
  total,
  notes,
}) {
  const lines = [
    `Hello! I would like to book an appointment at ${salonName}.`,
    "",
    "*Booking Details:*",
    "",
    `- Customer Name: ${name}`,
    `- Service(s): ${services.join(", ")}`,
    `- Phone Number: ${phone}`,
    `- Preferred Barber: ${barber}`,
    `- Booking Date: ${fmtLongDate(date)}`,
    `- Booking Time: ${fmt12(time)}`,
  ];
  if (Number(total) > 0) lines.push(`- Total Price: ${money(total)}`);
  const note = (notes || "").replace(/\s+/g, " ").trim();
  if (note) lines.push(`- Additional Notes: ${note}`);
  lines.push("", "Thank you!");
  return lines.join("\n");
}

const ANY = "any";
const FIELD_ORDER = ["service", "date", "time", "name", "phone", "email"];

/* Unsent form is kept for this browser tab, so a refresh or a quick visit to
   another page doesn't wipe the customer's choices. Cleared after sending. */
const DRAFT_KEY = "legend-booking-draft";
const readDraft = () => {
  try {
    const d = JSON.parse(sessionStorage.getItem(DRAFT_KEY));
    return d && typeof d === "object" ? d : {};
  } catch {
    return {};
  }
};
const saveDraft = (d) => {
  try {
    sessionStorage.setItem(DRAFT_KEY, JSON.stringify(d));
  } catch {
    /* storage unavailable */
  }
};
const clearDraft = () => {
  try {
    sessionStorage.removeItem(DRAFT_KEY);
  } catch {
    /* storage unavailable */
  }
};

const phoneDigits = (p) => p.replace(/\D/g, "");
const validPhone = (p) =>
  /^\+?[\d\s()-]+$/.test(p.trim()) &&
  phoneDigits(p).length >= 10 &&
  phoneDigits(p).length <= 13;

export default function BookingForm({ initial = {} }) {
  const { services, barbers, isFree, book, settings } = useStore();
  const formRef = useRef(null);

  /* Starting values: a link (e.g. "Book Now" on a service) wins over the saved draft */
  const [start] = useState(() => {
    const d = readDraft();
    const fromLink = ["service", "barber", "date", "time"].some(
      (k) => initial[k],
    );
    const sel = fromLink
      ? {
          serviceIds: initial.service ? String(initial.service).split(",") : [],
          barber: initial.barber,
          date: initial.date,
          time: initial.time,
        }
      : d;
    const ids = (Array.isArray(sel.serviceIds) ? sel.serviceIds : []).filter(
      (id, i, a) => a.indexOf(id) === i && services.some((s) => s.id === id),
    );
    return {
      serviceIds: ids,
      barber: barbers.some((b) => b.id === sel.barber) ? sel.barber : ANY,
      date: sel.date && sel.date >= todayISO() ? sel.date : todayISO(),
      time: typeof sel.time === "string" ? sel.time : "",
      f: {
        name: initial.name || d.name || "",
        phone: initial.phone || d.phone || "",
        email: d.email || "",
        notes: d.notes || "",
      },
    };
  });

  const [serviceIds, setServiceIds] = useState(start.serviceIds);
  const [addId, setAddId] = useState("");
  const [barberId, setBarber] = useState(start.barber);
  const [date, setDate] = useState(start.date);
  const [time, setTime] = useState(start.time);
  const [f, setF] = useState(start.f);
  const [errors, setErrors] = useState({});
  const [err, setErr] = useState("");
  const [notice, setNotice] = useState("");
  const [done, setDone] = useState(null);

  const selected = serviceIds
    .map((id) => services.find((s) => s.id === id))
    .filter(Boolean);
  const service = selected[0];
  const extras = selected.slice(1);
  const available = services.filter((s) => !serviceIds.includes(s.id));
  const barber = barbers.find((b) => b.id === barberId);
  const totalDuration = selected.reduce(
    (t, s) => t + Number(s.duration || 0),
    0,
  );
  const totalPrice = selected.reduce((t, s) => t + Number(s.price || 0), 0);
  const need = Math.max(totalDuration, STEP);

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
    if (!time || !selected.length) return;
    const slot = slots.find((s) => s.t === time);
    if (!slot || !slot.ok) {
      setTime("");
      setNotice(
        `${fmt12(time)} isn’t available for this choice — please pick another time.`,
      );
    }
  }, [slots, time, selected.length]);

  /* Remember unsent choices for this tab */
  useEffect(() => {
    if (done) return;
    saveDraft({ serviceIds, barber: barberId, date, time, ...f });
  }, [serviceIds, barberId, date, time, f, done]);

  const clearErr = (k) => {
    if (errors[k]) setErrors((e) => ({ ...e, [k]: "" }));
    if (err) setErr("");
  };
  const setField = (k) => (e) => {
    setF({ ...f, [k]: e.target.value });
    clearErr(k);
  };

  /* Main service select — works exactly like before */
  const setPrimary = (id) => {
    const rest = serviceIds.slice(1).filter((x) => x !== id);
    setServiceIds(id ? [id, ...rest] : rest);
    if (addId === id) setAddId("");
    setNotice("");
    clearErr("service");
  };
  const addExtra = () => {
    if (!addId || serviceIds.includes(addId)) return;
    setServiceIds([...serviceIds, addId]);
    setAddId("");
    setNotice("");
  };
  const removeExtra = (id) => {
    setServiceIds(serviceIds.filter((x) => x !== id));
    setNotice("");
  };

  const validate = () => {
    const e = {};
    if (!selected.length) e.service = "Please select at least one service.";
    if (!date || date < todayISO())
      e.date = "Please choose today or a future date.";
    if (!time)
      e.time = selected.length
        ? "Please choose an available time."
        : "Select a service first, then choose a time.";
    if (f.name.trim().length < 2) e.name = "Please enter your full name.";
    if (!f.phone.trim()) e.phone = "Please enter your phone number.";
    else if (!validPhone(f.phone))
      e.phone = "Please enter a valid phone number, e.g. 0300 1234567.";
    if (f.email.trim() && !/^\S+@\S+\.\S+$/.test(f.email.trim()))
      e.email = "Please enter a valid email or leave it empty.";
    return e;
  };

  /* Scroll to (and focus) the first field that needs attention */
  const showFirstError = (e) => {
    const first = FIELD_ORDER.find((k) => e[k]);
    requestAnimationFrame(() => {
      const el = formRef.current?.querySelector(`[data-field="${first}"]`);
      if (!el) return;
      el.scrollIntoView({ behavior: "smooth", block: "center" });
      el.querySelector("input, select, textarea, button:not(:disabled)")?.focus(
        { preventScroll: true },
      );
    });
  };

  const submit = (ev) => {
    ev.preventDefault();
    const e = validate();
    const keys = Object.keys(e);
    if (keys.length) {
      setErrors(e);
      setErr(
        keys.length === 1
          ? e[keys[0]]
          : "Please complete the highlighted fields to send your booking request.",
      );
      showFirstError(e);
      return;
    }
    const assigned = freeBarber(toMin(time));
    if (!assigned) {
      const e2 = { time: "That time was just taken — please choose another." };
      setErrors(e2);
      setErr(e2.time);
      setTime("");
      showFirstError(e2);
      return;
    }

    const name = f.name.trim();
    const phone = f.phone.trim();
    const notes = f.notes.trim();
    const names = selected.map((s) => s.name);
    const barberLabel =
      barberId === ANY
        ? `Any available (suggested: ${assigned.name})`
        : assigned.name;

    /* Save the request so it shows in Admin → Bookings as "pending" */
    book(
      { name, phone, email: f.email.trim(), notes },
      selected.map((s) => s.id),
      assigned.id,
      date,
      time,
    );

    /* Open WhatsApp with the booking details (must run inside the click for pop-up blockers) */
    const message = bookingMessage({
      salonName: settings.salonName || "Legend Barber Shop",
      name,
      services: names,
      phone,
      barber: barberLabel,
      date,
      time,
      total: totalPrice,
      notes,
    });
    const url = waLink(settings.whatsapp, message);
    let opened = false;
    if (url) {
      const w = window.open(url, "_blank");
      if (w) {
        try {
          w.opener = null;
        } catch {
          /* ignore */
        }
        opened = true;
      }
    }

    clearDraft();
    setDone({
      services: names,
      barber: barberLabel,
      date,
      time,
      total: totalPrice,
      url,
      opened,
    });
    setErrors({});
    setErr("");
    setTime("");
    setF({ name: "", phone: "", email: "", notes: "" });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (done)
    return (
      <div className="booking-success" role="status">
        <span className="success-icon">
          <Icon name="whatsapp" size={30} />
        </span>
        <p className="eyebrow">Booking Request Sent</p>
        <h2>Almost There.</h2>
        <p>
          {done.url
            ? done.opened
              ? "WhatsApp has opened with your booking details. Please tap Send in WhatsApp so the salon receives your request."
              : "Tap the button below to send your booking details to the salon on WhatsApp."
            : `We couldn’t open WhatsApp because the salon’s WhatsApp number isn’t set up yet. Please call ${settings.phone} to confirm your booking.`}
        </p>
        <dl className="success-details">
          <div>
            <dt>Service{done.services.length > 1 ? "s" : ""}</dt>
            <dd>{done.services.join(", ")}</dd>
          </div>
          <div>
            <dt>Barber</dt>
            <dd>{done.barber}</dd>
          </div>
          <div>
            <dt>Date &amp; time</dt>
            <dd>
              {fmtDate(done.date)} at {fmt12(done.time)}
            </dd>
          </div>
          <div>
            <dt>Total</dt>
            <dd>{money(done.total)}</dd>
          </div>
        </dl>
        <p className="pending-note">
          <Icon name="clock" size={16} />
          <span>
            Your appointment is <strong>not confirmed yet</strong>. It is
            confirmed only when the salon replies on WhatsApp or calls you.
          </span>
        </p>
        <div className="row center">
          {done.url ? (
            <a
              className="btn gold"
              href={done.url}
              target="_blank"
              rel="noreferrer"
            >
              <Icon name="whatsapp" size={16} />{" "}
              {done.opened ? "Open WhatsApp Again" : "Send on WhatsApp"}
            </a>
          ) : (
            settings.phone && (
              <a
                className="btn gold"
                href={`tel:${settings.phone.replace(/[^\d+]/g, "")}`}
              >
                <Icon name="phone" size={16} /> Call {settings.phone}
              </a>
            )
          )}
          <button className="btn outline-dark" onClick={() => setDone(null)}>
            Book Another
          </button>
          <Link className="btn outline-dark" to="/">
            Back to Home
          </Link>
        </div>
      </div>
    );

  const invalid = (k) =>
    errors[k]
      ? { "aria-invalid": true, "aria-describedby": `bk-err-${k}` }
      : {};
  const fieldError = (k) =>
    errors[k] ? (
      <p className="field-error" id={`bk-err-${k}`}>
        {errors[k]}
      </p>
    ) : null;

  return (
    <form className="booking-form" onSubmit={submit} noValidate ref={formRef}>
      <div className="booking-main">
        <fieldset data-field="service">
          <legend>
            <span>1</span> Service
          </legend>
          <div className="service-pick">
            <label className="field">
              <span className="field-label">
                Select a service <em>*</em>
              </span>
              <select
                value={service?.id || ""}
                onChange={(e) => setPrimary(e.target.value)}
                {...invalid("service")}
              >
                <option value="">Choose a service…</option>
                <ServiceOptions services={services} />
              </select>
            </label>
            {fieldError("service")}
            {service && (
              <p className="service-info">
                <span>{service.desc}</span>
                <span className="service-info-meta">
                  <Icon name="clock" size={15} /> {service.duration} min
                  <Icon name="tag" size={15} /> {money(service.price)}
                </span>
              </p>
            )}
            {service && (
              <div className="addon-box">
                <span className="field-label">
                  Add more services <small>(optional)</small>
                </span>
                {extras.length > 0 && (
                  <ul className="picked-services" aria-label="Added services">
                    {extras.map((s) => (
                      <li key={s.id}>
                        <span className="picked-name">
                          <strong>{s.name}</strong>
                          <small>
                            {s.duration} min · {money(s.price)}
                          </small>
                        </span>
                        <button
                          type="button"
                          className="picked-remove"
                          onClick={() => removeExtra(s.id)}
                          aria-label={`Remove ${s.name}`}
                          title="Remove"
                        >
                          <Icon name="close" size={16} />
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
                {available.length > 0 && (
                  <div className="addon-row">
                    <select
                      aria-label="Choose another service"
                      value={addId}
                      onChange={(e) => setAddId(e.target.value)}
                    >
                      <option value="">Add a service…</option>
                      <ServiceOptions services={available} />
                    </select>
                    <button
                      type="button"
                      className="btn outline-dark sm"
                      onClick={addExtra}
                      disabled={!addId}
                    >
                      Add
                    </button>
                  </div>
                )}
                {extras.length > 0 && (
                  <p className="addon-total">
                    {selected.length} services · {totalDuration} min ·{" "}
                    <strong>{money(totalPrice)}</strong>
                  </p>
                )}
              </div>
            )}
          </div>
        </fieldset>

        <fieldset>
          <legend>
            <span>2</span> Barber
          </legend>
          <div className="barber-choice-grid">
            {[
              { id: ANY, name: "Any Available", role: "First free barber" },
              ...barbers,
            ].map((b) => (
              <button
                type="button"
                key={b.id}
                aria-pressed={barberId === b.id}
                className={
                  "barber-choice" + (barberId === b.id ? " selected" : "")
                }
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
            <label className="field" data-field="date">
              <span className="field-label">
                Date <em>*</em>
              </span>
              <input
                type="date"
                min={todayISO()}
                value={date}
                onChange={(e) => {
                  setDate(e.target.value || todayISO());
                  setNotice("");
                  clearErr("date");
                }}
                {...invalid("date")}
              />
              {fieldError("date")}
            </label>
            <div className="field" data-field="time">
              <span className="field-label" id="bk-time-label">
                Available time <em>*</em>
              </span>
              {!selected.length ? (
                <p className="field-note">
                  Select a service to see available times.
                </p>
              ) : !slots.some((s) => s.ok) ? (
                <p className="field-note">
                  No free slots on this day — please try another date or barber.
                </p>
              ) : (
                <div
                  className={"time-grid" + (errors.time ? " invalid" : "")}
                  role="group"
                  aria-labelledby="bk-time-label"
                  {...(errors.time
                    ? { "aria-describedby": "bk-err-time" }
                    : {})}
                >
                  {slots.map((s) => (
                    <button
                      type="button"
                      key={s.t}
                      disabled={!s.ok}
                      aria-pressed={time === s.t}
                      className={
                        "time-chip" + (time === s.t ? " selected" : "")
                      }
                      onClick={() => {
                        setTime(s.t);
                        setNotice("");
                        clearErr("time");
                      }}
                    >
                      {fmt12(s.t)}
                    </button>
                  ))}
                </div>
              )}
              {fieldError("time")}
              {notice && <p className="field-note warn">{notice}</p>}
            </div>
          </div>
        </fieldset>

        <fieldset>
          <legend>
            <span>4</span> Your Details
          </legend>
          <div className="two">
            <label className="field" data-field="name">
              <span className="field-label">
                Full Name <em>*</em>
              </span>
              <input
                placeholder="e.g. Muhammad Hassan"
                value={f.name}
                autoComplete="name"
                onChange={setField("name")}
                required
                {...invalid("name")}
              />
              {fieldError("name")}
            </label>
            <label className="field" data-field="phone">
              <span className="field-label">
                Phone Number <em>*</em>
              </span>
              <input
                type="tel"
                inputMode="tel"
                placeholder="03XX XXXXXXX"
                value={f.phone}
                autoComplete="tel"
                onChange={setField("phone")}
                required
                {...invalid("phone")}
              />
              {fieldError("phone")}
            </label>
            <label className="field span-2" data-field="email">
              <span className="field-label">
                Email <small>(optional)</small>
              </span>
              <input
                type="email"
                placeholder="you@example.com"
                value={f.email}
                autoComplete="email"
                onChange={setField("email")}
                {...invalid("email")}
              />
              {fieldError("email")}
            </label>
            <label className="field span-2">
              <span className="field-label">
                Additional Notes <small>(optional)</small>
              </span>
              <textarea
                rows="3"
                placeholder="Any special request?"
                value={f.notes}
                maxLength={300}
                onChange={setField("notes")}
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
            <dt>Service{selected.length > 1 ? "s" : ""}</dt>
            <dd>
              {selected.length
                ? selected.map((s) => s.name).join(", ")
                : "Not selected"}
            </dd>
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
            <dd>{selected.length ? `${totalDuration} min` : "—"}</dd>
          </div>
        </dl>
        <div className="summary-total">
          <span>Total</span>
          <strong>{money(totalPrice)}</strong>
        </div>
        {err && (
          <p className="err" role="alert">
            {err}
          </p>
        )}
        <button className="btn gold full">
          <Icon name="whatsapp" size={16} /> Confirm Booking
        </button>
        <p className="summary-note">
          Opens WhatsApp with your booking details. Your slot is confirmed only
          after the salon replies. Pay at the shop.
        </p>
      </aside>
    </form>
  );
}
