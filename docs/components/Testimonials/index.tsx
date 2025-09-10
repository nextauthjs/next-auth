import React from "react"
import TestimonialCard from "./Card"

import { VercelIcon } from "@/components/Icons/VercelIcon"
import { ChatGPTIcon } from "@/components/Icons/ChatGPTIcon"
import { CalIcon } from "@/components/Icons/CalIcon"
import { T3Icon } from "@/components/Icons/T3Icon"
import { ArtlistIcon } from "@/components/Icons/Artlist"
import { DubIcon } from "@/components/Icons/DubIcon"

export default function Testimonials() {
  return (
    <section className="w-full bg-white py-16 sm:py-24 dark:bg-neutral-950">
      <div className="mx-auto max-w-7xl px-8">
        <div className="flex flex-col items-center gap-12">
          <h2 className="text-center text-3xl font-bold tracking-tight text-neutral-800 dark:text-neutral-200">
            Trusted by the best in the game
          </h2>
          <div className="grid w-full grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <TestimonialCard
              icon={ChatGPTIcon}
              title="ChatGPT"
              iconClassName="h-10"
            >
              The category-defining generative AI platform from OpenAI, enabling
              developers to build intelligent applications.
            </TestimonialCard>

            <TestimonialCard
              icon={CalIcon}
              title="Cal.com"
              iconClassName="h-6 mt-2"
            >
              Open-source scheduling infrastructure for everyone, from
              individuals to enterprise scale.
            </TestimonialCard>

            <TestimonialCard
              icon={VercelIcon}
              title="Vercel"
              iconClassName="h-10"
            >
              Vercel provides the developer tools and cloud infrastructure to
              build, scale, and secure a faster, more personalized web.
            </TestimonialCard>

            <TestimonialCard
              icon={DubIcon}
              title="Dub.co"
              iconClassName="h-10 w-10"
            >
              An open-source link management tool for modern marketing teams to
              create, share, and track short links.
            </TestimonialCard>

            <TestimonialCard
              icon={T3Icon}
              title="The T3 Stack"
              iconClassName="h-8"
            >
              An opinionated, modular stack focused on simplicity, and type
              safety, recommending Auth.js as its primary auth solution.
            </TestimonialCard>

            <TestimonialCard
              icon={ArtlistIcon}
              title="Artlist"
              iconClassName="h-6"
            >
              A creative powerhouse providing creators with royalty-free music,
              SFX, stock footage, and video editing software.
            </TestimonialCard>
          </div>
        </div>
      </div>
    </section>
  )
}
