import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import Img from "next/image"
import manifest from "@/data/manifest.json"

const clamp = (min: number, num: number, max: number) =>
  Math.min(Math.max(num, min), max)

const logoSize = 96 // px

function randomFloat(min: number, max: number): number {
  const randomValue = Math.random() * (max - min) + min
  return Number(randomValue.toFixed(2))
}

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
    <div className="absolute top-0 left-0 w-full h-full opacity-30 pointer-events-none">
      {Object.entries(manifest.providersOAuth)
        .sort(() => Math.random() - 0.5)
        .filter((_, i) => i < logoCount!)
        .map(([key, name]) => (
          <motion.div
            initial={{ x: `${randomFloat(-20, 10)}%`, offsetDistance: "0%" }}
            animate={{ x: "100vw", offsetDistance: "100%" }}
            transition={{
              delay: randomFloat(-10, 2),
              duration: randomFloat(30, 40),
              ease: "linear",
              repeat: Infinity,
              repeatType: "loop",
            }}
            style={{
              offsetPath: "M43.25.25a43,43,0,1,1-43,43,43,43,0,0,1,43-43",
              width: (scale ?? 60) * randomFloat(0.8, 1.2),
            }}
            key={`company-${key}`}
            //initDeg={randomIntFromInterval(0, 360)}
            //direction={Math.random() > 0.5 ? "clockwise" : "counterclockwise"}
            //velocity={10}
          >
            <motion.img
              src={`/img/providers/${key}.svg`}
              className="opacity-40 grayscale dark:invert"
              width={logoSize}
              height={logoSize}
              alt={`${name} logo`}
            />
          </motion.div>
        ))}
    </div>
  )
}
