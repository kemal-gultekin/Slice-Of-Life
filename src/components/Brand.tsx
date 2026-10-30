import { Fragment } from "react";

/**
 * Keeps "Crust & Ember" (and English dish names) out of Turkish casing rules:
 * with lang="tr", CSS uppercase maps i → İ, so English words are tagged lang="en".
 */
export function Brand({ text }: { text: string }) {
  const parts = text.split(/(Crust & Ember)/);
  return (
    <>
      {parts.map((p, i) =>
        p === "Crust & Ember" ? (
          <span key={i} lang="en">{p}</span>
        ) : (
          <Fragment key={i}>{p}</Fragment>
        ),
      )}
    </>
  );
}

/** For word-split headlines: is this word part of the brand name? */
export const isBrandWord = (w: string) => /^(Crust|Ember)/.test(w);
