<div align="center">

# 🍕 Slice of Life

**Where every slice feels like home.**

A cinematic, scroll-driven website for **Slice of Life** — a pizza place in Ortaköy, Lefkoşa.
Dive into a wood-fired oven, watch a pizza build itself from dough to box, browse the full menu and order straight on WhatsApp.

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-7-646CFF?logo=vite&logoColor=white)](https://vite.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![GSAP](https://img.shields.io/badge/GSAP-ScrollTrigger-88CE02?logo=greensock&logoColor=white)](https://gsap.com)
[![Vercel](https://img.shields.io/badge/Deploy-Vercel-000000?logo=vercel&logoColor=white)](https://vercel.com)

### [🔗 Live demo → slice-of-life-sable.vercel.app](https://slice-of-life-sable.vercel.app)

</div>

---

## ✨ Highlights

| | |
|---|---|
| 🔥 **Oven dive** | The page opens outside a brick oven and zooms through the arch into the fire as you scroll. |
| 🍕 **Pizza story** | One pinned GSAP timeline: dough → sauce → cheese → toppings → baked → boxed, every stage on identical framing so the layers line up perfectly. |
| 📜 **Full menu** | ~90 items across 16 categories (pizza & calzone, burgers, pasta, Indian, Chinese, cocktails…) with category filters and a detail dialog. |
| ⭐ **Signature dish** | A spotlight section for the house favourite, picked from one config value. |
| 💬 **WhatsApp ordering** | Every "Order" button opens a pre-filled WhatsApp chat. No number configured → buttons disable themselves. |
| 🟢 **Live "open now" badge** | Calculated in the restaurant's own time zone (Europe/Istanbul). |
| 🌍 **English / Türkçe** | Full UI and menu translation, remembers your choice and follows the browser language. |
| 🖼️ **Gallery** | Lightbox gallery of the room, the hands and the ingredients. |
| 🧈 **Buttery feel** | Lenis smooth scroll, Framer Motion reveals, floating embers, a custom cursor and film grain. |
| ♿ **Accessible** | Skip link, keyboard-friendly dialogs, and `prefers-reduced-motion` swaps the animations for a static story. |

## 🧱 Tech stack

- **React 19** + **Vite 7** — plain SPA, no framework lock-in
- **TypeScript** everywhere
- **Tailwind CSS v4** (via `@tailwindcss/vite`)
- **GSAP + ScrollTrigger** for the pinned scroll scenes
- **Framer Motion** for UI transitions, **Lenis** for smooth scrolling
- **Lucide** icons
- **Vitest** + **Testing Library** for tests, **ESLint** + **Prettier** for code style

## 🚀 Getting started

```bash
npm install
npm run dev       # http://localhost:5173
```

| Command | What it does |
|---|---|
| `npm run dev` | Start the dev server with hot reload |
| `npm run build` | Type-check and build for production → `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm test` | Run the test suite |
| `npm run lint` | Lint the project |
| `npm run format` | Format everything with Prettier |

## ☁️ Deploy

`dist/` is a fully static site. It's ready for **Vercel** out of the box (`vercel.json` included) and works just as well on Netlify or Cloudflare Pages:

- **Build command:** `npm run build`
- **Output directory:** `dist`

## 🗂️ Project structure

```
src/
├── assets/            # Pizza-story stages, oven photos, dish & gallery images (.webp)
├── components/        # One component per section (OvenDive, PizzaStoryAnimation, MenuSection…)
├── config/
│   └── siteConfig.ts  # ⭐ Business info: address, hours, WhatsApp, socials
├── data/
│   ├── menu.ts        # ⭐ The menu
│   └── gallery.ts     # ⭐ Gallery images
├── i18n/              # English & Turkish dictionaries + menu translations
├── lib/               # Smooth scroll, "open now" logic, helpers
├── utils/whatsapp.ts  # Builds every WhatsApp link
└── test/              # Vitest + Testing Library
```

## ✏️ Editing content

Everything the owner might change lives in **three files** — components only read from them.

**Business info** — [`src/config/siteConfig.ts`](src/config/siteConfig.ts)
Address, map link, opening hours, phone and socials. `whatsappNumber` is international format, digits only (e.g. `905338560333`); set it to `""` to disable all WhatsApp buttons.

**Menu** — [`src/data/menu.ts`](src/data/menu.ts)
Each item has a name, category, description, ingredients, `price` (in ₺), and optional `image` / `dietary`. Use `price: null` when a price isn't confirmed — the site shows *"Price on request"* instead of guessing. `signatureId` chooses the spotlight dish. Turkish names go in [`src/i18n/menuTr.ts`](src/i18n/menuTr.ts).

**Gallery** — [`src/data/gallery.ts`](src/data/gallery.ts)

**Images** — replace files in `src/assets/` keeping the same filename. The pizza-story images (`stage-*.webp`, `box-*.webp`) must keep the same square framing and pizza position, otherwise the layers won't line up during the animation.

## 📝 Still to come

- [ ] Real photos of the restaurant, team and dishes (current dish & story images are AI-generated illustrations)
- [ ] Verified Instagram / Facebook links (`socials` in `siteConfig.ts`)
- [ ] Dietary information per dish
- [ ] Confirm prices still marked "Price on request"

## 📸 Photo credits

Oven-dive photos are from [Unsplash](https://unsplash.com) (free under the Unsplash License):

- `oven-outer.webp` — https://unsplash.com/photos/souvaTHUJkY
- `oven-arch.webp` — https://unsplash.com/photos/4GNyMaoOV8c
- `oven-fire.webp` — https://unsplash.com/photos/U_2AlnfIGIU

---

<div align="center">

📍 Gazeteci Hasan Tahsin Cd 26-a, Ortaköy, Lefkoşa · 🕚 Open daily 11 AM – 11 PM

Made with 🍅, 🧀 and a lot of scrolling.

</div>
