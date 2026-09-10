import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { StatusBlock } from "@/components/ui/StatusBlock";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { pageTitle } from "@/lib/catalog";
import { fetchPage, isOrbitConfigured } from "@/lib/orbit";
import type { CmsPage as CmsPageType } from "@/types/orbit";

export function CmsPage() {
  const { slug } = useParams();
  const [page, setPage] = useState<CmsPageType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      if (!slug || !isOrbitConfigured()) {
        setLoading(false);
        setError("This page cannot be loaded.");
        return;
      }
      try {
        const res = await fetchPage(slug);
        if (!cancelled) setPage(res.data);
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Page not found.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    void load();
    return () => {
      cancelled = true;
    };
  }, [slug]);

  const title = page ? pageTitle(page) : "Page";
  useDocumentTitle(title);

  if (loading) return <StatusBlock eyebrow="Page" title="Opening…" />;
  if (error || !page) {
    return (
      <StatusBlock eyebrow="Page" title="This page is unpublished.">
        <p>{error}</p>
        <p className="mt-6">
          <Link to="/" className="underline underline-offset-4">
            Return home
          </Link>
        </p>
      </StatusBlock>
    );
  }

  return (
    <article className="pt-24">
      <header className="px-5 py-16 md:px-8 md:py-24">
        <p className="text-[0.68rem] uppercase tracking-[0.32em] text-mute">From the house</p>
        <h1 className="mt-5 max-w-5xl font-display text-[clamp(3rem,8vw,7.5rem)] leading-[0.86] tracking-[-0.05em]">
          {title}
        </h1>
      </header>
      <div className="px-5 pb-24 md:px-8">
        <div
          className="cms-content mx-auto max-w-3xl"
          dangerouslySetInnerHTML={{ __html: page.content || page.body || "" }}
        />
      </div>
    </article>
  );
}
