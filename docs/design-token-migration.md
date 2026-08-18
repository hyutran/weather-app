# Design Token Migration Report

## Outcome

Reusable design values now live in `app/styles/tokens.css`. `app/globals.css` remains the integration layer for Tailwind theme mappings, global keyframes, base element styles, and shared CSS patterns.

## Moved from `globals.css`

| Token group | Values | Reason |
| --- | --- | --- |
| Semantic colors | `--background`, `--foreground`, `--card`, `--popover`, `--primary`, `--secondary`, `--muted`, `--accent`, `--destructive`, `--border`, `--input`, `--ring`, and foreground pairs | These are reusable design decisions whose meaning is independent of Tailwind or a specific component. |
| Chart colors | `--chart-1` through `--chart-5` | The chart palette is part of the shared visual language and may be consumed by multiple visualizations. |
| Sidebar colors | `--sidebar` and its foreground, primary, accent, border, and ring variants | These are semantic component-family tokens with light and dark values. |
| Shape | `--radius` | This is the source value for the application's derived radius scale. |
| Theme overrides | The complete `.dark` token override block | Theme values belong beside their default token definitions, providing one source of truth for theming. |
| Motion values | `--animation-duration`, `--animation-duration-fast`, and `--animation-delay` | Timings are reusable motion tokens; animation names and keyframes remain framework integration code. |

> **Superseded.** The chart and sidebar rows above no longer describe the
> codebase. Both palettes were deleted in the visual consistency pass — see
> [Subsequent changes](#subsequent-changes-visual-consistency-pass).

## Added during the migration

| Token | Purpose |
| --- | --- |
| `--app-background-start` | Semantic starting color for the application canvas. |
| `--app-background-end` | Semantic ending color for the application canvas. |
| `--gradient-app-background` | Composite token describing the complete radial application background. |
| `--background-image-app-background` | Tailwind mapping that generates the `bg-app-background` utility. |

The raw gradient utilities in `app/layout.tsx` were replaced with `bg-app-background`. The layout now depends on the semantic role of the background rather than its current color values or gradient implementation.

## Intentionally retained in `globals.css`

| Code | Reason |
| --- | --- |
| `@import` and `@custom-variant` statements | They configure the global CSS entry point and Tailwind behavior. |
| `@theme inline` aliases | They expose design tokens to Tailwind utilities such as `bg-background`, `text-foreground`, and `bg-app-background`. |
| `@keyframes` and `--animate-*` declarations | These define executable animation behavior rather than raw design values. |
| Derived `--radius-*` mappings | They translate the base radius token into Tailwind's radius utility scale. |
| `.weather-background`, `.header-scrim`, `.surface-overlay` and their pseudo-elements | These are reusable presentation patterns — see [Material classes](#material-classes) — not static token definitions. |
| `@layer base` rules | These apply global behavior to HTML elements. |

## Dependency flow

```text
tokens.css
  reusable values and theme overrides
        ↓
globals.css
  Tailwind mappings and global behavior
        ↓
layout.tsx and components
  semantic utility consumption
```

## Subsequent changes (visual consistency pass)

A later audit found that most values proposed as *new* tokens already existed
under different names, and that several migrated tokens had no consumers at all.
See [`visual-consistency-plan.md`](visual-consistency-plan.md) for the full
record.

| Change | Detail |
| --- | --- |
| Deleted | `--chart-1`–`5` and all eight `--sidebar-*`, in both themes, plus their `@theme inline` mappings. Zero references; this app has no charts and no sidebar. |
| Deleted | `--weather-card-border-size` and `--weather-card-border-highlight`. Never read — the card's border comes from inset shadows in the `.weather-background--card` recipe. |
| Added | `--header-height`, the fixed app header bar's height. Consumed as `h-(--header-height)`; deliberately *not* the page content offset, which `PageShell` owns separately. |
| Retuned | `--muted-foreground` in `.dark`, 60% → 70%. The preset value read too dim over the weather gradients. |

The `:root` light palette is retained but never active — `<html>` carries a
hardcoded `dark` class. It is kept because removing that class would break 37
`dark:` variants across the shadcn primitives in `components/ui/`. Treat `:root`
as the values a future theme toggle would switch to, not as dead code.

## Choosing where a value lives

Three forms, and the test for choosing between them:

| Form | Use when | Example |
| --- | --- | --- |
| **Token** (`tokens.css`) | The value is consumed inside a CSS recipe, or referenced by another token — places a Tailwind utility cannot reach | `--weather-card-inset-highlight`, a colour slot inside a multi-layer `box-shadow` |
| **Utility** (Tailwind) | The value is applied at a call site and the existing theme already expresses it | `bg-popover/80`, `shadow-sm`, `border-input` |
| **Material class** (`globals.css`) | Several properties must travel together — fill *and* blur *and* border *and* shadow — or they will drift apart | `.weather-background--card`, `.header-scrim`, `.surface-overlay` |

A value a Tailwind utility already expresses does **not** earn a token. Adding
one creates a second name for one thing, which is what the audit spent most of
its time undoing.

## Material classes

`.weather-background--card`, `.header-scrim`, and `.surface-overlay` each bundle
a set of properties that must stay in sync. `.surface-overlay` in particular is
what keeps the dialog and the select popover identical; before it they disagreed
on fill, blur, border, radius, shadow, and sheen.

## Cascade layers

Hand-written rules in `globals.css` are **unlayered**, while Tailwind utilities
compile into the `utilities` layer. Unlayered styles win regardless of source
order. Two consequences:

- A material class always beats a competing utility. This is load-bearing for
  `.weather-background--card`, whose directional inset lighting must survive the
  `shadow-sm` that `weatherCardSurface` also applies.
- Conversely, a utility **cannot** override a property a material class sets. Do
  not expect `rounded-3xl` on a `DialogContent` to do anything; change the class
  or add a variant to it.

## Colour roles

Two text tiers, and no others in app code:

| Tier | Token | Use |
| --- | --- | --- |
| Primary | `--foreground` | Headings, temperatures, max temps |
| Secondary | `--muted-foreground` | Dates, conditions, min temps, control labels |

`--card-foreground`, `--popover-foreground`, `--secondary-foreground`, and
`--accent-foreground` are exact clones of `--foreground` in dark. They are
surface-*pair partners* — "text that sits on this surface" — not hierarchy
levels, and reading them as a ladder is what produced four parallel muted tones.
They stay for the shadcn primitives but are off-limits outside `components/ui/`.

Borders already had two tiers before the audit; keep using them as such:

| Token | Role |
| --- | --- |
| `--border` | Passive separators, e.g. between forecast rows |
| `--input` | Interactive control edges — trigger buttons, fields, the add-location tile |

One deliberate exception to all of the above: the card's remove button and the
dialog backdrop use literal `white`/`black` alphas. Both sit over arbitrary
weather imagery and must stay legible regardless of theme, so a fixed,
non-adaptive colour is correct there.

## Maintenance rule

Add a value to `tokens.css` only when it represents a reusable design decision
that a Tailwind utility cannot already express — see
[Choosing where a value lives](#choosing-where-a-value-lives). Keep selectors,
component recipes, keyframes, resets, and Tailwind integration in `globals.css`
or component-level styles. Avoid defining the same value in both files, and
before adding a colour token check whether one of the roles above already covers
it.
