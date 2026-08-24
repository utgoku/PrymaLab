# Security policy

## Reporting

Report suspected vulnerabilities privately to the operational email configured for the production project. Do not open a public issue containing credentials, personal data, exploit steps, or customer records.

## Minimum production controls

- All secrets live in the deployment provider's encrypted environment store; never in Git, screenshots, chat logs, or documentation.
- Admin access must use a unique password of at least 20 random characters. The previously shared password must be considered compromised and rotated.
- `PRYMALAB_ADMIN_SESSION_SECRET` must be at least 32 random bytes and different from the admin password.
- Supabase service-role keys must never be exposed to browser code or variables prefixed `NEXT_PUBLIC_`.
- Require MFA on the domain registrar, GitHub, Vercel, Supabase, email, analytics, and Search Console.
- Use company-controlled recovery email addresses and at least two authorized administrators.
- Review access quarterly and immediately after a contractor or employee leaves.
- Back up the database and test restoration at least quarterly.

## Incident priorities

1. Revoke or rotate exposed credentials.
2. Preserve relevant logs and deployment records.
3. Contain affected accounts and customer workflows.
4. Assess personal-data impact and applicable notification duties.
5. Document the cause, corrective actions, owner, and completion date.
