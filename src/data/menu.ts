import miniMargherita from "@/assets/mini-margherita.webp";
import calzone from "@/assets/calzone.webp";
import ingredients from "@/assets/gallery-ingredients.webp";
import baked from "@/assets/stage-baked.webp";

/**
 * Menu — names, descriptions and prices (Turkish lira) for the demo brand.
 * price: null means "price on request".
 * Images are art-directed illustrations of each dish; replace with real photos when available.
 */
export type MenuItem = {
  id: string;
  name: string;
  category: Category;
  description: string;
  ingredients: string[];
  price: number | null;
  image?: string;
  dietary?: string; // only when verified
};

export const categories = ["All", "Pizza & Calzone", "Small Menu", "Starters", "Sides", "Chicken", "Burgers", "Pasta", "Salads", "Indian", "Chinese", "Desserts", "Hot Drinks", "Cold Coffees", "Cold Specials", "Soft Drinks", "Cocktails"] as const;
export type Category = Exclude<(typeof categories)[number], "All">;

const slug = (n: string) => n.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
const x = (name: string, category: Category, price: number): MenuItem => ({ id: slug(name), name, category, description: "", ingredients: [], price });

export const menu: MenuItem[] = [
  {
    id: "mini-margarita",
    name: "Mini Pizza (Margarita) 15cm",
    category: "Small Menu",
    description: "A 15cm Margarita from our small menu — simple, classic, made fresh.",
    ingredients: ["Tomato sauce", "Mozzarella"],
    price: 450,
    image: miniMargherita,
  },
  {
    id: "bbq-chicken-calzone",
    name: "BBQ Chicken Calzone",
    category: "Pizza & Calzone",
    description: "Folded pizza dough baked around chicken, mushrooms and sweetcorn with BBQ sauce.",
    ingredients: ["Mozzarella", "Chicken", "Mushrooms", "Sweetcorn", "BBQ sauce"],
    price: 690,
    image: calzone,
  },
  {
    id: "deluxe-veggie-calzone",
    name: "Deluxe Veggie Calzone",
    category: "Pizza & Calzone",
    description: "Packed with vegetables and finished with Crust & Ember's special sauce.",
    ingredients: ["Mozzarella", "Mushrooms", "Green peppers", "Onion", "Olives", "Sweetcorn", "Special sauce"],
    price: 670,
    image: baked,
  },
  {
    id: "garlic-cheesy-bread",
    name: "Garlic Cheesy Bread",
    category: "Starters",
    description: "Garlic and cheese bread, straight from the oven.",
    ingredients: ["Garlic", "Cheese"],
    price: 340,
  },
  {
    id: "sharing-plate",
    name: "Crust & Ember Sharing Plate",
    category: "Starters",
    description: "Buffalo wings, chicken tenders, onion rings, mozzarella sticks and loaded potato skin with blue cheese, BBQ and honey mustard dips.",
    ingredients: ["Buffalo wings", "Chicken tenders", "Onion rings", "Mozzarella sticks", "Loaded potato skin"],
    price: 1640,
    image: ingredients,
  },
  {
    id: "loaded-potato-skins",
    name: "Loaded Potato Skins",
    category: "Starters",
    description: "Italian pastrami, sweetcorn and melted mozzarella with blue cheese or BBQ dip.",
    ingredients: ["Italian pastrami", "Sweetcorn", "Mozzarella"],
    price: 370,
  },
  {
    id: "buffalo-wings",
    name: "Buffalo Wings",
    category: "Starters",
    description: "5 pieces with blue cheese dipping sauce.",
    ingredients: ["Chicken wings", "Buffalo sauce", "Blue cheese dip"],
    price: 430,
  },
  {
    id: "mozzarella-sticks",
    name: "Mozzarella Sticks",
    category: "Sides",
    description: "4 pieces.",
    ingredients: ["Mozzarella"],
    price: 295,
  },
  {
    id: "onion-rings",
    name: "Onion Rings",
    category: "Sides",
    description: "6 pieces with BBQ dip.",
    ingredients: ["Onion", "BBQ dip"],
    price: 260,
  },
  {
    id: "fries",
    name: "Fries Chips",
    category: "Sides",
    description: "Classic fries.",
    ingredients: ["Potatoes"],
    price: 260,
  },
  {
    id: "english-tea",
    name: "English Tea",
    category: "Hot Drinks",
    description: "Listed in two sizes (₺70 and ₺180) — ask which one you'd like.",
    ingredients: [],
    price: null,
  },
  x("Chiken Tenders", "Small Menu", 540),
  x("Mini Penne Pasta", "Small Menu", 375),
  x("Chicken Tenders", "Starters", 460),
  x("Jack Daniels Sesame Chicken Tenders", "Starters", 470),
  x("Coleslaw", "Sides", 250),
  x("Boneless Wings Menu", "Chicken", 740),
  x("Chicken Tenders Menu", "Chicken", 740),
  x("Chicken Wings Menu", "Chicken", 740),
  x("Creamy Chicken Mushroom Burger", "Chicken", 740),
  x("Sesame Chicken Menu", "Chicken", 780),
  x("Cheese Burger", "Burgers", 670),
  x("Fried Chicken Burger", "Burgers", 670),
  x("Grilled Chicken Burger", "Burgers", 670),
  x("Jack Daniels Burger", "Burgers", 770),
  x("King Burger", "Burgers", 770),
  x("Signature Burger", "Burgers", 790),
  x("Slice Special Sandwich Burger", "Burgers", 580),
  x("Smokey BBQ Burger", "Burgers", 770),
  x("Cheese Feast Alfredo", "Pasta", 770),
  x("Chicken & Bacon Penne", "Pasta", 770),
  x("Chicken Penne Pasta", "Pasta", 740),
  x("Mediteranean Vegetable Penne Pasta", "Pasta", 680),
  x("Steak Penne Pasta", "Pasta", 785),
  x("BBQ Chicken Bacon Salad", "Salads", 700),
  x("Buffalo Chicken Salad", "Salads", 650),
  x("Caesar Salad (Grilled Chicken)", "Salads", 680),
  x("Cobb Salad", "Salads", 740),
  x("Halloumi/Hellim", "Salads", 520),
  x("Rocket & Parmesan Salad", "Salads", 450),
  x("Crust & Ember Mixed Salad", "Salads", 510),
  x("Beef Vindaloo (220g)", "Indian", 880),
  x("Chicken Korma", "Indian", 710),
  x("Chicken Tika Masala", "Indian", 710),
  x("Chicken Chow Mein", "Chinese", 790),
  x("Sweet and Sour Chicken", "Chinese", 785),
  x("Sweet Chilli Chicken", "Chinese", 785),
  x("Chocolate Delight", "Desserts", 610),
  x("Crust & Ember Special Kokteyl", "Cocktails", 280),
  x("Wallnut Dream", "Desserts", 610),
  x("Americano", "Hot Drinks", 210),
  x("Cafe Latte", "Hot Drinks", 230),
  x("Cafe Latte Aroma", "Hot Drinks", 250),
  x("Cappucino", "Hot Drinks", 220),
  x("Chai Tea Latte", "Hot Drinks", 250),
  x("Double Espresso", "Hot Drinks", 150),
  x("Espresso", "Hot Drinks", 120),
  x("Espresso Con Panna", "Hot Drinks", 170),
  x("Espresso Macchiato", "Hot Drinks", 150),
  x("Filter Coffee", "Hot Drinks", 220),
  x("Herbal Tea", "Hot Drinks", 210),
  x("Hot Chocolate", "Hot Drinks", 240),
  x("Turkish Coffee", "Hot Drinks", 100),
  x("Affogato Frappe", "Cold Coffees", 270),
  x("Caramel Frappe", "Cold Coffees", 250),
  x("Chocolate Chipp Frappe", "Cold Coffees", 270),
  x("Chocolate Frappe", "Cold Coffees", 250),
  x("Coffee Frappe", "Cold Coffees", 250),
  x("Iced Americano", "Cold Coffees", 210),
  x("Iced Cafe Latte", "Cold Coffees", 240),
  x("Iced Cafe Latte Aroma", "Cold Coffees", 250),
  x("Iced Chai Tea Latte", "Cold Coffees", 270),
  x("Iced Coffee Mocha", "Cold Coffees", 260),
  x("Vanilla Frappe", "Cold Coffees", 250),
  x("Fruit Chillers", "Cold Specials", 275),
  x("Italian Soda", "Cold Specials", 260),
  x("Milk Shakes", "Cold Specials", 300),
  x("Smoothies", "Cold Specials", 280),
  x("Cappy", "Soft Drinks", 80),
  x("Coca-Cola", "Soft Drinks", 80),
  x("Coka-Cola Zero", "Soft Drinks", 80),
  x("Damla Minera", "Soft Drinks", 80),
  x("Damla Soda", "Soft Drinks", 60),
  x("Fanta", "Soft Drinks", 80),
  x("Fruit Soda", "Soft Drinks", 90),
  x("Fuse Tea (Ice Tea)", "Soft Drinks", 80),
  x("Limonata", "Soft Drinks", 250),
  x("Pelegrino", "Soft Drinks", 190),
  x("Sprite", "Soft Drinks", 80),
  x("Bloody Marry", "Cocktails", 280),
  x("Cosmopolitan", "Cocktails", 280),
  x("Long Island Ice Tea", "Cocktails", 280),
  x("Mojito", "Cocktails", 280),
  x("Negroni", "Cocktails", 280),
  x("Pina Colada", "Cocktails", 280),
  x("Sex On The Beach", "Cocktails", 280),
  x("Strawbary Daiqiri", "Cocktails", 280),
];

/** Signature spotlight item (must exist above). */
export const signatureId = "deluxe-veggie-calzone";
