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

## Optional Reach audience preferences

The homepage Reach slot displays ads directly without an inline preference prompt. Unknown gender/age visitors can receive device-specific campaigns; gender and age remain unknown unless voluntarily supplied through the global Ad preferences control. The slot supports an optional first-party audience preference flow. Visitors can keep general ads, or actively confirm that they are 18+ and agree to sharing a coarse gender/age cohort. Agreement boxes start unchecked. The global **Ad preferences** button allows editing or withdrawal on any page. This flow is separate from Google Analytics consent and does not enable AdSense.

`/api/ad-preferences` is a dynamic, non-cacheable same-origin API. GET does not create a cookie for a new visitor. POST validates an explicit agreement, adult confirmation, current notice version and supported cohorts, then sets a signed `__Host-` cookie with Secure, HttpOnly, SameSite=Lax and a 30-day lifetime. No names, email addresses, birth dates or visitor IDs are saved. GET issues a fresh signed Reach token lasting at most five minutes, bound to the configured publisher. Tokens have only cohort fields and an expiry; no cross-site visitor identifier. Browser cookies can apply to another person using the same shared browser.

DELETE replaces the demographic preference with a minimal general-ads choice, removes the targeted iframe and notifies other open tabs using BroadcastChannel where supported. It does not delete historical aggregate ad counts. Previously copied short tokens can remain valid for up to five minutes; no central per-visitor profile or revocation database is maintained. Clearing site cookies also clears the preference. A failed or unavailable preference API uses general ads.

Configure `REACH_PUBLISHER_ID`, `REACH_PUBLISHER_SIGNING_KEY` and `REACH_CONSENT_COOKIE_SECRET` only as server-side Vercel environment variables. The publisher signing key belongs to Sidestreet’s Reach publisher record. Use a separate random 32+ character consent-cookie secret. These keys are never sent as component props or browser variables. The public server and slot IDs use the existing `NEXT_PUBLIC_REACH_AD_SERVER` and `NEXT_PUBLIC_REACH_PLACEMENT_ID` values.

Private preference cookies and signed cohort tokens must not be put in shared caches or logs. Request-level hosting logs may still process request metadata as described in the privacy policy. This preference flow offers consented ad selection; it is not a Google-certified consent management platform or a claim of legal compliance in every jurisdiction.

### Country targeting and additional Sidestreet slots

Campaign create/edit now supports All countries or an ISO alpha-2 country. Only the Vercel entry point enables trusted `x-vercel-ip-country` detection; standalone/local servers ignore that header by default, and URL country parameters are never used. This is approximate public-IP geography, not nationality or GPS. Invalid/unknown geography can match only worldwide campaigns. Country conditions combine with device and any verified consented demographic condition. Matching rank weights gender/age at 2 each and country/device at 1 each, then rotates fairly; normal schedule/budget checks still apply. No visitor-country profile database was added.

Initial country campaigns cover Thailand, Myanmar, Singapore, Malaysia, United States and United Kingdom, with worldwide fallback. Other countries can be selected in the campaign form. Country is visible on the delivered caption and campaign list/detail/review/CSV. Sample art is reused, with country labels overlaid.

Sidestreet now has nine named positions: four homepage slots, two guide article slots, two city-guide slots and one topic-listing slot. Eight new placement IDs each have independent copies of the existing active campaigns (including country/device/consented cohort variants); budgets/accounting are independent per copy and no payment is collected. The authenticated POST `/api/placements/:id/copy-campaigns` accepts `sourcePlacementId`, requires the same publisher and dimensions, copies active unended campaigns with fresh accounting, and skips matching copies. It does not synchronize future edits. Change/pause each placement or campaign independently in the dashboard. The public slot mapping is in Sidestreet `src/content/reach-placements.json`. Ads load lazily and retain reserved space; impressions require a loaded, at-least-half-visible creative for one second.

### Current-page contextual ads

