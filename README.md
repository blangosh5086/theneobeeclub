# The NeoBee Club

The bilingual website for NeoBee Club and NeoBee Studio: music sessions, live experiences, photography, film and visual experiments. Next.js App Router, React, TypeScript, next-intl and a GSAP bilingual scanning hero.

## Start here

Before changing content or design, read [AGENTS.md](AGENTS.md), the [brand system](docs/maintenance/brand-system.md), the [decision register](docs/maintenance/decision-register.md) and the [update playbook](docs/maintenance/update-playbook.md). They separate owner-confirmed direction, the current visual baseline and maintenance inferences, not just coding conventions.

NeoBee is music-led and cross-cultural. Dublin is its starting point, not its limit. Individual venue requirements do not become brand-wide music restrictions, and a restrained website does not rule out intense or experimental music. Professional presentation should retain accurate personal credits without inventing scale or business achievements.

Use Node **22.18+** (Node 22 in CI) and npm:

```sh
npm ci
npm run dev
```

Reuse an existing dev server if one is running. The locale routes are `/en` and `/zh`; each has Club, Studio, Archive, About and Contact pages. Deployment remains GitHub `main` → Vercel. Do not publish ordinary local updates without a publishing request.

Optional local configuration (never commit `.env.local`):

```dotenv
NEXT_PUBLIC_SITE_URL=https://theneobee.club
NEXT_PUBLIC_GOOGLE_VERIFICATION=your_verification_value
```

## Current content model

- `src/data/site.ts`: bilingual public copy, Sessions, Experiences, founders and social links.
- `homeFeature` on a Session or Experience: its bilingual homepage title and supporting copy.
- `editorialSelection`: explicit homepage and Studio selections. Adding a record does not automatically expand the homepage or replace the feature.
- `src/app/[locale]/` and `src/components/site/`: current pages and shared components.
- `src/app/globals.css` and `src/app/[locale]/layout.tsx`: visual system and fonts.
- `public/`: stable optimized images. Add source context to `harness/content-sources.json` for new work.

Source records declare the evidence kind, public status, work scope, evidence date, source links and open review questions. The content tests check these declarations, not their truth, freshness, live link availability or publishing permission. `approved-baseline` is for existing accepted records, not a shortcut for new work. Public availability alone does not authorize a website addition or establish its Session number. See the playbook for the field definitions and explicitly authorized exceptions.

Legacy components/data remain in the repository but are not the current content editing workflow. Do not follow old `artists.ts` / `works.ts` instructions for the redesigned pages.

## Maintenance harness

Install the test browsers once after `npm ci`:

```sh
npx playwright install chromium webkit
npm run verify
npm run report
```

On Linux use `npx playwright install --with-deps chromium webkit`.

| Command | Purpose |
| --- | --- |
| `npm run check` | Bilingual content, curated references, assets, sources, lint and types |
| `npm run verify` | All checks, clean production build, browser contracts and screenshot evidence |
| `npm run test:content` | Content checks only |
| `npm run test:browser` | Clean production build and browser checks only |
| `npm run report` | Open the generated HTML report |

The browser suite covers EN/ZH routes in desktop Chromium, touch Chromium and touch WebKit; a separate 320–1920px matrix checks type roles, color tokens, reading bounds, layout and spacing. Navigation, scanning interaction, reduced motion, metadata, discovery endpoints and actual image decoding are included. These are browser simulations, not a claim of physical iPhone testing.

The runner builds a temporary copy, serves it only at `127.0.0.1:3107`, and cleans up after itself. It will not reuse an unknown server, overwrite your active `.next`, or load local `.env` files. Port 3107 must be free. Production builds may need network access for Google Fonts.

Evidence lives in ignored `artifacts/harness/`. `run.json` records the latest run status; the HTML report contains browser results, screenshots, metrics and failure traces. Previous reports move to timestamped `history/` before a new run, so an early build failure cannot leave an old green report presented as current. Remove old local evidence when no longer needed; it is never published with the site. To focus a diagnosis, use e.g. `npm run test:browser -- --project chromium-desktop --grep '1041px'`; a filtered run is not a full release check.

### What the harness does not decide

Passing tests is **not aesthetic approval**. Inspect the changed areas in both languages on desktop and mobile; explain the focal point, reading rhythm, image choice/crop and copy. Style changes need same-viewport before/after evidence and a reason grounded in the brand system.

`reviewNotes` produces non-blocking **MANUAL REVIEW** diagnostics. A green run can still have unresolved factual questions; disclose the relevant ones and verify them before changing or reusing the affected claims. The current register flags Session 003's date semantics and the promotional “Dublin's first Yunnan menu” claim. Historical plans and editorial analysis must not be relabeled as confirmed facts to pass a check.

The decision register provides scoped review questions (B01–B05, V01), not an automated brand score. Full background archives stay outside versioned files; an optional ignored `docs/design/history-reference-index.md` locates local sources. Missing originals should be disclosed, and derived maintenance notes must not become circular evidence for their own authority.

`harness/brand-contract.json` records intentional visual invariants and broad spacing ranges, not every pixel. A deliberate new design can change them with updated rationale and review. Screenshots are evidence for human review, not automatically accepted golden snapshots: [Playwright notes that rendering varies with platform and environment](https://playwright.dev/docs/test-snapshots).

The GitHub workflow runs on PRs and pushes to `main` and retains evidence for 14 days. This file alone does **not** make checks required or delay Vercel's direct-main deployment. Until repository protection/deployment gates are explicitly configured, run local verification before publishing and review the evidence before merging.

## Public channels

[Website](https://theneobee.club) · [Instagram](https://www.instagram.com/theneobeeclub) · [YouTube](https://youtube.com/@theneobeeclub) · [Email](mailto:theneobeeclub@gmail.com)
