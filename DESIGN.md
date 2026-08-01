---
name: The Ice Hut
description: A hard-outlined, sticker-bright confectionery world for a seasonal small-town ice cream shop.
colors:
  pink: "#FF5D8F"
  pink-deep: "#A81E52"
  pink-soft: "#FFD3E1"
  mint: "#4FC9B1"
  mint-soft: "#C9F2E9"
  caramel: "#FFAE52"
  caramel-soft: "#FFE3C2"
  berry: "#8C5BD8"
  sky: "#8ED8F0"
  choc: "#3A2318"
  choc-soft: "#6B4630"
  cream: "#EFFAF5"
  cream-2: "#DCF3E9"
  paper: "#FFFFFF"
typography:
  display:
    fontFamily: "Shrikhand, Fredoka, Comic Sans MS, cursive"
    fontSize: "clamp(3rem, 8.5vw, 6.2rem)"
    fontWeight: 400
    lineHeight: 1.12
    letterSpacing: "0.5px"
  headline:
    fontFamily: "Shrikhand, Fredoka, Comic Sans MS, cursive"
    fontSize: "clamp(2rem, 5vw, 3.4rem)"
    fontWeight: 400
    lineHeight: 1.12
  title:
    fontFamily: "Shrikhand, Fredoka, Comic Sans MS, cursive"
    fontSize: "1.5rem"
    fontWeight: 400
    lineHeight: 1.12
  body:
    fontFamily: "Fredoka, Trebuchet MS, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.6
  lead:
    fontFamily: "Fredoka, Trebuchet MS, system-ui, sans-serif"
    fontSize: "clamp(1.05rem, 2vw, 1.3rem)"
    fontWeight: 400
    lineHeight: 1.6
  small:
    fontFamily: "Fredoka, Trebuchet MS, system-ui, sans-serif"
    fontSize: "0.95rem"
    fontWeight: 400
    lineHeight: 1.5
  fine:
    fontFamily: "Fredoka, Trebuchet MS, system-ui, sans-serif"
    fontSize: "0.92rem"
    fontWeight: 400
    lineHeight: 1.45
  label:
    fontFamily: "Fredoka, Trebuchet MS, system-ui, sans-serif"
    fontSize: "0.85rem"
    fontWeight: 700
    letterSpacing: "3px"
rounded:
  pill: "999px"
  card: "24px"
  card-sm: "18px"
  media: "16px"
  banner: "32px"
  focus: "6px"
spacing:
  xs: "8px"
  sm: "14px"
  md: "24px"
  lg: "30px"
  xl: "48px"
  section: "96px"
components:
  button-primary:
    backgroundColor: "{colors.pink}"
    textColor: "{colors.choc}"
    rounded: "{rounded.pill}"
    padding: "15px 30px"
  button-primary-hover:
    backgroundColor: "{colors.pink}"
    textColor: "{colors.choc}"
  button-ghost:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.choc}"
    rounded: "{rounded.pill}"
    padding: "15px 30px"
  card:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.choc}"
    rounded: "{rounded.card}"
    padding: "{spacing.lg}"
  nav-link:
    textColor: "{colors.choc}"
    rounded: "{rounded.pill}"
    padding: "8px 14px"
  nav-link-active:
    backgroundColor: "{colors.pink}"
    textColor: "{colors.choc}"
    rounded: "{rounded.pill}"
    padding: "8px 14px"
  status-pill:
    backgroundColor: "{colors.choc}"
    textColor: "{colors.cream}"
    rounded: "{rounded.pill}"
    padding: "8px 16px"
  chip-diet:
    backgroundColor: "{colors.mint-soft}"
    textColor: "{colors.choc}"
    rounded: "{rounded.pill}"
    padding: "2px 8px"
  chip-favourite:
    backgroundColor: "{colors.caramel}"
    textColor: "{colors.choc}"
    rounded: "{rounded.pill}"
    padding: "3px 9px"
---

# Design System: The Ice Hut

## Overview

**Creative North Star: "The Sticker Sheet"**

Everything in this system behaves like a die-cut vinyl sticker pressed onto a
sheet of mint paper. Surfaces are outlined in a thick chocolate ink line, they
cast a hard shadow with no blur at all, and they sit *on* the page rather than
floating above it. Nothing is glassy, nothing is misty, nothing fades into its
background. The world is legible from across a parking lot, which is roughly the
viewing distance this business actually operates at.

