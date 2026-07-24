import Head from "next/head";
import Header from "../../components/Header";
import listings from "../../data/listings.json";

export async function getStaticPaths() {
  return {
    paths: listings.map((item) => ({ params: { sku: item.sku } })),
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  const item = listings.find((l) => l.sku === params.sku);
  if (!item) return { notFound: true };
  return { props: { item } };
}

export default function ProductPage({ item }) {
  const specEntries = Object.entries(item.itemSpecifics || {});

  return (
    <>
      <Head>
        <title>{item.title} | {item.sku}</title>
        <meta name="description" content={stripHtml(item.description).slice(0, 155)} />
        <meta property="og:title" content={item.title} />
        <meta property="og:description" content={stripHtml(item.description).slice(0, 155)} />
        {item.images?.[0] && <meta property="og:image" content={item.images[0]} />}
        <meta property="og:type" content="product" />
        <script
          type="application/ld+json"
          // Structured data helps Google understand this is a real, priced product.
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Product",
              name: item.title,
              sku: item.sku,
              description: stripHtml(item.description),
              image: item.images,
              offers: {
                "@type": "Offer",
                price: item.price?.split(" ")[0],
                priceCurrency: item.price?.split(" ")[1] || "USD",
                url: item.itemWebUrl,
                availability: "https://schema.org/InStock",
              },
            }),
          }}
        />
      </Head>

      <Header />

      <main className="container product-page">
        <div className="product-images">
          {(item.images || []).map((src) => (
            <img key={src} src={src} alt={item.title} />
          ))}
        </div>

        <div>
          <div className="product-sku">Part number: {item.sku}</div>
          <h1 className="product-title">{item.title}</h1>
          {item.price && <div className="product-price">{item.price}</div>}

          <a
            className="buy-button"
            href={item.itemWebUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            Buy on eBay
          </a>

          {specEntries.length > 0 && (
            <table className="specs-table">
              <tbody>
                {specEntries.map(([key, value]) => (
                  <tr key={key}>
                    <td>{key}</td>
                    <td>{value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          <div
            className="product-description"
            dangerouslySetInnerHTML={{ __html: item.description }}
          />
        </div>
      </main>
    </>
  );
}

function stripHtml(html = "") {
  return html.replace(/<[^>]*>/g, "");
}
