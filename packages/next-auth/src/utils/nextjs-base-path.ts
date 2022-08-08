import type { NextURL } from "next/dist/server/web/next-url";

export default function (nextUrl: NextURL): string {
    const { href, origin, pathname, search } = nextUrl
    const fullPathname = search.length > 0
        ? href.slice(origin.length, -1 * search.length)
        : href.substring(origin.length)
    if (fullPathname === pathname) {
        return "";
    }
    if (pathname === "/") {
        return fullPathname;
    }
    return fullPathname.slice(0, -1 * pathname.length);
}