// Shared geometry and elevation for the three tiles in the location list: the
// weather card, its loading skeleton, and the add-location trigger. All three
// sit adjacent in one list, so any divergence here surfaces as a layout shift
// the moment a skeleton is replaced by the card it stood in for.
//
// Fill is deliberately excluded. The weather card paints a gradient through
// `.weather-background--card` — which, being unlayered CSS, also supersedes the
// drop shadow below with its own directional inset lighting — while the other
// two take a flat raised tint.
export const weatherCardSurface =
  "min-h-28 rounded-4xl px-6 py-8 shadow-sm shadow-(color:--weather-card-shadow) sm:px-7 xl:px-8";
