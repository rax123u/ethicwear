import { useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ProductFigure } from "@/components/product/ProductFigure";
import { StatusBlock } from "@/components/ui/StatusBlock";
import { useSite } from "@/context/SiteContext";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { useProducts } from "@/hooks/useProducts";
import {
  canPurchase,
  categoryName,
  productCategories,
  productMatchesQuery,
  sortProducts,
} from "@/lib/catalog";

const PAGE_SIZE = 12;

const SORTS = [
  { value: "featured", label: "Edited" },
  { value: "price_asc", label: "Price ↑" },
  { value: "price_desc", label: "Price ↓" },
  { value: "name_asc", label: "A–Z" },
  { value: "name_desc", label: "Z–A" },
];

export function ShopPage() {
  const { categories } = useSite();
  const [params, setParams] = useSearchParams();
  const page = Number(params.get("page") || 1);
  const categoryId = params.get("category") || undefined;
  const sort = params.get("sort") || "featured";
  const availability = params.get("availability") || "all";
  const q = params.get("q") || "";

  useDocumentTitle("Shop");

  const { products, meta, loading, error } = useProducts({
    page,
    pageSize: PAGE_SIZE,
    categoryId,
    q: q || undefined,
    sort: sort === "featured" ? undefined : sort,
  });

  const visible = useMemo(() => {
    let list = products;
    if (categoryId) {
      list = list.filter((product) => {
        if (String(product.categoryId) === categoryId) return true;
        if (String(product.category?.id) === categoryId) return true;
        return productCategories(product).some((item) => String(item.id) === categoryId);
      });
    }
    if (q) list = list.filter((product) => productMatchesQuery(product, q));
    if (availability === "available") list = list.filter(canPurchase);
    if (availability === "unavailable") list = list.filter((product) => !canPurchase(product));
    return sortProducts(list, sort);
  }, [products, q, availability, sort]);

  const totalPages =
    meta?.totalPages ||
    (meta?.total ? Math.max(1, Math.ceil(meta.total / PAGE_SIZE)) : page);

  const setParam = (key: string, value: string) => {
    const next = new URLSearchParams(params);
    if (!value || value === "all" || value === "featured") next.delete(key);
    else next.set(key, value);
    if (key !== "page") next.delete("page");
    setParams(next);
  };

  return (
    <div className="pt-24">
      <section className="px-5 pb-10 pt-10 md:px-8">
        <p className="text-[0.68rem] uppercase tracking-[0.32em] text-mute">The shop</p>
        <h1 className="mt-4 font-display text-[clamp(4rem,12vw,10rem)] leading-[0.8] tracking-[-0.06em]">
          Collection
        </h1>
      </section>

      <div className="flex flex-col gap-4 border-y border-line px-5 py-4 text-[0.72rem] uppercase tracking-[0.18em] md:flex-row md:flex-wrap md:items-center md:justify-between md:px-8">
        <div className="flex flex-wrap gap-3">
          <select
            value={categoryId || "all"}
            onChange={(e) => setParam("category", e.target.value === "all" ? "" : e.target.value)}
            className="border-0 bg-transparent"
          >
            <option value="all">All rooms</option>
            {categories.map((category) => (
              <option key={String(category.id)} value={String(category.id)}>
                {categoryName(category)}
              </option>
            ))}
          </select>
          <select
            value={availability}
            onChange={(e) => setParam("availability", e.target.value)}
            className="border-0 bg-transparent"
          >
            <option value="all">Any availability</option>
            <option value="available">Available</option>
            <option value="unavailable">Unavailable</option>
          </select>
        </div>
        <select
          value={sort}
          onChange={(e) => setParam("sort", e.target.value)}
          className="border-0 bg-transparent"
        >
          {SORTS.map((item) => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>
      </div>

      {error && !loading && (
        <StatusBlock eyebrow="Catalog" title="The shop is quiet.">
          <p>{error}</p>
        </StatusBlock>
      )}

      {loading && (
        <p className="px-5 py-24 font-serif text-xl text-mute md:px-8">
          Laying out the collection…
        </p>
      )}

      {!loading && !error && visible.length === 0 && (
        <StatusBlock eyebrow="Catalog" title="Nothing in this edit.">
          <p>Try another room, or return when more products are published.</p>
        </StatusBlock>
      )}

      {!loading && visible.length > 0 && (
        <div className="grid gap-x-8 gap-y-16 px-5 py-16 md:grid-cols-2 md:px-8 xl:grid-cols-3">
          {visible.map((product, index) => (
            <ProductFigure
              key={String(product.id)}
              product={product}
              index={index}
              imageClassName="aspect-[4/5]"
            />
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-line px-5 py-8 text-[0.72rem] uppercase tracking-[0.22em] md:px-8">
          <button
            type="button"
            disabled={page <= 1}
            onClick={() => setParam("page", String(page - 1))}
            className="disabled:opacity-30"
          >
            Previous
          </button>
          <p>
            {page} / {totalPages}
          </p>
          <button
            type="button"
            disabled={page >= totalPages}
            onClick={() => setParam("page", String(page + 1))}
            className="disabled:opacity-30"
          >
            Next
          </button>
        </div>
      )}

      <div className="px-5 pb-16 md:px-8">
        <Link to="/search" className="text-[0.7rem] uppercase tracking-[0.24em] underline underline-offset-8">
          Search the house
        </Link>
      </div>
    </div>
  );
}
