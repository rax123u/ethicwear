import { cn } from "@/lib/cn";

export function Marquee({
  text,
  reverse = false,
  className,
}: {
  text: string;
  reverse?: boolean;
  className?: string;
}) {
  const phrase = `${text} — `;
  const copies = Array.from({ length: 10 }, () => phrase).join("");

  return (
    <div className={cn("overflow-hidden whitespace-nowrap", className)}>
      <div
        className={cn(
          "flex will-change-transform",
          reverse ? "marquee-track-reverse" : "marquee-track",
        )}
      >
        <span className="pr-8">{copies}</span>
        <span className="pr-8">{copies}</span>
      </div>
    </div>
  );
}
