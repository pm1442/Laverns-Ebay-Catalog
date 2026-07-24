require("dotenv").config({ path: ".env.local" });
const fs = require("fs");
const path = require("path");
const listings = require("../data/listings.json");

function slugify(text = "") {
  return (
    text
      .toString()
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "other"
  );
}

const SITE_URL = process.env.SITE_URL || "https://example.com";

function main() {
  const brandSlugs = [...new Set(listings.map((item) => slugify(item.brand)))];

  const urls = [
    { loc: `${SITE_URL}/`, priority: "1.0" },
    { loc: `${SITE_URL}/brands`, priority: "0.9" },
    ...brandSlugs.map((slug) => ({ loc: `${SITE_URL}/brands/${slug}`, priority: "0.8" })),
    // Active items get top priority; sold items are still listed (their
    // pages still work and still carry some SEO value) but weighted lower.
    ...listings.map((item) => ({
      loc: `${SITE_URL}/parts/${item.sku}`,
      priority: item.status === "active" ? "0.7" : "0.3",
    })),
  ];

  const xml =
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    urls
      .map((u) => `  <url><loc>${u.loc}</loc><priority>${u.priority}</priority></url>`)
      .join("\n") +
    `\n</urlset>\n`;

  const outPath = path.join(__dirname, "..", "public", "sitemap.xml");
  fs.writeFileSync(outPath, xml);
  console.log(`[sitemap] Wrote ${urls.length} URLs to ${outPath}`);
}

main();
