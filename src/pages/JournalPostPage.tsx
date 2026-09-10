import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { RevealImage } from "@/components/ui/RevealImage";
import { StatusBlock } from "@/components/ui/StatusBlock";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { fetchBlogPost, isOrbitConfigured } from "@/lib/orbit";
import type { BlogPost } from "@/types/orbit";

export function JournalPostPage() {
  const { slug } = useParams();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      if (!slug || !isOrbitConfigured()) {
        setLoading(false);
        setError("This note cannot be loaded.");
        return;
      }
      try {
        const res = await fetchBlogPost(slug);
        if (!cancelled) setPost(res.data);
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Note not found.");
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

  const title = post?.title || post?.name || "Journal";
  useDocumentTitle(title);

  if (loading) return <StatusBlock eyebrow="Journal" title="Opening the note…" />;
  if (error || !post) {
    return (
      <StatusBlock eyebrow="Journal" title="This note is unpublished.">
        <p>{error}</p>
        <p className="mt-6">
          <Link to="/journal" className="underline underline-offset-4">
            Back to the journal
          </Link>
        </p>
      </StatusBlock>
    );
  }

  const image = post.featuredImage || post.image || post.imageUrl;
  const html = post.content || post.body || "";

  return (
    <article className="pt-24">
      <header className="px-5 py-16 md:px-8 md:py-24">
        <p className="text-[0.68rem] uppercase tracking-[0.32em] text-mute">Journal</p>
        <h1 className="mt-5 max-w-5xl font-display text-[clamp(3rem,8vw,7.5rem)] leading-[0.86] tracking-[-0.05em]">
          {title}
        </h1>
        {post.excerpt || post.summary ? (
          <p className="mt-8 max-w-2xl font-serif text-2xl text-ink/70">
            {post.excerpt || post.summary}
          </p>
        ) : null}
      </header>
      {image && <RevealImage src={image} alt={title} className="max-h-[80vh]" />}
      <div className="px-5 py-16 md:px-8 md:py-24">
        {html ? (
          <div
            className="cms-content mx-auto max-w-3xl text-ink"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        ) : (
          <p className="mx-auto max-w-3xl font-serif text-xl text-mute">
            This listing has no long-form body. Open the note in Orbit for the full text, or
            publish a complete post.
          </p>
        )}
      </div>
    </article>
  );
}
