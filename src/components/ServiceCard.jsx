import { Link } from "react-router-dom";
import { money } from "../store.jsx";
import Icon from "./Icon.jsx";

/* Reusable service card (services page + homepage "Our Services") */
export default function ServiceCard({ s, cta = "Book This Service" }) {
  return (
    <article className="service-card">
      <div className="service-card-img">
        {s.image && <img src={s.image} alt={s.name} loading="lazy" />}
        <span className="tag">{s.category}</span>
      </div>
      <div className="service-card-body">
        <h3>{s.name}</h3>
        <p>{s.desc}</p>
        <div className="card-meta">
          <span>
            <Icon name="clock" size={15} /> {s.duration} min
          </span>
          <strong>{money(s.price)}</strong>
        </div>
        <Link
          to={`/booking?service=${encodeURIComponent(s.id)}`}
          className="btn outline-dark sm full"
          aria-label={`${cta} — ${s.name}`}
        >
          {cta} <Icon name="arrow" size={15} />
        </Link>
      </div>
    </article>
  );
}
