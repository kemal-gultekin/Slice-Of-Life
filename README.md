# Crust & Ember — website

Cinematic one-page site for Crust & Ember, a fictional pizzeria in Lefkoşa used as a demo brand. Built with React + Vite (plain SPA, no Lovable dependency), Tailwind v4, GSAP ScrollTrigger, Framer Motion and Lucide.

**Live demo:** https://crust-and-ember.vercel.app

## Run
```
npm install
npm run dev      # http://localhost:5173
npm run build    # production build -> dist/
npm test
```

## Deploy
`dist/` is a static site: drop it on Vercel, Netlify or Cloudflare Pages
(build command `npm run build`, output folder `dist`).

Production runs on Vercel, connected to this repo: every push to `main` redeploys
https://crust-and-ember.vercel.app automatically.

## Edit content
- **Business info / WhatsApp number:** `src/config/siteConfig.ts` — `whatsappNumber` is international format, digits only (e.g. `905550000000`). The demo ships with `""`, which disables the WhatsApp buttons; `phoneDisplay` and `mapUrl` are hidden when empty.
- **Menu:** `src/data/menu.ts` — name, description, ingredients, `price` (TRY; use `null` for "Price on request"), optional `image`, `dietary`. `signatureId` picks the spotlight dish.
- **Gallery:** `src/data/gallery.ts`.
- **Images:** replace files in `src/assets/` keeping the same filename. The six pizza-story images (`stage-*.webp`, `box-open.webp`) must keep the same square framing and pizza position so layers line up.

## Photo credits
Dish, story and gallery images are AI-generated illustrations. Oven-dive photos are from Unsplash (free under the Unsplash License):
- `oven-outer.webp` — https://unsplash.com/photos/souvaTHUJkY
- `oven-arch.webp` — https://unsplash.com/photos/4GNyMaoOV8c
- `oven-fire.webp` — https://unsplash.com/photos/U_2AlnfIGIU
