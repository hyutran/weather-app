import { AnimatedGroup, type AnimatedProps } from "../AnimatedGroup";

interface ThunderboltProps extends AnimatedProps {
    x?: number;
    y?: number;
    scale?: number;
}

export function Thunderbolt({
    x = 0,
    y = 0,
    scale = 1,
    animation,
    delay,
}: ThunderboltProps) {
    return (
        <AnimatedGroup animation={animation} delay={delay}>
            <polygon
                transform={`translate(${x}, ${y}) scale(${scale})`}
                style={{ transformOrigin: "center" }}
                points="204,72 84,216 192,216 180,312 300,168 192,168 204,72"
                className="fill-yellow-400"
                filter="url(#whiteInnerShadow)"
            />
        </AnimatedGroup>
    );
}
