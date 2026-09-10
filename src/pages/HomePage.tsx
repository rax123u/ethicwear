import { Link } from "react-router-dom";
import { ProductFigure } from "@/components/product/ProductFigure";
import { Marquee } from "@/components/ui/Marquee";
import { Reveal } from "@/components/ui/Reveal";
import { RevealImage } from "@/components/ui/RevealImage";
import { EditorManifesto } from "@/components/home/EditorManifesto";
import { useSite } from "@/context/SiteContext";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { useProducts } from "@/hooks/useProducts";
import {
  categoryImage,
  categoryName,
  productImage,
  storeDescription,
  storeName,
} from "@/lib/catalog";
import { EDITORIAL } from "@/lib/editorial";
import { fetchBlog, isOrbitConfigured } from "@/lib/orbit";
import { useEffect, useState } from "react";
import type { BlogPost } from "@/types/orbit";

export function HomePage() {
  const { settings, categories } = useSite();
  const { products, loading } = useProducts({ page: 1, pageSize: 8 });
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const name = storeName(settings);
  const description = storeDescription(settings);
  const featured = products[0];
  const heroImage = featured ? productImage(featured, EDITORIAL.hero) : EDITORIAL.hero;

  useDocumentTitle();

  useEffect(() => {
    if (!isOrbitConfigured()) return;
    void fetchBlog({ page: 1, pageSize: 3 })
      .then((res) => setPosts(Array.isArray(res.data) ? res.data : []))
      .catch(() => setPosts([]));
  }, []);

  return (
    <div>
      <section data-nav-theme="dark" className="relative min-h-[100svh]">
        <RevealImage
          src={heroImage}
          alt={name}
          className="absolute inset-0"
          imgClassName="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-noir via-noir/25 to-noir/40" />
        <div className="relative flex min-h-[100svh] flex-col justify-between px-5 pb-8 pt-28 md:px-8 text-paper">
          <p className="text-[0.68rem] uppercase tracking-[0.36em] text-paper/70">
            Clothing · Fashion · Beauty
          </p>
          <div>
            <h1 className="max-w-[16ch] font-display text-[clamp(4.4rem,16vw,13.5rem)] leading-[0.78] tracking-[-0.07em]">
              {name}
            </h1>
            <div className="mt-8 flex max-w-3xl flex-col justify-between gap-6 md:flex-row md:items-end">
              <p className="max-w-md font-serif text-lg text-paper/80 md:text-xl">
                {description ||
                  "An edited house of garments and beauty — presented at the scale of a magazine, not a catalogue."}
              </p>
              <Link
                to="/shop"
                className="text-[0.7rem] uppercase tracking-[0.28em] underline underline-offset-8"
              >
                Enter the shop
              </Link>
            </div>
          </div>
        </div>
      </section>

      <div data-nav-theme="dark">
        <Marquee
          text="ETHICWEAR — ETHICWEAR — ETHICWEAR"
          className="border-y border-line-soft bg-noir py-5 font-display text-[clamp(3rem,9vw,8rem)] leading-none tracking-[-0.05em] text-paper"
        />
      </div>

      <EditorManifesto />

      <section data-nav-theme="dark" className="bg-noir px-5 py-24 text-paper md:px-8 md:py-32">
        <div className="mb-16 flex items-end justify-between gap-6">
          <Reveal>
            <h2 className="font-display text-[clamp(3rem,8vw,7.5rem)] leading-[0.82] tracking-[-0.06em]">
              In
              <br />
              the rooms
            </h2>
          </Reveal>
          <Link
            to="/categories"
            className="hidden text-[0.7rem] uppercase tracking-[0.26em] underline underline-offset-8 md:block"
          >
            Full index
          </Link>
        </div>

        <div className="divide-y divide-line-soft border-y border-line-soft">
          {categories.length ? (
            categories.slice(0, 6).map((category, index) => (
              <Link
                key={String(category.id)}
                to={`/category/${category.id}`}
                className="group grid items-center gap-6 py-6 md:grid-cols-[80px_1fr_220px]"
              >
                <span className="text-[0.68rem] uppercase tracking-[0.28em] text-mute">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="font-display text-[clamp(2rem,5vw,4.4rem)] leading-none tracking-[-0.04em] transition-opacity group-hover:opacity-55">
                  {categoryName(category)}
                </span>
                <span className="hidden overflow-hidden md:block">
                  <img
                    src={categoryImage(category, EDITORIAL.texture)}
                    alt=""
                    className="h-20 w-full object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                  />
                </span>
              </Link>
            ))
          ) : (
            <p className="py-10 font-serif text-xl text-mute">
              Categories appear when published products are assigned to them.
            </p>
          )}
        </div>
      </section>

      <div data-nav-theme="dark">
        <Marquee
          text="CLOTH — PIGMENT — LIGHT — FORM"
          reverse
          className="border-y border-line-soft bg-noir py-3 text-[0.72rem] uppercase tracking-[0.4em] text-mist"
        />
      </div>

      <section className="bg-paper px-5 py-24 md:px-8 md:py-32">
        <Reveal>
          <h2 className="mb-16 max-w-4xl font-display text-[clamp(2.8rem,7vw,6.5rem)] leading-[0.86] tracking-[-0.05em]">
            Selected
            <br />
            for the floor
          </h2>
        </Reveal>

        {loading ? (
          <p className="font-serif text-xl text-mute">Gathering the collection…</p>
        ) : products.length ? (
          <div className="grid gap-16 lg:grid-cols-12">
            {products[0] && (
              <ProductFigure
                product={products[0]}
                index={0}
                className="lg:col-span-7"
                imageClassName="aspect-[4/5] lg:aspect-[3/4]"
              />
            )}
            <div className="grid gap-16 lg:col-span-5">
              {products.slice(1, 3).map((product, index) => (
                <ProductFigure
                  key={String(product.id)}
                  product={product}
                  index={index + 1}
                  imageClassName="aspect-[5/6]"
                />
              ))}
            </div>
            {products.slice(3, 6).map((product, index) => (
              <ProductFigure
                key={String(product.id)}
                product={product}
                index={index + 3}
                className="lg:col-span-4"
                imageClassName="aspect-[4/5]"
              />
            ))}
          </div>
        ) : (
          <p className="max-w-xl font-serif text-xl text-mute">
            No published products are available from the Orbit catalog yet.
          </p>
        )}

        <div className="mt-16">
          <Link
            to="/shop"
            className="text-[0.72rem] uppercase tracking-[0.28em] underline underline-offset-8"
          >
            View the full shop
          </Link>
        </div>
      </section>

      <section data-nav-theme="dark" className="grid lg:grid-cols-2">
        <RevealImage
          src={EDITORIAL.beauty}
          alt=""
          className="min-h-[70vh]"
        />
        <div className="flex flex-col justify-between bg-noir px-5 py-16 text-paper md:px-12 md:py-20">
          <p className="text-[0.68rem] uppercase tracking-[0.32em] text-mute">
            Beauty, beside cloth
          </p>
          <div>
            <h2 className="font-display text-[clamp(2.8rem,6vw,5.4rem)] leading-[0.88] tracking-[-0.05em]">
              The dressing
              <br />
              table
              <br />
              after dark
            </h2>
            <p className="mt-8 max-w-md font-serif text-lg leading-relaxed">
              Fashion here is not a department. Beauty sits in the same edit —
              pigment, scent and fabric speaking in the same register.
            </p>
          </div>
          <Link
            to="/shop"
            className="mt-12 text-[0.7rem] uppercase tracking-[0.28em] underline underline-offset-8"
          >
            Shop the house
          </Link>
        </div>
      </section>

      <section className="grid lg:grid-cols-2">
        <div className="order-2 flex flex-col justify-center bg-paper-2 px-5 py-16 md:px-12 lg:order-1">
          <p className="text-[0.68rem] uppercase tracking-[0.32em] text-mute">
            Cut and hold
          </p>
          <h2 className="mt-6 font-display text-[clamp(2.6rem,6vw,5rem)] leading-[0.88] tracking-[-0.05em]">
            Tailoring
            <br />
            as quiet
            <br />
            architecture
          </h2>
        </div>
        <RevealImage
          src={EDITORIAL.tailoring}
          alt=""
          className="order-1 min-h-[62vh] lg:order-2"
        />
      </section>

      {posts.length > 0 && (
        <section className="border-t border-line bg-paper px-5 py-24 md:px-8 md:py-32">
          <div className="mb-14 flex items-end justify-between">
            <h2 className="font-display text-[clamp(2.8rem,7vw,6rem)] leading-[0.86] tracking-[-0.05em]">
              Journal
            </h2>
            <Link
              to="/journal"
              className="text-[0.7rem] uppercase tracking-[0.26em] underline underline-offset-8"
            >
              All notes
            </Link>
          </div>
          <div className="grid gap-12 md:grid-cols-3">
            {posts.map((post) => (
              <Link key={post.slug} to={`/journal/${post.slug}`} className="group">
                {(post.featuredImage || post.image || post.imageUrl) && (
                  <RevealImage
                    src={post.featuredImage || post.image || post.imageUrl || ""}
                    alt={post.title || post.name || post.slug}
                    className="mb-5 aspect-[4/5]"
                  />
                )}
                <h3 className="font-display text-3xl leading-tight tracking-[-0.03em] group-hover:opacity-60">
                  {post.title || post.name || post.slug}
                </h3>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
