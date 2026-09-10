import { formatMoney } from "@/lib/money";
import { productCompareAt, productPrice } from "@/lib/catalog";
import { useSite } from "@/context/SiteContext";
import type { Product } from "@/types/orbit";
import { cn } from "@/lib/cn";

export function Price({
  product,
  className,
}: {
  product: Product;
  className?: string;
}) {
  const { settings } = useSite();
  const price = productPrice(product);
  const compare = productCompareAt(product);

  if (price == null) {
    return <span className={cn("text-mute", className)}>Price on request</span>;
  }

  return (
    <span className={cn("inline-flex items-baseline gap-3", className)}>
      <span>{formatMoney(price, settings)}</span>
      {compare != null && (
        <span className="text-mute line-through">
          {formatMoney(compare, settings)}
        </span>
      )}
    </span>
  );
}
