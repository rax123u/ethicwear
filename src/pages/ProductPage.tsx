import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Price } from "@/components/ui/Price";
import { RevealImage } from "@/components/ui/RevealImage";
import { StatusBlock } from "@/components/ui/StatusBlock";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import {
  canPurchase,
  productDescription,
  productImage,
  productImages,
  productName,
  productCategories,
  stockLabel,
} from "@/lib/catalog";
import { EDITORIAL } from "@/lib/editorial";
import { fetchProduct, isOrbitConfigured, orbitShopUrl } from "@/lib/orbit";
import type { Product } from "@/types/orbit";

export function ProductPage() {
  const { productId } = useParams();
  const { add, has } = useCart();
  const wishlist = useWishlist();
  const [product, setProduct] = useState<Product | null>(null);
  const [active, setActive] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      if (!productId || !isOrbitConfigured()) {
        setLoading(false);
        setError("This product cannot be loaded.");
        return;
      }
      setLoading(true);
      try {
        const res = await fetchProduct(productId);
        if (!cancelled) {
          setProduct(res.data);
          setActive(0);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Product not found.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    void load();
    return () => {
      cancelled = true;
    };
  }, [productId]);

  const name = product ? productName(product) : "Product";
  useDocumentTitle(product ? name : "Product");

  if (loading) {
    return <StatusBlock eyebrow="Product" title="Opening the look…" />;
  }

  if (error || !product) {
    return (
      <StatusBlock eyebrow="Product" title="This piece is not published.">
        <p>{error}</p>
        <p className="mt-6">
          <Link to="/shop" className="underline underline-offset-4">
            Return to the shop
          </Link>
        </p>
      </StatusBlock>
    );
  }

  const images = productImages(product);
  const gallery = images.length ? images : [productImage(product, EDITORIAL.fabric)];
  const current = gallery[active] || gallery[0];
  const available = canPurchase(product);
  const rooms = productCategories(product);

  return (
    <div className="pt-24">
      <div className="grid lg:grid-cols-12">
        <div className="lg:col-span-7">
          <RevealImage src={current} alt={name} className="min-h-[70vh] lg:min-h-[100svh]" />
          {gallery.length > 1 && (
            <div className="grid grid-cols-4 gap-px bg-line">
              {gallery.slice(0, 8).map((src, index) => (
                <button
                  key={src + index}
                  type="button"
                  onClick={() => setActive(index)}
                  className={index === active ? "opacity-100" : "opacity-50"}
                >
                  <img src={src} alt="" className="aspect-square object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-col justify-between px-5 py-12 lg:col-span-5 lg:sticky lg:top-24 lg:h-[calc(100svh-6rem)] lg:px-10">
          <div>
            <p className="text-[0.68rem] uppercase tracking-[0.28em] text-mute">
              {stockLabel(product)}
            </p>
            <h1 className="mt-5 font-display text-[clamp(2.8rem,6vw,5.2rem)] leading-[0.9] tracking-[-0.05em]">
              {name}
            </h1>
            <div className="mt-6 text-lg">
              <Price product={product} />
            </div>
            {rooms.length > 0 && (
              <div className="mt-6 flex flex-wrap gap-3 text-[0.68rem] uppercase tracking-[0.22em] text-mute">
                {rooms.map((room) =>
                  room.id ? (
                    <Link key={String(room.id)} to={`/category/${room.id}`}>
                      {room.name || room.slug}
                    </Link>
                  ) : null,
                )}
              </div>
            )}
          </div>

          <div className="py-10 font-serif text-lg leading-relaxed text-ink/75">
            {productDescription(product) ? (
              <div dangerouslySetInnerHTML={{ __html: productDescription(product) }} />
            ) : (
              <p>A published piece from the EthicWear catalog.</p>
            )}
          </div>

          <div className="space-y-4">
            <button
              type="button"
              onClick={() => add(product.id)}
              disabled={!available}
              className="w-full border border-ink px-6 py-4 text-[0.72rem] uppercase tracking-[0.28em] transition-opacity hover:bg-ink hover:text-paper disabled:opacity-40"
            >
              {has(product.id) ? "Added to hold" : "Hold this piece"}
            </button>
            <button
              type="button"
              onClick={() => wishlist.toggle(product.id)}
              className="w-full px-6 py-3 text-[0.72rem] uppercase tracking-[0.24em] underline underline-offset-8"
            >
              {wishlist.has(product.id) ? "Saved" : "Save"}
            </button>
            <a
              href={orbitShopUrl(product.id)}
              className="block w-full bg-espresso px-6 py-4 text-center text-[0.72rem] uppercase tracking-[0.28em] text-paper transition-opacity hover:opacity-80"
            >
              Purchase
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
