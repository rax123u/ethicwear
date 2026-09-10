import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { ProductFigure } from "@/components/product/ProductFigure";
import { StatusBlock } from "@/components/ui/StatusBlock";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { useProducts } from "@/hooks/useProducts";
import { productMatchesQuery } from "@/lib/catalog";

export function SearchPage() {
  const [params, setParams] = useSearchParams();
  const q = params.get("q") || "";
  const [draft, setDraft] = useState(q);
  const { products, loading, error } = useProducts({
    page: 1,
    pageSize: 48,
    q: q || undefined,
    search: q || undefined,
  });
  const results = q ? products.filter((product) => productMatchesQuery(product, q)) : products;

  useDocumentTitle(q ? `Search: ${q}` : "Search");

  return (
    <div className="pt-24">
      <section className="px-5 py-16 md:px-8 md:py-24">
        <p className="text-[0.68rem] uppercase tracking-[0.32em] text-mute">Look through</p>
        <h1 className="mt-4 font-display text-[clamp(3.6rem,11vw,9.5rem)] leading-[0.8] tracking-[-0.06em]">
          Search
        </h1>
        <form
          className="mt-12 border-b border-line"
          onSubmit={(event) => {
            event.preventDefault();
            const next = new URLSearchParams(params);
            if (draft.trim()) next.set("q", draft.trim());
            else next.delete("q");
            setParams(next);
          }}
        >
          <input
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            placeholder="A coat. A pigment. A name."
            className="w-full bg-transparent py-5 font-serif text-2xl outline-none placeholder:text-mute md:text-4xl"
          />
        </form>
      </section>

      {loading && (
        <p className="px-5 py-16 font-serif text-xl text-mute md:px-8">Searching the catalog…</p>
      )}
      {error && (
        <StatusBlock eyebrow="Search" title="Search is unavailable.">
          <p>{error}</p>
        </StatusBlock>
      )}
      {!loading && !error && q && results.length === 0 && (
        <StatusBlock eyebrow="Search" title="No pieces matched.">
          <p>Nothing in the published catalog matches “{q}”.</p>
        </StatusBlock>
      )}
      {!loading && results.length > 0 && (
        <div className="grid gap-x-8 gap-y-16 px-5 pb-24 md:grid-cols-2 md:px-8 xl:grid-cols-3">
          {results.map((product, index) => (
            <ProductFigure
              key={String(product.id)}
              product={product}
              index={index}
              imageClassName="aspect-[4/5]"
            />
          ))}
        </div>
      )}
    </div>
  );
}
