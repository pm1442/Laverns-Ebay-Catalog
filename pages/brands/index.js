import Head from "next/head";
import Link from "next/link";
import Header from "../../components/Header";
import listings from "../../data/listings.json";
import { slugify } from "../../lib/slug";

export async function getStaticProps() {
  const counts = {};
  for (const item of listings) {
    if (item.status !== "active") continue;
    counts[item.brand] = (counts[item.brand] || 0) + 1;
  }
  const brands = Object.entries(counts)
    .map(([brand, count]) => ({ brand, slug: slugify(brand), count }))
    .sort((a, b) => b.count - a.count);

  return { props: { brands } };
}

export default function BrandsIndex({ brands }) {
  return (
    <>
      <Head>
        <title>Shop by Brand | MSK Industrial Services LLC</title>
        <meta name="description" content="Browse the MSK Industrial Services catalog by brand." />
      </Head>

      <Header />

      <main className="container">
        <section className="hero">
          <h1>Shop by brand</h1>
          <p>Every brand we carry, with current in-stock counts.</p>
        </section>

        <div className="grid">
          {brands.map((b) => (
            <Link key={b.slug} href={`/brands/${b.slug}`} className="card">
              <div className="card-body">
                <div className="card-title">{b.brand}</div>
                <div className="card-sku">{b.count} in stock</div>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </>
  );
}
