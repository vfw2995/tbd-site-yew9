import { useEffect } from "react";

function setOrCreateMeta(selector: string, attr: string, attrVal: string, content: string) {
  let el = document.querySelector<HTMLMetaElement>(selector);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, attrVal);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

export function Seo({
  title,
  description,
  ogImage,
  fullTitle,
}: {
  title: string;
  description?: string;
  ogImage?: string;
  fullTitle?: string;
}) {
  useEffect(() => {
    const resolvedTitle = fullTitle ?? `${title} | TBD, Mortgage Loan Officer`;
    document.title = resolvedTitle;

    if (description) {
      setOrCreateMeta('meta[name="description"]', "name", "description", description);
      setOrCreateMeta('meta[property="og:description"]', "property", "og:description", description);
    }

    setOrCreateMeta('meta[property="og:title"]', "property", "og:title", resolvedTitle);

    if (ogImage) {
      setOrCreateMeta('meta[property="og:image"]', "property", "og:image", ogImage);
    }
  }, [title, description, ogImage, fullTitle]);

  return null;
}
