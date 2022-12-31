# Create JD App

This project was created using [Create JD App](https://github.com/OrJDev/create-jd-app)

## Deploying To Vercel

### Installing

```bash
npm install solid-start-vercel@latest -D
```

### Adding to vite config

```ts
import solid from "solid-start/vite";
import dotenv from "dotenv";
import { defineConfig } from "vite";
// @ts-expect-error no typing
import vercel from "solid-start-vercel";
  
export default defineConfig(() => {
  dotenv.config();
  return {
    plugins: [solid({ ssr: true, adapter: vercel({ edge: false }) })],
  };
});
  
```

### Enviroment Variables

- `ENABLE_VC_BUILD`=`1` .

### You Are Done

Create a github repo and push your code to it, then deploy it to vercel (:
