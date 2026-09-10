import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { readWishlist, writeWishlist } from "@/lib/storage";

interface WishlistContextValue {
  ids: string[];
  count: number;
  toggle: (id: string | number) => void;
  has: (id: string | number) => boolean;
}

const WishlistContext = createContext<WishlistContextValue | null>(null);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [ids, setIds] = useState<string[]>(() =>
    typeof window === "undefined" ? [] : readWishlist(),
  );

  const persist = (next: string[]) => {
    setIds(next);
    writeWishlist(next);
  };

  const value = useMemo<WishlistContextValue>(
    () => ({
      ids,
      count: ids.length,
      toggle: (id) => {
        const key = String(id);
        persist(ids.includes(key) ? ids.filter((item) => item !== key) : [...ids, key]);
      },
      has: (id) => ids.includes(String(id)),
    }),
    [ids],
  );

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used within WishlistProvider");
  return ctx;
}
