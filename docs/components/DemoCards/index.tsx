import { Link } from "@/components/Link";
import { Plus, ArrowSquareOut, GithubLogo, Flask } from "@phosphor-icons/react";

export function DemoCards() {
  return (
    <div className="flex flex-wrap gap-2 justify-around items-start mt-8 mb-12 w-full">
      {[
        {
          href: "https://next-auth-example.vercel.app/",
          img: "/img/etc/nextjs.svg",
          name: "Next.js",
          githubHref: "https://github.com/nextauthjs/next-auth-example",
          logoWidth: "40",
          wip: false,
        },
        {
          href: "https://sveltekit-auth-example.vercel.app/",
          img: "/img/etc/sveltekit.svg",
          name: "SvelteKit",
          githubHref: "https://github.com/nextauthjs/sveltekit-auth-example",
          logoWidth: "35",
          wip: true,
        },
        {
          href: "https://authjs-express-dev-app.onrender.com/",
          img: "/img/etc/express.svg",
          name: "Express",
          logoWidth: "40",
          githubHref: "https://github.com/nextauthjs/express-auth-example",
          wip: true,
        },
      ].map(({ href, name, img, logoWidth, wip, githubHref }) => (
        <div className="flex flex-col gap-2" key={name}>
          <Link
            href={`/docs/installation?framework=${name.toLowerCase()}`}
            className="flex relative flex-col flex-wrap justify-between items-center p-4 w-28 h-28 bg-white rounded-lg border border-solid shadow-lg border-slate-200 dark:border-neutral-800 dark:bg-neutral-900"
          >
            <img
              alt={name}
              src={img}
              width={logoWidth}
              className={
                name === "Express" || name === "Next.js" ? "dark:invert" : ""
              }
            />
            <div className="mt-3 text-sm">{name}</div>
            {wip ? (
              <div
                className="absolute py-1 px-3 text-sm font-semibold text-black bg-amber-300 rounded-full shadow-sm"
                style={{ right: "-30px", top: "-15px" }}
              >
                <Flask size={24} />
              </div>
            ) : null}
          </Link>
          <div className="flex gap-2">
            <a
              href={href}
              rel="noreferrer"
              title="Live Example"
              target="_blank"
              className="flex justify-center p-2 w-full text-sm rounded-md bg-slate-100 dark:bg-neutral-900"
            >
              <ArrowSquareOut size={20} />
            </a>
            <a
              href={githubHref}
              rel="noreferrer"
              title="Github Repository for Example"
              target="_blank"
              className="flex justify-center p-2 w-full text-sm rounded-md bg-slate-100 dark:bg-neutral-900"
            >
              <GithubLogo size={20} />
            </a>
          </div>
        </div>
      ))}
      <Link
        href={`/reference`}
        className="flex relative flex-col flex-wrap justify-between items-center p-4 w-28 h-28 bg-white rounded-lg border border-solid shadow-lg border-slate-200 dark:border-neutral-800 dark:bg-neutral-900"
      >
        <Plus size={36} />
        <div className="mt-3 text-sm">Add New</div>
      </Link>
    </div>
  );
}
