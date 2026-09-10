import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export function StatusBlock({
  eyebrow,
  title,
  children,
  tone = "light",
}: {
  eyebrow?: string;
  title: string;
  children?: ReactNode;
  tone?: "dark" | "light";
}) {
  return (
    <section
      data-nav-theme={tone === "dark" ? "dark" : undefined}
      className={cn(
        "flex min-h-[50vh] flex-col justify-end px-5 py-24 md:px-10",
        tone === "dark" ? "bg-noir text-paper" : "bg-paper text-ink",
      )}
    >
      {eyebrow && (
        <p className="mb-6 text-[0.7rem] uppercase tracking-[0.32em] text-mute">
          {eyebrow}
        </p>
      )}
      <h1 className="max-w-4xl font-display text-[clamp(2.8rem,8vw,6.5rem)] leading-[0.9] tracking-[-0.04em]">
        {title}
      </h1>
      {children && (
        <div className="mt-8 max-w-xl font-serif text-lg text-mute">{children}</div>
      )}
    </section>
  );
}
