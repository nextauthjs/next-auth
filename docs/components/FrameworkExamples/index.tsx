import React, { useEffect, useState } from "react";
import { addClassToHast, codeToHtml } from "shikiji";
import { Framework, frameworkDetails } from "utils/frameworks";
import { RichTabs } from "@/components/RichTabs";
import Image from "next/image";
import SvelteKit from "../../public/img/etc/sveltekit.svg";
import Express from "../../public/img/etc/express.svg";
import NextJs from "../../public/img/etc/nextjs.svg";

async function renderNextJs(framework: Framework) {
  const tailwindDarkMode = document.documentElement.classList.contains("dark");

  return codeToHtml(frameworkDetails[framework].code, {
    lang: "ts",
    theme: tailwindDarkMode ? "rose-pine" : "rose-pine-moon",
    transformers: [
      {
        pre(node) {
          addClassToHast(
            node,
            "w-full h-full !px-2 !py-4 rounded-md overflow-x-scroll"
          );
        },
      },
    ],
  });
}

export function FrameworkExamples() {
  const [active, setActive] = useState<Framework>(Framework.NextJs);
  const [example, setExample] = useState("");

  useEffect(() => {
    renderNextJs(active)
      .then((code) => setExample(code))
      // eslint-disable-next-line no-console
      .catch((e) => console.error(e));
  }, [active]);

  function handleTabChange(value: Framework) {
    setActive(value);
  }

  return (
    <div className="flex justify-center w-full">
      <RichTabs
        onTabChange={handleTabChange}
        orientation="vertical"
        defaultValue="nextjs"
        className="flex flex-col justify-center !pb-4 md:flex-row md:max-w-full w-[75vw]"
      >
        <RichTabs.List className="flex flex-row gap-2 justify-start p-2 mb-4 bg-white rounded-xl shadow-md md:flex-col md:mr-4 md:mb-0 dark:bg-neutral-950">
          <RichTabs.Trigger
            value="nextjs"
            orientation="vertical"
            className="!border-0 aria-selected:!bg-violet-600/40 !h-32 !w-32 flex-1 p-4 rounded-md focus:outline-none transition-all duration-300"
          >
            <div className="flex flex-col justify-center items-center h-full">
              <Image
                width="64"
                src={NextJs}
                alt="Next.js Logo"
                className="dark:invert"
              />
            </div>
          </RichTabs.Trigger>
          <RichTabs.Trigger
            value="sveltekit"
            orientation="vertical"
            className="!border-0 aria-selected:!bg-violet-600/40 !h-32 !w-32 flex-1 p-4 rounded-md focus:outline-none transition-all duration-300"
          >
            <div className="flex flex-col justify-center items-center h-full">
              <Image width="64" src={SvelteKit} alt="Next.js Logo" />
            </div>
          </RichTabs.Trigger>
          <RichTabs.Trigger
            value="express"
            orientation="vertical"
            className="!border-0 aria-selected:!bg-violet-600/40 !h-32 !w-32 flex-1 p-4 rounded-md focus:outline-none transition-all duration-300"
          >
            <div className="flex flex-col justify-center items-center h-full dark:invert">
              <Image width="64" src={Express} alt="Next.js Logo" />
            </div>
          </RichTabs.Trigger>
        </RichTabs.List>
        <div className="md:w-[clamp(20rem,_50vw,_45rem)] w-full p-2 dark:bg-neutral-950 bg-white rounded-xl shadow-md">
          <RichTabs.Content
            orientation="vertical"
            value="nextjs"
            className="h-full"
            tabIndex={-1}
          >
            <div
              className="w-full h-full"
              dangerouslySetInnerHTML={{ __html: example }}
            />
          </RichTabs.Content>
          <RichTabs.Content
            value="sveltekit"
            className="h-full"
            tabIndex={-1}
            orientation="vertical"
          >
            <div
              className="w-full h-full"
              dangerouslySetInnerHTML={{ __html: example }}
            />
          </RichTabs.Content>
          <RichTabs.Content
            value="express"
            className="h-full"
            tabIndex={-1}
            orientation="vertical"
          >
            <div
              className="w-full h-full"
              dangerouslySetInnerHTML={{ __html: example }}
            />
          </RichTabs.Content>
        </div>
      </RichTabs>
    </div>
  );
}
