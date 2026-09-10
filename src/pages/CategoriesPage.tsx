import { Link } from "react-router-dom";
import { RevealImage } from "@/components/ui/RevealImage";
import { StatusBlock } from "@/components/ui/StatusBlock";
import { useSite } from "@/context/SiteContext";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { categoryImage, categoryName } from "@/lib/catalog";
import { EDITORIAL } from "@/lib/editorial";

export function CategoriesPage() {
  const { categories, loading, error } = useSite();
  useDocumentTitle("Index");

  if (loading) return <StatusBlock eyebrow="Index" title="Opening the rooms…" />;
  if (error) {
    return (
      <StatusBlock eyebrow="Index" title="The index is unavailable.">
        <p>{error}</p>
      </StatusBlock>
    );
  }

  return (
    <div className="pt-24">
      <section className="px-5 py-16 md:px-8 md:py-24">
        <p className="text-[0.68rem] uppercase tracking-[0.32em] text-mute">Rooms</p>
        <h1 className="mt-4 font-display text-[clamp(4rem,13vw,11rem)] leading-[0.8] tracking-[-0.07em]">
          Index
        </h1>
      </section>

      {categories.length === 0 ? (
        <StatusBlock eyebrow="Index" title="No rooms have been published.">
          <p>Categories appear once they contain at least one published product.</p>
        </StatusBlock>
      ) : (
        <div className="divide-y divide-line border-y border-line">
          {categories.map((category, index) => (
            <Link
              key={String(category.id)}
              to={`/category/${category.id}`}
              className="group grid items-center gap-6 px-5 py-8 md:grid-cols-[100px_1fr_280px] md:px-8"
            >
              <span className="text-[0.68rem] uppercase tracking-[0.28em] text-mute">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="font-display text-[clamp(2.2rem,6vw,5.4rem)] leading-none tracking-[-0.05em]">
                {categoryName(category)}
              </span>
              <RevealImage
                src={categoryImage(category, EDITORIAL.still)}
                alt={categoryName(category)}
                className="hidden aspect-[16/10] md:block"
              />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
