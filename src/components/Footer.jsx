import { Link } from "react-router-dom";
import { useStore } from "../store.jsx";
import Icon, { Socials } from "./Icon.jsx";

export default function Footer() {
  const { settings } = useStore();
  return (
    <footer className="foot">
      <div className="wrap footer-top">
        <div className="footer-brand">
          <Link to="/" className="logo">
            LEGEND <small>BARBER SHOP</small>
          </Link>
          <p>Precision cuts. Local confidence. Premium grooming in Khanpur.</p>
          <Socials settings={settings} />
        </div>
        <div className="footer-col">
          <strong>Explore</strong>
          <Link to="/">Home</Link>
          <Link to="/services">Services</Link>
          <Link to="/barbers">Barbers</Link>
          <Link to="/#reviews">Reviews</Link>
          <Link to="/#about">About</Link>
          <Link to="/booking">Book Appointment</Link>
        </div>
        <div className="footer-col">
          <strong>Contact</strong>
          <a href={`tel:${settings.phone.replace(/\s/g, "")}`}>
            <Icon name="phone" size={15} /> {settings.phone}
          </a>
          <a
            href={`https://wa.me/${settings.whatsapp.replace(/\D/g, "")}`}
            target="_blank"
            rel="noreferrer"
          >
            <Icon name="whatsapp" size={15} /> WhatsApp
          </a>
          <a href={`mailto:${settings.email}`}>
            <Icon name="mail" size={15} /> {settings.email}
          </a>
          <span>
            <Icon name="pin" size={15} /> {settings.address}
          </span>
        </div>
        <div className="footer-col">
          <strong>Opening Hours</strong>
          <span>{settings.hours}</span>
          <span>Walk-ins welcome</span>
          <span>Appointments recommended</span>
        </div>
      </div>
      <div className="wrap footer-bottom">
        <span>
          © {new Date().getFullYear()} Legend Barber Shop. All rights reserved.
        </span>
        <span>
          Made for the modern Pakistani gentleman. ·{" "}
          <Link to="/admin" className="footer-admin">
            Admin
          </Link>
        </span>
      </div>
    </footer>
  );
}
