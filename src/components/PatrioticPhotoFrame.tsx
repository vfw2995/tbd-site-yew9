import { useAmandaContent } from "@/hooks/useAmandaContent";
import { DEFAULT_THEME_ID } from "@/lib/themes";

const NAVY = "#1e3a5f";
const RED  = "#be123c";
const GOLD = "#c9a227";

interface Props {
  src: string;
  alt: string;
  outerClassName?: string;
  imgClassName?: string;
  showBadge?: boolean;
}

export function PatrioticPhotoFrame({ src, alt, outerClassName = "", imgClassName = "", showBadge = false }: Props) {
  const { data } = useAmandaContent();
  const isMemorialDay = (data?.settings?.site_theme ?? DEFAULT_THEME_ID) === "memorial-day";

  return (
    <div className={`relative ${outerClassName}`}>
      <img
        src={src}
        alt={alt}
        className={imgClassName}
        style={isMemorialDay ? {
          border: `5px solid ${NAVY}`,
          boxShadow: `0 0 0 3px white, 0 0 0 7px ${RED}, 0 24px 50px rgba(30,58,95,0.28)`,
        } : undefined}
      />

      {isMemorialDay && (
        <>
          {/* Corner stars — positioned outside the img */}
          {["-top-4 -left-4", "-top-4 -right-4", "-bottom-4 -left-4", "-bottom-4 -right-4"].map((pos, i) => (
            <div
              key={i}
              className={`absolute ${pos} z-20 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold select-none`}
              style={{
                background: NAVY,
                border: `2px solid ${GOLD}`,
                color: GOLD,
                boxShadow: "0 2px 8px rgba(0,0,0,0.30)",
              }}
            >
              ★
            </div>
          ))}

          {/* Optional "In Honor" ribbon badge at the bottom */}
          {showBadge && (
            <div
              className="absolute -bottom-5 left-1/2 z-20 flex items-center gap-2 px-4 py-1.5 rounded-full text-white whitespace-nowrap"
              style={{
                transform: "translateX(-50%)",
                background: NAVY,
                border: `2px solid ${RED}`,
                fontSize: "9px",
                fontWeight: 700,
                letterSpacing: "0.13em",
                boxShadow: "0 3px 12px rgba(0,0,0,0.28)",
              }}
            >
              <span style={{ color: GOLD }}>★</span>
              IN HONOR OF THOSE WHO SERVED
              <span style={{ color: GOLD }}>★</span>
            </div>
          )}
        </>
      )}
    </div>
  );
}
