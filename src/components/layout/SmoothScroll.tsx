import { useEffect } from "react";
import Lenis from "lenis";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { setLenisInstance } from "@/lib/lenis-control";

export function SmoothScroll() {
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;

    const lenis = new Lenis({
      autoRaf: true,
      duration: 0.95,
      lerp: 0.12,
      smoothWheel: true,
      syncTouch: false,
    });

    setLenisInstance(lenis);

    return () => {
      setLenisInstance(null);
      lenis.destroy();
    };
  }, [reduced]);

  return null;
}
