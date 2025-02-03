import { ImageResponse } from "next/og"
import type { NextRequest } from "next/server"

export const runtime = "edge"

const medium = fetch(new URL("./Inter-Light.ttf", import.meta.url)).then(
  (res) => res.arrayBuffer()
)

const bold = fetch(new URL("./Inter-Bold.ttf", import.meta.url)).then((res) =>
  res.arrayBuffer()
)

const foreground = "hsl(0 0% 98%)"
const mutedForeground = "hsl(0 0% 53.9%)"
const background = "rgba(10, 10, 10, 0.90)"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url!)
  const title = searchParams.get("title")
  const description = searchParams.get("description")

  var url = `data:image/svg+xml;base64,${btoa(backgroundSvg)}`

  return new ImageResponse(
    OG({
      title: title ?? "Authentication for the Web.",
      description: description ?? "",
      bgSvg: url,
    }),
    {
      width: 1200,
      height: 630,
      fonts: [
        { name: "Inter", data: await medium, weight: 300 },
        { name: "Inter", data: await bold, weight: 800 },
      ],
    }
  )
}

function OG({
  title,
  description,
  bgSvg,
}: {
  bgSvg: string
  title: string
  description: string
}) {
  return (
    <div
      tw="flex flex-col w-full h-full pb-12 pt-16 px-16"
      style={{
        fontFamily: "'Inter', system-ui, sans-serif",
        color: foreground,
        backgroundSize: "1200 630",
      }}
    >
      <img
        tw="absolute top-0 left-0"
        style={{ width: 1200, height: 660 }}
        src={bgSvg}
      ></img>
      <div
        tw="flex flex-col justify-center rounded-2xl p-3 shadow-2xl"
        style={{
          background:
            "linear-gradient(to right bottom, rgb(40, 158, 249), rgb(91, 33, 182))",
          // New colors: "linear-gradient(to right bottom, rgb(255, 68, 0), rgb(187, 68, 204))",
        }}
      >
        <div
          tw="flex flex-col items-center rounded-xl p-12"
          style={{
            border: "1px rgba(156,163,175,0.3)",
            background,
          }}
        >
          <p
            style={{
              fontSize: "3.5rem",
              fontWeight: 300,
              maxHeight: "14rem",
              overflow: "hidden",
              textAlign: "center",
              textWrap: "balance",
            }}
          >
            {title}
          </p>
        </div>
      </div>

      <div tw="flex flex-row items-center justify-between mt-auto p-4">
        <div tw="flex">
          <img
            src="https://authjs.dev/img/logo-sm.png"
            width={77}
            height={90}
          />
          <p
            style={{
              fontWeight: 800,
              marginLeft: "1rem",
              fontSize: "2.3rem",
            }}
          >
            Auth.js
          </p>
        </div>
        <p
          style={{
            marginLeft: "3rem",
            color: mutedForeground,
            fontWeight: 300,
            fontSize: "2rem",
          }}
        >
          {description}
        </p>
      </div>
    </div>
  )
}

const backgroundSvg = `
<svg width="2560" height="1280" viewBox="0 0 2560 1280" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_511_47)">
<rect width="2560" height="1280" fill="#111111"/>
<path d="M438.668 1160.38C1283.52 617.831 3403.85 1713.01 2144.14 1267.27L1980.48 1809.63C1746.84 1726.27 1275.31 1558.8 1258.29 1555.83C1237 1552.12 -35.3605 1436.43 151.807 1269.12C242.949 1225.11 254.011 1278.96 438.668 1160.38Z" fill="url(#paint0_radial_511_47)"/>
<path d="M2335.05 977.4C1638.8 708.04 1258.25 143.506 1155 -105.091L2257.61 -196C2573.53 307.367 3031.29 1246.76 2335.05 977.4Z" fill="url(#paint1_radial_511_47)"/>
<path d="M888.078 42.3028C465.467 1294.94 73.8505 662.761 -266.668 854.807L-294.52 -12.0731C-119.086 -25.2806 234.782 -53.0437 246.789 -58.4363C261.797 -65.1771 1132.31 -620.045 1050.51 -275.273C1001.27 -160.866 980.447 -231.483 888.078 42.3028Z" fill="url(#paint2_radial_511_47)"/>
</g>
<defs>
<radialGradient id="paint0_radial_511_47" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(1016.5 939) rotate(93.0267) scale(757.557 879.417)">
<stop stop-color="#FF7722"/>
<stop offset="1" stop-color="#111111"/>
</radialGradient>
<radialGradient id="paint1_radial_511_47" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(1653 619) rotate(-46.5881) scale(548.572 1194.34)">
<stop stop-color="#BB44CC"/>
<stop offset="1" stop-color="#111111"/>
</radialGradient>
<radialGradient id="paint2_radial_511_47" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(666.999 571.116) rotate(-129.513) scale(513.947 862.777)">
<stop stop-color="rgb(40, 158, 249)"/>
<stop offset="1" stop-color="#111111"/>
</radialGradient>
<clipPath id="clip0_511_47">
<rect width="2560" height="1280" fill="white"/>
</clipPath>
</defs>
</svg>
`

// New colors - '#44BBCC', '#BB44CC', '#FF4400'
