import { Link } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import Icon from "../components/Icon.jsx";
import { BarberCard } from "../components/Barbers.jsx";
import { useStore } from "../store.jsx";

export default function BarbersPage() {
  const { barbers } = useStore();
  return (
    <>
      <Navbar />
      <main className="inner-page">
        <section className="page-hero">
          <div className="wrap">
            <p className="eyebrow">Meet the Team</p>
            <h1>
              Barbers Who Understand Your <span className="gold-t">Style.</span>
            </h1>
            <p className="lead">
              Our local grooming experts combine classic barbering with the
              cuts, fades and beard styles men in Pakistan actually ask for.
            </p>
          </div>
        </section>
        <section className="sec light">
          <div className="wrap">
            <div className="section-head">
              <div>
                <p className="eyebrow">Our Barbers</p>
                <h2>Choose Your Barber</h2>
                <p className="section-sub">Tap the arrow on any card to book with that barber.</p>
              </div>
              <Link to="/booking" className="btn dark sm">
                Book Appointment <Icon name="arrow" size={15} />
              </Link>
            </div>
            <div className="barber-grid all-barbers">
              {barbers.map((b) => (
                <BarberCard key={b.id} b={b} />
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
