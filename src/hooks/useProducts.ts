import { useEffect, useState } from "react";
import { fetchProducts, isOrbitConfigured } from "@/lib/orbit";
import type { OrbitMeta, Product, ProductQuery } from "@/types/orbit";

export function useProducts(query: ProductQuery) {
  const [products, setProducts] = useState<Product[]>([]);
  const [meta, setMeta] = useState<OrbitMeta | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      if (!isOrbitConfigured()) {
        setLoading(false);
        setError("Empty yet!");
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const res = await fetchProducts(query);
        if (cancelled) return;
        setProducts(Array.isArray(res.data) ? res.data : []);
        setMeta(res.meta ?? null);
      } catch (err) {
        if (!cancelled) {
          setProducts([]);
          setError(err instanceof Error ? err.message : "Unable to load products.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, [query.page, query.pageSize, query.categoryId, query.q, query.search, query.sort]);

  return { products, meta, loading, error };
}
