import { DocsThemeConfig } from "nextra-theme-docs";
import { Link } from "@/components/Link";
import { ChildrenProps } from "@/utils/types";
import Footer from "@/components/Footer";
import { Sparkle } from "@phosphor-icons/react";
import dynamic from "next/dynamic";

const InkeepChatButton = dynamic(
  () => import("@/components/InkeepSearch").then((mod) => mod.InkeepTrigger),
  {
    ssr: false,
    loading: () => (
      <div>
        <button className="flex gap-2 items-center py-1.5 px-3 text-base leading-tight text-gray-800 rounded-lg transition-colors md:text-sm dark:text-gray-200 bg-black/[.05] dark:bg-gray-50/10">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            fill="currentColor"
            viewBox="0 0 256 256"
          >
            <path d="M197.58,129.06l-51.61-19-19-51.65a15.92,15.92,0,0,0-29.88,0L78.07,110l-51.65,19a15.92,15.92,0,0,0,0,29.88L78,178l19,51.62a15.92,15.92,0,0,0,29.88,0l19-51.61,51.65-19a15.92,15.92,0,0,0,0-29.88ZM140.39,163a15.87,15.87,0,0,0-9.43,9.43l-19,51.46L93,172.39A15.87,15.87,0,0,0,83.61,163h0L32.15,144l51.46-19A15.87,15.87,0,0,0,93,115.61l19-51.46,19,51.46a15.87,15.87,0,0,0,9.43,9.43l51.46,19ZM144,40a8,8,0,0,1,8-8h16V16a8,8,0,0,1,16,0V32h16a8,8,0,0,1,0,16H184V64a8,8,0,0,1-16,0V48H152A8,8,0,0,1,144,40ZM248,88a8,8,0,0,1-8,8h-8v8a8,8,0,0,1-16,0V96h-8a8,8,0,0,1,0-16h8V72a8,8,0,0,1,16,0v8h8A8,8,0,0,1,248,88Z"></path>
          </svg>
          Ask AI
        </button>
      </div>
    ),
  }
);

const config: DocsThemeConfig = {
  logo: (
    <div className="flex flex-row items-center">
      <img src="/img/etc/logo-sm.webp" width="30" />
      <span className="ml-2 text-xl font-black">Auth.js</span>
    </div>
  ),
  components: {
    a: (props: ChildrenProps) => <Link href="" {...props} />,
  },
  project: {
    link: "https://github.com/nextauthjs/next-auth",
  },
  darkMode: true,
  color: {
    hue: {
      light: 268,
      dark: 280,
    },
    saturation: {
      light: 100,
      dark: 50,
    },
  },
  navbar: {
    extraContent: (
      <div className="flex gap-4 items-center !h-12">
        <InkeepChatButton />
        <div className="relative">
          <Link
            className="p-2"
            href="https://github.com/nextauthjs/next-auth"
            target="_blank"
          >
            <svg
              className="size-4"
              width="24"
              height="24"
              fill="currentColor"
              viewBox="3 3 18 18"
              xmlns="http://www.w3.org/2000/svg"
            >
              <title>GitHub</title>
              <path d="M12 3C7.0275 3 3 7.12937 3 12.2276C3 16.3109 5.57625 19.7597 9.15374 20.9824C9.60374 21.0631 9.77249 20.7863 9.77249 20.5441C9.77249 20.3249 9.76125 19.5982 9.76125 18.8254C7.5 19.2522 6.915 18.2602 6.735 17.7412C6.63375 17.4759 6.19499 16.6569 5.8125 16.4378C5.4975 16.2647 5.0475 15.838 5.80124 15.8264C6.51 15.8149 7.01625 16.4954 7.18499 16.7723C7.99499 18.1679 9.28875 17.7758 9.80625 17.5335C9.885 16.9337 10.1212 16.53 10.38 16.2993C8.3775 16.0687 6.285 15.2728 6.285 11.7432C6.285 10.7397 6.63375 9.9092 7.20749 9.26326C7.1175 9.03257 6.8025 8.08674 7.2975 6.81794C7.2975 6.81794 8.05125 6.57571 9.77249 7.76377C10.4925 7.55615 11.2575 7.45234 12.0225 7.45234C12.7875 7.45234 13.5525 7.55615 14.2725 7.76377C15.9937 6.56418 16.7475 6.81794 16.7475 6.81794C17.2424 8.08674 16.9275 9.03257 16.8375 9.26326C17.4113 9.9092 17.76 10.7281 17.76 11.7432C17.76 15.2843 15.6563 16.0687 13.6537 16.2993C13.98 16.5877 14.2613 17.1414 14.2613 18.0065C14.2613 19.2407 14.25 20.2326 14.25 20.5441C14.25 20.7863 14.4188 21.0746 14.8688 20.9824C16.6554 20.364 18.2079 19.1866 19.3078 17.6162C20.4077 16.0457 20.9995 14.1611 21 12.2276C21 7.12937 16.9725 3 12 3Z"></path>
            </svg>
          </Link>
          <div className="github-counter">20k</div>
        </div>
      </div>
    ),
  },
  sidebar: {
    defaultMenuCollapseLevel: 1,
  },
  head: (
    <>
      <link
        rel="icon"
        href="/favicon-32x32.png"
        sizes="32x32"
        type="image/png"
      />
      <link
        rel="icon"
        href="/favicon-16x16.png"
        sizes="16x16"
        type="image/png"
      />
      <link rel="icon" href="/favicon.ico" type="image/x-icon" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta property="og:url" content="https://authjs.dev" />
      <meta property="og:title" content="Auth.js" />
      <meta property="og:description" content="Authentication for the Web" />
    </>
  ),
  banner: {
    content: (
      <>
        Migrating from NextAuth.js v4? Read{" "}
        <a style={{ textDecoration: "underline" }} href="/docs/migrating-to-v5">
          <b>our migration guide</b>
        </a>
        .
      </>
    ),
    dismissible: true,
  },
  toc: {
    extraContent: <span data-todo="potential spot for ad?"></span>,
    backToTop: true,
  },
  docsRepositoryBase: "https://github.com/nextauthjs/next-auth/docs",
  footer: {
    component: <Footer />,
  },
};

export default config;
