# Casa Costa — Design Direction Brief
*From Sonnet design-research agent, 2026-07-04. The build spec.*

## Palette — "Ember & Ash" (dark, warm, low-light — lit like a fireplace, not a retail floor)

**Backgrounds:** Char Oak `#14100D` (page) · Espresso `#1E1712` (cards) · Aged Leather `#2A2019` (nav/modals) · Cigar Box Cedar `#3A2B1F` (borders)
**Tobacco tones:** Maduro Leaf `#4A3324` (footer) · Corojo Tan `#7A5A3A` (secondary text/icons)
**Accents:** Cognac Amber `#C17F3E` (primary/CTA) · Aged Brass `#B8935A` (hairlines/crest metal) · Foil Gold `#D4AF6A` (crest/hero, one per screen) · Oxblood `#5C2020` (rare single detail)
**Text:** Parchment `#EDE3CE` (body) · Cream Muted `#C9BEA8` (captions) · Ash Grey `#8C8378` (fine print)

Rule: gold in small doses only (hairline, crest, one word). Never pure white-on-black. Parchment on Char Oak for body.

## Type
- **Primary pairing:** Cinzel (Roman inscriptional caps — headings/crest, all-caps, letter-spacing 0.05–0.12em) + EB Garamond (body).
- Foil-gold text = CSS gradient `linear-gradient(180deg,#F3D896,#B8935A 40%,#8A6A38)` clipped to text, NOT flat fill.
- Cigar-band lettering: all-caps/small-caps, curved baseline in oval, Latin/Spanish motto beneath.

## Cigar-band crest = the signature device
Oval/shield medallion, double-line brass/gold border, Cinzel small-caps wordmark curved along top, motto/est-year/city beneath, one center emblem (tobacco leaf / match flame / single star). Two states: full-foil (header/hero) + flat line-art (footer/favicon/watermark). One crest per screen — a wax seal, not wallpaper. Shrink to icon-only as section-header eyebrow. Tone-on-tone watermark at 5–8% behind hero/footer.

## Layout & motion (premium tells)
Full-bleed hero, transparent floating nav until scroll · generous negative space (120–200px section padding, 60–65char line length) · 4–5 nav items, small-caps serif labels · slow fade-in-on-scroll 400–700ms ease-out, subtle hero parallax (≤10–15%) · gold hairline dividers (Aged Brass @40–60% opacity) · members'-club copy ("Request an evening," "Reserve your chair," "Inquire" — never "Book Now"/"Sign Up") · photography sells, no badges/ratings/star icons.

**Avoid (kills luxury instantly):** rounded-corner SaaS cards, drop shadows, gradient buttons, >1 bright accent per screen, tight-tracked sans headlines, bright/even stock photos, sticky banners/popups/chat bubbles, Font Awesome glyphs, gradient blobs/particles, emoji, carousels.

## Imagery — Ideogram (append these style tokens to EVERY prompt for cohesion)
`cinematic low-key lighting, warm amber and tobacco tones, shallow depth of field, 85mm lens, soft film grain, muted desaturated color grade, deep shadows, chiaroscuro, editorial luxury magazine photography, moody atmosphere, no text, no watermark, photorealistic`

Direction: warm tungsten/candlelight, low-key, deep shadow falloff, shallow DoF, 85mm editorial framing, film grain, muted grade. Like a film still on Portra pushed a stop under.

**8 prompts:** 1 Hero (lounge at night, leather chesterfields, brass lamp, resting lit cigar + whiskey) · 2 Cigar foot glowing macro · 3 Spanish-cedar humidor interior · 4 Hanging tobacco leaves in curing barn · 5 Whiskey/cognac pour over ice sphere · 6 Leather chair armrest w/ brass cutter + lighter · 7 Ybor City Tampa cigar factory at dusk (red brick, wrought iron, cobblestone) · 8 Gloved hand presenting cigar box to seated guest. (Full prompt text in the research output / build agent brief.)

## Reference lessons
Davidoff (stage the product as art, name specific materials) · Cohiba (restraint > ornament — one confident mark) · Casa de Montecristo (sell the room/ritual, not the product) · Soho House (one full-bleed image, recessed nav) · Grand Havana Room (gated tone: "by reservation," member humidor lockers) · luxury cognac sites (near-black bg + single gold accent; brown lives in imagery not UI chrome).
