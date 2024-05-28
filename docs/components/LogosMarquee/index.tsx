import dynamic from "next/dynamic"

export const LogosMarquee = dynamic(() => import("./Marquee"), {
  ssr: false,
})
