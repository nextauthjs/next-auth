import cx from "classnames"
import Image from "next/image"

export function Screenshot({ src, alt, full, className }) {
  return (
    <div
      className={cx(
        "mt-6 flex justify-center overflow-hidden rounded-xl border border-zinc-200 shadow-lg",
        full ? "bg-white" : "m-8 bg-zinc-100",
        className
      )}
    >
      <Image
        src={src}
        alt={alt}
        className={cx(
          "w-auto select-none bg-white",
          full ? "" : "ring-1 ring-gray-200"
        )}
      />
    </div>
  )
}
