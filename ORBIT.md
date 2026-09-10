# Orbit Custom Website Rules

Orbit Custom hosting is **static-only**. These rules are hard constraints.

- No Node.js, SSR runtime, Express, server functions, or database.
- Use **React + Vite** and `base: '/'`.
- Production build must contain `dist/index.html` and `dist/assets/`.
- Load `/config.js` **before** the React app.
- Read API configuration from `window.ORBIT_PUBLIC_API`.
- Never hardcode production API keys, secrets, or credentials.
- Use Orbit Public API with `Authorization: Bearer <apiKey>`.
- API endpoints start with `/api/public/v1/`.
- API responses use `{ data, error, meta }`.
- Use Orbit API for real products, categories, pages, blog, and site settings. **Do not create fake production data.**
- Public API is read-only for commerce. Do not create orders through it.
- Product checkout/purchase should link to `/shop/{productId}` or Orbit `/shop`.
- Respect Orbit currency, pricing, stock, and availability fields.
- Keep the final build under Orbit limits: **40 MB total, 5 MB per file, 400 files**.
- Never include `node_modules`, `.env`, source secrets, private keys, or unnecessary files in the production ZIP.
- Always run `npm run build` and fix all build errors before deployment.
