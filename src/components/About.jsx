import { sectionPhotos } from "../store.jsx";
import Icon from "./Icon.jsx";

const stats = [
  ["user", "8+", "Years experience"],
  ["users", "500+", "Happy clients"],
  ["star", "4.9", "Average rating"],
  ["calendar", "7", "Days a week"],
];
const points = [
  "Respectful service",
  "Honest pricing",
  "Easy online booking",
  "Walk-ins welcome",
];

export default function About() {
  return (
    <section id="about" className="sec about-section">
      <div
        className="about-photo"
        style={{ backgroundImage: `url(${sectionPhotos.about})` }}
        aria-hidden="true"
      ></div>
      <div className="wrap about">
        <div className="about-copy">
          <p className="eyebrow">Why Legend</p>
          <h2>
            Classic Barbering,
            <br />
            <span className="gold-t">Local Attitude.</span>
          </h2>
          <p className="lead">
            <span className="gold-t">Legend Barber Shop</span> is built for the
            modern Pakistani gentleman — a place for a clean cut before Jumma, a
            polished look for Eid, or the full grooming setup before a wedding.
          </p>
          <ul className="about-points">
            {points.map((p) => (
              <li key={p}>
                <Icon name="checkCircle" size={17} />
                {p}
              </li>
            ))}
          </ul>
        </div>
        <div className="stats">
          {stats.map(([i, n, t]) => (
            <div key={t} className="stat">
              <Icon name={i} size={30} className="gold-t" />
              <div>
                <b>{n}</b>
                <span>{t}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
