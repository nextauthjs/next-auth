import { useEffect, useState } from "react"
import dynamic from "next/dynamic"
import manifest from "@/data/manifest.json"

const Logo = dynamic(() => import("./logo").then((mod) => mod.Logo), {
  ssr: false,
})

const clamp = (min: number, num: number, max: number) =>
  Math.min(Math.max(num, min), max)

function changeScale() {
  if (typeof window !== "undefined") {
    const width = window.innerWidth
    return clamp(40, Number((40 + width * 0.01).toFixed(2)), 80)
  }
}

function changeLogoCount() {
  if (typeof window !== "undefined") {
    const width = window.innerWidth
    return clamp(10, Number((10 + width * 0.004).toFixed(0)), 30)
  }
}

export const LogosMarquee = () => {
  const [scale, setScale] = useState(changeScale)
  const [logoCount, setLogoCount] = useState(changeLogoCount)

  useEffect(() => {
    // Window resize handling
    function handleEvent() {
      setScale(changeScale)
      setLogoCount(changeLogoCount)
    }

    window.addEventListener("resize", handleEvent)
    return () => window.removeEventListener("resize", handleEvent)
  }, [])

  return (
    <div className="pointer-events-none absolute left-0 top-0 h-full w-full opacity-30">
      {Object.entries(manifest.providersOAuth)
        .sort(() => Math.random() - 0.5)
        .filter((_, i) => i < logoCount!)
        .map(([id, name]) => (
          <Logo providerId={id} name={name} scale={scale} key={id} />
        ))}
    </div>
  )
}
