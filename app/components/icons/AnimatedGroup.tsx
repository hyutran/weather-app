import type { CSSProperties, ReactNode } from "react";

// Animation carrier for the icon primitives.
//
// This has to be a wrapper element rather than a class on the primitive itself.
// The primitives position themselves with an SVG `transform` *attribute*, while
// every keyframe set below animates the CSS `transform` *property* — and a CSS
// declaration overrides the presentation attribute. Sharing one element would
// therefore let `hover`/`fall` replace the primitive's `translate(x, y)`,
// collapsing it onto the origin. Keeping the animation one level up composes
// the two transforms instead of having them fight.
// `animate-pulse` is deliberately absent: Sun applies it to one of its own two
// circles rather than to a whole primitive, so it never passes through here.
const ICON_ANIMATION = {
    hover: "animate-hover",
    fall: "animate-fall",
    flash: "animate-flash",
} as const;

export type IconAnimation = keyof typeof ICON_ANIMATION;

// Mixed into each primitive's props, so a call site reads
// `<Cloud x={80} animation="hover" delay="-2.5s" />`.
export interface AnimatedProps {
    animation?: IconAnimation;
    // Negative values start the animation mid-cycle, which is how two copies of
    // one primitive are kept out of phase. Feeds `--animation-delay`.
    //
    // Typed as a CSS seconds value rather than a bare string: a missing unit
    // (`"-2.5"`) is not a CSS time, so the browser discards the whole animation
    // shorthand and the primitive silently stops moving. Nothing reports that at
    // runtime, so it has to be caught here.
    delay?: `${number}s`;
}

interface AnimatedGroupProps extends AnimatedProps {
    children: ReactNode;
}

export function AnimatedGroup({ animation, delay, children }: AnimatedGroupProps) {
    if (!animation) {
        return <>{children}</>;
    }

    return (
        <g
            className={ICON_ANIMATION[animation]}
            style={
                delay
                    ? ({ "--animation-delay": delay } as CSSProperties)
                    : undefined
            }
        >
            {children}
        </g>
    );
}
