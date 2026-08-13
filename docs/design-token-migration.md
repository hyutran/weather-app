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
| `.weather-background` and its pseudo-element | This is a reusable presentation pattern driven by runtime weather variables, not a static token definition. |
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

## Maintenance rule

Add a value to `tokens.css` when it represents a reusable design decision. Keep selectors, component recipes, keyframes, resets, and Tailwind integration in `globals.css` or component-level styles. Avoid defining the same value in both files.
