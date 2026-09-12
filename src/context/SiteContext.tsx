import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { fetchCategories, fetchSiteSettings, isOrbitConfigured } from "@/lib/orbit";
import type { Category, SiteSettings } from "@/types/orbit";

interface SiteContextValue {
  settings: SiteSettings | null;
  categories: Category[];
  loading: boolean;
  configured: boolean;
  error: string | null;
}

const SiteContext = createContext<SiteContextValue | null>(null);

export function SiteProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const configured = isOrbitConfigured();

  useEffect(() => {
    let cancelled = false;

    async function load() {
      if (!configured) {
        setLoading(false);
        setError("Empty yet!");
        return;
      }

      try {
        const [settingsRes, categoriesRes] = await Promise.all([
          fetchSiteSettings(),
          fetchCategories().catch(() => ({ data: [] as Category[] })),
        ]);
        if (cancelled) return;
        setSettings(settingsRes.data);
        setCategories(Array.isArray(categoriesRes.data) ? categoriesRes.data : []);
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Unable to load site settings.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, [configured]);

  const value = useMemo(
    () => ({ settings, categories, loading, configured, error }),
    [settings, categories, loading, configured, error],
  );

  return <SiteContext.Provider value={value}>{children}</SiteContext.Provider>;
}

export function useSite() {
  const ctx = useContext(SiteContext);
  if (!ctx) throw new Error("useSite must be used within SiteProvider");
  return ctx;
}
