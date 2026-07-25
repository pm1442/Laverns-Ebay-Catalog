import { useEffect, useState } from "react";
import Link from "next/link";

export default function HeroBanner() {
  const [showLogo, setShowLogo] = useState(true);

  useEffect(() => {
    const id = setInterval(() => setShowLogo((v) => !v), 3000);
    return () => clearInterval(id);
  }, []);

  return (
    <section className="hero-banner">
      <div className={`hero-slide hero-slide-logo ${showLogo ? "is-visible" : ""}`}>
        <img src="/logo.jpg" alt="MSK Industrial Services LLC" />
      </div>

      <div className={`hero-slide hero-slide-text ${!showLogo ? "is-visible" : ""}`}>
        <div className="hero-text-inner">
          <p>
            MSK Industrial Services is a family-owned industrial surplus supplier
            with over 30 years of combined industry experience. We specialize in&hellip;
          </p>
          <Link href="/about" className="learn-more-btn">
            Learn more
          </Link>
        </div>
      </div>

      <div className="hero-dots">
        <span className={showLogo ? "is-active" : ""} />
        <span className={!showLogo ? "is-active" : ""} />
      </div>
    </section>
  );
}
