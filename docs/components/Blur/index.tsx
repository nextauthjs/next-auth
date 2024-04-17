function Blur() {
  return (
    <div className="absolute right-4 w-full h-96 pointer-events-none md:right-24 -z-10 top-[15vh]">
      <div className="absolute top-0 right-80 w-96 h-96 bg-violet-200 rounded-full opacity-60 2xl:right-96 dark:opacity-5 max-h-[800px] max-w-[900px] animate-blob mix-blend-multiply blur-3xl lg:h-[60vh] lg:w-[40vw] dark:mix-blend-overlay"></div>
      <div className="absolute right-0 -top-80 w-96 h-96 bg-yellow-200 rounded-full opacity-50 2xl:-right-64 2xl:-top-96 dark:opacity-5 animation-delay-2000 max-h-[800px] max-w-[900px] animate-blob mix-blend-multiply blur-3xl lg:h-[60vh] lg:w-[40vw] dark:mix-blend-overlay"></div>
      <div className="absolute right-0 bottom-0 w-96 h-96 bg-pink-200 rounded-full opacity-50 lg:-bottom-80 2xl:-right-64 2xl:-bottom-96 dark:opacity-5 animation-delay-4000 max-h-[800px] max-w-[900px] animate-blob mix-blend-multiply blur-3xl lg:h-[60vh] lg:w-[40vw] dark:mix-blend-overlay"></div>
    </div>
  )
}

export { Blur }
