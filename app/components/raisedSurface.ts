// Fill and edge lighting for the app's raised translucent chrome: the loading
// skeleton, the add-location tile, and the temperature toggle. None of them sit
// on a weather gradient, so instead of being painted they take a flat tint of
// the foreground plus a one-pixel sheen along the top edge to read as lifted.
//
// Companion to `weatherCardSurface`, which owns geometry and elevation and is
// deliberately fill-free. The split is along the axis the consumers differ on:
// the two tiles share geometry with the weather card but not its gradient,
// while the toggle shares this fill but is a pill, not a tile.
export const raisedSurface =
  "bg-foreground/10 inset-shadow-xs inset-shadow-(color:--weather-card-inset-highlight)";
