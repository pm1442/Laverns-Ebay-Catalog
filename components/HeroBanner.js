import { useEffect, useState } from "react";
import Link from "next/link";

export default function HeroBanner() {
  const [slide, setSlide] = useState(0); // 0 = logo, 1 = text
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => setSlide((s) => (s === 0 ? 1 : 0)), 3000);
    return () => clearInterval(id);
  }, [paused]);

  return (
    <section className="hero-banner">
      <div
        className="hero-track"
        style={{ transform: `translateX(-${slide * 50}%)` }}
      >
        <div className="hero-slide hero-slide-logo">
          <img src="/logo.jpg" alt="MSK Industrial Services LLC" />
        </div>

        <div className="hero-slide hero-slide-text">
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
      </div>

      <button
        type="button"
        className="hero-pause-btn"
        onClick={() => setPaused((p) => !p)}
        aria-label={paused ? "Resume slideshow" : "Pause slideshow"}
      >
        {paused ? "\u25B6" : "\u23F8"}
      </button>

      <div className="hero-dots">
        <span className={slide === 0 ? "is-active" : ""} />
        <span className={slide === 1 ? "is-active" : ""} />
      </div>
    </section>
  );
}
