# SEO, AEO and GEO setup

Implemented and checked on 2026-10-09. This is a technical and content-structure improvement, not proof of rankings, indexing or AI citations. No public domain or Search Console data is available yet.

## What is implemented

- Page-specific titles and descriptions across 75 public-facing routes.
- Canonical URLs, Open Graph images and Twitter cards derived from the configured public HTTPS origin.
- WebSite and Organization JSON-LD on the homepage, Article and BreadcrumbList on guides, and CollectionPage/ItemList on city and topic directories. JSON-LD is escaped before embedding.
- Article schema uses actual source URLs and the visible Sidestreet editorial organization. No invented personal author, publication date, review, rating or contact information.
- Visible update dates and dateModified only for the four guides actually revised: Bangkok temples, night markets, street food and Saigon coffee. Sitemap lastModified also uses those recorded dates, not the build date.
- Accessible guide contents and stable section anchors; existing direct answers appear early in guides without a planning summary. FAQs remain readable HTML. Bangkok planning tables and primary-source citations remain available.
- Existing city/topic links and related-guide cards help readers and crawlers discover content.
- Robots allows crawling. Without a valid public origin, pages emit noindex and omit public canonical/schema URLs; sitemap is empty. This prevents localhost placeholders from becoming publishing metadata.

## Activate when a domain is available

1. Configure NEXT_PUBLIC_SITE_URL in the hosting build environment or .env.local as the real HTTPS origin, with no path. Do not use localhost or a sample domain.
2. Configure GOOGLE_SITE_VERIFICATION with the genuine Search Console HTML verification token if using that method. Add the actual publisher name and public contact email in src/content/site.config.json.
3. Run npm run check, then deploy or rebuild. NEXT_PUBLIC_SITE_URL must be present at build time because static pages and the sitemap are generated during the build. A domain configured only after building will not update those pages.
4. Inspect the deployed HTML: robots should allow indexing, canonicals and social images should use the real origin, and JSON-LD should describe the visible page. Check /robots.txt and /sitemap.xml; the current route inventory is 75 URLs.
5. Verify ownership in Search Console and submit the actual domain's /sitemap.xml. Use URL Inspection on the homepage, a city page and a guide. Test Article/Breadcrumb markup with Google's Rich Results Test. Valid markup does not guarantee a rich result or inclusion.
6. Inspect mobile layout, image loading and real-user Core Web Vitals once traffic exists. This change does not establish field performance.

## Content and AI-search follow-up

Google's current guidance says established SEO foundations also matter for its generative-AI Search features. Clear answers, useful original content, source transparency and crawlable pages support discoverability; special GEO markup or llms.txt is not required for Google Search.

The remaining guides still need editorial fact checks, current venue details and stronger original value. Add genuinely gathered local examples, photographs, routes or observations with honest attribution. Retain image licences and independent wording. Never label desk research as a personal visit. See EDITORIAL-REVIEW.md and TIMEOUT-SOURCE-NOTES.md.

Measure Search Console impressions, clicks, queries and landing pages after launch. Inspect generative-AI reporting if available in the actual account. Compare visits with useful outcomes such as guide engagement or genuine booking enquiries; visibility alone is not revenue. Analytics and advertising require the appropriate privacy/consent setup.

## Validation completed

- npm run check: lint, 8 automated tests and production build passed.
- Local HTTP audit: all 75 routes returned 200 with a title, description and one h1; no duplicate titles, duplicate IDs or broken section anchors.
- Domain-unset preview: noindex present and no placeholder canonicals. Public-origin schema construction is covered by automated tests. End-to-end public-domain indexing and Search Console verification remain pending deployment.

## Official references

- https://developers.google.com/search/docs/fundamentals/ai-optimization-guide
- https://developers.google.com/search/docs/appearance/structured-data/article
- https://developers.google.com/search/docs/appearance/site-names
