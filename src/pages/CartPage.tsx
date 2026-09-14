import { Link } from "react-router-dom";
import { Price } from "@/components/ui/Price";
import { StatusBlock } from "@/components/ui/StatusBlock";
import { useCart } from "@/context/CartContext";
import { useSite } from "@/context/SiteContext";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { useProductList } from "@/hooks/useProductList";
import { productImage, productName, productPrice } from "@/lib/catalog";
import { EDITORIAL } from "@/lib/editorial";
import { formatMoney } from "@/lib/money";
import { orbitShopUrl } from "@/lib/orbit";

export function CartPage() {
  const { lines, setQuantity, remove, clear } = useCart();
  const { settings } = useSite();
  const { products, loading } = useProductList(lines.map((line) => line.id));
  useDocumentTitle("Cart");

  const rows = lines
    .map((line) => {
      const product = products.find((item) => String(item.id) === line.id);
      return product ? { line, product } : null;
    })
    .filter((row): row is { line: (typeof lines)[number]; product: (typeof products)[number] } =>
      Boolean(row),
    );

  const total = rows.reduce((sum, row) => {
    const price = productPrice(row.product) ?? 0;
    return sum + price * row.line.quantity;
  }, 0);

  if (!lines.length) {
    return (
      <StatusBlock eyebrow="Hold" title="Nothing is being held.">
        <p>
          <Link to="/shop" className="underline underline-offset-4">
            Walk the collection
          </Link>
        </p>
      </StatusBlock>
    );
  }

  return (
    <div className="pt-24">
      <section className="px-5 py-16 md:px-8">
        <p className="text-[0.68rem] uppercase tracking-[0.32em] text-mute">Hold</p>
        <h1 className="mt-4 font-display text-[clamp(3.8rem,11vw,9rem)] leading-[0.8] tracking-[-0.06em]">
          Cart
        </h1>
      </section>

      {loading ? (
        <p className="px-5 py-16 font-serif text-xl text-mute md:px-8">Recalling your hold…</p>
      ) : (
        <div className="px-5 pb-24 md:px-8">
          <div className="divide-y divide-line border-y border-line">
            {rows.map(({ line, product }) => (
              <article key={line.id} className="grid gap-6 py-8 md:grid-cols-[140px_1fr_auto]">
                <Link to={orbitShopUrl(product.id)}>
                  {/* <img
                    src={productImage(product, EDITORIAL.fabric)}
                    alt={productName(product)}
                    className="aspect-[4/5] object-cover"
                  /> */}
                </Link>
                <div>
                  <Link
                    to={orbitShopUrl(product.id)}
                    className="font-display text-3xl tracking-[-0.03em]"
                  >
                    {productName(product)}
                  </Link>
                  <div className="mt-3">
                    <Price product={product} />
                  </div>
                  <div className="mt-6 flex items-center gap-4 text-sm">
                    <button type="button" onClick={() => setQuantity(line.id, line.quantity - 1)}>
                      −
                    </button>
                    <span>{line.quantity}</span>
                    <button type="button" onClick={() => setQuantity(line.id, line.quantity + 1)}>
                      +
                    </button>
                    <button
                      type="button"
                      onClick={() => remove(line.id)}
                      className="ml-4 text-mute underline underline-offset-4"
                    >
                      Release
                    </button>
                  </div>
                </div>
                <a
                  href={orbitShopUrl(product.id)}
                  className="self-start text-[0.68rem] uppercase tracking-[0.24em] underline underline-offset-8"
                >
                  Purchase
                </a>
              </article>
            ))}
          </div>

          <div className="mt-12 flex flex-col justify-between gap-8 md:flex-row md:items-end">
            <div>
              <p className="text-[0.68rem] uppercase tracking-[0.28em] text-mute">Held total</p>
              <p className="mt-3 font-display text-5xl tracking-[-0.04em]">
                {formatMoney(total, settings) || "—"}
              </p>
              <p className="mt-4 max-w-md font-serif text-ink/70">
                Purchase continues on the Orbit shop path for each piece. The Public API does not
                create orders.
              </p>
            </div>
            <div className="flex flex-col gap-4">
              {rows[0] && (
                <a
                  href={orbitShopUrl(rows[0].product.id)}
                  className="bg-espresso px-8 py-4 text-center text-[0.72rem] uppercase tracking-[0.28em] text-paper transition-opacity hover:opacity-80"
                >
                  Continue to shop
                </a>
              )}
              <button
                type="button"
                onClick={clear}
                className="text-[0.68rem] uppercase tracking-[0.22em] text-mute"
              >
                Clear hold
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
