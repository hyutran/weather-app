# Visual Consistency Plan

Remediation plan for the visual inconsistencies found across the home list and
location detail pages. Findings are numbered `#1`–`#19` from the source review;
each todo below cites the findings it closes.

Finding **#7** (Minecart typeface omitted from forecast rows) is intentional and
excluded from this plan.

**Status: phases 1–3 complete (todos 1–12).** Phase 4 is next.

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
| **Token** (`tokens.css`) | The value is consumed inside a CSS recipe, or referenced by another token — places a Tailwind utility cannot reach | `--weather-card-inset-highlight`, a color slot inside a multi-layer `box-shadow` |
| **Utility** (Tailwind) | The value is applied at a call site and the existing theme already expresses it | `bg-popover/80`, `shadow-sm`, `border-input` |
| **Material class** (`globals.css`) | Several properties must travel together — fill *and* blur *and* border *and* shadow — or they will drift apart | `.weather-background--card`, `.header-scrim`, the planned `.surface-overlay` |

A value that a Tailwind utility already expresses does **not** earn a token.
Adding one creates a second name for one thing, which is the problem findings
#10, #12, and #13 are about.

**Naming note.** `--weather-card-inset-highlight` and `--weather-card-shadow`
keep their current names even though Phase 6 widens their scope beyond weather
cards (the dialog and select popover consume them too). Renaming was considered
and declined; expect to see `weather-card` tokens on non-card surfaces.

**Cascade note.** Hand-written rules in `globals.css` are *unlayered*, while
Tailwind utilities compile into the `utilities` layer. Unlayered styles win, so
a material class always supersedes a competing utility regardless of source
order. This is load-bearing for the card surface — see todo 9.

## Reuse map

What the first draft proposed, and what already covered it:

| Originally proposed | Resolution |
| --- | --- |
| `--text-secondary` | **`--muted-foreground`** already is the secondary-text token — shadcn uses it for descriptions, labels, and placeholders on base surfaces, not for text on `--muted` fills. Only its dark value changed (60% → 70%). |
| `--text-primary` | **`--foreground`**. A pure alias adds nothing. |
| `--border-subtle` | **`--border`** (separators) and **`--input`** (interactive edges) are an existing two-tier system, already used correctly by the shadcn primitives. |
| `--border-highlight` | **`--weather-card-inset-highlight`** already performs the edge-lighting job at [`globals.css`](../app/globals.css). |
| `--inset-highlight` | Same token as above. |
| `--surface-raised` | **`bg-foreground/10`**, applied at the three tile call sites. |
| `--surface-overlay` | **`bg-popover/80`** inside the Phase 6 material class. A token would orphan the `--popover` / `--popover-foreground` pair. |
| `--surface-scrim` | **`bg-black/30`** — one call site, theme-independent by design. |
| `--elevation-card` | **`shadow-sm`**. The card's hand-written shadow is byte-identical in geometry to Tailwind's `--shadow-sm`; only the color differs. |
| `--elevation-overlay` | **`shadow-xl`**, which the select popover already uses. |
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
| `spacious` | 2rem / 32px | 6rem / 96px | Detail-page hero | already correct (`gap-8`) |

Page content offset is a separate decision owned by `PageShell` (`py-24`,
96px), deliberately not tied to `--header-height` so the two can move
independently.

## Sequencing

Phases 1 → 3 were load-bearing and ran in order. Phases 4, 6, and 7 are
independent of one another. Phase 5 is blocked on the theme decision in todo 18.

## Open decisions

| # | Decision | Recommendation |
| --- | --- | --- |
| Todo 18 | Light palette: delete it and document dark-only, or wire a real theme toggle? | Delete. Adding a light theme is a feature, not a consistency fix, and the weather gradients are built for dark. |

Settled during implementation:

| # | Decision | Outcome |
| --- | --- | --- |
| Todo 1 | Shadow color: 25%, or keep the card's current 24%? | **Kept 24%.** The card is the reference element — its shadow is already tuned, and later phases converge the drifting elements (30%, 10%) onto it. Moving the correct one for a round number is the wrong direction, and the 1% is imperceptible. |
| Todo 4 | Delete the dead `--chart-*` / `--sidebar-*` blocks now, or defer to Phase 7? | **Deleted in Phase 1**, along with their `@theme inline` mappings. |
| Todo 5 | Header scrim: tinted fill, or fully transparent? | **Tinted, via a material class.** The recommended `bg-app-background/80` was not viable — see todo 5. |

---

