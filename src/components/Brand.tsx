import { Fragment } from "react";

/**
 * Keeps "Slice of Life" (and English dish names) out of Turkish casing rules:
 * with lang="tr", CSS uppercase turns i → İ, which would print "SLİCE OF LİFE".
 */
export function Brand({ text }: { text: string }) {
  const parts = text.split(/(Slice of Life)/);
  return (
    <>
      {parts.map((p, i) =>
        p === "Slice of Life" ? (
          <span key={i} lang="en">{p}</span>
        ) : (
          <Fragment key={i}>{p}</Fragment>
        ),
      )}
    </>
  );
}

/** For word-split headlines: is this word part of the brand name? */
export const isBrandWord = (w: string) => /^(Slice|Life)/.test(w);
