# AdSense preparation and launch

The site is prepared for verification; it is not submitted or approved. Google advertising is disabled. Production GA4 is consent-based; no Analytics script loads before acceptance. Missing publisher details are deliberately not invented.

## 1. Publisher and content preparation

- Select the actual publisher name and a public email you can answer. Put them in `src/content/site.config.json` as `publisherName` and `contactEmail`. Set `contactEmailReady` true only after verifying real mailbox delivery. The current requested admin address is not active. A public business address is optional; do not publish your private home address just for this setup.
- Review every guide for originality, facts and photograph permissions. Use `docs/EDITORIAL-REVIEW.md`. Existing text was migrated, not independently fact-checked. A reference or licence link alone is not proof that all obligations have been met.
- Record `editorialReviewedAt` as the date the review actually occurred (YYYY-MM-DD), and set `editorialReviewComplete` only after the entire current collection has been reviewed. Do not use this flag as a substitute for reviewing content. A global date is shown on guides only after this recorded review.
- Run `npm run check` and `npm run adsense:check`. Pending items are expected at this stage. `npm run adsense:check -- --strict` exits unsuccessfully while required configuration remains incomplete.

## 2. Hosting and domain configuration

Deploy with a Next.js-compatible Node host. Copy `.env.example` to `.env.local` for local launch tests, or configure the variables in the hosting dashboard:

- `NEXT_PUBLIC_SITE_URL`: your actual HTTPS origin, without a subpath.
- `ADSENSE_CLIENT`: your account's actual `ca-pub-` ID, followed by 16 digits.
- `GOOGLE_SITE_VERIFICATION`: optional URL-prefix verification token. The current Domain property is verified via DNS; keep its TXT record.
- `NEXT_PUBLIC_GA_MEASUREMENT_ID`: production GA4 measurement ID. Production currently uses G-9G33152W7G with reader consent.

The same values can be entered as `siteUrl`, `adsenseClient` and `googleSiteVerification` in the JSON configuration. Environment values take precedence. Rebuild and redeploy after changing them.

The site adds the AdSense verification meta tag to the head and serves `/ads.txt` with your real publisher ID. Without an ID, `/ads.txt` returns 404 rather than advertising a fake seller. Verification metadata does not enable advertising. Select the meta-tag verification method in the AdSense account when available. Compare the actual ads.txt line against the line supplied by your account.

Confirm your public pages, `/privacy`, `/contact`, `/editorial-policy`, `/credits`, `/robots.txt`, `/sitemap.xml` and `/ads.txt` load without a password. The sitemap and canonical URLs appear only after a valid public origin is configured. Check the public site's HTTPS, mobile navigation and crawl access. Search Console is useful for crawl diagnostics; indexing is not an approval guarantee.

## 3. Request review in AdSense

Add the actual domain in your own AdSense account, verify it using the published meta tag, and request review. Complete account, payment and identity requirements directly in Google when requested. No application has been submitted by this project.

## 4. Before showing ads

Keep `adsenseEnabled` false while preparing and applying. Configure and publish consent messages in AdSense Privacy & messaging (Google CMP), or implement an appropriate Google-certified CMP. Select the applicable regional messages and list the actual vendors; check reject, accept and preference controls on the live site. A custom decorative cookie banner is not a certified CMP.

The project includes an optional Google advertising loader. Only after approval and a verified consent setup, set `consentConfigured` and `adsenseEnabled` to true, and configure Auto ads in your account. These switches are an operator's attestation; they do not configure or certify consent themselves. The loader also requires a valid publisher ID and public HTTPS origin and only runs on that exact origin. It is restricted to the known home, city, guide, topic and calendar content routes; it is excluded from information/policy pages, directory pages and unknown/404 routes. Add vendor-specific disclosures to the privacy page if you use additional services; configure those vendors in the consent platform too.

Review the privacy policy with the actual hosting and email provider once selected, including applicable retention and contact details. Remove unused planned-service text if you decide not to use advertising.

## Official references

- [Connect a site and verification methods](https://support.google.com/adsense/answer/7584263?hl=en-GB)
- [Site content and navigation](https://support.google.com/adsense/answer/7299563?hl=en-GB)
- [Privacy disclosures](https://support.google.com/adsense/answer/1348695?hl=en)
- [Certified CMP requirements](https://support.google.com/adsense/answer/13554116?hl=en)
- [ads.txt guide](https://support.google.com/adsense/answer/12171612)

Google decides approval after reviewing the live site. Passing a build or this local readiness check does not establish approval or content originality.

## Current preparation record

See `docs/PRELAUNCH-REVIEW.md` for actual work, crawl evidence and remaining blockers. `npm run prelaunch:check` checks preparation before an AdSense ID exists. Do not interpret a successful script exit as Google approval: pending review and mailbox items are printed separately.