The palette is a confectionery one — pink, mint, caramel, berry — but it is
disciplined by a single dark brown that does all the structural work: every
border, every shadow, every piece of body text. That brown is what stops the
brightness from turning into noise. The type pairing runs the same way: Shrikhand
carries all the personality in headings and does none of the reading work, while
Fredoka handles every sentence in a plain, friendly, high-legibility voice.

The register is playful but never childish, and never precious. This is a
thirty-year-old family business whose defining trait is that the portions are
absurd; the design should feel generous and confident in the same way. Motion
overshoots slightly on interaction — things bounce back like they have weight —
but nothing loops forever demanding attention.

**Key Characteristics:**
- Hard-edged: 3px ink outlines and zero-blur offset shadows on every raised surface
- Bright but anchored: five candy hues held together by one structural brown
- Pill-shaped interactivity: anything clickable is fully rounded
- Display type for personality, body type for everything you actually read
- Motion with overshoot and weight, never ambient drift

## Colors

A confectionery palette — the colours of the product itself — kept honest by a
single dark brown that carries all structure and all body text.

### Primary
- **Bubblegum Pink** (`{colors.pink}`): The one true accent. Fills primary
  buttons, the active navigation pill, and the back-to-top control. Used as a
  *fill* only, never as text on a light background.
- **Cherry Ink** (`{colors.pink-deep}`): The readable sibling of Bubblegum. All
  accent *text*: section kickers, prices, inline links, stat numerals, the
  wavy-underlined hero word. Exists specifically because Bubblegum fails contrast
  as text.
- **Cotton Candy** (`{colors.pink-soft}`): Soft wash. Navigation hover, today's
  highlighted row in the hours table, ambient hero gradients.

### Secondary
- **Scoop Mint** (`{colors.mint}`): The counterweight to pink. Ambient hero and
  section gradients, illustrated mint-chip scoops.
- **Mint Cream** (`{colors.mint-soft}`): Dietary tag chips, ambient washes.

### Tertiary
- **Butter Caramel** (`{colors.caramel}`): Small emphatic flags — the "for
  dogs!" and "3 flavours!" chips, footer section headings, the wavy underline
  beneath the hero's second line.
- **Caramel Cream** (`{colors.caramel-soft}`): Ambient gradient only.
- **Grape Berry** (`{colors.berry}`): Focus rings and the far end of the CTA
  banner gradient. Deliberately rare.
- **Slushie Sky** (`{colors.sky}`): Confetti particles in the hero canvas. Never
  used for UI.

### Neutral
- **Chocolate Ink** (`{colors.choc}`): The structural workhorse. Every border,
  every shadow, all primary body text, the footer and facts-strip backgrounds,
  and the text sitting on top of pink and caramel fills.
- **Cocoa Soft** (`{colors.choc-soft}`): Secondary and supporting text —
  descriptions, captions, fine print.
- **Mint Paper** (`{colors.cream}`): The page. A pale mint chosen deliberately
  over the reflexive warm beige.
- **Mint Paper Deep** (`{colors.cream-2}`): Alternating section bands and dashed
  table rules, to separate without drawing a line.
- **Card Paper** (`{colors.paper}`): Every raised card surface.

### Named Rules

**The Two Pinks Rule.** Bubblegum fills, Cherry writes. `{colors.pink}` may back
a shape but must never be the colour of text on a light surface; `{colors.pink-deep}`
is the accent text colour and should not be used as a large fill. Every
text-on-background pair in this system clears WCAG AA (4.5:1), and this split is
how that stays true.

**The One Brown Rule.** Borders, shadows, and body copy are all Chocolate Ink.
Do not introduce a second neutral, a grey, or a pure black. Depth and structure
come from one colour used consistently.

## Typography

**Display Font:** Shrikhand (fallback Fredoka, Comic Sans MS, cursive)
**Body Font:** Fredoka (fallback Trebuchet MS, system-ui, sans-serif)

**Character:** Shrikhand is a heavy, slanted, single-weight display face with
scoop-like curves — it reads as hand-painted signage and carries the entire
personality of the brand. Fredoka underneath is rounded, even, and completely
unfussy, so the moment you're actually reading a sentence the playfulness gets
out of the way.

### Hierarchy
- **Display** (Shrikhand, `clamp(3rem, 8.5vw, 6.2rem)`, 1.12): The home hero
  headline only. One per site.
