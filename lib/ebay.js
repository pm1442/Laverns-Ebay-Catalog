// Talks to eBay's Browse API using an app-level (client credentials) token.
// No seller login/OAuth-refresh needed -- this reads whatever is publicly
// live under your seller username, which is enough to build the catalog.

const ENV = process.env.EBAY_ENVIRONMENT === "sandbox" ? "sandbox" : "production";

const HOSTS = {
  production: "api.ebay.com",
  sandbox: "api.sandbox.ebay.com",
};

const HOST = HOSTS[ENV];

async function getAppToken() {
  const clientId = process.env.EBAY_CLIENT_ID;
  const clientSecret = process.env.EBAY_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error(
      "Missing EBAY_CLIENT_ID / EBAY_CLIENT_SECRET. Copy .env.example to .env.local and fill them in."
    );
  }

  const basicAuth = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");

  const res = await fetch(`https://${HOST}/identity/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${basicAuth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "client_credentials",
      scope: "https://api.ebay.com/oauth/api_scope",
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`eBay token request failed (${res.status}): ${text}`);
  }

  const data = await res.json();
  return data.access_token;
}

// Pulls every item currently live under the configured seller username.
// Browse API caps each page at 200 results, so we page through with offset.
async function fetchAllListings() {
  const seller = process.env.EBAY_SELLER_USERNAME;
  if (!seller) {
    throw new Error("Missing EBAY_SELLER_USERNAME in your .env.local file.");
  }

  const token = await getAppToken();
  const items = [];
  let offset = 0;
  const limit = 200;

  while (true) {
    const url =
      `https://${HOST}/buy/browse/v1/item_summary/search` +
      `?filter=${encodeURIComponent(`sellers:{${seller}}`)}` +
      `&limit=${limit}&offset=${offset}`;

    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        "X-EBAY-C-MARKETPLACE-ID": "EBAY_US",
      },
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`eBay search failed (${res.status}): ${text}`);
    }

    const data = await res.json();
    const batch = data.itemSummaries || [];
    items.push(...batch);

    if (batch.length < limit) break;
    offset += limit;
  }

  return items;
}

// Fetches full detail (full description, all images, item specifics) for
// one item. Called per-item after the summary search, since item_summary
// results are deliberately thin.
async function fetchItemDetail(itemId, token) {
  const res = await fetch(`https://${HOST}/buy/browse/v1/item/${itemId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "X-EBAY-C-MARKETPLACE-ID": "EBAY_US",
    },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`eBay getItem failed for ${itemId} (${res.status}): ${text}`);
  }

  return res.json();
}

module.exports = { getAppToken, fetchAllListings, fetchItemDetail };
