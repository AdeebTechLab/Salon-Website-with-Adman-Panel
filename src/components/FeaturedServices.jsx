import { Link } from "react-router-dom";
import { useStore, featuredList } from "../store.jsx";
import ServiceCard from "./ServiceCard.jsx";
import Icon from "./Icon.jsx";

/* Homepage "Our Services" — up to 4 services picked in Admin → Services */
export default function FeaturedServices() {
  const { services, featuredServiceIds } = useStore();
  const list = featuredList(services, featuredServiceIds);
  if (!list.length) return null; // nothing featured → hide the section

  return (
    <section id="our-services" className="light sec featured-sec">
      <div className="wrap">
        <div className="section-head">
          <div>
            <p className="eyebrow">Most Booked</p>
            <h2>Our Services</h2>
            <p className="section-sub">
              Our most popular services — clear prices, no surprises. Pick one
              and reserve your chair in seconds.
            </p>
          </div>
          <Link to="/services" className="btn dark sm">
            Full Service Menu <Icon name="arrow" size={15} />
          </Link>
        </div>
        <div className="service-grid featured-grid">
          {list.map((s) => (
            <ServiceCard key={s.id} s={s} cta="Book Now" />
          ))}
        </div>
      </div>
    </section>
  );
}
