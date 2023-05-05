"use client"

import { useEffect } from "react"

export default function Client({ session }: any) {
  useEffect(() => {
    console.log(window.location)
  })
  return <div>{JSON.stringify(session)}</div>
}
