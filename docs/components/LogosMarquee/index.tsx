import { useEffect, useState } from "react"
import { motion } from "framer-motion"
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
          .map(([id, name]) => (
            <motion.div
              initial={{ x: `${randomFloat(-10, 80)}vw` }}
              animate={{ x: "100vw" }}
              transition={{
                delay: randomFloat(-10, 2),
                duration: randomFloat(40, 70),
                ease: "linear",
                repeat: Infinity,
                repeatType: "loop",
              }}
              style={{ 
                width: (scale ?? 60) * randomFloat(0.8, 1.2),
              }}
              key={`company-${id}`}
            >
              <motion.img
                src={`/img/providers/${id}.svg`}
                className="opacity-40 animate-orbit grayscale dark:invert"
                style={{
                  // @ts-expect-error
                  "--duration": randomFloat(20, 30),
                  "--radius": randomFloat(10, 20),
                }}
                width={logoSize}
                height={logoSize}
                alt={`${name} logo`}
              />
            </motion.div>
          ))}
    </div>
  )
}
