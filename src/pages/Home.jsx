import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import Hero from "../components/Hero.jsx";
import Features from "../components/Features.jsx";
import Services from "../components/Services.jsx";
import FeaturedServices from "../components/FeaturedServices.jsx";
import Packages from "../components/Packages.jsx";
import Barbers from "../components/Barbers.jsx";
import About from "../components/About.jsx";
import Testimonials from "../components/Testimonials.jsx";
import Contact from "../components/Contact.jsx";
import BookingCTA from "../components/BookingCTA.jsx";
import Footer from "../components/Footer.jsx";

export default function Home() {
  const { hash } = useLocation();
  /* Scroll to a section when arriving with a hash, e.g. /#reviews */
  useEffect(() => {
    if (!hash) return;
    const t = setTimeout(
      () =>
        document
          .getElementById(hash.slice(1))
          ?.scrollIntoView({ behavior: "smooth" }),
      60,
    );
    return () => clearTimeout(t);
  }, [hash]);

  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Features />
        <Services />
        <FeaturedServices />
        <Packages />
        <Barbers />
        <About />
        <Testimonials />
        <Contact />
        <BookingCTA />
      </main>
      <Footer />
    </>
  );
}
