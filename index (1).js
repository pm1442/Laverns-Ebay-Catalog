import Head from "next/head";
import Header from "../components/Header";

export default function About() {
  return (
    <>
      <Head>
        <title>About Us | MSK Industrial Services LLC</title>
        <meta
          name="description"
          content="MSK Industrial Services is a family-owned industrial surplus supplier with over 30 years of combined industry experience."
        />
      </Head>

      <Header />

      <main className="container about-page">
        <h1 className="section-label" style={{ marginTop: 32 }}>About Us</h1>

        <p>
          MSK Industrial Services is a family-owned industrial surplus supplier with
          over 30 years of combined industry experience. We specialize in industrial
          surplus, automation components, electrical controls, hydraulic equipment,
          machinery parts, warehouse equipment, and hard-to-find replacement parts
          from leading manufacturers.
        </p>

        <p>
          Our team personally sources inventory through facility upgrades, plant
          closures, and machine dismantling projects. Because we handle much of the
          removal process ourselves, we have firsthand knowledge of the equipment
          and components we sell.
        </p>

        <p>
          Our items are visually inspected and static tested by our team prior to
          listing. We take pride in doing quality work, standing behind what we
          sell, and providing accurate listings, responsive customer service,
          competitive pricing, and fast shipping.
        </p>

        <p className="about-tagline">
          Quality Industrial Surplus. Trusted Experience. We Stand Behind What We Sell.
        </p>

        <dl className="about-meta">
          <div>
            <dt>Location</dt>
            <dd>United States</dd>
          </div>
          <div>
            <dt>On eBay since</dt>
            <dd>February 2023</dd>
          </div>
        </dl>
      </main>
    </>
  );
}
