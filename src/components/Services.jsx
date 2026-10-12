import { Link } from "react-router-dom";
import Icon from "./Icon.jsx";

/* "Choose Your Look" — the four main service categories */
const cats = [
  ["Haircut", "Classic & modern styles.", "scissors"],
  ["Beard & Trim", "Shape up, define your beard.", "beard"],
  ["Facial", "Refresh & rejuvenate your skin.", "face"],
  ["Grooming", "Complete care for men.", "bottle"],
];

export default function Services() {
  return (
    <section id="services" className="light sec">
      <div className="wrap">
        <div className="section-head">
          <div>
            <p className="eyebrow">Our Services</p>
            <h2>Choose Your Look</h2>
            <p className="section-sub">
              From classic cuts to premium grooming, our services are designed
              to keep you looking and feeling your best.
            </p>
          </div>
          <Link to="/services" className="btn dark sm">
            View All Services <Icon name="arrow" size={15} />
          </Link>
        </div>
        <div className="category-grid">
          {cats.map(([t, d, i]) => (
            <Link
              to={`/services?cat=${encodeURIComponent(t)}`}
              key={t}
              className="category-card"
            >
              <span className="category-icon">
                <Icon name={i} size={24} />
              </span>
              <h3>{t}</h3>
              <p>{d}</p>
              <span className="category-arrow" aria-hidden="true">
                <Icon name="arrow" size={18} />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
