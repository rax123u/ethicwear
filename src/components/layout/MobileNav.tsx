import { useEffect, type CSSProperties } from "react";
import { Link } from "react-router-dom";
import { useSite } from "@/context/SiteContext";
import { categoryName, storeName } from "@/lib/catalog";
import { EDITORIAL } from "@/lib/editorial";
import { startLenis, stopLenis } from "@/lib/lenis-control";
import { cn } from "@/lib/cn";

const PRIMARY = [
  { to: "/shop", label: "Shop", hint: "The floor" },
  { to: "/categories", label: "Index", hint: "Rooms" },
  { to: "/journal", label: "Journal", hint: "Notes" },
  { to: "/about", label: "About", hint: "The house" },
];

const SECONDARY = [
  { to: "/search", label: "Search" },
  { to: "/contact", label: "Contact" },
];

export function MobileNav({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { settings, categories } = useSite();
  const name = storeName(settings);
  const rooms = categories.slice(0, 5);

  useEffect(() => {
    if (!open) {
      startLenis();
      document.body.style.removeProperty("overflow");
      return;
    }

    stopLenis();
    document.body.style.overflow = "hidden";

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      startLenis();
      document.body.style.removeProperty("overflow");
    };
  }, [open, onClose]);

  return (
    <div
      id="mobile-nav"
      role="dialog"
      aria-modal="true"
      aria-hidden={!open}
      aria-label="Navigation"
      className={cn("mobile-nav lg:hidden", open && "is-open")}
      inert={!open}
    >
      <div className="mobile-nav-panel bg-noir text-paper">
        <div className="flex min-h-[100svh] flex-col px-5 pb-8 pt-24">
          <div className="mb-8 flex items-end justify-between gap-6">
            <div>
              <p className="text-[0.62rem] uppercase tracking-[0.34em] text-bronze">
                Index
              </p>
              <p className="mt-3 font-display text-[clamp(2rem,9vw,3.4rem)] leading-none tracking-[-0.05em]">
                {name}
              </p>
            </div>
            <img
              src={EDITORIAL.silhouette}
              alt=""
              className="hidden h-24 w-20 object-cover sm:block"
            />
          </div>

          <nav className="flex-1 border-t border-line-soft">
            {PRIMARY.map((item, index) => (
              <Link
                key={item.to}
                to={item.to}
                className="mobile-nav-item group flex items-baseline justify-between gap-4 border-b border-line-soft py-5"
                style={{ "--i": index } as CSSProperties}
              >
                <span className="flex min-w-0 items-baseline gap-4 sm:gap-6">
                  <span className="w-7 shrink-0 text-[0.62rem] uppercase tracking-[0.28em] text-bronze">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="font-display text-[clamp(2.4rem,12vw,4.4rem)] leading-[0.9] tracking-[-0.05em] transition-opacity duration-300 group-active:opacity-45">
                    {item.label}
                  </span>
                </span>
                <span className="hidden text-[0.62rem] uppercase tracking-[0.24em] text-mute sm:block">
                  {item.hint}
                </span>
              </Link>
            ))}
          </nav>

          {rooms.length > 0 && (
            <div
              className="mobile-nav-item mt-8"
              style={{ "--i": 4 } as CSSProperties}
            >
              <p className="mb-4 text-[0.62rem] uppercase tracking-[0.28em] text-mute">
                Rooms
              </p>
              <div className="flex flex-wrap gap-x-5 gap-y-2">
                {rooms.map((category) => (
                  <Link
                    key={String(category.id)}
                    to={`/category/${category.id}`}
                    className="font-serif text-xl tracking-[-0.02em] underline-offset-4 active:opacity-50"
                  >
                    {categoryName(category)}
                  </Link>
                ))}
              </div>
            </div>
          )}

          <div
            className="mobile-nav-item mt-auto flex items-end justify-between gap-6 pt-10"
            style={{ "--i": 5 } as CSSProperties}
          >
            <div className="flex gap-6 text-[0.68rem] uppercase tracking-[0.26em]">
              {SECONDARY.map((item) => (
                <Link key={item.to} to={item.to} className="active:opacity-50">
                  {item.label}
                </Link>
              ))}
            </div>
            <img
              src={EDITORIAL.still}
              alt=""
              className="h-16 w-14 object-cover sm:hidden"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
