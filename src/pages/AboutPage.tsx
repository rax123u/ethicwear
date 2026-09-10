import { useEffect, useState } from "react";
import { RevealImage } from "@/components/ui/RevealImage";
import { WordReveal } from "@/components/ui/WordReveal";
import { useSite } from "@/context/SiteContext";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { storeDescription, storeName } from "@/lib/catalog";
import { EDITORIAL, MANIFESTO } from "@/lib/editorial";
import { fetchPage } from "@/lib/orbit";
import type { CmsPage } from "@/types/orbit";

export function AboutPage() {
  const { settings } = useSite();
  const [page, setPage] = useState<CmsPage | null>(null);
  const name = storeName(settings);
  const description = storeDescription(settings);
  useDocumentTitle("House");

  useEffect(() => {
    void fetchPage("about")
      .then((res) => setPage(res.data))
      .catch(() => setPage(null));
  }, []);

  return (
    <div className="pt-24">
      <section className="px-5 py-16 md:px-8 md:py-24">
        <p className="text-[0.68rem] uppercase tracking-[0.32em] text-mute">The house</p>
        <h1 className="mt-4 font-display text-[clamp(4rem,13vw,11rem)] leading-[0.78] tracking-[-0.07em]">
          About
        </h1>
      </section>

      <RevealImage src={EDITORIAL.silhouette} alt="" className="max-h-[80vh]" />

      <section className="bg-paper-2 px-5 py-24 text-ink md:px-10 md:py-36">
        <WordReveal
          text={description || MANIFESTO}
          className="max-w-6xl text-[clamp(1.6rem,4vw,3.2rem)] leading-[1.2] tracking-[-0.03em]"
        />
      </section>

      {page?.content || page?.body ? (
        <section className="px-5 py-20 md:px-8">
          <div
            className="cms-content mx-auto max-w-3xl"
            dangerouslySetInnerHTML={{ __html: page.content || page.body || "" }}
          />
        </section>
      ) : (
        <section className="grid gap-16 px-5 py-20 md:grid-cols-2 md:px-8 md:py-28">
          <h2 className="font-display text-[clamp(2.4rem,5vw,4.4rem)] leading-[0.9] tracking-[-0.04em]">
            {name} is a storefront for clothing, fashion and beauty.
          </h2>
          <p className="font-serif text-xl leading-relaxed text-ink/70">
            What appears in the shop is what Orbit has published — garments, fashion objects and
            beauty products, presented without invented claims. The house is the edit.
          </p>
        </section>
      )}
    </div>
  );
}
