# The Ice Hut — Website Redesign 🍦

A modern, animation-rich redesign concept for [The Ice Hut](https://morinvilleicehut.ca), Morinville's family-owned ice cream shop since 1995.

## What's inside

- **`index.html`** — the entire site, fully self-contained (inline CSS + JS, zero build step, zero dependencies). Open it in any browser or drop it on any static host.
- **`images/`** — AI-generated food photography (see *Automations* below), driven by `images/prompts.json`.
- **`robots.txt`** / **`sitemap.xml`** — search engine crawling support.
- **`llms.txt`** — an [llms.txt](https://llmstxt.org/) summary so AI assistants (ChatGPT, Claude, Perplexity, Google AI Overviews) can answer questions about the shop accurately.
- **`og-image.png`** — social sharing preview image (Facebook, iMessage, etc.).

## Automations 🤖

- **AI image pipeline** (`.github/workflows/generate-images.yml`): edit a prompt in `images/prompts.json`, push, and GitHub Actions regenerates that photography using the free [Pollinations.ai](https://pollinations.ai) Flux API and commits the results back — no design tools or paid APIs needed. Every photo has a built-in fallback: if an image is missing, the site swaps in its hand-drawn SVG illustration automatically.
- **Auto-deploy** (`.github/workflows/deploy.yml`): every push to `main` publishes the site to GitHub Pages.
- **Weekly health check** (`.github/workflows/link-check.yml`): validates the HTML and checks for broken links every Monday.
- **Flavour of the Week**: the spotlight banner rotates through the flavour list automatically every Monday — zero maintenance.
- **Live hours**: the "Open now / Opens at…" pill and highlighted hours row compute themselves in Edmonton time.

## Highlights

**Motion & delight**
- Animated sprinkle particle field in the hero (canvas, pauses off-screen)
- Floating triple-scoop SVG cone with dripping animation and a spinning "Since 1995" badge
- Scroll-triggered staggered reveals, animated stat counters, 3D-tilt flavour cards
- Scrolling marquee, marshmallow-soft hover states everywhere
- Fully respects `prefers-reduced-motion`

**Smart touches**
- Live **"Open now / Opens at…"** pill computed in America/Edmonton time, with today's row highlighted in the hours table
- "Summers of scooping" counter updates itself every year automatically

**SEO & AI-search (GEO) optimization**
- `IceCreamShop` + `FAQPage` JSON-LD structured data (rich results, knowledge panels, AI answers)
- Full Open Graph + Twitter Card metadata, canonical URL, geo meta tags
- Semantic HTML, descriptive headings, an on-page FAQ that mirrors the schema
- Accessible: skip link, focus states, aria labels, keyboard-friendly accordions

## ⚠️ Before going live

Menu prices other than the Puppy Cone ($2.25) and Kids Single ($4.50) are **placeholders** — update them in the Menu section of `index.html`. Same goes for the flavour list: swap in whatever's actually in the freezer.
