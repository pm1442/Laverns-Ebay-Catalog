require("dotenv").config({ path: ".env.local" });
const fs = require("fs");
const path = require("path");
const listings = require("../data/listings.json");

const SITE_URL = process.env.SITE_URL || "https://example.com";

function main() {
  const urls = [
    `${SITE_URL}/`,
    ...listings.map((item) => `${SITE_URL}/parts/${item.sku}`),
  ];

  const xml =
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    urls.map((url) => `  <url><loc>${url}</loc></url>`).join("\n") +
    `\n</urlset>\n`;

  const outPath = path.join(__dirname, "..", "public", "sitemap.xml");
  fs.writeFileSync(outPath, xml);
  console.log(`[sitemap] Wrote ${urls.length} URLs to ${outPath}`);
}

main();
