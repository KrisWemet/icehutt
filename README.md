# The Ice Hut — Website Redesign 🍦

A modern, animation-rich redesign concept for [The Ice Hut](https://morinvilleicehut.ca), Morinville's family-owned ice cream shop since 1995.

## What's inside

**Seven pages**, each targeting its own search intent, sharing one stylesheet and script (zero build step, zero framework — plain static files, drop on any host):

| Page | Targets |
|---|---|
| `index.html` | Home — "Ice Hut", "Ice Hut Morinville", brand searches |
| `flavours.html` | "ice cream flavours Morinville" — all 75+ real flavours, A–Z |
| `menu.html` | "Ice Hut menu", "ice cream prices Morinville" |
| `story.html` | "Ice Hut history", brand/about queries |
| `reviews.html` | "Ice Hut reviews", "best ice cream Morinville" |
| `visit.html` | "Ice Hut hours", "ice cream near Morinville", directions |
| `faq.html` | long-tail questions ("does the ice hut have gluten free") |

Previously this was a single page; splitting it out means each topic can rank on its own instead of all competing for the same slot, and each has its own title, meta description, and structured data.

- **`styles.css`** / **`script.js`** — shared across every page (cached once, loaded everywhere).
- **`images/`** — AI-generated food photography (see *Automations* below), driven by `images/prompts.json`.
- **`robots.txt`** / **`sitemap.xml`** — search engine crawling support.
- **`llms.txt`** — an [llms.txt](https://llmstxt.org/) summary so AI assistants (ChatGPT, Claude, Perplexity, Google AI Overviews) can answer questions about the shop accurately.
- **`og-image.png`** — social sharing preview image (Facebook, iMessage, etc.).
- **`manifest.webmanifest`** + **`images/icon-*.png`** — installable-app icons generated from the shop's real logo (`images/logo.png`), dark chocolate background, neon-sign look.
- **`images/real-fb-cones.jpg`** — a genuine photo from the shop's own Facebook page (see `social-photos/` for provenance).

## Automations 🤖

- **AI image pipeline** (`.github/workflows/generate-images.yml`): edit a prompt in `images/prompts.json`, push, and GitHub Actions regenerates that photography using the free [Pollinations.ai](https://pollinations.ai) Flux API and commits the results back — no design tools or paid APIs needed. Every photo has a built-in fallback: if an image is missing, the site swaps in its hand-drawn SVG illustration automatically.
- **Auto-deploy** (`.github/workflows/deploy.yml`): every push to `main` publishes the site to GitHub Pages.
- **Weekly health check** (`.github/workflows/link-check.yml`): validates the HTML and checks for broken links every Monday.
- **Flavour of the Week**: the spotlight banner rotates through the flavour list automatically every Monday — zero maintenance, and it skips any flavour currently marked out of stock.
- **Live hours**: the "Open now / Opens at…" pill and highlighted hours row compute themselves in Edmonton time.

## Staff flavour board 🍨

`admin.html` is a password-protected page where staff mark each flavour **In stock**, **Getting low**, or **Out of stock** from their phone. The website reflects the change within seconds — out-of-stock flavours get greyed out and badged, low ones get an amber "Almost out" tag. No redeploy involved.

- **Setup:** see **[ADMIN-SETUP.md](ADMIN-SETUP.md)** — ~10 minutes in the Firebase console, free tier, no credit card.
- **Where the data lives:** `flavours.html` remains the source of truth for names and descriptions; Firestore stores only a small map of *flavour → status*. That means one tiny request per visitor, no SDK on public pages, and if the database is ever unreachable the site renders exactly as it did before the feature existed.
- **Adding a flavour:** edit `flavours.html`, then run `python3 scripts/build-flavour-data.py` to refresh `flavours-data.json` and assign internal ids.

## Highlights

**Motion & delight**
- Animated sprinkle particle field in the hero (canvas, pauses off-screen)
- Hero photo in a slow-morphing blob frame with a Ken Burns zoom and cursor-driven 3D tilt
- Scroll-triggered staggered reveals, animated stat counters, 3D-tilt flavour cards
- A calm, static "facts strip" (75+ flavours, family-owned since 1995, etc.) — no infinite auto-scrolling ticker demanding attention it hasn't earned
- Marshmallow-soft hover states everywhere
- Fully respects `prefers-reduced-motion`

**Smart touches**
- Live **"Open now / Opens at…"** pill computed in America/Edmonton time, with today's row highlighted in the hours table
- "Summers of scooping" counter updates itself every year automatically

**SEO & AEO (answer-engine optimization)**
- A single linked JSON-LD `@graph`: `IceCreamShop`, a full `Menu` (every size/price/topping/drink as `MenuItem` + `Offer`, ready for Google's menu rich results), `FAQPage` (10 questions, every one mirrored in visible on-page text — schema.org guidelines require the match), `WebPage` with `SpeakableSpecification` for voice assistants, and `WebSite`
- No fabricated `AggregateRating`: searched multiple sources for a real, citable star rating and found none, so none was added — fake review schema is a Google policy violation and actively misleading
- Full Open Graph + Twitter Card metadata (with image alt text), canonical URL, geo meta tags, PWA manifest, real app icons
- `llms.txt` expanded with the full menu and a Q&A block for AI assistants (ChatGPT, Perplexity, Google AI Overviews, Claude)
- Embedded Google Maps iframe in the Visit section (real map, not just a link) for local-SEO trust signals
- Accessible: skip link, focus states, aria labels, keyboard-friendly accordions

## ✅ Fact-checked against the original site

Hours (seasonal May–September schedule), address, phone, menu items and prices, flavour names, and the "Cold Treats & Other Eats" tagline were all verified against morinvilleicehut.ca (captured in `site-reference/`). Review snippets come from real public customer reviews.

**Discrepancies found on the original site worth telling the owner about:**
- `www.morinvilleicehut.ca` has an invalid TLS certificate (browsers warn on the `www` address; the bare domain is fine)
- The homepage says "since 1995" but the About page says "since 1997"
- The Menu page footer shows phone (780) 819-9726 while every other page shows (780) 974-9944 (this redesign uses 974-9944)

## 🎨 Design quality pass

Run through [Impeccable](https://github.com/pbakaus/impeccable), a deterministic detector for common "AI-generated UI" tells (`npx impeccable detect index.html`). Fixed everything it flagged:

- **Contrast**: darkened the accent pink (`--pink-deep`) and switched button/badge text so every text/background pairing clears WCAG AA (4.5:1), including the CTA banner gradient and the spinning "since 1995" badge
- **No gradient-clipped text**: the hero's "Bigger smiles." is a solid color with a hand-drawn wavy underline instead of a scrolling rainbow gradient
- **No infinite marquee**: replaced the auto-scrolling fact ticker with a calm, static, wrapping row
- **Removed the card side-stripe** (the "most recognizable AI-UI tell," per the tool) from flavour cards — the photo already carries the flavour's identity
- **Deliberate palette**: swapped the reflexive warm-beige page background for a pale mint tone that's clearly a considered choice, not a default
- **Fixed**: a layout-thrashing padding transition on scroll, undersized 10px badge text, sections with no horizontal inset on small viewports, a skipped heading level in the footer, and body-level overflow clipping that could have hidden fixed-position UI
- **Cut em-dash overuse** in the copy from 22 instances to 4 (kept only in review attributions)
- **Kept intentionally**: the pulsing "Open now" status dot — the tool's own rule carves out an exception for indicators tied to genuinely live data, and ours recomputes from the real clock every 60 seconds

Also removed the WebGL "3D Cone Lab" per request — along with the vendored Three.js bundle (~740KB) it shipped with.

## 📸 Real photo sourcing

Pulled candidate photos from the shop's public Facebook page, Google Maps, and image search (`.github/workflows/fetch-social-photos.yml`, runs on GitHub's servers since Facebook/Google are unreachable from this sandbox). Google Maps required sign-in and returned nothing; image search returned unrelated businesses named "Ice Hut" elsewhere. Exactly one genuine, on-brand, usable photo turned up: the shop's own Facebook profile picture (5 pastel scoops in cones), now on the site as `images/real-fb-cones.jpg` with a caption crediting the source. Everything else photographic on the site remains AI-generated (see the image pipeline above) since no other real photos of the actual food, storefront, or staff were publicly available to pull from.

## 🔍 Multi-page SEO architecture

Split the single-page site into seven, each independently optimized:

- **Unique title, meta description, and canonical URL per page**, each targeting a distinct real search query (see table above) instead of every page fighting for the same one
- **JSON-LD on every page**: the core `IceCreamShop` business entity repeats everywhere (standard practice — every page is a potential landing page and should carry NAP + hours for local-pack eligibility), plus a page-specific type: `Menu` on Flavours/Menu, `FAQPage` on FAQ, `AboutPage` on Story, `ContactPage` on Visit, and a `BreadcrumbList` on every subpage matching a visible breadcrumb trail
- **All 75+ real flavours** (name + description, scraped from the original site) as their own glossary section on `flavours.html`, also embedded as `MenuItem`s in the schema — genuine topical depth, not just the 8 photo cards
- **Dietary tags only where explicitly stated** on the source menu (No Sugar Added, Dairy-Free for sorbets, Lactose-Free) — never guessed per-flavour allergen claims, which would be a real food-safety risk to fabricate; a clear disclaimer points people to ask staff
- **Internal linking**: every page's footer links to all six others, plus contextual "See full menu →" / "See all flavours →" CTAs between related pages
- `sitemap.xml` and `llms.txt` updated with all seven URLs

### On ranking #1

Technical SEO is table stakes, not a guarantee. Realistic targets: **"Ice Hut"**, **"Ice Hut Morinville"**, and **"ice cream Morinville"** are winnable for a well-optimized local business site. Ranking #1 for a bare generic term like **"ice cream"** is not realistic for a small local shop (competing with national chains, retailers, Wikipedia) and no amount of on-page work changes that. Two things outside this codebase matter as much as anything here:

1. **This needs to go live on the real `morinvilleicehut.ca` domain.** A `vercel.app` preview URL won't accumulate the domain history, backlinks, or trust signals the ranking depends on.
2. **Google Business Profile** (reviews, photos, posts, Q&A) drives local-pack rankings as much as the website does — worth the owner's attention alongside this redesign.
