# Direct dependency license audit

Audit date: 24 August 2026

Source: installed package metadata in `node_modules` plus declared versions in `package.json`

| Package | Installed | Declared license |
| --- | ---: | --- |
| @supabase/supabase-js | 2.112.2 | MIT |
| @tailwindcss/postcss | 4.3.3 | MIT |
| @types/node | 20.19.43 | MIT |
| @types/pg | 8.23.1 | MIT |
| @types/react | 19.2.17 | MIT |
| @types/react-dom | 19.2.3 | MIT |
| dotenv | 17.4.2 | BSD-2-Clause |
| eslint | 9.39.5 | MIT |
| eslint-config-next | 16.3.1 | MIT |
| framer-motion | 12.43.0 | MIT |
| lucide-react | 1.28.0 | ISC |
| nanoid | 3.3.18 | MIT |
| next | 16.3.1 | MIT |
| pg | 8.23.0 | MIT |
| react | 19.2.4 | MIT |
| react-dom | 19.2.4 | MIT |
| recharts | 3.10.1 | MIT |
| tailwindcss | 4.3.3 | MIT |
| typescript | 5.9.3 | Apache-2.0 |

## Limitations and transaction gate

This is a direct-dependency screening, not a complete software composition analysis. Before fundraising, sale, enterprise contracting, or a major release:

- audit every transitive dependency in `package-lock.json`;
- retain the applicable license and notice text required for distribution;
- run vulnerability and abandoned-package checks;
- review browser-delivered assets, fonts, images and generated media separately;
- record the exact production build commit and lockfile hash; and
- investigate any package with unknown, custom, copyleft, source-available or noncommercial terms before use.
