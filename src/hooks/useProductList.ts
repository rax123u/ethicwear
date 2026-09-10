import { useEffect, useState } from "react";
import { fetchProduct, isOrbitConfigured } from "@/lib/orbit";
import type { Product } from "@/types/orbit";

export function useProductList(ids: string[]) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(ids.length > 0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      if (!ids.length) {
        setProducts([]);
        setLoading(false);
        return;
      }
      if (!isOrbitConfigured()) {
        setLoading(false);
        setError("Orbit Public API is not configured.");
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const results = await Promise.all(
          ids.map((id) => fetchProduct(id).then((res) => res.data).catch(() => null)),
        );
        if (!cancelled) {
          setProducts(results.filter((item): item is Product => Boolean(item)));
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Unable to load saved pieces.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, [ids.join(",")]);

  return { products, loading, error };
}
