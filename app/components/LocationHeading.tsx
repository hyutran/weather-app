import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

// The location name paired with its supporting line, as used by the card, the
// detail hero, and the card's loading skeleton. The pairing is the point: this
// is the app's two-tier text ladder — primary name over secondary meta, each
// with its matching shadow weight — and it was previously re-typed at all three
// sites, which is how the detail hero came to be missing `text-foreground`.
const LOCATION_HEADING_SIZE = {
  card: { name: "text-base", meta: "text-sm" },
  hero: { name: "text-lg", meta: "text-base" },
} as const;

interface LocationHeadingProps {
  name: string;
  // ReactNode rather than string: the skeleton fills this slot with a shimmer
  // placeholder instead of text. It must be inline-level or a block-displayed
  // `span` — the meta line renders as a `<p>`.
  meta: ReactNode;
  size?: keyof typeof LOCATION_HEADING_SIZE;
  // Heading level tracks the document outline; `size` tracks visual hierarchy.
  // Deliberately separate — see the Phase 4 note in visual-consistency-plan.md.
  as?: "h1" | "h2" | "h3" | "h4";
  className?: string;
}

export function LocationHeading({
  name,
  meta,
  size = "card",
  as: Heading = "h2",
  className,
}: LocationHeadingProps) {
  const sizes = LOCATION_HEADING_SIZE[size];

  return (
    <div className={className}>
      <Heading
        className={cn(
          "font-semibold text-foreground text-on-weather",
          sizes.name
        )}
      >
        {name}
      </Heading>
      <p
        className={cn(
          "text-muted-foreground text-on-weather-sm",
          sizes.meta
        )}
      >
        {meta}
      </p>
    </div>
  );
}