- **Headline** (Shrikhand, `clamp(2rem, 5vw, 3.4rem)`, 1.12): Section titles.
  Subpage `h1`s run slightly smaller at `clamp(2.4rem, 6vw, 4rem)`.
- **Title** (Shrikhand, 1.5rem): Card headings — hours, location, menu category
  heads (1.35rem), footer brand (1.8rem).
- **Lead** (Fredoka, `clamp(1.05rem, 2vw, 1.3rem)`, 1.6): Hero subheading and
  section standfirsts. Capped at ~34rem so lines stay readable.
- **Body** (Fredoka, 1rem, 1.6): All running text.
- **Small** (Fredoka, 0.95rem, 1.5): Supporting notes that sit beside body copy —
  seasonal closure notice, story-point descriptions, photo captions.
- **Fine** (Fredoka, 0.92rem, 1.45): The smallest running text — flavour card
  descriptions, drink lists, review attributions, glossary definitions.
- **Label** (Fredoka, 0.85rem, 700, `letter-spacing: 3px`, uppercase): Section
  kickers above headlines, footer column headings (2px tracking).

### Named Rules

**The Shrikhand Ceiling Rule.** The display face is for headings, the brand mark,
and large numerals. It never sets a paragraph, a label, a button, or a menu row.
It has one weight and no italic — if a design needs emphasis inside display type,
change the size or the colour, not the weight.

**The 11px Floor Rule.** No functional text — chips, labels, prices, captions,
nav — renders below 11px at any viewport. Decorative micro-labels are still
functional and are still in scope.

## Layout

A single centred column: `min(1160px, 92%)`, with sections padded `96px 24px`
(dropping to `72px 20px` under 560px). The horizontal inset is not optional —
it's what keeps content off the edge on small screens.

Content alternates between the page mint and the deeper mint band to separate
regions tonally rather than with rules. Grids collapse on two breakpoints:
**960px** (the main one — flavour grid 4→2, menu 3→1, story/visit/footer to
single column, and the nav becomes a pop-out sheet behind a ☰ toggle) and
**560px** (flavour grid → 1, tighter section padding). The full flavour glossary
is a 3-column CSS multi-column list that steps 3→2→1 across the same
breakpoints.

Rhythm is generous. Cards get 30–36px of internal padding, grid gaps sit at
26–28px, and there is deliberately a lot of air between sections — the page is
meant to be scrolled at speed on a phone.

## Elevation & Depth

This system does **not** use ambient shadow. Depth is a hard, offset, zero-blur
drop — the visual language of a sticker sitting on paper, or of thick-stock
signage. There is exactly one blurred shadow in the whole system and it is
reserved for the two darkest surfaces.

### Shadow Vocabulary
- **Pop** (`box-shadow: 0 8px 0 rgba(58, 35, 24, 0.9)`): The default for raised
  cards. No blur, no spread, pure vertical offset.
- **Pop Small** (`box-shadow: 5px 5px 0 var(--choc)` / `6px 6px 0`): Diagonal
  variant for smaller or tilted elements — FAQ accordions, story list items, the
  mobile nav sheet, the flavour-of-the-week banner.
- **Button Stack** (`0 6px 0` at rest → `0 10px 0` on hover → `0 3px 0` on
  active): Buttons animate their shadow *depth*, so pressing one visibly pushes
  it into the page.
- **Soft** (`box-shadow: 0 20px 50px -20px rgba(58, 35, 24, 0.35)`): The one
  ambient shadow. Only on the dark story card and the CTA banner, where a hard
  edge against a dark fill would read as a mistake.

### Named Rules

**The Zero-Blur Rule.** Raised surfaces cast a hard offset shadow with a blur
radius of `0`. If a new component needs a soft glow to look right, the component
is wrong for this system — not the rule.

**The Ink Outline Rule.** Every raised surface carries a `3px solid` Chocolate
Ink border (4px on hero media and the story photo). There are no borderless
cards. The outline and the hard shadow are a matched pair; never ship one without
the other.

## Shapes

Two shape families, and the distinction is functional:

**Pills (`999px`)** — anything interactive or status-bearing: buttons, nav links,
the open/closed pill, all chips, the back-to-top button. If a user can click it
or it reports live state, it is fully rounded.

