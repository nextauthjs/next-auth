import { type NextRequest } from "next/server"
import { ImageResponse } from "next/og"

export const runtime = "edge"

// const medium = fetch(new URL("./inter-medium.woff", import.meta.url)).then(
//   (res) => res.arrayBuffer()
// )
//
// const bold = fetch(new URL("./inter-bold.woff", import.meta.url)).then((res) =>
//   res.arrayBuffer()
// )

const foreground = "hsl(0 0% 98%)"
const mutedForeground = "hsl(0 0% 53.9%)"
const background = "rgba(10, 10, 10)"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url!)
  const title = searchParams.get("title")
  const description = searchParams.get("description")

  return new ImageResponse(
    OG({
      title: title ?? "Auth.js",
      description: description ?? "Authentication for the web.",
    }),
    {
      width: 1200,
      height: 630,
      // fonts: [
      //   { name: "Inter", data: await medium, weight: 500 },
      //   { name: "Inter", data: await bold, weight: 700 },
      // ],
    }
  )
}

function OG({ title, description }: { title: string; description: string }) {
  return (
    <div
      tw="flex flex-col w-full h-full p-12"
      style={{
        color: foreground,
        background,
      }}
    >
      <div
        tw="flex flex-col justify-center rounded-2xl p-4 shadow-2xl shadow-purple-600/50"
        style={{
          background:
            "linear-gradient(to right bottom, rgb(150, 200, 255), rgb(200, 100, 255))",
        }}
      >
        <div
          tw="flex flex-col rounded-xl p-12"
          style={{
            border: "1px rgba(156,163,175,0.3)",
            background,
          }}
        >
          <p
            style={{
              fontWeight: 700,
              fontSize: "3.5rem",
              maxHeight: "14rem",
              overflow: "hidden",
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
              fontWeight: 700,
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
            fontSize: "2rem",
          }}
        >
          {description}
        </p>
      </div>
    </div>
  )
}
