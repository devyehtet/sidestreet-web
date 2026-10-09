# Traveller services and updates

Implemented: coarse Vercel geo suggestion, manually followed destinations, browser-local read/version markers, fresh feed endpoint, destination/category service directory, reviewed email enquiry, and guarded sponsored placement rendering. No push permission prompts or third-party notification scripts are active.

## Revenue model
Fixed-period sponsored city/category cards are the initial product. Quotes and dates are agreed individually. Independent directory order is alphabetical and does not change with payment. The sponsored section is distinct. No audience, performance or “best” award claims may be invented. Enquiries are reviewed emails, not payments or automatically accepted advertisements.

## Publishing a real sponsor
After the advertiser and publisher agree copy, dates and commercial arrangements, add a record to src/content/sponsored-placements.json with: id, city (content city ID), category (service category ID), name, bestFor, description, https url, status: published, sponsorshipConfirmed: true, startsAt and endsAt (YYYY-MM-DD). All conditions are checked before rendering. Keep advertiser agreement and claims evidence in the publisher’s private records, not this public repository. Do not fill the file with fictional sponsors. Expired or draft records do not display. Sponsored external links use rel=sponsored.

## Push notifications — later setup
The user chose browser-local Follow / Updates first because no OneSignal account is available. Create a website push app with the production origin, review its current privacy/data processing terms and platform requirements, and configure its service worker before enabling it. Ask visitors to explicitly enable push after selecting destinations; subscribe only on that action. Map city choices to provider tags, provide unsubscribe controls, update privacy disclosures, and keep REST credentials server-side. Do not send sponsored campaigns using a news subscription without separate permission. Test opt-in, refusal, destination changes and unsubscribe on supported desktop/mobile platforms before launch. The current UI correctly says background push is inactive.

## Editorial update markers
Feed items use real article modification/publication dates and content fingerprints, with verified event versions. Following a city marks existing items as seen; future additions or changed content versions become unread. Reading an item or marking all read saves its current version. City preferences are browser-specific, with no account sync. No coordinates or raw IP addresses are stored by application code.
