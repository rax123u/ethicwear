# EthicWear

Custom static storefront for Orbit Custom hosting.

## Develop

```bash
npm install
npm run dev
```

Orbit injects `/config.js` in production. For local development:

1. Copy `.env.example` to `.env.local`
2. Set `ORBIT_API_KEY` (Public API key from Settings → Developer API)
3. Add the local origin to **Allowed origins**

`npm run dev` serves `/config.js` with `window.ORBIT_PUBLIC_API` (`baseUrl: "/api/public/v1"`) using that env var. The production stub in `public/config.js` stays keyless so Orbit can overwrite it after upload. Do not commit `.env.local`.

## Production (Orbit Custom)

```bash
npm run build
```

Zip the **contents** of `dist/` — `index.html` must be at the archive root, not inside a nested folder:

```text
site.zip
├── index.html
├── config.js      ← keyless stub; Orbit overwrites this after upload
├── favicon.svg
└── assets/
```

Upload under **Settings → Website → Custom**. The live site reads `window.ORBIT_PUBLIC_API` from Orbit’s generated `/config.js`. Do not put a client API key in the zip.
