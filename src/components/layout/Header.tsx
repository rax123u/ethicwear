import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { MobileNav } from "@/components/layout/MobileNav";
import { useCart } from "@/context/CartContext";
import { useSite } from "@/context/SiteContext";
import { useWishlist } from "@/context/WishlistContext";
import { useOverDarkNav } from "@/hooks/useOverDarkNav";
import { storeName } from "@/lib/catalog";
import { cn } from "@/lib/cn";

const NAV = [
  { to: "/shop", label: "Shop" },
  { to: "/categories", label: "Index" },
  { to: "/journal", label: "Journal" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
];

export function Header() {
  const { settings } = useSite();
  const { count } = useCart();
  const { count: saved } = useWishlist();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const overDark = useOverDarkNav();
  const name = storeName(settings);

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const media = window.matchMedia("(min-width: 1024px)");
    const closeDesktop = () => {
      if (media.matches) setOpen(false);
    };
    media.addEventListener("change", closeDesktop);
    return () => media.removeEventListener("change", closeDesktop);
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div
        className={cn(
          "relative z-50 flex items-center justify-between px-5 py-5 md:px-8 transition-colors duration-300",
          open && "bg-noir text-paper",
          !open && overDark && "text-paper",
          !open && !overDark && "text-ink",
        )}
      >
        <Link
          to="/"
          className="font-display text-[1.35rem] leading-none tracking-[-0.04em] md:text-[1.6rem]"
        >
          {name}
        </Link>

        <nav className="hidden items-center gap-8 text-[0.72rem] uppercase tracking-[0.26em] lg:flex">
          {NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                cn("transition-opacity hover:opacity-60", isActive && "opacity-60")
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-5 text-[0.72rem] uppercase tracking-[0.26em]">
          <Link to="/search" className="hidden sm:block hover:opacity-60">
            Search
          </Link>
          <Link to="/wishlist" className="hover:opacity-60">
            Saved{saved ? ` ${saved}` : ""}
          </Link>
          <Link to="/cart" className="hover:opacity-60">
            Cart{count ? ` ${count}` : ""}
          </Link>
          <button
            type="button"
            className="flex items-center gap-3 lg:hidden"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Close menu" : "Open menu"}
          >
            <span className="text-[0.72rem] uppercase tracking-[0.26em]">
              {open ? "Close" : "Menu"}
            </span>
            <span className={cn("menu-mark", open && "is-open")} aria-hidden="true">
              <span />
              <span />
            </span>
          </button>
        </div>
      </div>

      <MobileNav open={open} onClose={() => setOpen(false)} />
    </header>
  );
}
