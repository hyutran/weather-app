interface SnowflakeProps {
    x?: number;
    y?: number;
    scale?: number;
}

export function Snowflake({ x = 0, y = 0, scale = 1 }: SnowflakeProps) {
    return (
        <g
            transform={`translate(${192 + x}, ${300 + y}) scale(${scale})`}
            style={{ transformOrigin: "center" }}
            className="stroke-sky-200"
            strokeWidth={10}
            strokeLinecap="round"
            fill="none"
        >
            <g transform="rotate(0)">
                <line x1="0" y1="-40" x2="0" y2="40" />
                <line x1="-14" y1="-24" x2="0" y2="-40" />
                <line x1="14" y1="-24" x2="0" y2="-40" />
                <line x1="-14" y1="24" x2="0" y2="40" />
                <line x1="14" y1="24" x2="0" y2="40" />
            </g>
            <g transform="rotate(60)">
                <line x1="0" y1="-40" x2="0" y2="40" />
                <line x1="-14" y1="-24" x2="0" y2="-40" />
                <line x1="14" y1="-24" x2="0" y2="-40" />
                <line x1="-14" y1="24" x2="0" y2="40" />
                <line x1="14" y1="24" x2="0" y2="40" />
            </g>
            <g transform="rotate(120)">
                <line x1="0" y1="-40" x2="0" y2="40" />
                <line x1="-14" y1="-24" x2="0" y2="-40" />
                <line x1="14" y1="-24" x2="0" y2="-40" />
                <line x1="-14" y1="24" x2="0" y2="40" />
                <line x1="14" y1="24" x2="0" y2="40" />
            </g>
        </g>
    );
}
