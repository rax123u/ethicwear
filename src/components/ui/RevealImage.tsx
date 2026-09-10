import { useInView } from "@/hooks/useInView";
import { cn } from "@/lib/cn";

interface RevealImageProps {
  src: string;
  alt: string;
  className?: string;
  imgClassName?: string;
}

export function RevealImage({ src, alt, className, imgClassName }: RevealImageProps) {
  const { ref, inView } = useInView<HTMLDivElement>();

  return (
    <div ref={ref} className={cn("overflow-hidden bg-sand", className)}>
      <img
        src={src}
        alt={alt}
        loading="lazy"
        className={cn(
          "reveal-clip h-full w-full object-cover",
          inView && "is-in",
          imgClassName,
        )}
      />
    </div>
  );
}
