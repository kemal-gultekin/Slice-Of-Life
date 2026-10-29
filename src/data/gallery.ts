import hands from "@/assets/gallery-hands.webp";
import ingredients from "@/assets/gallery-ingredients.webp";
import baked from "@/assets/stage-baked.webp";
import boxOpen from "@/assets/box-open.webp";
import room from "@/assets/gallery-room.webp";
import calzone from "@/assets/calzone.webp";
import mini from "@/assets/mini-margherita.webp";

/** Replace with real restaurant photos when available. span = grid classes for the editorial layout. */
export const gallery = [
  { src: hands, alt: "Hands stretching fresh pizza dough over a floured counter", span: "md:col-span-2 md:row-span-2", w: 1024, h: 1280 },
  { src: ingredients, alt: "Fresh tomatoes, mozzarella, basil, mushrooms and olives", span: "md:col-span-2", w: 1400, h: 933 },
  { src: baked, alt: "A baked pizza with blistered crust, mozzarella and vegetables", span: "", w: 1400, h: 1400 },
  { src: mini, alt: "A small margarita pizza on dark slate", span: "", w: 1280, h: 1280 },
  { src: room, alt: "A warm, softly lit dining room in the evening", span: "md:col-span-2", w: 1400, h: 933 },
  { src: calzone, alt: "A calzone cut open with melted mozzarella", span: "", w: 1280, h: 1280 },
  { src: boxOpen, alt: "A finished pizza in a Slice of Life takeaway box", span: "", w: 1400, h: 1400 },
];
