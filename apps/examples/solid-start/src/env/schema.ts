import { z } from "zod"

export const serverScheme = z.object({
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  GITHUB_ID: z.string(),
  GITHUB_SECRET: z.string(),
  AUTH_SECRET: z.string(),
  NEXTAUTH_URL: z.string().optional(),
})

export const clientScheme = z.object({
  MODE: z.enum(["development", "production", "test"]).default("development"),
})
