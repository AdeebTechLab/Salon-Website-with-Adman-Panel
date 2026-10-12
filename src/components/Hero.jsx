import { Link } from "react-router-dom";
import { heroPhoto } from "../store.jsx";
import Icon, { Stars } from "./Icon.jsx";

export default function Hero() {
  return (
    <section id="top" className="hero">
      <div className="hero-media">
        <img src={heroPhoto} alt="Barber giving a client a precise haircut" fetchpriority="high" />
      </div>
      <div className="hero-shade" aria-hidden="true"></div>
      <div className="wrap hero-in">
        <div className="hero-copy">
          <p className="eyebrow">Khanpur · Punjab · Est. 2018</p>
          <h1>
            Sharp Cuts.
            <br />
            <span className="gold-t">Strong Presence.</span>
          </h1>
          <p className="hero-lead">
            Premium men’s grooming for everyday confidence. Haircuts, beard
            care, facials and more — crafted by experts, for the modern man.
          </p>
          <div className="hero-actions">
            <Link to="/booking" className="btn gold">
              Book Appointment <Icon name="arrow" size={16} />
            </Link>
            <Link to="/services" className="btn outline">
              Explore Services
            </Link>
          </div>
          <div className="hero-trust">
            <Stars value={5} size={15} />
            <span>4.9/5</span>
            <i aria-hidden="true"></i>
            <span>500+ happy clients</span>
          </div>
        </div>
        <p className="hero-script" aria-hidden="true">
          More Than Just
          <br />a Haircut
        </p>
      </div>
    </section>
  );
}
