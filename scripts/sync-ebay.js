// Run this on a schedule (cron, GitHub Action, or Vercel Cron) to keep
// data/listings.json in sync with what's actually live on eBay.
//
// Sold items are NOT deleted -- their SEO/backlink value is worth keeping.
// If a previously-active item is no longer in the live eBay results, it's
// marked status: "sold" (with a soldAt timestamp) instead of being removed.
// Its page stays live, shows "Sold", and links to the matching category
// page. Only run `npm run purge` (see below) if you want to hard-delete
// old sold items after a long retention window.
//
// Usage:  npm run sync

require("dotenv").config({ path: ".env.local" });
const fs = require("fs");
const path = require("path");
const { getAppToken, fetchAllListings, fetchItemDetail } = require("../lib/ebay");

const DATA_PATH = path.join(__dirname, "..", "data", "listings.json");

// Pulls a part/SKU-style identifier out of the title if eBay doesn't give
// us a clean SKU. Adjust this if your listings use a consistent pattern --
// tune the regex to match yours, or better, set Custom SKUs in eBay.
function extractPartNumber(item) {
  if (item.sku) return item.sku;
  const match = item.title && item.title.match(/\b[\w-]{5,}\b/);
  return match ? match[0] : item.itemId;
}

function extractBrand(detail) {
  const aspect = (detail.localizedAspects || []).find(
    (a) => a.name && a.name.toLowerCase() === "brand"
  );
  if (aspect) return aspect.value;
  // Fallback: first word of the title, better than nothing for grouping.
  return (detail.title || "").split(" ")[0] || "Other";
}

async function main() {
  const existing = fs.existsSync(DATA_PATH)
    ? JSON.parse(fs.readFileSync(DATA_PATH, "utf8"))
    : [];
  const existingById = new Map(existing.map((item) => [item.itemId, item]));

  console.log(`[sync] Fetching listings for ${process.env.EBAY_SELLER_USERNAME}...`);
  const summaries = await fetchAllListings();
  console.log(`[sync] Found ${summaries.length} live listings. Pulling full detail...`);

  const token = await getAppToken();
  const liveIds = new Set();
  const listings = [];

  for (const summary of summaries) {
    try {
      const detail = await fetchItemDetail(summary.itemId, token);
      liveIds.add(detail.itemId);

      listings.push({
        itemId: detail.itemId,
        sku: extractPartNumber(detail),
        brand: extractBrand(detail),
        status: "active",
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

  // Anything that was active before but isn't live now: soft-retire it.
  // Keep everything about the page as-is, just flip status and stamp when.
  let retiredCount = 0;
  for (const old of existing) {
    if (!liveIds.has(old.itemId) && old.status !== "sold") {
      listings.push({
        ...old,
        status: "sold",
        soldAt: new Date().toISOString(),
      });
      retiredCount++;
    } else if (!liveIds.has(old.itemId) && old.status === "sold") {
      // Already retired from a previous run -- carry it forward unchanged.
      listings.push(old);
    }
  }

  fs.writeFileSync(DATA_PATH, JSON.stringify(listings, null, 2));
  console.log(
    `[sync] Wrote ${listings.length} listings (${liveIds.size} active, ${retiredCount} newly retired) to ${DATA_PATH}`
  );
}

main().catch((err) => {
  console.error("[sync] Failed:", err.message);
  process.exit(1);
});
