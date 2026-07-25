# The Ice Hut — Website Redesign 🍦

A modern, animation-rich redesign concept for [The Ice Hut](https://morinvilleicehut.ca), Morinville's family-owned ice cream shop since 1995.

## What's inside

- **`index.html`** — the entire site, fully self-contained (inline CSS + JS, zero build step, zero dependencies). Open it in any browser or drop it on any static host.
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
- **Flavour of the Week**: the spotlight banner rotates through the flavour list automatically every Monday — zero maintenance.
- **Live hours**: the "Open now / Opens at…" pill and highlighted hours row compute themselves in Edmonton time.

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
