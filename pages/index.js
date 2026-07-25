import { useMemo, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import Header from "../components/Header";
import listings from "../data/listings.json";

export default function Home() {
  const [query, setQuery] = useState("");

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

  return (
    <>
      <Head>
        <title>MSK Industrial Services LLC - Parts Catalog</title>
        <meta
          name="description"
          content="Search the full MSK Industrial Services parts catalog by part number, brand, or description. Every listing links straight to eBay checkout."
        />
      </Head>

      <Header />

      <section className="catalog-banner">
        <div className="container">
          <p className="banner-eyebrow">Industrial Surplus &amp; Automation Parts</p>
          <h1 className="banner-title">Find the exact part, fast.</h1>
          <p className="banner-tagline">
            Search MSK&rsquo;s full inventory by part number, brand, or description.
            Every result links straight through to checkout.
          </p>
          <input
            className="banner-search"
            type="text"
            placeholder="Search a part number, e.g. 3RH1131-1BB40"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
          />
        </div>
      </section>

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
            </div>
          </div>
          <a
            className="ebay-link"
            href="https://www.ebay.com/str/mskindustrialservices"
            target="_blank"
            rel="noopener noreferrer"
          >
            View store on eBay
          </a>
        </div>
      </section>

      <nav className="tabs">
        <Link href="/" className="active">Shop</Link>
        <Link href="/brands">Brands</Link>
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
