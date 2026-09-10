import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { MANIFESTO } from "@/lib/editorial";

gsap.registerPlugin(useGSAP, ScrollTrigger);

export function EditorManifesto() {
  const sectionRef = useRef<HTMLElement>(null);
  const words = MANIFESTO.split(" ");
  const reduced = useReducedMotion();

  useGSAP(
    () => {
      if (reduced || !sectionRef.current) return;

      gsap
        .timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            pin: true,
            start: "top top",
            end: () => "+=" + words.length * 28,
            scrub: 0.6,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        })
        .to(".word", {
          opacity: 1,
          color: "var(--color-ink)",
          stagger: 0.05,
          ease: "none",
        });
    },
    { scope: sectionRef, dependencies: [reduced, words.length] },
  );

  return (
    <section
      ref={sectionRef}
      className="editor-manifesto flex min-h-[100svh] flex-col justify-center bg-paper px-5 py-20 text-ink md:px-10 md:py-28"
    >
      <p className="mb-10 text-[0.68rem] uppercase tracking-[0.32em] text-mute">
        From the editor
      </p>
      <p className="max-w-5xl font-serif text-[clamp(1.7rem,4.4vw,3.6rem)] leading-[1.25] tracking-[-0.03em]">
        {words.map((word, index) => (
          <span key={`${word}-${index}`} className="word">
            {word}{" "}
          </span>
        ))}
      </p>
    </section>
  );
}
