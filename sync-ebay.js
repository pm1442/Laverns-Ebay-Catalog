import Head from "next/head";
import Link from "next/link";
import Header from "../../components/Header";
import listings from "../../data/listings.json";
import { slugify } from "../../lib/slug";

export async function getStaticPaths() {
  const brands = [...new Set(listings.map((item) => item.brand))];
  return {
    paths: brands.map((brand) => ({ params: { brand: slugify(brand) } })),
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  const allForBrand = listings.filter((item) => slugify(item.brand) === params.brand);
  if (allForBrand.length === 0) return { notFound: true };

  const brandName = allForBrand[0].brand;
  const active = allForBrand.filter((item) => item.status === "active");

  return { props: { brandName, active, soldCount: allForBrand.length - active.length } };
}

export default function BrandPage({ brandName, active, soldCount }) {
  return (
    <>
      <Head>
        <title>{brandName} Parts | MSK Industrial Services LLC</title>
        <meta
          name="description"
          content={`Browse currently available ${brandName} parts from MSK Industrial Services. ${active.length} in stock now.`}
        />
      </Head>

      <Header />

      <main className="container">
        <section className="hero">
          <h1>{brandName} Parts</h1>
          <p>
            {active.length} {brandName} part{active.length === 1 ? "" : "s"} currently in stock.
            {soldCount > 0 && ` This page updates automatically as items sell and new ones come in.`}
          </p>
        </section>

        {active.length === 0 ? (
          <div className="no-results">
            No {brandName} parts in stock right now &mdash; check back soon, or{" "}
            <Link href="/">search the full catalog</Link>.
          </div>
        ) : (
          <div className="grid">
            {active.map((item) => (
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
