# Product

<!-- impeccable:product-schema 1 -->

> **Provenance note.** The init interview was offered once and not answered, so
> fields below are marked **[confirmed]** (stated by the user in this project's
> brief, or verified against a primary source) or **[inferred]** (derived from
> the brief and repository evidence, never validated by a human). Treat every
> `[inferred]` line as a hypothesis a future session should confirm before
> relying on it. Nothing here was invented to fill a template.

## Platform

web

## Stack

Static HTML, CSS, and vanilla JS with no framework or build step **[confirmed —
existing codebase]**. Seven hand-authored pages share `styles.css` and
`script.js`. Deployed on Vercel via a `build.sh` that clones the GitHub branch
and copies files; the production alias is `morinville-ice-hut.vercel.app`
**[confirmed]**. An optional staff feature (`admin.html`) depends on Firebase
Auth + Firestore, currently unconfigured placeholders **[confirmed]**.

## Users

Two distinct audiences, and they are **not** the same person:

1. **The site's visitors** — people looking for ice cream in or near Morinville,
   Alberta **[inferred]**. Sub-segments the design currently serves without
   confirmation of their relative priority: locals checking hours and today's
   flavours; nearby Edmonton/St. Albert searchers deciding whether to make the
   ~20-minute drive; families choosing a summer-evening outing; travellers on
   the Highway 2 corridor **[all inferred]**.
2. **The evaluator** — the user's friend, connected to the real Ice Hut, who is
   being shown this work **[confirmed: "It's my friends site and I want to show
   him what you can do"]**. This person decides whether the site is ever
   adopted, so persuading them is a live job of the artifact itself.

**Open decision:** whether the shop's actual owner (Dawn, per the published
contact address) has any awareness of or input into this project. No evidence of
owner contact exists in this repository. Future work must not imply endorsement.

## Product Purpose

A complete replacement website for The Ice Hut, a real family-owned ice cream
shop in Morinville, Alberta **[confirmed]**. It exists to (a) demonstrate to the
user's friend what a modern rebuild of their site looks like **[confirmed]**,
and (b) function as a genuinely usable local-business site — hours, flavours,
menu, prices, directions — should it be adopted **[inferred]**.

