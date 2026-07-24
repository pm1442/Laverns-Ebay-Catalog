import { useMemo, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import Header from "../components/Header";
import listings from "../data/listings.json";

export default function Home() {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return listings;
    return listings.filter((item) =>
      [item.sku, item.title, item.description].join(" ").toLowerCase().includes(q)
    );
  }, [query]);

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

      <main className="container">
        <section className="hero">
          <h1>Find your part</h1>
          <p>
            Search the MSK Industrial Services catalog by part number, brand, or
            description.
          </p>
          <input
            className="search-box"
            type="text"
            placeholder="e.g. 070-0050-00"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
          />
        </section>

        {filtered.length === 0 ? (
          <div className="no-results">No parts match &ldquo;{query}&rdquo;.</div>
        ) : (
          <div className="grid">
            {filtered.map((item) => (
              <Link key={item.sku} href={`/parts/${item.sku}`} className="card">
                {item.images?.[0] && <img src={item.images[0]} alt={item.title} />}
                <div className="card-body">
                  <div className="card-sku">{item.sku}</div>
                  <div className="card-title">{item.title}</div>
                  {item.price && <div className="card-price">{item.price}</div>}
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </>
  );
}
