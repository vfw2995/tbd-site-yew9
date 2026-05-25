import { useEffect } from "react";
import { useAmandaContent } from "@/hooks/useAmandaContent";
import { getTheme, DEFAULT_THEME_ID } from "@/lib/themes";

const STAR_SVG = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80'%3E%3Ctext x='40' y='54' font-size='32' text-anchor='middle' fill='%231e3a5f'%3E%E2%98%85%3C/text%3E%3C/svg%3E`;

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { data } = useAmandaContent();
  const themeId = data?.settings?.site_theme ?? DEFAULT_THEME_ID;
  const isMemorialDay = themeId === "memorial-day";

  useEffect(() => {
    const theme = getTheme(themeId);

    const existing = document.getElementById("amanda-theme-vars");
    const style = existing ?? document.createElement("style");
    style.id = "amanda-theme-vars";

    const lightLines = Object.entries(theme.light).map(([k, v]) => `  ${k}: ${v};`).join("\n");
    const darkLines = Object.entries(theme.dark).map(([k, v]) => `  ${k}: ${v};`).join("\n");

    style.textContent = `:root {\n${lightLines}\n}\n.dark {\n${darkLines}\n}`;

    if (!existing) document.head.appendChild(style);
  }, [themeId]);

  return (
    <>
      {isMemorialDay && (
        <div
          aria-hidden="true"
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 0,
            pointerEvents: "none",
            backgroundImage: `url("${STAR_SVG}")`,
            backgroundSize: "80px 80px",
            backgroundRepeat: "repeat",
            opacity: 0.045,
          }}
        />
      )}
      {children}
    </>
  );
}
