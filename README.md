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

**3D Cone Lab** 🧪
- A real-time WebGL "Build your dream cone" section (`js/cone3d.js`, powered by a vendored Three.js — MIT licence, no CDN): tap flavours to stack squishy, hand-scooped 3D scoops with a drop-and-bounce animation, drag to spin, floating 3D sprinkles, cherry on top, and a camera that pulls back as the tower grows (max 5 scoops — "a Morinville single")
- Progressive enhancement: the section only appears when WebGL is available, so nothing breaks on old devices
- The hero photo also tilts in 3D as the mouse moves

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

## ✅ Fact-checked against the original site

Hours (seasonal May–September schedule), address, phone, menu items and prices, flavour names, and the "Cold Treats & Other Eats" tagline were all verified against morinvilleicehut.ca (captured in `site-reference/`). Review snippets come from real public customer reviews.

**Discrepancies found on the original site worth telling the owner about:**
- `www.morinvilleicehut.ca` has an invalid TLS certificate (browsers warn on the `www` address; the bare domain is fine)
- The homepage says "since 1995" but the About page says "since 1997"
- The Menu page footer shows phone (780) 819-9726 while every other page shows (780) 974-9944 (this redesign uses 974-9944)
