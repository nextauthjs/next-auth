import { ImageResponse, type NextRequest } from "next/server"

type Mode = {
  param: string
  name: string
}

const modes: Mode[] = [
  {
    param: "headless",
    name: "Next Docs Zeta",
  },
  {
    param: "ui",
    name: "Next Docs UI",
  },
  {
    param: "mdx",
    name: "Next Docs MDX",
  },
]

export const runtime = "edge"

const medium = fetch(new URL("./inter-medium.woff", import.meta.url)).then(
  (res) => res.arrayBuffer()
)

const bold = fetch(new URL("./inter-bold.woff", import.meta.url)).then((res) =>
  res.arrayBuffer()
)

const foreground = "hsl(0 0% 98%)"
const mutedForeground = "hsl(0 0% 63.9%)"
const background = "rgba(10, 10, 10)"

export async function GET(
  request: NextRequest,
  { params }: { params: { mode: string } }
) {
  const { searchParams } = new URL(request.url!)
  const title = searchParams.get("title"),
    description = searchParams.get("description")

  return new ImageResponse(
    OG({
      title: title ?? "Next Docs",
      description: description ?? "The Documentation Framework",
      mode: modes.find((mode) => mode.param === params.mode) ?? modes[0],
    }),
    {
      width: 1200,
      height: 630,
      fonts: [
        { name: "Inter", data: await medium, weight: 500 },
        { name: "Inter", data: await bold, weight: 700 },
      ],
    }
  )
}

function OG({
  title,
  description,
  mode,
}: {
  mode: Mode
  title: string
  description: string
}) {
  return (
    <div
      tw="flex flex-col w-full h-full p-12"
      style={{
        color: foreground,
        background,
      }}
    >
      <div
        tw="flex flex-col justify-center rounded-2xl p-4 shadow-2xl shadow-purple-600"
        style={{
          background:
            "linear-gradient(to right bottom, rgb(150, 200, 255), rgb(200, 100, 255))",
        }}
      >
        <div
          tw="flex flex-col rounded-2xl p-12"
          style={{
            border: "1px rgba(156,163,175,0.3)",
            background,
          }}
        >
          <p
            style={{
              fontWeight: 700,
              fontSize: "3.5rem",
            }}
          >
            {title}
          </p>
          <p
            style={{
              color: mutedForeground,
              fontSize: "2rem",
            }}
          >
            {description}
          </p>
        </div>
      </div>

      <div tw="flex flex-row items-center mt-auto p-4">
        <svg
          width="60"
          height="60"
          viewBox="0 0 24 24"
          fill="currentColor"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
          <path d="M5 3v4" />
          <path d="M19 17v4" />
          <path d="M3 5h4" />
          <path d="M17 19h4" />
        </svg>
        <p
          style={{
            fontWeight: 700,
            marginLeft: "1rem",
            fontSize: "2.3rem",
          }}
        >
          {mode.name}
        </p>
      </div>
    </div>
  )
}
