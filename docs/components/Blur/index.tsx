function Blur() {
  return (
    <div className="pointer-events-none absolute right-4 top-[15vh] -z-10 h-96 w-full md:right-24">
      <div className="animate-blob absolute right-80 top-0 h-96 max-h-[800px] w-96 max-w-[900px] rounded-full bg-violet-200 opacity-60 mix-blend-multiply blur-3xl lg:h-[60vh] lg:w-[40vw] 2xl:right-96 dark:opacity-5 dark:mix-blend-overlay"></div>
      <div className="animation-delay-2000 animate-blob absolute -top-80 right-0 h-96 max-h-[800px] w-96 max-w-[900px] rounded-full bg-yellow-200 opacity-50 mix-blend-multiply blur-3xl lg:h-[60vh] lg:w-[40vw] 2xl:-right-64 2xl:-top-96 dark:opacity-5 dark:mix-blend-overlay"></div>
      <div className="animation-delay-4000 animate-blob absolute bottom-0 right-0 h-96 max-h-[800px] w-96 max-w-[900px] rounded-full bg-pink-200 opacity-50 mix-blend-multiply blur-3xl lg:-bottom-80 lg:h-[60vh] lg:w-[40vw] 2xl:-bottom-96 2xl:-right-64 dark:opacity-5 dark:mix-blend-overlay"></div>
    </div>
  )
}

export { Blur }
