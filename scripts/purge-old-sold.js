// Optional: hard-deletes sold listings older than the retention window.
// Not run automatically -- call it manually (or on a much longer schedule,
// like monthly) if your sold-item backlog grows too large. Most stores
// never need this; sold pages are cheap to keep.
//
// Usage:  npm run purge          (default: 180 days)
//         npm run purge -- 365   (custom day count)

const fs = require("fs");
const path = require("path");

const DATA_PATH = path.join(__dirname, "..", "data", "listings.json");
const retentionDays = Number(process.argv[2]) || 180;
const cutoff = Date.now() - retentionDays * 24 * 60 * 60 * 1000;

const listings = JSON.parse(fs.readFileSync(DATA_PATH, "utf8"));

const kept = listings.filter((item) => {
  if (item.status !== "sold" || !item.soldAt) return true;
  return new Date(item.soldAt).getTime() > cutoff;
});

const removed = listings.length - kept.length;
fs.writeFileSync(DATA_PATH, JSON.stringify(kept, null, 2));
console.log(
  `[purge] Removed ${removed} sold listings older than ${retentionDays} days. ${kept.length} remain.`
);
