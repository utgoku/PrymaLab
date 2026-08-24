# IP and asset register

This register must be updated when an asset, account, contributor, license, or owner changes.

| Asset | Current location/controller | Intended legal owner | Evidence required | Transfer status |
| --- | --- | --- | --- | --- |
| Source code and Git history | GitHub repository `utgoku/PrymaLab` | Project legal entity when formed | Git history, repository export, founder assignment | Assignment pending |
| Production deployment | Vercel project `prymalab` | Project legal entity | team ownership, invoices, member list, environment export | Team transfer pending |
| Database and CRM | Supabase project | Project legal entity | organization ownership, schema export, backup, member list | Verify |
| Domain `prymalab.com` | Current registrar account | Project legal entity | invoice, RDAP/WHOIS, registrant record, auth controls | Transfer after counsel advice |
| Brand word `PrymaLab` | Used on website | Unclear pending clearance | professional search and filing records | **HOLD** |
| Logo and icon | Code-native assets in repository | Project legal entity | design history and creator assignment | Founder assignment pending |
| Website copy and articles | Repository | Project legal entity | author records, source list, originality confirmation | Founder/editor assignments pending |
| Raster images and OG assets | `public/` | Project legal entity or licensed use | source, prompt/creator, invoice, license, edit history | Audit required |
| Customer/lead/order data | Supabase | Data controller identified in privacy notice | processing register, consent records, retention schedule | Controller not formalized |
| Bank payment instructions | Operational configuration | Contracting legal entity | bank ownership and merchant/accounting records | Personal account currently creates transfer risk |
| Analytics/Search Console | Provider accounts | Project legal entity | company email ownership, member list | Verify |
| Social handles and email | Provider accounts | Project legal entity | recovery methods, MFA, transfer procedure | Inventory required |

## Rules

- No asset is considered exit-ready without a named owner and documentary evidence.
- Founder and contractor work must be assigned in writing; payment alone is insufficient.
- Do not place company-critical accounts under a contractor's personal email.
- Keep originals, invoices, model prompts, source URLs and license snapshots for every media asset.
- Third-party code remains under its own license and must be included in a dependency/license inventory.
- Secrets, private keys and customer data are never stored in this register.
