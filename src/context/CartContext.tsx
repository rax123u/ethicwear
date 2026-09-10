import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { readCart, writeCart, type CartLine } from "@/lib/storage";

interface CartContextValue {
  lines: CartLine[];
  count: number;
  add: (id: string | number, quantity?: number) => void;
  setQuantity: (id: string | number, quantity: number) => void;
  remove: (id: string | number) => void;
  clear: () => void;
  has: (id: string | number) => boolean;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>(() =>
    typeof window === "undefined" ? [] : readCart(),
  );

  const persist = (next: CartLine[]) => {
    setLines(next);
    writeCart(next);
  };

  const value = useMemo<CartContextValue>(
    () => ({
      lines,
      count: lines.reduce((sum, line) => sum + line.quantity, 0),
      add: (id, quantity = 1) => {
        const key = String(id);
        const existing = lines.find((line) => line.id === key);
        persist(
          existing
            ? lines.map((line) =>
                line.id === key
                  ? { ...line, quantity: line.quantity + quantity }
                  : line,
              )
            : [...lines, { id: key, quantity }],
        );
      },
      setQuantity: (id, quantity) => {
        const key = String(id);
        persist(
          quantity <= 0
            ? lines.filter((line) => line.id !== key)
            : lines.map((line) =>
                line.id === key ? { ...line, quantity } : line,
              ),
        );
      },
      remove: (id) => persist(lines.filter((line) => line.id !== String(id))),
      clear: () => persist([]),
      has: (id) => lines.some((line) => line.id === String(id)),
    }),
    [lines],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
