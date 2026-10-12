import Icon from "./Icon.jsx";

const F = [
  ["scissors", "Expert Barbers", "Skilled local professionals."],
  ["jar", "Premium Products", "Quality grooming products."],
  ["shield", "Clean & Hygienic", "Sanitised tools & fresh towels."],
  ["star", "Comfort First", "Relaxed, respectful service."],
];

export default function Features() {
  return (
    <section className="strip" aria-label="Highlights">
      <div className="wrap feature-grid">
        {F.map(([i, t, d]) => (
          <div key={t} className="feat">
            <Icon name={i} size={30} className="gold-t" />
            <div>
              <strong>{t}</strong>
              <p>{d}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