## Phase 1 — Token corrections ✅

All work in [`app/styles/tokens.css`](../app/styles/tokens.css).

- [x] **1. Retune `--muted-foreground`** — `.dark` value set to white/70, up from
  the preset's 60%. The app had independently converged on 70–80% at four of five
  secondary-text sites, which said 60% was too dim over the weather gradients.
  Also corrected [`page.tsx`](../app/[slug]/page.tsx), the only site already
  using the token and until now the dimmest text in the app. *(#10)*

- [x] **2. Add `--header-height`** — the app header bar only, not the page
  offset. Consumed as `h-(--header-height)`, the same shorthand used at
  [`select.tsx:87`](../components/ui/select.tsx#L87); Tailwind 4.3's `--spacing`
  is a single base multiplier, so no `@theme` mapping was needed. **Set to
  `5rem`** during implementation. *(#3)*

- [x] **3. Delete the dead weather-card tokens** — `--weather-card-border-size`
  and `--weather-card-border-highlight`. Neither was referenced. *(#14)*

- [x] **4. Delete the dead palette blocks** — `--chart-1`–`5` and all eight
  `--sidebar-*`, in both themes, plus their `@theme inline` mappings. Zero
  references; this app has no charts and no sidebar.

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
  > utilities. A flat `bg-background/80` would have been wrong too — `--background`
  > is near-black while the canvas gradient is lighter blue at the top, painting a
  > visible dark band exactly where the header sits. Replaced with a
  > `.header-scrim` material class that tints with `--app-background-start` (the
  > actual canvas color at that position, so it blends) and masks both tint and
  > blur to nothing at the bottom edge. It lives on a pseudo-element because a
  > mask on the header itself would fade the title and toggle too. Lightning CSS
  > adds `-webkit-` prefixes and a `color-mix` fallback automatically.

- [x] **6. Create `PageShell`** — [`app/components/PageShell.tsx`](../app/components/PageShell.tsx)
  `mx-auto max-w-xl px-6 py-24`. Header height and page offset are now separate
  concerns. *(#2)*

- [x] **7. Adopt it on the home page** — [`LocationList.tsx`](../app/components/LocationList.tsx) *(#2)*

- [x] **8. Adopt it on the detail page** — [`page.tsx`](../app/[slug]/page.tsx)
  Container swapped and the nested `py-8` deleted; the shell now owns all page
  padding. Incidentally fixed the split className originally logged under
  todo 26. *(#2)*

## Phase 3 — Unified card surface ✅

- [x] **9. Create the shared surface recipe** — [`app/components/weatherCardSurface.ts`](../app/components/weatherCardSurface.ts)
  `min-h-28 rounded-4xl px-6 py-8 shadow-sm shadow-(color:--weather-card-shadow) sm:px-7 xl:px-8`

  > **Deviation.** Written as a plain exported string rather than cva. cva exists
  > to generate variants and there are none here; a plain constant is the same
  > class constant with less ceremony. A class constant rather than a wrapper
  > component because the three consumers have three different root elements
  > (`Link`, `div`, `DialogTrigger`), so a wrapper would need `asChild` plumbing
  > for no gain.
  >
  > **Known overlap, verified.** `.weather-background--card` sets `box-shadow` in
  > CSS, which replaces rather than merges with the recipe's `shadow-sm`. Because
  > it is unlayered and `shadow-sm` compiles into the `utilities` layer, the card's
  > declaration wins — keeping its directional insets (`inset -1px 2px 2px`), which
  > the ladder cannot express. Skeleton and Add tile take the utility. Same
  > rendering, one shadow color, ladder geometry throughout.
  >
  > Note the `shadow-(color:--…)` form: the unhinted `shadow-(--…)` would set the
  > shadow *value* rather than its color, silently producing an invalid shadow.

- [x] **10. Adopt in LocationCard** — [`LocationCard.tsx`](../app/components/LocationCard.tsx)
  Geometry was already at the target values, so nothing moved; `min-h-28` equals
  its natural height. Trailing space cleared. *(#1, #17)*

- [x] **11. Adopt in LocationCardSkeleton** — [`LocationCardSkeleton.tsx`](../app/components/LocationCardSkeleton.tsx)
  Padding grew 20/24px → 24/32px to match the real card, **killing the load-time
  layout shift**. Dead `shadow-md/80` dropped (it was overridden by the
  `shadow-black/30` that followed it); `bg-white/10` → `bg-foreground/10`.
  *(#1, #12, #18)*

- [x] **12. Adopt in the Add tile** — [`AddLocationDialog.tsx`](../app/components/AddLocationDialog.tsx)
  Removed the one-off `min-h-26` and the `shadow-lg shadow-black/10` that made it
  float above its siblings. `bg-card/40` → `bg-foreground/10`,
  `outline-white/20` → `outline-input`, `hover:outline-white/40` →
  `hover:outline-foreground/40`.

  > As predicted, this is the one element that changed character: its fill
  > flipped from *dark* translucent to *light* translucent to match the skeleton
  > beside it. Correct outcome for #12. *(#1, #12, #13, #17)*

## Phase 4 — Typography roles

- [ ] **13. Define the two text-on-weather utilities** — [`app/globals.css`](../app/globals.css)
  `.text-on-weather` (md shadow) and `.text-on-weather-sm`, then apply to every
  heading, value, and meta line over a weather surface — including the two that
  currently lack it, the Add label and the toggle. *(#9)*

- [ ] **14. Collapse supporting-text treatments to `text-muted-foreground`** —
  [`LocationCard.tsx`](../app/components/LocationCard.tsx) (`text-foreground/70`),
  [`page.tsx`](../app/[slug]/page.tsx) (`text-foreground/80`),
  [`DaysListItem.tsx`](../app/components/DaysListItem.tsx) (`text-foreground/80`).
  The detail page's date line already uses the token and needs no edit. Sizes stay
  per context — `text-sm` on cards, `text-base` on the detail page — only the
  color converges. *(#5, #10)*

- [ ] **15. Fix heading levels** — [`page.tsx`](../app/[slug]/page.tsx)
  Promote the location name to `h1` (it is the page title) and demote the
  forecast heading to `h3`, so one tag no longer carries two sizes. *(#6)*

- [ ] **16. Normalize control labels** — [`TemperatureToggle.tsx`](../app/components/TemperatureToggle.tsx), [`AddLocationDialog.tsx`](../app/components/AddLocationDialog.tsx)
  One style: `text-sm font-medium`. *(#8)*

- [ ] **17. Replace `mb-4` with gap** — [`page.tsx`](../app/[slug]/page.tsx)
  Wrap the section in `flex flex-col gap-4`. *(#4)*

## Phase 5 — Retire the hardcoded literals

- [ ] **18. Settle the theme question first** — [`layout.tsx`](../app/layout.tsx), [`tokens.css`](../app/styles/tokens.css)
  `<html>` is hardcoded `dark`, so the entire `:root` light palette is
  unreachable — which is *why* the codebase drifted into `white/10` literals.
  See the open decisions table.

- [ ] **19. De-literalize TemperatureToggle** — [`TemperatureToggle.tsx`](../app/components/TemperatureToggle.tsx)
  - **Delete `border-white/15` outright** — it is a no-op. The `SelectTrigger`
    already carries `border-input` from [`select.tsx:45`](../components/ui/select.tsx#L45),
    and `--input` *is* white/15 in dark. Removing it renders identically.
  - `bg-white/10` → `bg-foreground/10`
  - `text-white/70` → `text-muted-foreground`
  - The popover's fill, blur, border, shadow, and sheen all move to the
    `.surface-overlay` class in Phase 6. *(#11, #12, #13, #19)*

- [ ] **20. Document the remove-button scrim as an exception** — [`LocationCard.tsx`](../app/components/LocationCard.tsx)
  `bg-black/30` stays. It is theme-independent by design (its job is darkening,
  not theming) and has one call site, so a token would be ceremony. Add a
  comment saying so, then close #11 against it. *(#11)*

- [ ] **21. De-literalize the Add tile** — [`AddLocationDialog.tsx`](../app/components/AddLocationDialog.tsx)
  `text-foreground/80` → `text-muted-foreground`. Fill and outline were handled
  in todo 12. *(#11)*

- [ ] **22. De-literalize the skeleton's inset sheen** — [`LocationCardSkeleton.tsx`](../app/components/LocationCardSkeleton.tsx)
  `inset-shadow-white/20` → `inset-shadow-(color:--weather-card-inset-highlight)`,
  matching the sheen source the card and the Phase 6 overlays use. Note the
  `color:` hint, for the same reason as todo 9.

  > **Added after Phase 3.** This literal had no owner in the original plan —
  > #19's coverage assigned only the toggle and the two overlays, leaving the
  > skeleton's inset shadow as the last unclaimed `white/x` value in the app.
  > *(#11, #19)*

## Phase 6 — Overlay material and radius tiers

Target radius tiers: cards `4xl` (26px), overlays `2xl` (18px), controls `lg` (10px).

- [ ] **23. Create the `.surface-overlay` material class** — [`app/globals.css`](../app/globals.css)
  Sibling to the existing `.weather-background--card` and `.header-scrim`
  recipes, bundling the five properties that must travel together:

  ```css
  .surface-overlay {
    background-color: color-mix(in oklch, var(--popover) 80%, transparent);
    backdrop-filter: blur(24px);
    border: 1px solid var(--input);
    border-radius: var(--radius-2xl);
    box-shadow: var(--shadow-xl), inset 0 1px 0 var(--weather-card-inset-highlight);
  }
  ```

- [ ] **24. Adopt it on both overlays** — [`dialog.tsx`](../components/ui/dialog.tsx), [`TemperatureToggle.tsx`](../app/components/TemperatureToggle.tsx)
  This is the real form of #15. The two overlays differ on **five** properties,
  only one of which is radius:

  | | Dialog | Select popover |
  | --- | --- | --- |
  | Fill | `bg-popover` (opaque) | `bg-background/80` |
  | Blur | none | `backdrop-blur-xl` |
  | Border | `ring-1 ring-foreground/10` | `border-white/15` |
  | Shadow | none | `shadow-xl shadow-black/30` |
  | Sheen | none | `inset-shadow-white/10` |

  A shared class fixes all five; a radius change alone would have fixed one.
  Also update the footer's `rounded-b-xl` to match. *(#12, #15, #19)*

- [ ] **25. Fix select item radius** — [`TemperatureToggle.tsx`](../app/components/TemperatureToggle.tsx)
  `rounded-xl` → `rounded-lg`, restoring visible inset inside the 18px popover. *(#16)*

## Phase 7 — Dead code and documentation

- [ ] **26. Strip remaining leftovers** — empty `style={{}}` in
  [`layout.tsx`](../app/layout.tsx), and the stray blank line in the detail
  page's header block. (The split className originally listed here was fixed in
  todo 8.)

- [ ] **27. Update the migration doc** — [`design-token-migration.md`](design-token-migration.md)
  Record the token-vs-utility-vs-class rule from [Principles](#principles), the
  cascade-layer note, the two-tier text ladder, and the `--border` / `--input`
  distinction, so the maintenance rule at [`:55`](design-token-migration.md#L55)
  stays accurate and the next contributor does not re-derive `white/15`.

## Phase 8 — Verify

- [ ] **28.** `pnpm lint` and `pnpm build` both pass.

  > Two lint errors are **pre-existing and out of scope**: `getWeatherIcon`
  > returning a component during render in [`page.tsx`](../app/[slug]/page.tsx),
  > and a `setState`-in-effect in
  > [`WeatherContext.tsx`](../app/context/WeatherContext.tsx). Both are
  > correctness issues rather than visual ones. Fix separately.

- [ ] **29.** Run dev and check both pages:
  - card → skeleton swap holds still on load
  - all three tiles share one height, one fill character, and one elevation
  - first card is clickable at its top edge
  - dialog and select popover read as the same material

---

## Finding coverage

| Finding | Closed by | Status |
| --- | --- | --- |
| #1 Card padding / min-height mismatch | 9, 10, 11, 12 | ✅ |
| #2 Two page-container expressions | 6, 7, 8 | ✅ |
| #3 Header height vs content offset, invalid `bg-` | 2, 5 | ✅ |
| #4 Margin/gap mixed for one rhythm | 17 | |
| #5 Supporting text differs per page | 14 | |
| #6 Heading levels vs visual weight | 15 | |
| #8 Control label weight pairing | 16 | |
| #9 `text-shadow` applied ad hoc | 13 | |
| #10 Four muted-text ladders | 1, 14 | partial |
| #11 Hardcoded `white/*`, `black/*` | 12, 18, 19, 20, 21, 22 | partial |
| #12 Inconsistent surface fills | 11, 12, 19, 24 | partial |
| #13 Border alpha 10/15/20/25/40 | 12, 19 | partial |
| #14 Unused card tokens | 3 | ✅ |
| #15 Overlay radii disagree *(widened to material)* | 23, 24 | |
| #16 Select item radius override | 25 | |
| #17 Three elevation systems on siblings | 9, 10, 12 | ✅ |
| #18 Dead `shadow-md/80` | 11 | ✅ |
| #19 Inset highlight varies | 19, 22, 24 | partial |

*#7 excluded — intentional.*
