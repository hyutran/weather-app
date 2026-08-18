# Visual Consistency Plan

Remediation plan for the visual inconsistencies found across the home list and
location detail pages. Findings are numbered `#1`–`#19` from the source review;
each todo below cites the findings it closes.

Finding **#7** (Minecart typeface omitted from forecast rows) is intentional and
excluded from this plan.

**Status: complete.** All 29 todos across 8 phases are done. Build passes (50/50
pages), and both pages were visually verified. Two pre-existing lint errors
remain, out of scope — see Phase 8.

> **Revision note.** This plan was revised after auditing
> [`tokens.css`](../app/styles/tokens.css) against the shadcn preset it derives
> from. The audit found that most values this plan originally proposed as *new*
> tokens already exist under different names. Phase 1 shrank from seven new
> tokens to one. See [Principles](#principles) for the rule that drove the
> change and [Reuse map](#reuse-map) for what replaced what.

## Principles

Three ways to express a design decision, and the test for choosing between them:

| Form | Use when | Example |
| --- | --- | --- |
| **Token** (`tokens.css`) | The value is consumed inside a CSS recipe, or referenced by another token — places a Tailwind utility cannot reach | `--weather-card-inset-highlight`, a colour slot inside a multi-layer `box-shadow` |
| **Utility** (Tailwind) | The value is applied at a call site and the existing theme already expresses it | `bg-popover/80`, `shadow-sm`, `border-input` |
| **Material class** (`globals.css`) | Several properties must travel together — fill *and* blur *and* border *and* shadow — or they will drift apart | `.weather-background--card`, `.header-scrim`, `.surface-overlay` |

A value that a Tailwind utility already expresses does **not** earn a token.
Adding one creates a second name for one thing, which is the problem findings
#10, #12, and #13 are about.

**Naming note.** `--weather-card-inset-highlight` and `--weather-card-shadow`
keep their current names even though Phase 6 widened their scope beyond weather
cards — the dialog and select popover consume them too. Renaming was considered
and declined; expect to see `weather-card` tokens on non-card surfaces.

**Cascade note.** Hand-written rules in `globals.css` are *unlayered*, while
Tailwind utilities compile into the `utilities` layer. Unlayered styles win, so
a material class always supersedes a competing utility regardless of source
order. Load-bearing for todo 9 — and it cuts both ways, see todo 23.

## Reuse map

What the first draft proposed, and what already covered it:

| Originally proposed | Resolution |
| --- | --- |
| `--text-secondary` | **`--muted-foreground`** already is the secondary-text token — shadcn uses it for descriptions, labels, and placeholders on base surfaces, not for text on `--muted` fills. Only its dark value changed (60% → 70%). |
| `--text-primary` | **`--foreground`**. A pure alias adds nothing. |
| `--border-subtle` | **`--border`** (separators) and **`--input`** (interactive edges) are an existing two-tier system, already used correctly by the shadcn primitives. |
| `--border-highlight` | **`--weather-card-inset-highlight`** already performs the edge-lighting job. |
| `--inset-highlight` | Same token as above. |
| `--surface-raised` | **`bg-foreground/10`**, applied at the three tile call sites. |
| `--surface-overlay` | **`bg-popover/80`** inside the Phase 6 material class. A token would orphan the `--popover` / `--popover-foreground` pair. |
| `--surface-scrim` | **`bg-black/30`** — theme-independent by design. |
| `--elevation-card` | **`shadow-sm`**. The card's hand-written shadow is byte-identical in geometry to Tailwind's `--shadow-sm`; only the colour differs. |
| `--elevation-overlay` | **`shadow-xl`** geometry — but see todo 23, the ladder's built-in colour was wrong. |
| `--header-height` | The one genuinely new token. |

## The text ladder

App code uses **two** tiers. The five `*-foreground` tokens that were exact
clones of `--foreground` in dark are surface-pair partners, not hierarchy
levels — they stay for the shadcn primitives but are off-limits outside
[`components/ui/`](../components/ui/).

| Tier | Token | Use |
| --- | --- | --- |
| Primary | `--foreground` | Headings, temperatures, max temps |
| Secondary | `--muted-foreground` | Dates, conditions, min temps, control labels |

## The density scale

Header sizing splits into two concepts, because the two headers differ in kind:

- **Fixed chrome** (app header) needs a *height* — page content must offset by
  at least that amount. It is a layout contract between two components.
- **Content-driven containers** (dialog header) need *padding* — height follows
  the title and description, so a fixed height would clip or leave dead space.

What they share is density, which is what makes them read as one product:

| Density | Padding | Fixed height *(chrome only)* | Applies to | Status |
| --- | --- | --- | --- | --- |
| `compact` | 1rem / 16px | 3rem / 48px | Dialog header, popover, toolbar | already correct (`p-4` on `DialogContent`) |
| `default` | 1.5rem / 24px | 5rem / 80px | App header bar | ✅ done (was 136px) |
| `spacious` | 2rem / 32px | 6rem / 96px | Detail-page hero | already correct |

Page content offset is a separate decision owned by `PageShell` (`py-24`,
96px), deliberately not tied to `--header-height` so the two can move
independently.

## Decisions

All settled. Recorded because several reversed the plan's original recommendation.

| # | Decision | Outcome |
| --- | --- | --- |
| Todo 1 | Shadow colour: 25%, or keep the card's 24%? | **Kept 24%.** The card is the reference element; later phases converged the drifting elements (30%, 10%) onto it. Moving the correct one for a round number is backwards, and 1% is imperceptible. |
| Todo 4 | Delete the dead `--chart-*` / `--sidebar-*` blocks now, or defer? | **Deleted in Phase 1**, with their `@theme inline` mappings. |
| Todo 5 | Header scrim: tinted fill, or transparent? | **Tinted, via a material class.** The recommended `bg-app-background/80` was not viable — see todo 5. |
| Todo 15 | Promote the location name to `h1`? | **No** — it would produce two `h1`s per page. See todo 15. |
| Todo 18 | Light palette: delete, or wire a theme toggle? | **Neither — document and retain.** Recommendation reversed on evidence; see todo 18. |

---

## Phase 1 — Token corrections ✅

All work in [`app/styles/tokens.css`](../app/styles/tokens.css).

- [x] **1. Retune `--muted-foreground`** — `.dark` value set to white/70, up from
  the preset's 60%. The app had independently converged on 70–80% at four of five
  secondary-text sites, which said 60% was too dim over the weather gradients.
  *(#10)*

- [x] **2. Add `--header-height`** — the app header bar only, not the page
  offset. Consumed as `h-(--header-height)`, the same shorthand used at
  [`select.tsx:87`](../components/ui/select.tsx#L87); Tailwind 4.3's `--spacing`
  is a single base multiplier, so no `@theme` mapping was needed. Set to `5rem`.
  *(#3)*

- [x] **3. Delete the dead weather-card tokens** — `--weather-card-border-size`
  and `--weather-card-border-highlight`. Neither was referenced. *(#14)*

- [x] **4. Delete the dead palette blocks** — `--chart-1`–`5` and all eight
  `--sidebar-*`, in both themes, plus their `@theme inline` mappings.

> No other `globals.css` changes were needed: `--color-muted-foreground` was
> already mapped, the shadow ladder is built into Tailwind, and `--border` /
> `--input` were already exposed.

## Phase 2 — Layout shell and header ✅

- [x] **5. Rebuild the header box** — [`app/layout.tsx`](../app/layout.tsx)
  `py-12` replaced with `h-(--header-height) flex items-center`, so height is
  declared rather than derived from padding plus whatever the toggle measures.
  `pointer-events-none` on the `<header>` with `pointer-events-auto` on the inner
  row stops the full-width fixed bar swallowing clicks over the top of the page.
  Two nested divs collapsed into one. Bar went 136px → 80px. *(#3)*

  > **Deviation.** The recommended `bg-app-background/80 backdrop-blur-md` was
  > not viable: `bg-app-background` maps to `--background-image-app-background`,
  > a radial-gradient, and alpha modifiers only apply to background-*color*
  > utilities. A flat `bg-background/80` would have been worse — `--background`
  > is near-black while the canvas gradient is lighter blue at the top, painting
  > a visible dark band exactly where the header sits. Replaced with a
  > `.header-scrim` material class that tints with `--app-background-start` (the
  > actual canvas colour at that position, so it blends) and masks both tint and
  > blur to nothing at the bottom edge. It lives on a pseudo-element because a
  > mask on the header itself would fade the title and toggle too. Lightning CSS
  > adds `-webkit-` prefixes and a `color-mix` fallback automatically.

- [x] **6. Create `PageShell`** — [`PageShell.tsx`](../app/components/PageShell.tsx)
  `mx-auto max-w-xl px-6 py-24`. *(#2)*

- [x] **7. Adopt it on the home page** — [`LocationList.tsx`](../app/components/LocationList.tsx) *(#2)*

- [x] **8. Adopt it on the detail page** — [`page.tsx`](../app/[slug]/page.tsx)
  Container swapped and the nested `py-8` deleted. Incidentally fixed the split
  className originally logged under todo 26. *(#2)*

## Phase 3 — Unified card surface ✅

- [x] **9. Create the shared surface recipe** — [`weatherCardSurface.ts`](../app/components/weatherCardSurface.ts)
  `min-h-28 rounded-4xl px-6 py-8 shadow-sm shadow-(color:--weather-card-shadow) sm:px-7 xl:px-8`

  > **Deviation.** Written as a plain exported string rather than cva. cva exists
  > to generate variants and there are none here. A class constant rather than a
  > wrapper component because the three consumers have three different root
  > elements (`Link`, `div`, `DialogTrigger`).
  >
  > **Known overlap, verified.** `.weather-background--card` sets `box-shadow` in
  > CSS, replacing rather than merging with the recipe's `shadow-sm`. Being
  > unlayered, it wins over the `utilities` layer — keeping its directional
  > insets, which the ladder cannot express. Confirmed by inspecting the compiled
  > CSS.
  >
  > Note the `shadow-(color:--…)` form: the unhinted `shadow-(--…)` sets the
  > shadow *value* rather than its colour, silently producing an invalid shadow.

- [x] **10. Adopt in LocationCard** — geometry was already at target, so nothing
  moved. Trailing space cleared. *(#1, #17)*

- [x] **11. Adopt in LocationCardSkeleton** — padding grew 20/24px → 24/32px,
  **killing the load-time layout shift**. Dead `shadow-md/80` dropped;
  `bg-white/10` → `bg-foreground/10`. *(#1, #12, #18)*

- [x] **12. Adopt in the Add tile** — removed the one-off `min-h-26` and the
  `shadow-lg shadow-black/10`. `bg-card/40` → `bg-foreground/10`,
  `outline-white/20` → `outline-input`, `hover:outline-white/40` →
  `hover:outline-foreground/40`.

  > As predicted, its fill flipped from *dark* translucent to *light* to match
  > the skeleton beside it — the one element that changed character. *(#1, #12, #13, #17)*

## Phase 4 — Typography roles ✅

- [x] **13. Define the two text-on-weather utilities** — [`globals.css`](../app/globals.css)
  `.text-on-weather` / `.text-on-weather-sm`, applied at all 13 sites including
  the toggle and Add label, which had no shadow at all.

  > Existing `sm`/`md` assignments were **preserved rather than re-graded**. The
  > todo asked for coverage of the two elements that lacked shadows, not a
  > re-tiering, so this is a rename plus two additions. *(#9)*

- [x] **14. Collapse supporting-text treatments to `text-muted-foreground`** —
  card meta, detail description, forecast min temps. The detail date line already
  used the token.

  > Also converted the site title's `text-foreground/80` in `layout.tsx`, which
  > the todo did not list. It was the fourth surviving value in the muted ladder;
  > leaving it would have kept #10 partial. *(#5, #10)*

- [x] **15. Fix heading levels** — forecast heading `h2`→`h3`, day names
  `h3`→`h4`.

  > **Deviation — the location name was *not* promoted to `h1`.** Doing so would
  > give every detail page two `h1`s, since the layout's site title already is
  > one — an accessibility regression, not a fix. And demoting the forecast to
  > `h3` as written would have put it level with the day names, so those moved to
  > `h4`. Resulting outlines: home is `h1` → `h2` (cards); detail is `h1` → `h2`
  > (location) → `h3` (forecast) → `h4` (days). Both nest correctly.
  >
  > This leaves `h2` at `text-xl` on detail and `text-base` on home cards, which
  > is intentional: heading *level* tracks document structure, *size* tracks
  > visual hierarchy. The defect in #6 was the broken outline. *(#6)*

- [x] **16. Normalize control labels** — toggle trigger and both items,
  `text-xs font-semibold` → `text-sm font-medium`. *(#8)*

- [x] **17. Replace `mb-4` with gap** — forecast section wrapped in
  `flex flex-col gap-4`. *(#4)*

## Phase 5 — Retire the hardcoded literals ✅

- [x] **18. Settle the theme question** — **documented, not deleted.**

  > **Recommendation reversed on evidence.** The plan advised deleting the light
  > palette. Checking first: there are **37 `dark:` variants across 8 shadcn
  > primitives**, and deleting the palette means dropping the `dark` class, which
  > breaks every one. That is a refactor of vendored components, not a cleanup,
  > and an unused palette costs nothing at runtime. A comment block at the top of
  > `tokens.css` now explains why `:root` is retained, so nobody deletes it as
  > dead code later.

- [x] **19. De-literalize TemperatureToggle** — `border-white/15` deleted
  outright (a no-op: the `SelectTrigger` already carries `border-input`, and
  `--input` *is* white/15 in dark). `bg-white/10` → `bg-foreground/10`,
  `text-white/70` → `text-muted-foreground`.

  > **Latent bug found.** The trigger carried both `bg-white/10` and
  > `dark:bg-card/40` — and since `<html>` is always `dark`, the dark rule always
  > won. Its real fill was `card/40`, never the `white/10` the class list
  > implied. Removing the stale `dark:` overrides puts it on `bg-foreground/10`,
  > matching the skeleton and Add tile. *(#11, #12, #13, #19)*

- [x] **20. Document the remove-button scrim as an exception** — comment added at
  [`LocationCard.tsx`](../app/components/LocationCard.tsx). The fill was later
  tokenised to `bg-foreground/10`; only the white glyph and focus ring remain
  literal, and the comment was corrected to say so. *(#11)*

- [x] **21. De-literalize the Add tile** — `text-foreground/80` →
  `text-muted-foreground`. *(#11)*

- [x] **22. De-literalize the skeleton's inset sheen** —
  `inset-shadow-white/20` → `inset-shadow-(color:--weather-card-inset-highlight)`.
  Also converted the three shimmer bars, `bg-white/20` → `bg-foreground/20`.
  *(#11, #19)*

> **Went beyond the todos**, all under #11: the popover's `text-white` →
> `text-popover-foreground`, the select items' state colours, and the chevron's
> `text-white/50` → `text-muted-foreground`. Leaving those would have left the
> phase half-done.
>
> **Open aesthetic question.** The sheen token is **40%**, where the surfaces
> adopting it previously used 10–20%. Three surfaces now use it at geometries it
> was not tuned for. Flagged for a human eye; lower it in one place if it reads
> too hot.

## Phase 6 — Overlay material and radius tiers ✅

- [x] **23. Create the `.surface-overlay` material class** — [`globals.css`](../app/globals.css)

  > **Deviation.** The plan's `box-shadow: var(--shadow-xl)` would have used
  > Tailwind's built-in **10% black** — verified in the emitted CSS — which
  > contradicts the 24% settled in todo 1 and would leave overlays casting a
  > different colour than every card. The xl *geometry* is written explicitly
  > with `--weather-card-shadow` instead.
  >
  > **Caveat.** Because the class is unlayered it beats utilities, so
  > per-call-site overrides of fill, radius, border, or shadow will silently not
  > apply on these two components. Same tradeoff as `.weather-background--card`,
  > but now on a vendored primitive where it is less expected.

- [x] **24. Adopt it on both overlays** — [`dialog.tsx`](../components/ui/dialog.tsx)
  and [`TemperatureToggle.tsx`](../app/components/TemperatureToggle.tsx); footer
  `rounded-b-xl` → `rounded-b-2xl`. This is the real form of #15 — the two
  differed on fill, blur, border, radius, shadow, and sheen, only one of which
  was radius.

  > The dialog changed substantially: it previously had no blur, no
  > translucency, no shadow, and a `ring` instead of a border. Largest single
  > visual change in the plan. *(#12, #15, #19)*

- [x] **25. Fix select item radius** — `rounded-xl` → `rounded-lg`. *(#16)*

## Phase 7 — Dead code and documentation ✅

- [x] **26. Strip remaining leftovers** — empty `style={{}}` and a stray blank
  line in `layout.tsx`; the whitespace-only line in the detail page's header
  block; trailing spaces at `<DaysListItem ` and in `DaysListItem`'s className.
  Left alone: trailing whitespace in `icons/primitives/`, `lib/dateTime.ts` —
  pre-existing, in files this plan never touched.

- [x] **27. Update the migration doc** — [`design-token-migration.md`](design-token-migration.md)

  > **Two of its tables had become factually wrong**: it recorded the chart and
  > sidebar palettes as migrated to `tokens.css`, but Phase 1 deleted both. Fixed
  > with a "Superseded" callout plus a *Subsequent changes* section. New
  > sections: choosing where a value lives, material classes, cascade layers,
  > colour roles, and a rewritten maintenance rule.

## Phase 8 — Verify ✅

- [x] **28. `pnpm build` passes** — compiles clean, TypeScript clean, 50/50
  static pages generated.

  > `pnpm lint` reports **2 errors, both pre-existing and out of scope**:
  > `getWeatherIcon` returning a component during render in
  > [`page.tsx`](../app/[slug]/page.tsx), and a `setState`-in-effect in
  > [`WeatherContext.tsx`](../app/context/WeatherContext.tsx). Correctness issues
  > rather than visual ones — fix separately.
  >
  > Intermittent `Weather API error: 429` during static generation is upstream
  > rate limiting from repeated builds, not a code fault. It clears on its own.

- [x] **29. Visual check** — dev server driven with headless Chrome; home and
  detail pages screenshotted and inspected.

  | Check | Result |
  | --- | --- |
  | Card → skeleton swap holds still | ✅ Tile positions pixel-identical between a 350ms and a 12s capture. Geometry is also provable: all three tiles carry `weatherCardSurface` and no other box-geometry class. |
  | Three tiles share height, fill, elevation | ✅ All five tiles measure ~112px (`min-h-28`), including the Add tile, previously 104px. |
  | First card clickable at its top edge | ✅ Bar occupies 0–80px, first card starts at 96px. No overlap remains. |
  | Dialog and popover read as one material | ⚠️ Structurally guaranteed — both carry `.surface-overlay` with no competing utilities, verified in source and compiled CSS — but **not** confirmed on screen. Driving the two overlays open needs a browser automation driver, which is not installed and was not worth adding for this. |

---

## Finding coverage

All findings closed. #7 excluded — intentional.

| Finding | Closed by |
| --- | --- |
| #1 Card padding / min-height mismatch | 9, 10, 11, 12 |
| #2 Two page-container expressions | 6, 7, 8 |
| #3 Header height vs content offset, invalid `bg-` | 2, 5 |
| #4 Margin/gap mixed for one rhythm | 17 |
| #5 Supporting text differs per page | 14 |
| #6 Heading levels vs visual weight | 15 |
| #8 Control label weight pairing | 16 |
| #9 `text-shadow` applied ad hoc | 13 |
| #10 Four muted-text ladders | 1, 14 |
| #11 Hardcoded `white/*`, `black/*` | 12, 18, 19, 20, 21, 22 |
| #12 Inconsistent surface fills | 11, 12, 19, 24 |
| #13 Border alpha 10/15/20/25/40 | 12, 19 |
| #14 Unused card tokens | 3 |
| #15 Overlay radii disagree *(widened to material)* | 23, 24 |
| #16 Select item radius override | 25 |
| #17 Three elevation systems on siblings | 9, 10, 12 |
| #18 Dead `shadow-md/80` | 11 |
| #19 Inset highlight varies | 19, 22, 24 |

## Follow-ups

Not part of this plan, surfaced by it:

- The two pre-existing lint errors (todo 28).
- The 40% sheen intensity on three surfaces (Phase 5).
- `bg-black/10` on `DialogOverlay` — the modal backdrop. Same category as the
  documented scrim exception; no todo covered it, left deliberately.
