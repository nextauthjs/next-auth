import { motion } from "framer-motion"

const logoSizePx = 96

function randomFloat(min: number, max: number): number {
  const randomValue = Math.random() * (max - min) + min
  return Number(randomValue.toFixed(2))
}

export const Logo = ({ providerId: id, name, scale }) => {
  return (
    <motion.div
      initial={{ x: `${randomFloat(-40, 40)}vw` }}
      animate={{ x: "100vw" }}
      transition={{
        delay: randomFloat(-10, 10),
        duration: randomFloat(40, 80),
        ease: "linear",
        repeat: Infinity,
        repeatType: "loop",
      }}
      style={{
        width: (scale ?? 60) * randomFloat(0.8, 1.2),
      }}
    >
      <motion.img
        src={`/img/providers/${id}.svg`}
        className="animate-orbit opacity-40 grayscale dark:invert"
        style={{
          // @ts-expect-error
          "--duration": randomFloat(20, 30),
          "--radius": randomFloat(10, 20),
        }}
        width={logoSizePx}
        height={logoSizePx}
        alt={`${name} logo`}
      />
    </motion.div>
  )
}
