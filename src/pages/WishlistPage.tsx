import { Link } from "react-router-dom";
import { ProductFigure } from "@/components/product/ProductFigure";
import { StatusBlock } from "@/components/ui/StatusBlock";
import { useWishlist } from "@/context/WishlistContext";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { useProductList } from "@/hooks/useProductList";

export function WishlistPage() {
  const { ids, toggle } = useWishlist();
  const { products, loading } = useProductList(ids);
  useDocumentTitle("Saved");

  if (!ids.length) {
    return (
      <StatusBlock eyebrow="Saved" title="Nothing is saved.">
        <p>
          <Link to="/shop" className="underline underline-offset-4">
            Begin an edit
          </Link>
        </p>
      </StatusBlock>
    );
  }

  return (
    <div className="pt-24">
      <section className="px-5 py-16 md:px-8">
        <p className="text-[0.68rem] uppercase tracking-[0.32em] text-mute">Kept aside</p>
        <h1 className="mt-4 font-display text-[clamp(3.8rem,11vw,9rem)] leading-[0.8] tracking-[-0.06em]">
          Saved
        </h1>
      </section>

      {loading ? (
        <p className="px-5 py-16 font-serif text-xl text-mute md:px-8">Recalling saved pieces…</p>
      ) : (
        <div className="grid gap-x-8 gap-y-16 px-5 pb-24 md:grid-cols-2 md:px-8 xl:grid-cols-3">
          {products.map((product, index) => (
            <div key={String(product.id)}>
              <ProductFigure product={product} index={index} imageClassName="aspect-[4/5]" />
              <button
                type="button"
                onClick={() => toggle(product.id)}
                className="mt-4 text-[0.68rem] uppercase tracking-[0.22em] text-mute underline underline-offset-4"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
