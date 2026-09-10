export interface OrbitError {
  code?: string;
  message?: string;
}

export interface OrbitMeta {
  page?: number;
  pageSize?: number;
  total?: number;
  totalPages?: number;
  hasMore?: boolean;
  [key: string]: unknown;
}

export interface OrbitEnvelope<T> {
  data: T;
  error: OrbitError | null;
  meta?: OrbitMeta | null;
}

export type PriceFormat = "SYMBOL_BEFORE" | "SYMBOL_AFTER" | "NO_DECIMALS" | string;

export interface ShopSettings {
  priceFormat?: PriceFormat;
  outOfStockBehavior?: string;
  [key: string]: unknown;
}

export interface CmsPageSummary {
  id?: number | string;
  slug: string;
  title?: string;
  name?: string;
  [key: string]: unknown;
}

export interface SiteSettings {
  storeName?: string;
  name?: string;
  businessName?: string;
  brandName?: string;
  tagline?: string;
  description?: string;
  logo?: string;
  logoUrl?: string;
  favicon?: string;
  currency?: string;
  currencySymbol?: string;
  shop?: ShopSettings;
  branding?: Record<string, unknown>;
  modules?: Record<string, unknown>;
  pages?: CmsPageSummary[];
  social?: Record<string, string | undefined>;
  contact?: {
    email?: string;
    phone?: string;
    address?: string;
    [key: string]: unknown;
  };
  email?: string;
  phone?: string;
  address?: string;
  instagram?: string;
  facebook?: string;
  twitter?: string;
  tiktok?: string;
  youtube?: string;
  [key: string]: unknown;
}

export interface ProductImage {
  url?: string;
  src?: string;
  alt?: string;
  [key: string]: unknown;
}

export interface ProductCategoryRef {
  id?: number | string;
  name?: string;
  slug?: string;
  [key: string]: unknown;
}

export interface Product {
  id: number | string;
  name?: string;
  title?: string;
  slug?: string;
  sku?: string;
  description?: string;
  shortDescription?: string;
  sellingPrice?: number | string | null;
  shopSalePrice?: number | string | null;
  shopCompareAtPrice?: number | string | null;
  shopUnitPrice?: number | string | null;
  images?: ProductImage[] | string[];
  image?: string;
  imageUrl?: string;
  thumbnail?: string;
  featuredImage?: string;
  media?: ProductImage[];
  categoryId?: number | string;
  category?: ProductCategoryRef;
  categories?: ProductCategoryRef[];
  shopStockLabel?: string;
  shopAvailableQty?: number | string | null;
  shopCanPurchase?: boolean;
  tags?: string[];
  [key: string]: unknown;
}

export interface Category {
  id: number | string;
  name?: string;
  title?: string;
  slug?: string;
  description?: string;
  image?: string;
  imageUrl?: string;
  thumbnail?: string;
  productCount?: number;
  [key: string]: unknown;
}

export interface BlogPost {
  id?: number | string;
  slug: string;
  title?: string;
  name?: string;
  excerpt?: string;
  summary?: string;
  content?: string;
  body?: string;
  featuredImage?: string;
  image?: string;
  imageUrl?: string;
  publishedAt?: string;
  createdAt?: string;
  seoTitle?: string;
  seoDescription?: string;
  [key: string]: unknown;
}

export interface CmsPage {
  id?: number | string;
  slug: string;
  title?: string;
  name?: string;
  content?: string;
  body?: string;
  seoTitle?: string;
  seoDescription?: string;
  [key: string]: unknown;
}

export interface ProductQuery {
  page?: number;
  pageSize?: number;
  categoryId?: number | string;
  q?: string;
  search?: string;
  sort?: string;
}

export interface JobPosting {
  id?: number | string;
  title?: string;
  slug?: string;
  [key: string]: unknown;
}
