import { useLocation, useSearchParams } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import BookingForm from "../components/BookingForm.jsx";
import { useStore } from "../store.jsx";
import Icon from "../components/Icon.jsx";

export default function BookingPage() {
  const [params] = useSearchParams();
  const { state } = useLocation();
  const { settings } = useStore();
  const initial = {
    service: params.get("service") || "",
    barber: params.get("barber") || "",
    date: params.get("date") || "",
    time: params.get("time") || "",
    name: state?.name || "",
    phone: state?.phone || "",
  };
  return (
    <>
      <Navbar />
      <main className="inner-page">
        <section className="page-hero compact">
          <div className="wrap page-hero-in">
            <div>
              <p className="eyebrow">Book Your Appointment</p>
              <h1>
                Reserve Your <span className="gold-t">Chair.</span>
              </h1>
              <p className="lead">
                Pick a service, choose your barber and an available time — it
                takes less than a minute.
              </p>
            </div>
            <a
              className="help-card"
              href={`https://wa.me/${settings.whatsapp.replace(/\D/g, "")}`}
              target="_blank"
              rel="noreferrer"
            >
              <Icon name="whatsapp" size={22} />
              <span>
                <small>Need help booking?</small>
                <strong>{settings.whatsapp}</strong>
              </span>
            </a>
          </div>
        </section>
        <section className="sec light booking-page">
          <div className="wrap">
            {/* key resets the form when arriving with a new pre-selection */}
            <BookingForm key={params.toString()} initial={initial} />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