Success stated by the user, in their words: make a viewer "desire this ice
cream"; be SEO- and AI-search-optimized; rank first for searches like "ice hut"
and "ice cream" **[confirmed]**. The last of these was scoped in-session to a
realistic target: brand and local-intent queries ("Ice Hut", "Ice Hut
Morinville", "ice cream Morinville") are winnable; a bare national head term
like "ice cream" is not, and no on-page work changes that **[confirmed —
communicated to and not disputed by the user]**.

## Positioning

The shop's own differentiators, verified from its published site and public
customer reviews — not invented:

- Family-owned and operating in Morinville since **1995** **[confirmed — shop's
  homepage]**. Note: the shop's own About page says 1997; the homepage figure is
  used throughout **[confirmed discrepancy, documented in README]**.
- Serves **Foothills Creamery** ice cream, an Alberta creamery **[confirmed]**.
- **75 distinct flavours** with published descriptions, including regional ones
  a chain would not carry (Saskatoon Pie, Haskap Prairie Berry, Tiger, All
  Canadian Moose) **[confirmed — scraped from the shop's menu page, stored in
  `site-reference/`]**.
- Portion size is the single most repeated theme in public reviews: "a single
  scoop is more like 4 scoops" **[confirmed — public review text]**.
- Dog-friendly, with a $2.25 Puppy Cone **[confirmed]**.
- Official tagline: **"Cold Treats & Other Eats"** **[confirmed]**.

## Operating Context

- **Seasonal business.** Open May–September only; closed October–April
  **[confirmed]**. Hours differ across three sub-seasons (May–June, July–August,
  September) **[confirmed]**. Any design that assumes year-round operation is
  wrong, and the off-season state is a real, months-long condition the site must
  handle gracefully — not an edge case.
- **Outdoor, walk-up service** with a grassy area and picnic benches
  **[confirmed — public reviews]**. There is no indoor dining room, no online
  ordering, and no delivery **[inferred from the absence of any such facility in
  all source material]**.
- **Mobile-dominant usage is likely** — someone standing outside or in a car
  deciding where to go **[inferred]**.
- The flavour board **rotates**; not all 75 flavours are available on a given day
  **[confirmed — the shop's own menu page frames the list as rotating]**.

## Capabilities and Constraints

**Built and working:** seven static pages (home, flavours, menu, story, reviews,
visit, FAQ); a live open/closed indicator computed in America/Edmonton time
against the seasonal schedule; an auto-rotating flavour of the week; per-page
JSON-LD; `sitemap.xml`, `robots.txt`, `llms.txt`; a PWA manifest **[confirmed]**.

**Built but not operational:** a staff flavour-availability board
(`admin.html` + Firestore) that lets staff mark flavours in/low/out from a phone.
`firebase-config.js` holds `REPLACE_ME` placeholders, so it does not function
until roughly ten minutes of Firebase console setup is done **[confirmed]**.

**Hard constraints:**
- No server-side runtime. Anything dynamic must be client-side or third-party.
- **Facts about a real business must never be fabricated.** Prices, hours, and
  flavours were taken from the shop's live site and are reproduced, not invented.
- **Allergen and dietary claims are safety-critical.** Only the dietary tags the
  shop explicitly publishes (No Sugar Added, Dairy-Free on sorbets,
  Lactose-Free) appear; per-flavour allergen status is never guessed, and the
  page directs people to ask staff **[confirmed — deliberate decision]**.
- **No fabricated review schema.** No `AggregateRating` is emitted because no
  citable rating was found; inventing one violates Google policy **[confirmed]**.

**Undecided:** whether the site ever moves to the real `morinvilleicehut.ca`
domain; whether the staff board is wanted by the shop; whether real photography
will be supplied.

## Brand Commitments

- Name **The Ice Hut**; tagline **"Cold Treats & Other Eats"** **[confirmed]**.
- The shop's real neon-style logo is in use at `images/logo.png`, pulled from
  their own site **[confirmed]**.
- Real NAP: 9911 100 Street, Morinville, AB T8R 1R4 · (780) 974-9944 ·
  dawn@morinvilleicehut.ca **[confirmed]**. A second phone number,
  (780) 819-9726, appears on one page of the shop's site; the 974 number is used
  because it appears on three of four pages **[confirmed discrepancy]**.
- Public profiles: Facebook and Instagram `@morinvilleicehut` **[confirmed]**.
- Voice, as written across the current site: warm, playful, plainspoken,
  self-aware about portion size. **[inferred — this voice was authored in this
  project, not supplied by the business, and is therefore a proposal.]**

## Evidence on Hand

**Real:**
- Full capture of the shop's live site (home, menu, about, contact) as HTML,
  text, and screenshots in `site-reference/` **[confirmed]**.
- All 75 flavour names and their published descriptions **[confirmed]**.
- Complete menu with real prices **[confirmed]**.
- One genuine photo — the shop's Facebook profile image — at
  `images/real-fb-cones.jpg`, credited on the reviews page **[confirmed]**.
- Four short quotes drawn from real public customer reviews **[confirmed]**.

**Explicitly absent — future work must not fabricate these:**
- Photos of the actual storefront, staff, or the shop's real product. Every
  other photographic image on the site is AI-generated via
  `images/prompts.json` and is a stand-in **[confirmed]**.
- Any verified star rating or review count.
- Named review attributions (quotes are credited only as "Google review").
- Any statement from the owner.

## Product Principles

1. **A real business's facts outrank a good-looking page.** When source material
   conflicts, document the conflict rather than picking the prettier answer.
2. **Never invent anything a customer could act on.** Prices, allergens, hours,
   ratings, and endorsements are reproduced from source or omitted.
3. **Design for the visitor standing outside deciding right now.** Open/closed,
   what's available, and how to get there beat brand storytelling.
4. **The seasonal cycle is a first-class state,** not an exception — the site is
   closed for more of the year than it is open.
5. **Placeholder content must announce itself.** AI-generated imagery and
   unconfigured features should never be mistaken for the real thing.

## Accessibility & Inclusion

No shop-specific requirement has been established with a human **[open]**. The
implementation currently targets WCAG AA contrast, honours
`prefers-reduced-motion`, and ships skip links, focus states, and
keyboard-operable disclosure widgets **[confirmed — verified in-session]**.
Dietary and allergen clarity is treated as an inclusion requirement, not a
nicety, given the food context.
