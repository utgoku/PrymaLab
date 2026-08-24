# Search Console and indexing runbook

## Current blocker

`GOOGLE_SITE_VERIFICATION` is not configured in the local environment as of 24 August 2026. The site already supports the HTML verification token through this environment variable, but Google Search Console cannot be completed without a token from the Google account that will own the property or a DNS TXT record created in the domain account.

## Ownership rule

Create the Search Console domain property under a company-controlled Google account with MFA and at least two verified owners. Do not make a contractor's personal account the sole owner.

## Verification and submission

1. Add the domain property `prymalab.com` in Google Search Console.
2. Prefer DNS TXT verification at the registrar/DNS provider. If HTML verification is used, set `GOOGLE_SITE_VERIFICATION` in Vercel Production, Preview and Development as appropriate, then redeploy.
3. Confirm the property shows `https://prymalab.com/` as reachable.
4. Submit `https://prymalab.com/sitemap.xml`.
5. Inspect and request indexing for `/`, `/about`, `/services`, `/quiz`, `/blog`, `/phuong-phap`, and the highest-value article URLs.
6. Review Page indexing, Core Web Vitals, HTTPS and structured-data reports weekly for the first 8 weeks.
7. Record the verified owners and screenshots in the data room.

## Do not do

- Do not submit fake reviews, doorway pages, spun articles, purchased backlinks or hidden keyword blocks.
- Do not repeatedly request indexing for unchanged URLs.
- Do not claim medical outcomes or credentials that cannot be verified.
- Do not mix peptide/supplement keywords into the current lifestyle-service entity.

Google indexing is not guaranteed and can take days to weeks even after a correct submission.
