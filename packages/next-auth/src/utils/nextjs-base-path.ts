import type { NextURL } from "next/dist/server/web/next-url";

export default function (nextUrl: NextURL): string {
    const { href, origin, pathname } = nextUrl;
    const fullPathname = href.substring(origin.length);
    const index = fullPathname.indexOf(pathname);
    return fullPathname.substring(0, index);
}