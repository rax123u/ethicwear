import { Link } from "react-router-dom";
import { productImage, productName, stockLabel } from "@/lib/catalog";
import { EDITORIAL } from "@/lib/editorial";
import { Price } from "@/components/ui/Price";
import { RevealImage } from "@/components/ui/RevealImage";
import { cn } from "@/lib/cn";
import type { Product } from "@/types/orbit";

export function ProductFigure({
  product,
  className,
  imageClassName,
  index,
}: {
  product: Product;
  className?: string;
  imageClassName?: string;
  index?: number;
}) {
  const name = productName(product);
  const image = productImage(product, EDITORIAL.fabric);

  return (
    <article className={cn("group", className)}>
      <Link to={`/product/${product.id}`} className="block">
        <RevealImage
          src={image}
          alt={name}
          className={imageClassName}
        />
        <div className="mt-4 flex items-start justify-between gap-6">
          <div>
            {index != null && (
              <p className="mb-2 text-[0.65rem] uppercase tracking-[0.28em] text-mute">
                {String(index + 1).padStart(2, "0")}
              </p>
            )}
            <h3 className="max-w-sm font-display text-[clamp(1.4rem,2.4vw,2.1rem)] leading-[1.05] tracking-[-0.03em]">
              {name}
            </h3>
          </div>
          <div className="pt-1 text-right text-sm">
            <Price product={product} />
            <p className="mt-1 text-[0.65rem] uppercase tracking-[0.22em] text-mute">
              {stockLabel(product)}
            </p>
          </div>
        </div>
      </Link>
    </article>
  );
}
