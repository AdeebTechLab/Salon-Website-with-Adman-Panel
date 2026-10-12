import { Link } from "react-router-dom";
import { useStore } from "../store.jsx";
import Icon from "./Icon.jsx";

/* Reusable barber card (homepage + barbers page) */
export function BarberCard({ b }) {
  return (
    <article className="barber-card">
      <img src={b.image} alt={b.name} loading="lazy" />
      <div className="barber-card-body">
        <p className="barber-role">{b.role}</p>
        <h3>{b.name}</h3>
        <p className="barber-spec">{b.specialty || "Professional grooming"}</p>
        <div className="barber-foot">
          {b.experience && (
            <span className="barber-exp">
              <Icon name="award" size={14} /> {b.experience} experience
            </span>
          )}
          <Link
            to={`/booking?barber=${b.id}`}
            className="barber-book"
            aria-label={`Book with ${b.name}`}
            title={`Book with ${b.name.split(" ")[0]}`}
          >
            <Icon name="arrow" size={17} />
          </Link>
        </div>
      </div>
    </article>
  );
}

export default function Barbers() {
  const { barbers } = useStore();
  return (
    <section id="barbers" className="sec light barbers-sec">
      <div className="wrap">
        <div className="section-head">
          <div>
            <p className="eyebrow">Our Team</p>
            <h2>Meet Your Barbers</h2>
            <p className="section-sub">
              Skilled hands. Sharp minds. Meet the experts behind your style.
            </p>
          </div>
          <Link to="/barbers" className="btn outline-dark sm">
            View All Barbers <Icon name="arrow" size={15} />
          </Link>
        </div>
        <div className="barber-grid">
          {barbers.slice(0, 3).map((b) => (
            <BarberCard key={b.id} b={b} />
          ))}
        </div>
      </div>
    </section>
  );
}
