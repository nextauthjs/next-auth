"use client"

import React from "react"
import Image from "next/image"

import CustomLink from "./custom-link"
import { Button } from "./ui/button"

export function MainNav() {
  return (
    <div className="flex items-center space-x-2 lg:space-x-6">
      <CustomLink href="/">
        <Button variant="ghost" className="p-0">
          <Image src="/logo.png" alt="Home" width="32" height="32" />
        </Button>
      </CustomLink>
    </div>
  )
}
