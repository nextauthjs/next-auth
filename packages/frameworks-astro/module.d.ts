declare module "auth:config" {
  const config: import('./server').AstroAuthConfig;
  export default config;
}
