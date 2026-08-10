interface SunProps {
  x?: number;
  y?: number;
}

export function Sun({ x = 0, y = 0 }: SunProps) {
  return (
    <>
      <circle 
        cx={192 + x}
        cy={192 + y}
        r="170"
        fill="url(#yellowGlow)"
        // opacity={0.7}
        className="animate-pulse"
        style={{ transformOrigin: "center" }}
      />
      <circle
        cx={192 + x}
        cy={192 + y}
        r="104"
        fill="url(#yellowGradient)"
        filter="url(#whiteInnerShadow)"
      />
    </>
  );
}