import Link from "next/link"
import React from "react"
import { CodeTabs } from "./CodeTabs"

export default function Hero() {
  return (
    <section className="flex w-full flex-col items-center gap-12 self-center px-8 py-12 pb-24 lg:pb-40 lg:pt-24 xl:px-0 dark:bg-black/50">
      <div className="container flex flex-col items-center justify-start gap-10">
        <div className="flex w-full flex-col items-center justify-center gap-6">
          <h1 className="text-center text-5xl font-black tracking-tight lg:text-7xl">
            Auth. Free. Open Source.
          </h1>
          <div className="max-w-3xl text-center text-xl font-medium text-neutral-700 dark:text-neutral-300">
            Own your user data. Connect to your own database with a simple
            adapter, any from 100+ providers, and avoid vendor lock-in forever.
          </div>
        </div>
        <div className="flex w-full max-w-xs flex-col items-center justify-center gap-4 text-lg lg:flex-row">
          <Link
            href="/getting-started"
            className="w-full rounded-lg bg-violet-600 p-4 text-center font-semibold text-white transition duration-300 hover:bg-violet-700 lg:min-w-48 dark:bg-violet-800 dark:hover:bg-violet-900"
          >
            Get Started
          </Link>
          <Link
            href="https://github.com/nextauthjs/next-auth"
            target="_blank"
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-neutral-200 bg-[#FFF4] p-4 font-semibold text-black backdrop-blur-sm transition duration-300 lg:min-w-48 dark:border-neutral-800 dark:bg-[#FFFFFF03] dark:text-white"
          >
            <svg
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17.25 6.75 22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3-4.5 16.5"
              />
            </svg>
            Source
          </Link>
        </div>
      </div>
      <CodeTabs />
    </section>
  )
}
