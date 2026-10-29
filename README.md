# Slice of Life — website

Cinematic one-page site for Slice of Life, Lefkoşa. Built with React + Vite (plain SPA, no Lovable dependency), Tailwind v4, GSAP ScrollTrigger, Framer Motion and Lucide.

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

## Edit content
- **Business info / WhatsApp number:** `src/config/siteConfig.ts` — `whatsappNumber` is international format, digits only (e.g. `905338560333`). Set to `""` to disable WhatsApp buttons.
- **Menu:** `src/data/menu.ts` — name, description, ingredients, `price` (TRY; use `null` if unverified), optional `image`, `dietary`. `signatureId` picks the spotlight dish.
- **Gallery:** `src/data/gallery.ts`.
- **Images:** replace files in `src/assets/` keeping the same filename. The six pizza-story images (`stage-*.jpg`, `box-open.jpg`) must keep the same square framing and pizza position so layers line up.

## Still needed from the owner
- Real photos of the restaurant, team and dishes (current images are AI-generated illustrations).
- Full pizza menu with prices (the current site lists only the Mini Margarita and two calzones).
- Verified Instagram / Facebook links (`socials` in siteConfig).
- Dietary information per dish.

## Photo credits
Oven-dive photos are from Unsplash (free under the Unsplash License):
- `oven-outer.webp` — https://unsplash.com/photos/souvaTHUJkY
- `oven-arch.webp` — https://unsplash.com/photos/4GNyMaoOV8c
- `oven-fire.webp` — https://unsplash.com/photos/U_2AlnfIGIU
