# Sidestreet — Next.js

City guides with an editorial Home Page based on the **Home Page** screen in the Google Stitch **City Guide Media Portal** project. The original Sidestreet guides, places and credited photography are preserved.

## Run locally

Open this project folder in VS Code, then open its terminal. Use Node.js **22.13+** or **24+** (the lint tools require a current Node version).

```sh
npm install
npm run dev
```

Open http://localhost:3000. `npm run dev` is the normal command while editing.

Production preview:

```sh
npm run build
npm start
```

`npm start` serves the production build and requires `npm run build` first. `npm run preview` is an alias for production start. If port 3000 is busy, use `npm run dev -- --port 3001`.

## Structure

```text
src/app/          Next.js App Router pages, metadata and global CSS
src/components/  Header, search, footer, editorial cards and place filters
src/content/     Editable content and publisher configuration
src/lib/         Shared content helpers and city-local event dates
public/images/   Local photographs, with Wikimedia credits retained
tests/          Event expiry regression tests
```

- Home Page: `src/app/page.jsx`
- Colours, typography and responsive layout: `src/app/globals.css`
- Cities, articles, events, places and image credits: `src/content/content.json`
- Site name, actual domain and publisher contact details: `src/content/site.config.json`
- Photos: `public/images/`

No HTML generator, separate backend, CDN Tailwind runtime or Live Server extension is needed. Fonts are bundled locally. There are no generation badges, demo ticket products, newsletter success simulations, or Next.js development indicators in the page.

## Checks

```sh
npm run lint
npm test
npm run build
npm run check
```

`npm run check` runs all three checks. The tests cover city-local expiry dates and exclusion of sample events.

## Deployment

Deploy as a Node.js Next.js application (for example on a Next.js-compatible host). This project is not a `public_html` static HTML upload: city calendars render at request time so ended events are removed using each city's local date.

Set the actual public origin in `src/content/site.config.json` (`siteUrl`), or copy `.env.example` to `.env.local` and set `NEXT_PUBLIC_SITE_URL`. Without an origin, the sitemap intentionally has no domain entries; no made-up domain is published. Fill publisher details before launch.

Existing `.html` paths redirect to the matching Next.js routes. All 16 city guides, 44 articles, 109 places and 110 image credits are retained.

The Home Page adopts the Stitch layout and visual style with Sidestreet branding and existing content; it does not reproduce fictional survey counts or Time Out's ownership claims. Advertising and newsletter services are not enabled. The privacy page describes this version's actual behaviour.

Keep the attribution and licence information when changing photographs. Content prices, hours and dates remain subject to editorial verification; migration does not re-verify the travel facts.

## AdSense preparation

Run `npm run adsense:check` to see missing launch configuration. See [AdSense setup](docs/ADSENSE-SETUP.md) and [editorial review inventory](docs/EDITORIAL-REVIEW.md). Domain, publisher details, AdSense ID, live consent setup and actual editorial review remain pending. No advertising scripts run with the default settings.