**Soft rectangles** — content containers: `24px` for the main card family
(flavour, menu, review, visit), `18px` for secondary surfaces (FAQ accordions,
story items, mobile nav), `16px` for inset media, `32px` for the CTA banner, and
a `40px 40px 0 0` cap where the footer meets the page.

One deliberate exception: the hero photograph and its ambient blobs use an
animated organic blob radius (`58% 42% 55% 45% / 48% 55% 45% 52%` morphing over
16s), because ice cream is not a rectangle. This is the only place asymmetric
radii are allowed.

Small rotations (−2° to +1.2°) are applied to the hero kicker, story card, and
story photo so the sticker metaphor stays literal.

## Components

### Buttons
- **Shape:** Full pill (`999px`), `3px` Chocolate Ink border, `15px 30px` padding
- **Primary:** Bubblegum fill, Chocolate Ink text
- **Ghost:** White fill, Chocolate Ink text — the secondary action
- **Hover / Active:** Lifts `4px` with a deeper shadow, then presses to `2px`
  down with a shallow shadow. Transitions on `transform` and `box-shadow` only
- **On dark:** Inside the CTA banner, buttons invert to a white fill

### Cards
- **Corner:** `24px` (`{rounded.card}`)
- **Background:** Card Paper on the mint page
- **Border:** `3px` Chocolate Ink, always
- **Shadow:** Pop (see Elevation)
- **Padding:** 28–36px depending on density
- **Hover:** Menu and review cards lift and rotate a fraction of a degree;
  flavour cards tilt in 3D toward the cursor on fine pointers only

### Chips
- **Dietary** (`chip-diet`): Mint Cream fill, uppercase, 0.72rem — factual
  tags on the flavour glossary
- **Favourite** (`chip-favourite`): Butter Caramel fill, uppercase, 0.72rem —
  emphatic menu flags
- Both are pills with no border; they sit *inside* an outlined surface, so they
  don't need their own outline

### Navigation
- Fixed header, transparent at rest, gaining a translucent mint background and
  blur past 30px of scroll
- Links are Fredoka 600 in pill hit-areas; hover fills Cotton Candy and lifts 2px
- The current page is marked with a solid Bubblegum pill via `aria-current="page"`
- Under 960px the links collapse into an outlined white sheet behind a ☰ toggle
- A brown status pill reports live open/closed state and hides on mobile

### Hours Table
Borderless, separated by dashed Mint Paper Deep rules. Season headings are Cherry
uppercase labels; the currently-active season's rows fill with Cotton Candy and
round at the ends.

### Signature: the Status Pill
A dark pill in the header with a small dot that pulses green when the shop is
genuinely open and sits static orange when closed. Its text recomputes every 60
seconds against the real seasonal schedule in Edmonton time. **The pulse is
earned by live data** — it is the one animated indicator in the system, and it
must never be copied onto something static.

## Do's and Don'ts

### Do:
- **Do** pair every `3px` Chocolate Ink outline with a zero-blur Pop shadow.
- **Do** use `{colors.pink}` for fills and `{colors.pink-deep}` for accent text —
  the Two Pinks Rule keeps the whole system at WCAG AA.
- **Do** make anything clickable a `999px` pill.
- **Do** animate `transform` and `opacity` only. Buttons and cards move; layout
  boxes do not.
- **Do** respect `prefers-reduced-motion` — the reduced-motion block neutralises
  every animation and reveals all scroll-hidden content.
- **Do** keep display type (Shrikhand) out of body copy, buttons, and labels.

### Don't:
- **Don't** apply a gradient to text via `background-clip: text`. It was removed
  from the hero deliberately; the wavy caramel underline replaced it.
- **Don't** add a coloured stripe along one edge of a card. Removed from the
  flavour cards on purpose.
- **Don't** build an infinitely auto-scrolling marquee. The facts strip is a
  static wrapping row, and that was a deliberate downgrade from a ticker.
- **Don't** animate `padding`, `width`, `height`, or `margin`. The header's
  padding transition was removed for exactly this reason.
- **Don't** introduce grey, pure black, or a second neutral. One brown does all
  structural work.
- **Don't** put a pulsing dot on anything that isn't reporting genuinely live,
  changing data.
- **Don't** let functional text fall below 11px, including inside the footer.
- **Don't** use a soft/blurred shadow on a light surface — that shadow belongs
  only to the dark story card and CTA banner.
