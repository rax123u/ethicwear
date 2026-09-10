import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { cn } from "@/lib/cn";

export function WordReveal({
  text,
  className,
}: {
  text: string;
  className?: string;
}) {
  const ref = useRef<HTMLParagraphElement>(null);
  const reduced = useReducedMotion();
  const words = text.trim().split(/\s+/);
  const [progress, setProgress] = useState(reduced ? 1 : 0);

  useEffect(() => {
    if (reduced) {
      setProgress(1);
      return;
    }

    const node = ref.current;
    if (!node) return;

    const update = () => {
      const rect = node.getBoundingClientRect();
      const vh = window.innerHeight;
      const start = vh * 0.82;
      const end = vh * 0.22;
      const raw = (start - rect.top) / (rect.height + (start - end));
      setProgress(Math.min(1, Math.max(0, raw)));
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [reduced]);

  return (
    <p ref={ref} className={cn("font-serif", className)}>
      {words.map((word, index) => {
        const threshold = index / Math.max(words.length - 1, 1);
        const active = progress >= threshold;
        return (
          <span
            key={`${word}-${index}`}
            className={cn(active ? "word-on" : "word-dim")}
          >
            {word}
            {index < words.length - 1 ? " " : ""}
          </span>
        );
      })}
    </p>
  );
}
