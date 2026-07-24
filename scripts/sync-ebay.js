// Run this on a schedule (cron, GitHub Action, or Vercel Cron) to keep
// data/listings.json in sync with what's actually live on eBay.
//
// Usage:  npm run sync

require("dotenv").config({ path: ".env.local" });
const fs = require("fs");
const path = require("path");
const { getAppToken, fetchAllListings, fetchItemDetail } = require("../lib/ebay");

// Pulls a part/SKU-style identifier out of the title if eBay doesn't give
// us a clean SKU. Adjust this if your listings use a consistent pattern,
// e.g. "PN12345" or a bracketed code -- tune the regex to match yours.
function extractPartNumber(item) {
  if (item.sku) return item.sku;
  const match = item.title && item.title.match(/\b[\w-]{5,}\b/);
  return match ? match[0] : item.itemId;
}

async function main() {
  console.log(`[sync] Fetching listings for ${process.env.EBAY_SELLER_USERNAME}...`);
  const summaries = await fetchAllListings();
  console.log(`[sync] Found ${summaries.length} live listings. Pulling full detail...`);

  const token = await getAppToken();
  const listings = [];

  for (const summary of summaries) {
    try {
      const detail = await fetchItemDetail(summary.itemId, token);

      listings.push({
        itemId: detail.itemId,
        sku: extractPartNumber(detail),
        title: detail.title,
        description: detail.description || "",
        price: detail.price ? `${detail.price.value} ${detail.price.currency}` : null,
        condition: detail.condition || null,
        images: [detail.image, ...(detail.additionalImages || [])]
          .filter(Boolean)
          .map((img) => img.imageUrl),
        itemWebUrl: detail.itemWebUrl,
        itemSpecifics: (detail.localizedAspects || []).reduce((acc, a) => {
          acc[a.name] = a.value;
          return acc;
        }, {}),
        lastSynced: new Date().toISOString(),
      });
    } catch (err) {
      console.warn(`[sync] Skipped ${summary.itemId}: ${err.message}`);
    }
  }

  const outPath = path.join(__dirname, "..", "data", "listings.json");
  fs.writeFileSync(outPath, JSON.stringify(listings, null, 2));
  console.log(`[sync] Wrote ${listings.length} listings to ${outPath}`);
}

main().catch((err) => {
  console.error("[sync] Failed:", err.message);
  process.exit(1);
});
