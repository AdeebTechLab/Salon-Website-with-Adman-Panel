import { Link } from "react-router-dom";
import { useStore, money } from "../store.jsx";
import Icon from "./Icon.jsx";

const deco = ["sparkle", "crown", "award"];

export default function Packages() {
  const { packages, services } = useStore();
  return (
    <section id="packages" className="sec dark-s packages-sec">
      <div className="wrap">
        <div className="section-head">
          <div>
            <p className="eyebrow">Our Packages</p>
            <h2>Exclusive Grooming Packages</h2>
            <p className="section-sub">
              Choose from our specially crafted packages for the ultimate
              grooming experience.
            </p>
          </div>
          <Link to="/services?cat=Packages" className="btn outline sm">
            View All Packages <Icon name="arrow" size={15} />
          </Link>
        </div>
        <div className="package-grid">
          {packages.map((p, i) => {
            const s = services.find((x) => x.id === p.serviceId);
            return (
              <article key={p.id} className="package-card">
                <Icon name={deco[i % deco.length]} size={26} className="package-deco" />
                <span className="badge">{p.badge}</span>
                <h3>{p.name}</h3>
                <p className="package-desc">{p.desc}</p>
                <ul className="check-list">
                  {p.includes.map((x) => (
                    <li key={x}>
                      <Icon name="check" size={16} />
                      {x}
                    </li>
                  ))}
                </ul>
                <div className="package-foot">
                  <div className="package-meta">
                    <span>
                      <Icon name="clock" size={17} />
                      {s ? s.duration : "—"} min
                    </span>
                    <span>
                      <Icon name="tag" size={17} />
                      {s ? money(s.price) : "Ask in shop"}
                    </span>
                  </div>
                  <Link
                    to={s ? `/booking?service=${s.id}` : "/booking"}
                    className="btn gold sm"
                  >
                    Book Now <Icon name="arrow" size={15} />
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
