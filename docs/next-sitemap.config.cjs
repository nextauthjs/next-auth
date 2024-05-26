/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl:
    process.env.VERCEL_ENV === "preview"
      ? process.env.VERCEL_URL
      : "https://authjs.dev",
  generateIndexSitemap: false,
  generateRobotsTxt: true,
}
