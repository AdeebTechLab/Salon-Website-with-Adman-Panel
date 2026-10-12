import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useStore, todayISO, toTime, fmt12, sectionPhotos, OPEN, CLOSE, STEP } from "../store.jsx";
import { ServiceOptions } from "./BookingForm.jsx";
import Icon from "./Icon.jsx";

const TIMES = [];
for (let m = OPEN; m < CLOSE; m += STEP) TIMES.push(toTime(m));

/* Homepage "Easy Booking" strip — collects the basics, then continues on /booking */
export default function BookingCTA() {
  const { services, barbers } = useStore();
  const navigate = useNavigate();
  const [f, setF] = useState({ service: "", barber: "", date: todayISO(), time: "", name: "", phone: "" });
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  const submit = (e) => {
    e.preventDefault();
    const q = new URLSearchParams();
    ["service", "barber", "date", "time"].forEach((k) => f[k] && q.set(k, f[k]));
    navigate(`/booking?${q.toString()}`, { state: { name: f.name, phone: f.phone } });
  };

  return (
    <section id="book" className="booking-cta">
      <div
        className="booking-cta-photo"
        style={{ backgroundImage: `url(${sectionPhotos.booking})` }}
        aria-hidden="true"
      ></div>
      <div className="wrap booking-cta-in">
        <div className="booking-cta-copy">
          <p className="eyebrow">Book Your Appointment</p>
          <h2>Easy Booking, Hassle Free</h2>
          <p>Choose your service, pick a date &amp; time, and get ready for the best grooming experience.</p>
        </div>
        <form className="booking-cta-form" onSubmit={submit}>
          <div className="cta-step">
            <p className="cta-step-title"><span>1</span> Choose Service</p>
            <select aria-label="Service" value={f.service} onChange={set("service")}>
              <option value="">Select service</option>
              <ServiceOptions services={services} />
            </select>
            <select aria-label="Barber" value={f.barber} onChange={set("barber")}>
              <option value="">Any barber</option>
              {barbers.map((b) => (
                <option key={b.id} value={b.id}>{b.name}</option>
              ))}
            </select>
          </div>
          <div className="cta-step">
            <p className="cta-step-title"><span>2</span> Date &amp; Time</p>
            <input type="date" aria-label="Date" min={todayISO()} value={f.date} onChange={set("date")} />
            <select aria-label="Preferred time" value={f.time} onChange={set("time")}>
              <option value="">Select time</option>
              {TIMES.map((t) => (
                <option key={t} value={t}>{fmt12(t)}</option>
              ))}
            </select>
          </div>
          <div className="cta-step">
            <p className="cta-step-title"><span>3</span> Your Details</p>
            <input aria-label="Full name" placeholder="Full name" value={f.name} onChange={set("name")} />
            <input aria-label="Phone number" type="tel" placeholder="Phone number" value={f.phone} onChange={set("phone")} />
          </div>
          <button className="btn gold cta-submit">
            Book Appointment <Icon name="arrow" size={15} />
          </button>
        </form>
      </div>
    </section>
  );
}
