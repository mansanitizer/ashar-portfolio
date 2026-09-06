# Portfolio rebuild

The portfolio is now an independent multi-page site with its own styles and
interaction code. It does not load the old homepage JavaScript or CSS.

## Design

Cobalt accents, oversized typography, a narrow navigation rail, larger work
previews, and an editorial layout. Light/dark appearance, accent selection,
high contrast, native dialogs, focus return, and reduced motion are supported.
The existing random seed `35456546222620412887` generates the radial hero mark.
Emil Kowalski's `emil-design-eng` skill informed the interaction design.

## Content and routes

- Homepage: six Fabits projects, outcomes, biography, full toolkit, three
  certifications, video introduction, CV, and contact details.
- `/playground.html`: seven searchable/filterable independent projects.
- `/projects/<project>.html`: seven project pages with original write-ups,
  media, external links, and expandable presentation slides.
- `/projects/work-<id>.html`: six readable Fabits case studies.
- The game is omitted from the new navigation. Its old route is retained.

`src/content/work.js` preserves the existing case studies.
`src/content/project-details.json` preserves the original project articles and
slides. `src/content/projects.js` supplies project metadata.
`scripts/generate-site.mjs` generates the HTML; edit that source rather than the
generated files. Run `npm run generate` after changes, or `npm run build`, which
regenerates automatically. CSS and interactions live in `src/site.css` and
`src/site.js`.

## Contact and analytics

The form uses the existing API client's `/api/contact` endpoint and documented
payload. Success requires `{ "success": true }`; errors leave the user's input
in place and show the email fallback. Tests mock this endpoint: delivery to the
live backend has not been tested. Existing `VITE_API_BASE_URL`, `VITE_API_KEY`,
`VITE_POSTHOG_KEY`, and `VITE_POSTHOG_HOST` configuration remains supported.
Analytics respects the stored opt-out preference.

## Local use

`npm ci`, then `npm run dev`. Production: `npm run build` and `npm run preview`.
Changes have not been deployed to ashar.site.

## Verification

`npm run build` and all five Playwright tests pass. Run `npm run test:e2e`
after building (install Chromium with `npx playwright install chromium`, or
set `CHROME_PATH` to an existing Chrome executable). The suite covers project
search, certificate keyboard navigation and focus return, contact validation
and mocked delivery outcomes, saved preferences, four viewport widths, and all
13 detail pages.
