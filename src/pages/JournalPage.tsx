import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { RevealImage } from "@/components/ui/RevealImage";
import { StatusBlock } from "@/components/ui/StatusBlock";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { EDITORIAL } from "@/lib/editorial";
import { fetchBlog, isOrbitConfigured } from "@/lib/orbit";
import type { BlogPost } from "@/types/orbit";

export function JournalPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  useDocumentTitle("Journal");

  useEffect(() => {
    let cancelled = false;
    async function load() {
      if (!isOrbitConfigured()) {
        setLoading(false);
        setError("Orbit Public API is not configured.");
        return;
      }
      try {
        const res = await fetchBlog({ page: 1, pageSize: 24 });
        if (!cancelled) setPosts(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Journal is unavailable.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) return <StatusBlock eyebrow="Journal" title="Turning the pages…" />;
  if (error) {
    return (
      <StatusBlock eyebrow="Journal" title="The journal is closed.">
        <p>{error}</p>
      </StatusBlock>
    );
  }

  return (
    <div className="pt-24">
      <section className="px-5 py-16 md:px-8 md:py-24">
        <p className="text-[0.68rem] uppercase tracking-[0.32em] text-mute">Notes</p>
        <h1 className="mt-4 font-display text-[clamp(4rem,12vw,10rem)] leading-[0.8] tracking-[-0.07em]">
          Journal
        </h1>
      </section>

      {posts.length === 0 ? (
        <StatusBlock eyebrow="Journal" title="No published notes yet.">
          <p>When posts are published in Orbit, they will appear here.</p>
        </StatusBlock>
      ) : (
        <div className="divide-y divide-line border-y border-line">
          {posts.map((post) => (
            <Link
              key={post.slug}
              to={`/journal/${post.slug}`}
              className="grid items-center gap-8 px-5 py-10 md:grid-cols-[1fr_280px] md:px-8"
            >
              <div>
                <p className="text-[0.68rem] uppercase tracking-[0.24em] text-mute">
                  {post.publishedAt || post.createdAt
                    ? new Date(String(post.publishedAt || post.createdAt)).toLocaleDateString()
                    : "Note"}
                </p>
                <h2 className="mt-3 font-display text-[clamp(2rem,5vw,4.2rem)] leading-[0.92] tracking-[-0.04em]">
                  {post.title || post.name || post.slug}
                </h2>
                {(post.excerpt || post.summary) && (
                  <p className="mt-4 max-w-xl font-serif text-lg text-ink/70">
                    {post.excerpt || post.summary}
                  </p>
                )}
              </div>
              <RevealImage
                src={post.featuredImage || post.image || post.imageUrl || EDITORIAL.still}
                alt={post.title || post.name || post.slug}
                className="aspect-[16/11]"
              />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
