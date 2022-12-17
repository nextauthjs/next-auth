import solid from "solid-start/vite";
import { defineConfig } from "vite";
import dotenv from "dotenv";
// @ts-expect-error no typings
import vercel from "solid-start-vercel";

export default defineConfig(() => {
  dotenv.config();
  return {
    plugins: [solid({ ssr: false, adapter: vercel({ edge: false }) })],
  };
});
