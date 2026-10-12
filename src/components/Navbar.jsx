import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Icon from "./Icon.jsx";

const L = [
  ["/", "Home"],
  ["/services", "Services"],
  ["/barbers", "Barbers"],
  ["/#reviews", "Reviews"],
  ["/#about", "About"],
  ["/#contact", "Contact"],
];

export default function Navbar() {
  const [o, setO] = useState(false);
  const { pathname, hash } = useLocation();
  const navigate = useNavigate();

  useEffect(() => setO(false), [pathname, hash]);
  useEffect(() => {
    document.body.classList.toggle("menu-open", o);
    return () => document.body.classList.remove("menu-open");
  }, [o]);

  const go = (path) => {
    setO(false);
    if (path.includes("#")) {
      const [base, id] = path.split("#");
      if ((base || "/") === pathname) {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
        window.history.replaceState(null, "", "#" + id);
      } else navigate(path);
    } else {
      if (path === pathname) window.scrollTo({ top: 0, behavior: "smooth" });
      navigate(path);
    }
  };
  const isActive = (p) => !p.includes("#") && p === pathname && !(p === "/" && hash);

  return (
    <header className="nav">
      <div className="wrap nav-in">
        <Link to="/" className="logo" onClick={() => setO(false)} aria-label="Legend Barber Shop home">
          LEGEND <small>BARBER SHOP</small>
        </Link>
        <nav className={"nav-menu" + (o ? " open" : "")} aria-label="Main">
          {L.map(([p, t]) => (
            <button
              key={p}
              className={"nav-link" + (isActive(p) ? " active" : "")}
              aria-current={isActive(p) ? "page" : undefined}
              onClick={() => go(p)}
            >
              {t}
            </button>
          ))}
          <Link to="/booking" className="btn gold sm nav-book">
            Book Now
          </Link>
        </nav>
        <div className="nav-mobile">
          <Link to="/booking" className="btn gold sm">
            Book Now
          </Link>
          <button
            className="burger"
            aria-label={o ? "Close menu" : "Open menu"}
            aria-expanded={o}
            onClick={() => setO(!o)}
          >
            <Icon name={o ? "close" : "menu"} size={22} />
          </button>
        </div>
      </div>
    </header>
  );
}
