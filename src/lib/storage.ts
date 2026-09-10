const CART_KEY = "ethicwear.cart";
const WISHLIST_KEY = "ethicwear.wishlist";

export interface CartLine {
  id: string;
  quantity: number;
}

function readJson<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeJson(key: string, value: unknown) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function readCart(): CartLine[] {
  return readJson<CartLine[]>(CART_KEY, []);
}

export function writeCart(lines: CartLine[]) {
  writeJson(CART_KEY, lines);
}

export function readWishlist(): string[] {
  return readJson<string[]>(WISHLIST_KEY, []);
}

export function writeWishlist(ids: string[]) {
  writeJson(WISHLIST_KEY, ids);
}
