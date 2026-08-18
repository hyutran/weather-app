import { AnimatedGroup, type AnimatedProps } from "../AnimatedGroup";

interface RainProps extends AnimatedProps {
    x?: number;
    y?: number;
    scale?: number;
}

export function Rain({ x = 0, y = 0, scale = 1, animation, delay }: RainProps) {
    return (
        <AnimatedGroup animation={animation} delay={delay}>
            <g
                transform={`translate(${x}, ${y}) scale(${scale})`}
                style={{ transformOrigin: "center" }}
                className="fill-blue-400"
            >
                <path
                    d="M12 0C12 0 0 15 0 22C0 28.6274 5.37258 34 12 34C18.6274 34 24 28.6274 24 22C24 15 12 0 12 0Z"
                    transform="translate(130, 290) rotate(15)"
                    filter="url(#whiteInnerShadow)"
                />
                <path
                    d="M12 0C12 0 0 15 0 22C0 28.6274 5.37258 34 12 34C18.6274 34 24 28.6274 24 22C24 15 12 0 12 0Z"
                    transform="translate(180, 306) rotate(15)"
                    filter="url(#whiteInnerShadow)"
                />
                <path
                    d="M12 0C12 0 0 15 0 22C0 28.6274 5.37258 34 12 34C18.6274 34 24 28.6274 24 22C24 15 12 0 12 0Z"
                    transform="translate(230, 290) rotate(15)"
                    filter="url(#whiteInnerShadow)"
                />
            </g>
        </AnimatedGroup>
    );
}
