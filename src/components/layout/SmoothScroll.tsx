import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { setLenisInstance } from "@/lib/lenis-control";

gsap.registerPlugin(ScrollTrigger);

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
    lenis.on("scroll", ScrollTrigger.update);

    return () => {
      lenis.off("scroll", ScrollTrigger.update);
      setLenisInstance(null);
      lenis.destroy();
    };
  }, [reduced]);

  return null;
}
