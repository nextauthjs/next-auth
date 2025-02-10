import dynamic from "next/dynamic"

const DocSearch = dynamic(
  () => import("./wrapper").then((mod) => mod.default),
  {
    ssr: false,
  }
)

export default DocSearch
