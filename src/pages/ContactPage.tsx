import { useEffect, useState } from "react";
import { useSite } from "@/context/SiteContext";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import {
  contactAddress,
  contactEmail,
  contactPhone,
  socialLinks,
} from "@/lib/catalog";
import { fetchPage } from "@/lib/orbit";
import type { CmsPage } from "@/types/orbit";

export function ContactPage() {
  const { settings } = useSite();
  const [page, setPage] = useState<CmsPage | null>(null);
  const email = contactEmail(settings);
  const phone = contactPhone(settings);
  const address = contactAddress(settings);
  const social = socialLinks(settings);
  useDocumentTitle("Contact");

  useEffect(() => {
    void fetchPage("contact")
      .then((res) => setPage(res.data))
      .catch(() => setPage(null));
  }, []);

  return (
    <div className="pt-24">
      <section className="px-5 py-16 md:px-8 md:py-24">
        <p className="text-[0.68rem] uppercase tracking-[0.32em] text-mute">Correspondence</p>
        <h1 className="mt-4 font-display text-[clamp(4rem,13vw,11rem)] leading-[0.78] tracking-[-0.07em]">
          Contact
        </h1>
      </section>

      <section className="grid gap-16 px-5 pb-24 md:grid-cols-2 md:px-8">
        <div className="space-y-8">
          {email && (
            <div>
              <p className="text-[0.68rem] uppercase tracking-[0.28em] text-mute">Email</p>
              <a href={`mailto:${email}`} className="mt-3 block font-display text-4xl tracking-[-0.03em]">
                {email}
              </a>
            </div>
          )}
          {phone && (
            <div>
              <p className="text-[0.68rem] uppercase tracking-[0.28em] text-mute">Telephone</p>
              <a href={`tel:${phone}`} className="mt-3 block font-display text-4xl tracking-[-0.03em]">
                {phone}
              </a>
            </div>
          )}
          {address && (
            <div>
              <p className="text-[0.68rem] uppercase tracking-[0.28em] text-mute">Atelier</p>
              <p className="mt-3 max-w-sm font-serif text-2xl">{address}</p>
            </div>
          )}
          {!email && !phone && !address && (
            <p className="max-w-md font-serif text-xl text-mute">
              Contact details will appear here when they are published in Orbit site settings.
            </p>
          )}
          {social.length > 0 && (
            <div className="flex flex-wrap gap-5 pt-4 text-[0.7rem] uppercase tracking-[0.24em]">
              {social.map((item) => (
                <a key={item.label} href={item.href} target="_blank" rel="noreferrer">
                  {item.label}
                </a>
              ))}
            </div>
          )}
        </div>

        {page?.content || page?.body ? (
          <div
            className="cms-content"
            dangerouslySetInnerHTML={{ __html: page.content || page.body || "" }}
          />
        ) : (
          <p className="font-serif text-2xl leading-relaxed text-ink/70">
            Write when the season turns, or when a piece needs another look. We keep the
            correspondence as considered as the shop floor.
          </p>
        )}
      </section>
    </div>
  );
}
