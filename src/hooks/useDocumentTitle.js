import { useEffect } from "react";

const BASE_TITLE = "Space Tourism";

/**
 * Sets document.title to "Space Tourism | {title}".
 * @param {string} title - Page name (e.g. "Home", "Destination").
 */
export function useDocumentTitle(title) {
  useEffect(() => {
    const previous = document.title;
    document.title = `${BASE_TITLE} | ${title}`;
    return () => {
      document.title = previous;
    };
  }, [title]);
}
