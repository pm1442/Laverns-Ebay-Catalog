import { useMemo, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import HeroBanner from "../components/HeroBanner";
import listings from "../data/listings.json";

const EBAY_STORE_URL = "https://www.ebay.com/str/mskindustrialservices";
const EBAY_CONTACT_URL =
  "https://contact.ebay.com/ws/eBayISAPI.dll?ContactUserShow&requested=mskindustrialservices";

export default function Home() {
  const [query, setQuery] = useState("");
  const [shareMsg, setShareMsg] = useState("");

  const active = useMemo(() => listings.filter((item) => item.status === "active"), []);
  const brandCount = useMemo(() => new Set(active.map((item) => item.brand)).size, [active]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return active;
    return listings.filter((item) =>
      [item.sku, item.title, item.description].join(" ").toLowerCase().includes(q)
    );
  }, [query, active]);

  const isSearching = query.trim().length > 0;

  const handleShare = async () => {
    const shareData = {
      title: "MSK Industrial Services",
      text: "Check out MSK Industrial Services' parts catalog",
      url: typeof window !== "undefined" ? window.location.href : "",
    };
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share(shareData);
      } catch {
        // user cancelled the share sheet -- no action needed
      }
    } else if (typeof navigator !== "undefined" && navigator.clipboard) {
      await navigator.clipboard.writeText(shareData.url);
      setShareMsg("Link copied!");
      setTimeout(() => setShareMsg(""), 2000);
    }
  };

  return (
    <>
      <Head>
        <title>MSK Industrial Services LLC - Parts Catalog</title>
        <meta
          name="description"
          content="Search the full MSK Industrial Services parts catalog by part number, brand, or description. Every listing links straight to eBay checkout."
        />
      </Head>

      <div className="container hero-wrap">
        <div className="search-bar-full">
          <input
            type="text"
            placeholder={`Search all ${listings.length} parts`}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
          />
        </div>

        <HeroBanner />
      </div>

      <section className="seller-bar">
        <div className="container">
          <div className="seller-identity">
            <img className="seller-logo" src="/logo.jpg" alt="MSK Industrial Services LLC" />
            <div>
              <p className="seller-name">MSK Industrial Services LLC</p>
              <p className="seller-stats">
                <strong>{active.length}</strong> parts in stock
                <span className="dot">&middot;</span>
                <strong>{brandCount}</strong> brands carried
              </p>
              <a
                className="ebay-inline-link"
                href={EBAY_STORE_URL}
                target="_blank"
                rel="noopener noreferrer"
              >
                View store on eBay &#8599;
              </a>
            </div>
          </div>

          <div className="seller-actions">
            <button type="button" className="action-btn" onClick={handleShare}>
              &#8593; Share
            </button>
            <a
              className="action-btn"
              href={EBAY_CONTACT_URL}
              target="_blank"
              rel="noopener noreferrer"
            >
              &#9993; Contact
            </a>
            {shareMsg && <span className="share-msg">{shareMsg}</span>}
          </div>
        </div>
      </section>

      <nav className="tabs">
        <Link href="/" className="active">Shop</Link>
        <Link href="/brands">Brands</Link>
        <Link href="/about">About</Link>
      </nav>

      <main className="container">
        <h2 className="section-label">
          {isSearching ? `Results for \u201c${query}\u201d` : "Newly Listed"}
        </h2>

        {filtered.length === 0 ? (
          <div className="no-results">No parts match &ldquo;{query}&rdquo;.</div>
        ) : (
          <div className="grid">
            {filtered.map((item) => (
              <Link key={item.sku} href={`/parts/${item.sku}`} className="card">
                {item.images?.[0] && (
                  <img
                    src={item.images[0]}
                    alt={item.title}
                    style={item.status === "sold" ? { opacity: 0.5 } : undefined}
                  />
                )}
                <div className="card-body">
                  <div className="card-sku">{item.sku}</div>
                  <div className="card-title">{item.title}</div>
                  {item.status === "sold" ? (
                    <div className="card-sold">Sold</div>
                  ) : (
                    item.price && <div className="card-price">{item.price}</div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </>
  );
}
