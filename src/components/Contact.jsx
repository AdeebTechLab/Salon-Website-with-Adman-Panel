import { useStore } from "../store.jsx";
import Icon, { Socials } from "./Icon.jsx";

export default function Contact() {
  const { settings } = useStore();
  const wa = `https://wa.me/${settings.whatsapp.replace(/\D/g, "")}`;
  const map = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    "Legend Barber Shop " + settings.address,
  )}`;
  const items = [
    ["phone", "Phone", settings.phone, `tel:${settings.phone.replace(/\s/g, "")}`],
    ["whatsapp", "WhatsApp", settings.whatsapp, wa],
    ["mail", "Email", settings.email, `mailto:${settings.email}`],
    ["pin", "Location", settings.address, map],
    ["clock", "Opening Hours", settings.hours, null],
  ];
  return (
    <section id="contact" className="light contact-sec">
      <div className="wrap">
        <div className="contact-card">
          <div className="contact-intro">
            <p className="eyebrow">Contact Us</p>
            <h2>Get In Touch</h2>
            <p>
              We’re here to help. Call, message or drop by — walk-ins are
              always welcome.
            </p>
            <div className="contact-follow">
              <span>Follow us</span>
              <Socials settings={settings} />
            </div>
          </div>
          <ul className="contact-list">
            {items.map(([i, label, value, href]) => (
              <li key={label}>
                <span className="contact-icon">
                  <Icon name={i} size={18} />
                </span>
                <span className="contact-text">
                  <small>{label}</small>
                  {href ? (
                    <a
                      href={href}
                      target={href.startsWith("http") ? "_blank" : undefined}
                      rel="noreferrer"
                    >
                      {value}
                    </a>
                  ) : (
                    <strong>{value}</strong>
                  )}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
