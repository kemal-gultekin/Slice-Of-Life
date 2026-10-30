import { StrictMode } from "react";
import "lenis/dist/lenis.css";
import { createRoot } from "react-dom/client";
import App from "./App";
import { LangProvider } from "./i18n";
import { CartProvider } from "./lib/cart";
import "./styles.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <LangProvider>
      <CartProvider>
        <App />
      </CartProvider>
    </LangProvider>
  </StrictMode>,
);
