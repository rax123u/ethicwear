import { Link, useParams } from "react-router-dom";
import { ProductFigure } from "@/components/product/ProductFigure";
import { StatusBlock } from "@/components/ui/StatusBlock";
import { useSite } from "@/context/SiteContext";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { useProducts } from "@/hooks/useProducts";
import { categoryName } from "@/lib/catalog";

export function CategoryPage() {
  const { categoryId } = useParams();
  const { categories } = useSite();
  const category = categories.find((item) => String(item.id) === String(categoryId));
  const title = category ? categoryName(category) : "Room";
  const { products, loading, error } = useProducts({
    page: 1,
    pageSize: 48,
    categoryId,
  });

  useDocumentTitle(title);

  return (
    <div className="pt-24">
      <section className="px-5 py-16 md:px-8 md:py-24">
        <p className="text-[0.68rem] uppercase tracking-[0.32em] text-mute">Room</p>
        <h1 className="mt-4 font-display text-[clamp(3.4rem,10vw,9rem)] leading-[0.82] tracking-[-0.06em]">
          {title}
        </h1>
        {category?.description && (
          <p className="mt-8 max-w-2xl font-serif text-xl text-ink/70">
            {String(category.description)}
          </p>
        )}
      </section>

      {loading && (
        <p className="px-5 py-20 font-serif text-xl text-mute md:px-8">
          Gathering this room…
        </p>
      )}

      {error && (
        <StatusBlock eyebrow="Room" title="This room could not be opened.">
          <p>{error}</p>
        </StatusBlock>
      )}

      {!loading && !error && products.length === 0 && (
        <StatusBlock eyebrow="Room" title="Empty for now.">
          <p>
            <Link to="/shop" className="underline underline-offset-4">
              Browse the full shop
            </Link>
          </p>
        </StatusBlock>
      )}

      {products.length > 0 && (
        <div className="grid gap-x-8 gap-y-16 px-5 pb-24 md:grid-cols-2 md:px-8 xl:grid-cols-3">
          {products.map((product, index) => (
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
