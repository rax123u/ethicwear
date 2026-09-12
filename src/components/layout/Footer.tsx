import { Link } from "react-router-dom";
import { useSite } from "@/context/SiteContext";
import {
  categoryName,
  contactAddress,
  contactEmail,
  contactPhone,
  pageTitle,
  socialLinks,
  storeName,
} from "@/lib/catalog";
import { Marquee } from "@/components/ui/Marquee";

const FALLBACK_EMAIL = "Gmail : ethicswear@gmail.com";
const FALLBACK_PHONE = "Phone Number : 0343 9230354";
const FALLBACK_SOCIAL = [
  { label: "Instagram", href: "https://www.instagram.com/ethicwear_store/" },
  {
    label: "TikTok",
    href: "https://www.tiktok.com/@ethicwearstore?_r=1&_t=ZN-99RqXKG2Y7i&fbclid=PAcGRvZgJleHRuA2FlbQIxMQBzcnRjBmFwcF9pZA85MzY2MTk3NDMzOTI0NTkAAadyYLvQyvUJRbmCfajTd9CH6PYhdl3A4GjNNxYkUCQHTRp1-nTCeonAHRncEA_aem_UXDQXqUDmLloplfv0ssNfQ",
  },
];

export function Footer() {
  const { settings, categories } = useSite();
  const name = storeName(settings);
  const email = contactEmail(settings) || FALLBACK_EMAIL;
  const phone = contactPhone(settings) || FALLBACK_PHONE;
  const address = contactAddress(settings);
  const social = socialLinks(settings)?.length ? socialLinks(settings) : FALLBACK_SOCIAL;
  const cmsPages = settings?.pages ?? [];

  return (
    <footer data-nav-theme="dark" className="overflow-hidden bg-noir text-paper">
      <Marquee
        text={`${name.toUpperCase()} — CLOTHING — BEAUTY — FASHION`}
        className="border-y border-line-soft py-4 font-display text-[clamp(2.4rem,7vw,6.5rem)] leading-none tracking-[-0.04em]"
      />

      <div className="grid gap-16 px-5 py-20 md:grid-cols-12 md:px-8 md:py-28">
        <div className="md:col-span-5">
          <p className="text-[0.68rem] uppercase tracking-[0.32em] text-mute">
            The house
          </p>
          <p className="mt-6 max-w-md font-serif text-xl leading-relaxed text-paper/80 md:text-2xl">
            A storefront for clothing, fashion and beauty — edited, not stacked.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-10 sm:grid-cols-3 md:col-span-7 md:grid-cols-3">
          <div>
            <p className="mb-5 text-[0.68rem] uppercase tracking-[0.28em] text-mute">
              Move
            </p>
            <ul className="space-y-2 font-display text-2xl tracking-[-0.03em] [&_a]:transition-opacity [&_a]:hover:opacity-60">
              <li><Link to="/shop">Shop</Link></li>
              <li><Link to="/categories">Index</Link></li>
              <li><Link to="/journal">Journal</Link></li>
              <li><Link to="/about">About</Link></li>
              <li><Link to="/contact">Contact</Link></li>
            </ul>
          </div>

          <div>
            <p className="mb-5 text-[0.68rem] uppercase tracking-[0.28em] text-mute">
              Rooms
            </p>
            <ul className="space-y-2 text-sm [&_a]:transition-opacity [&_a]:hover:opacity-60">
              {categories.length ? (
                categories.slice(0, 8).map((category) => (
                  <li key={String(category.id)}>
                    <Link to={`/category/${category.id}`}>{categoryName(category)}</Link>
                  </li>
                ))
              ) : (
                <li className="text-mute">No rooms published yet.</li>
              )}
            </ul>
          </div>

          <div>
            <p className="mb-5 text-[0.68rem] uppercase tracking-[0.28em] text-mute">
              Pages
            </p>
            <ul className="space-y-2 text-sm [&_a]:transition-opacity [&_a]:hover:opacity-60">
              {cmsPages.length ? (
                cmsPages.map((page) => (
                  <li key={page.slug}>
                    <Link to={`/pages/${page.slug}`}>{pageTitle(page)}</Link>
                  </li>
                ))
              ) : (
                <>
                  <li><Link to="/about">About</Link></li>
                  <li><Link to="/contact">Contact</Link></li>
                </>
              )}
            </ul>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-8 border-t border-line-soft px-5 py-10 md:flex-row md:items-end md:justify-between md:px-8">
        <div className="space-y-2 text-sm text-paper/70">
          {email && (
            <p>
              <a href={`mailto:${email}`}>{email}</a>
            </p>
          )}
          {phone && (
            <p>
              <a href={`tel:${phone.replace(/\s+/g, "")}`}>{phone}</a>
            </p>
          )}
          {address && <p className="max-w-xs">{address}</p>}
          {!email && !phone && !address && (
            <p className="text-mute">Correspondence details appear when published.</p>
          )}
        </div>

        <div className="flex flex-wrap gap-x-6 gap-y-2 text-[0.68rem] uppercase tracking-[0.24em]">
          {social.length ? (
            social.map((item) => (
              <a key={item.label} href={item.href} target="_blank" rel="noreferrer">
                {item.label}
              </a>
            ))
          ) : (
            <span className="text-mute">Social channels unpublished</span>
          )}
        </div>
      </div>

      <div className="overflow-hidden px-3 pb-4 pt-2 md:px-5">
        <p className="select-none font-display text-[clamp(4.8rem,22vw,20rem)] leading-[0.78] tracking-[-0.07em]">
          {name.toUpperCase()}
        </p>
      </div>

      <Marquee
        text="ETHICWEAR"
        reverse
        className="border-t border-line-soft py-3 text-[0.7rem] uppercase tracking-[0.42em] text-mist"
      />

      <div className="flex flex-wrap items-center justify-between gap-4 px-5 py-6 text-[0.65rem] uppercase tracking-[0.22em] text-mute md:px-8">
        <p>© {new Date().getFullYear()} {name}</p>
        <div className="flex gap-5">
          <Link to="/pages/privacy">Privacy</Link>
          <Link to="/pages/terms">Terms</Link>
          <Link to="/shop">Orbit shop</Link>
        </div>
      </div>
    </footer>
  );
}