Campaigns support General, Restaurant, Hotel and Travel categories. Publisher tags can send `context=food`, `context=travel` or `context=hotels` (JavaScript tag: `data-context="food"`). General/unknown/unsupported context can use only General campaigns. Food allows Restaurant campaigns; Travel allows Hotel and Travel campaigns; Hotels allows Hotel campaigns. Relevant categories outrank General fallback, while every country/device/consented gender/age condition, schedule, enabled placement and budget check must still pass. Equal matches rotate fairly, so equally targeted Hotel and Travel campaigns both serve on Travel pages. Country/device specificity applies within the relevant category pool. Invalid context never becomes an inferred visitor interest.

Sidestreet sends the CMS story category from both guide slots and the topic ID from its topic slot; it does not classify visitors or send their browsing history. Mixed homepage, city, news, culture and unknown pages use General context. No member account, demographic preference, new tracking cookie or audience profile is needed for current-page contextual selection.

Distinct Restaurant, Hotel and Travel typographic sample cards are in `examples/`. They are demonstration campaigns linking to Sidestreet’s Food, Hotels and Travel topic pages, not paid business bookings. Replace them with advertiser art and destinations for commercial campaigns. Campaign category is editable in the dashboard and included in campaign filtering, review, details and CSV.

### Optional first-party audience learning

Reach now has a publisher-authenticated `/audience/profile` service. Publisher server requests are HMAC-signed over timestamp, nonce and canonical JSON, expire after 60 seconds and reject nonce replay. No public browser endpoint accepts unsigned labels or arbitrary IDs. Sidestreet’s same-origin `/api/audience-profile` stores a signed Secure/HttpOnly/SameSite=Lax first-party random-ID cookie only after explicit adult learning agreement. Training consent and self-declared labels are separately optional. No account or paid data provider is used.

Only the coarse Food, Travel, Hotels, Music and Things-to-do categories of known editorial routes are collected. No full URLs, search terms, email, name, exact birth date or IP are stored in this dataset. Reach stores a publisher-scoped hash, fixed 30-day expiry, optional training labels, and at most 200 deduplicated category events per browser profile. Profiles are not shared across publishers. Expiry cleanup runs on audience-service requests/admin summary/training; this is lazy cleanup rather than a scheduled purge. Clearing cookies prevents future association but retained data may remain until expiry cleanup if the old browser reference is lost. Hosting logs still process normal request metadata.

Interests require at least two views and a 20% category share. With no validated active demographic model, Gender/Age remain Unknown. A deterministic multinomial Naive Bayes baseline uses normalized category counts; its softmax output is a model score, not a calibrated probability or verified identity. Gender and age models are evaluated independently on stable SHA-256 browser-profile splits (80% training/20% held-out). Each dimension needs 200 eligible labelled profiles with five views each, at least 30 training and 10 validation profiles per class, held-out balanced accuracy >=70%, coverage >=20%, and >=10 accepted held-out predictions per class at >=80% precision using a score threshold of 0.85. These engineering gates do not guarantee real-world accuracy, fair performance, unique humans or absence of poisoning; labels are self-declared and shared/reset browsers limit evaluation. Synthetic test fixtures exercise mechanics only and are never production data or accuracy evidence.

Dashboard **Audiences** shows aggregated counts and validation reports. **Train & validate** does not activate a model. **Activate validated estimates** is blocked unless at least one dimension passes. Unknown dimensions remain Unknown. A small/weak dataset cannot be manually forced into demographic prediction. Optional training data is collected only with separate agreement; without labels no demographic model can be learned. Current-category targeting takes precedence over signed learned interests; learned interests may select category campaigns on mixed/unknown pages if such campaigns exist on the placement. Existing self-declared ad choices take precedence over learned tokens.

Withdrawal deletes this profile’s events/labels and invalidates models containing withdrawn training data. The model may contain aggregate parameters until replaced by retraining but cannot serve new estimates while invalidated. A network failure stops collection locally and saves a signed pending-deletion cookie, retried on the next preference read. Existing copied learning cohort tokens can remain valid for at most one minute. Ad preferences withdrawal also requests audience-learning withdrawal. No automatic periodic ad refresh was added.
