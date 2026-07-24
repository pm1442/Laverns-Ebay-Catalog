# Parts catalog

An auto-generated, searchable product catalog synced from your eBay listings.
Every part gets its own indexable page; the "Buy on eBay" button sends buyers
to checkout on eBay.

## How it fits together

1. `scripts/sync-ebay.js` pulls your live listings from eBay's Browse API and
   writes them to `data/listings.json`.
2. `pages/parts/[sku].js` turns each entry in that file into a real, static,
   SEO-friendly page at build time.
3. `scripts/generate-sitemap.js` writes `public/sitemap.xml` so Google can
   find every page.
4. The site currently ships with 3 sample listings (your mower parts) so you
   can see it running before any eBay credentials are wired in.

## 1. Get eBay developer credentials

1. Go to https://developer.ebay.com and sign up for a developer account
   (free).
2. Create an application under **My Account -> Application Keys**. You'll
   get a Client ID and Client Secret for the **Production** environment.
3. No further OAuth setup needed -- the Browse API only needs these two
   values (client credentials grant), not a seller login flow.

## 2. Configure your environment

```
cp .env.example .env.local
```

Fill in:
- `EBAY_CLIENT_ID` / `EBAY_CLIENT_SECRET` -- from step 1
- `EBAY_SELLER_USERNAME` -- already set to `mskindustrialservices` in `.env.example`
- `SITE_URL` -- your live domain once you have one (used in the sitemap)

## 3. Pull your real listings

```
npm install
npm run sync
```

This overwrites `data/listings.json` with your actual live eBay inventory
(title, description, images, price, and specs pulled straight from eBay).

## 4. Run it locally

```
npm run dev
```

Visit http://localhost:3000 -- search should work immediately, and every
result links to a real product page.

## 5. Generate the sitemap and build for production

```
npm run sitemap
npm run build
```

## 6. Deploy

Push this to a GitHub repo and connect it to Vercel (free tier is plenty
for this scale). Add the same environment variables from `.env.local` in
Vercel's project settings.

To keep the catalog current automatically, set up a **Vercel Cron Job** (or
a GitHub Action on a schedule) that runs `npm run sync && npm run sitemap`
and redeploys -- e.g. every few hours. Ask me when you're ready to wire
this up; it's a small config file.

## 7. Once you have your logo

Send it over and I'll pull the palette and update the 5 CSS variables at
the top of `styles/globals.css` (`--color-bg`, `--color-surface`,
`--color-text`, `--color-text-muted`, `--color-accent`) plus the site name
in `components/Header.js` -- that's the entire re-theming surface.

## Notes on the SKU-matching logic

`scripts/sync-ebay.js` currently pulls a part number either from eBay's own
`sku` field (if you've set Custom SKUs on your listings) or, as a fallback,
guesses from the title. If your listings don't have Custom SKUs set on
eBay, it's worth adding them there first -- it makes this matching exact
instead of guessed, and only takes a bulk edit in eBay's Seller Hub.
