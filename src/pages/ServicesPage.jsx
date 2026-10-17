import { Link, useSearchParams } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import Icon from "../components/Icon.jsx";
import ServiceCard from "../components/ServiceCard.jsx";
import { useStore, CATEGORIES } from "../store.jsx";

export default function ServicesPage() {
  const { services } = useStore();
  const [params, setParams] = useSearchParams();
  const cats = [
    "All",
    ...CATEGORIES.filter((c) => services.some((s) => s.category === c)),
    ...new Set(
      services.map((s) => s.category).filter((c) => !CATEGORIES.includes(c)),
    ),
  ];
  const cat = cats.includes(params.get("cat")) ? params.get("cat") : "All";
  const filtered =
    cat === "All" ? services : services.filter((s) => s.category === cat);
  const pick = (x) =>
    setParams(x === "All" ? {} : { cat: x }, { replace: true });

  return (
    <>
      <Navbar />
      <main className="inner-page">
        <section className="page-hero">
          <div className="wrap">
            <p className="eyebrow">Legend Barber Shop</p>
            <h1>
              Services Made for the{" "}
              <span className="gold-t">Modern Gentleman.</span>
            </h1>
            <p className="lead">
              From everyday cuts to shaadi-ready grooming — choose your service
              and book your slot in minutes.
            </p>
          </div>
        </section>
        <section className="sec light">
          <div className="wrap">
            <div className="section-head">
              <div>
                <p className="eyebrow">Our Menu</p>
                <h2>All Services</h2>
                <p className="section-sub">
                  Honest prices in PKR. Pay at the shop.
                </p>
              </div>
              <Link to="/booking" className="btn dark sm">
                Book Appointment <Icon name="arrow" size={15} />
              </Link>
            </div>
            <div
              className="filter-row"
              role="tablist"
              aria-label="Service categories"
            >
              {cats.map((x) => (
                <button
                  key={x}
                  role="tab"
                  aria-selected={cat === x}
                  className={"filter-pill" + (cat === x ? " active" : "")}
                  onClick={() => pick(x)}
                >
                  {x}
                </button>
              ))}
            </div>
            <div className="service-grid">
              {filtered.map((s) => (
                <ServiceCard key={s.id} s={s} />
              ))}
              {!filtered.length && (
                <p className="muted">No services in this category yet.</p>
              )}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
