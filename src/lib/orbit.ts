import type {
  BlogPost,
  Category,
  CmsPage,
  OrbitEnvelope,
  Product,
  ProductQuery,
  SiteSettings,
} from "@/types/orbit";

function getConfig() {
  const cfg = window.ORBIT_PUBLIC_API;
  if (!cfg?.apiKey || !cfg?.baseUrl) {
    throw new Error("ORBIT_PUBLIC_API missing");
  }
  return cfg;
}

export function isOrbitConfigured() {
  const cfg = window.ORBIT_PUBLIC_API;
  return Boolean(cfg?.apiKey && cfg?.baseUrl);
}

export async function orbitGet<T>(
  path: string,
  query?: Record<string, string | number | boolean | null | undefined>,
): Promise<OrbitEnvelope<T>> {
  const cfg = getConfig();
  const url = new URL(
    cfg.baseUrl.replace(/\/$/, "") + path,
    window.location.origin,
  );

  if (query) {
    for (const [key, value] of Object.entries(query)) {
      if (value != null && value !== "") {
        url.searchParams.set(key, String(value));
      }
    }
  }

  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${cfg.apiKey}` },
  });

  const body = (await res.json()) as OrbitEnvelope<T>;
  if (!res.ok || body.error) {
    const error = new Error(body?.error?.message || res.statusText);
    (error as Error & { code?: string }).code = body?.error?.code;
    throw error;
  }

  return body;
}

export function fetchSiteSettings() {
  return orbitGet<SiteSettings>("/site-settings");
}

export function fetchProducts(query: ProductQuery = {}) {
  return orbitGet<Product[]>("/products", {
    page: query.page ?? 1,
    pageSize: query.pageSize ?? 24,
    categoryId: query.categoryId,
    q: query.q,
    search: query.search,
    sort: query.sort,
  });
}

export function fetchProduct(id: number | string) {
  return orbitGet<Product>(`/products/${id}`);
}

export function fetchCategories() {
  return orbitGet<Category[]>("/categories");
}

export function fetchBlog(query: { page?: number; pageSize?: number } = {}) {
  return orbitGet<BlogPost[]>("/blog", {
    page: query.page ?? 1,
    pageSize: query.pageSize ?? 12,
  });
}

export function fetchBlogPost(slug: string) {
  return orbitGet<BlogPost>(`/blog/${encodeURIComponent(slug)}`);
}

export function fetchPage(slug: string) {
  return orbitGet<CmsPage>(`/pages/${encodeURIComponent(slug)}`);
}

export function orbitShopUrl(productId?: number | string) {
  return productId == null ? "/shop" : `/shop/${productId}`;
}
