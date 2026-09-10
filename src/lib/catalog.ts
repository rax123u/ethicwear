import type { Category, Product, ProductImage, SiteSettings } from "@/types/orbit";

export function asNumber(value: unknown): number | null {
  if (value == null || value === "") return null;
  const n = typeof value === "number" ? value : Number(value);
  return Number.isFinite(n) ? n : null;
}

export function productName(product: Product) {
  return product.name || product.title || `Product ${product.id}`;
}

export function productDescription(product: Product) {
  return (
    (typeof product.description === "string" && product.description) ||
    (typeof product.shortDescription === "string" && product.shortDescription) ||
    ""
  );
}

function imageFromEntry(entry: ProductImage | string | undefined) {
  if (!entry) return "";
  if (typeof entry === "string") return entry;
  return entry.url || entry.src || "";
}

export function productImages(product: Product): string[] {
  const collected: string[] = [];
  const push = (value?: string | null) => {
    if (value && !collected.includes(value)) collected.push(value);
  };

  if (Array.isArray(product.images)) {
    product.images.forEach((img) => push(imageFromEntry(img)));
  }
  if (Array.isArray(product.media)) {
    product.media.forEach((img) => push(imageFromEntry(img)));
  }

  push(product.image);
  push(product.imageUrl);
  push(product.thumbnail);
  push(product.featuredImage);

  return collected;
}

export function productImage(product: Product, fallback = "") {
  return productImages(product)[0] || fallback;
}

export function productPrice(product: Product) {
  return (
    asNumber(product.shopSalePrice) ??
    asNumber(product.shopUnitPrice) ??
    asNumber(product.sellingPrice)
  );
}

export function productCompareAt(product: Product) {
  const compare = asNumber(product.shopCompareAtPrice);
  const price = productPrice(product);
  if (compare == null || price == null || compare <= price) return null;
  return compare;
}

export function canPurchase(product: Product) {
  if (typeof product.shopCanPurchase === "boolean") return product.shopCanPurchase;
  return true;
}

export function stockLabel(product: Product) {
  return product.shopStockLabel || (canPurchase(product) ? "Available" : "Unavailable");
}

export function categoryName(category: Category) {
  return category.name || category.title || `Category ${category.id}`;
}

export function categoryImage(category: Category, fallback = "") {
  return category.image || category.imageUrl || category.thumbnail || fallback;
}

export function storeName(settings?: SiteSettings | null) {
  return (
    settings?.storeName ||
    settings?.brandName ||
    settings?.businessName ||
    settings?.name ||
    "EthicWear"
  );
}

export function storeLogo(settings?: SiteSettings | null) {
  return settings?.logo || settings?.logoUrl || "";
}

export function storeDescription(settings?: SiteSettings | null) {
  return (
    (typeof settings?.description === "string" && settings.description) ||
    (typeof settings?.tagline === "string" && settings.tagline) ||
    ""
  );
}

export function contactEmail(settings?: SiteSettings | null) {
  return settings?.contact?.email || settings?.email || "";
}

export function contactPhone(settings?: SiteSettings | null) {
  return settings?.contact?.phone || settings?.phone || "";
}

export function contactAddress(settings?: SiteSettings | null) {
  return settings?.contact?.address || settings?.address || "";
}

export function socialLinks(settings?: SiteSettings | null) {
  const fromObject = settings?.social ?? {};
  const entries: { label: string; href: string }[] = [];
  const add = (label: string, value?: string) => {
    if (!value) return;
    const href = value.startsWith("http") ? value : `https://${value.replace(/^@/, "")}`;
    entries.push({ label, href });
  };

  add("Instagram", fromObject.instagram || settings?.instagram);
  add("Facebook", fromObject.facebook || settings?.facebook);
  add("TikTok", fromObject.tiktok);
  add("YouTube", fromObject.youtube);
  add("X", fromObject.twitter || fromObject.x);

  return entries;
}

export function pageTitle(page: { title?: string; name?: string; slug: string }) {
  return page.title || page.name || page.slug;
}

export function moduleEnabled(settings: SiteSettings | null | undefined, key: string) {
  const value = settings?.modules?.[key];
  if (typeof value === "boolean") return value;
  if (value && typeof value === "object" && "enabled" in value) {
    return Boolean((value as { enabled?: boolean }).enabled);
  }
  return Boolean(value);
}

export function productMatchesQuery(product: Product, query: string) {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  const haystack = [
    productName(product),
    productDescription(product),
    product.sku,
    ...(product.tags ?? []),
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
  return haystack.includes(q);
}

export function sortProducts(products: Product[], sort: string) {
  const copy = [...products];
  switch (sort) {
    case "price_asc":
      return copy.sort((a, b) => (productPrice(a) ?? 0) - (productPrice(b) ?? 0));
    case "price_desc":
      return copy.sort((a, b) => (productPrice(b) ?? 0) - (productPrice(a) ?? 0));
    case "name_asc":
      return copy.sort((a, b) => productName(a).localeCompare(productName(b)));
    case "name_desc":
      return copy.sort((a, b) => productName(b).localeCompare(productName(a)));
    default:
      return copy;
  }
}

export function productCategories(product: Product) {
  if (Array.isArray(product.categories) && product.categories.length) {
    return product.categories;
  }
  return product.category ? [product.category] : [];
}
