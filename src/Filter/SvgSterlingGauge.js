import React from "react";
import face from './face.jpeg'
import rim from './gaugeRim.png'
function SvgSterlingGauge(props) {
    return (
        <svg viewBox="0 0 255.33 170.19" {...props}>
            <defs>
                <clipPath id="sterlingGauge_svg__a" transform="translate(45.66 .6)">
                    <path d="M152 84.5a70 70 0 11-70-70 70 70 0 0170 70z" fill="none" />
                </clipPath>
                <clipPath id="sterlingGauge_svg__c" transform="translate(45.66 .6)">
                    <circle cx={82} cy={84.5} r={63.31} fill="none" />
                </clipPath>
                <radialGradient
                    id="sterlingGauge_svg__b"
                    cx={82}
                    cy={84.44}
                    r={70.64}
                    gradientUnits="userSpaceOnUse"
                >
                    <stop offset={0} stopColor="#fff" />
                    <stop offset={0.12} stopColor="#c8c8c8" />
                    <stop offset={0.24} stopColor="#949494" />
                    <stop offset={0.37} stopColor="#676767" />
                    <stop offset={0.5} stopColor="#424242" />
                    <stop offset={0.63} stopColor="#252525" />
                    <stop offset={0.75} stopColor="#101010" />
                    <stop offset={0.88} stopColor="#040404" />
                    <stop offset={1} />
                </radialGradient>
            </defs>
            <g data-name="Layer 1">
                <g clipPath="url(#sterlingGauge_svg__a)">
                    <image
                        width={143}
                        height={142}
                        transform="translate(56.16 14.1)"
                        xlinkHref={rim}
                    />
                    <path
                        d="M152.65 84.44A70.65 70.65 0 1182 13.79a70.65 70.65 0 0170.65 70.65z"
                        transform="translate(45.66 .6)"
                        style={{
                            mixBlendMode: "screen"
                        }}
                        fill="url(#sterlingGauge_svg__b)"
                    />
                </g>
                <g clipPath="url(#sterlingGauge_svg__c)">
                    <image
                        width={3260}
                        height={2173}
                        transform="scale(.08)"
                        xlinkHref={face}
                    />
                </g>
                <path d="M173.78 85.54c0-1.2 0-2.44-.14-3.68l4-.42-.24-2.28-4 .42a45.72 45.72 0 00-5.22-16.11l3.48-2-1.15-2-3.48 2a46.74 46.74 0 00-6.76-8.56 46.22 46.22 0 00-4.58-4l2.38-3.31-1.86-1.35-2.36 3.35a45.5 45.5 0 00-15.48-6.89l.84-3.94-2.24-.47-.84 3.94a47.27 47.27 0 00-16.94 0l-.84-3.94-2.24.47.84 3.94a45.5 45.5 0 00-15.48 6.89l-2.36-3.26-1.86 1.26 2.41 3.3a46.22 46.22 0 00-4.58 4 46.74 46.74 0 00-6.76 8.56l-3.48-2-1.15 2 3.48 2a45.72 45.72 0 00-5.26 16.14l-4-.42-.25 2.26 4 .42c-.1 1.24-.14 2.48-.14 3.68a46.29 46.29 0 001.89 13.17l-3.75 1.24.7 2.18 3.83-1.24a45.56 45.56 0 008.47 14.71l-3 2.7 1.53 1.7 3.1-2.79 1.51-1.61-.09-.09c-.1-.11-9.57-10.61-11.62-25.16 0-.24 0-.48-.07-.72v-.24c0-.34-.06-.67-.08-1v-.1-.38-.48-.53-.45-.95-.48-.48V83.61v-.8a43.83 43.83 0 0187.5 0v2.45a1.62 1.62 0 010 .22v2.91c0 .32 0 .65-.08 1v.25c0 .24 0 .48-.07.72-1.87 14.16-11.5 25-11.6 25.12l-.09.09 1.54 1.54 3.1 2.78 1.53-1.7-3-2.7a45.56 45.56 0 008.48-14.66l3.83 1.24.7-2.18-3.82-1.24a46.29 46.29 0 001.82-13.11z" />
                <g stroke="#000">
                    <g fill="#25333f">
                        <path
                            d="M124.93 86.51l-10.27 7.48 1.48 2 10.08-7.73a2.92 2.92 0 01-.8-.73 2.88 2.88 0 01-.49-1.02zM166.76 56.6l-5.3 3.34-32.2 23.42a2.78 2.78 0 011.21 1.61l31.7-24.32z"
                            style={{
                                strokemiterlimit: 10
                            }}
                        />
                    </g>
                    <circle
                        cx={127.72}
                        cy={85.79}
                        r={2.88}
                        style={{
                            strokemiterlimit: 10
                        }}
                        fill="none"
                        strokeWidth={3}
                    />
                </g>
                <g>
                    <path d="M122.03 117.29h-1.56a.38.38 0 00-.39.38v2.07a.38.38 0 00.39.37h1.56a.38.38 0 00.38-.37v-2.07a.38.38 0 00-.38-.38zM132.66 117.29h-1.6a.39.39 0 00-.39.38v2.07a.39.39 0 00.39.37h1.6a.39.39 0 00.39-.37v-2.07a.39.39 0 00-.39-.38zM129.09 117.29h-1.56a.39.39 0 00-.39.38v2.07a.39.39 0 00.39.37h1.56a.39.39 0 00.39-.37v-2.07a.39.39 0 00-.39-.38z" />
                    <path d="M138.46 115.6h-20.31a1 1 0 00-1 1v6.13a1 1 0 001 1h20.31a1 1 0 001-1v-6.13a1 1 0 00-1-1zm0 7.14h-20.31v-6.14h20.31z" />
                    <path d="M136.15 117.29h-1.56a.39.39 0 00-.39.38v2.07a.39.39 0 00.39.37h1.56a.39.39 0 00.39-.37v-2.07a.39.39 0 00-.39-.38zM125.56 117.29H124a.38.38 0 00-.39.38v2.07a.38.38 0 00.39.37h1.56a.38.38 0 00.38-.37v-2.07a.38.38 0 00-.38-.38z" />
                </g>
            </g>
        </svg>
    );
}

export default SvgSterlingGauge;