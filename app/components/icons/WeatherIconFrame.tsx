import {ReactNode, SVGProps} from "react";

interface WeatherIconFrameProps extends SVGProps<SVGSVGElement> {
    children?: ReactNode;
    }

export function WeatherIconFrame({ children, ...props }: WeatherIconFrameProps) {
    return (
        <svg
            width={384}
            height={384}
            viewBox="0 0 384 384"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
            {...props}
        >
            {children}
        </svg>
    );
}
