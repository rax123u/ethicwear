import { Link } from "react-router-dom";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";

export function NotFoundPage() {
  useDocumentTitle("Lost");

  return (
    <section className="flex min-h-[100svh] flex-col justify-end px-5 pb-16 pt-32 md:px-8">
      <p className="text-[0.68rem] uppercase tracking-[0.32em] text-mute">404</p>
      <h1 className="mt-4 font-display text-[clamp(4.5rem,16vw,13rem)] leading-[0.78] tracking-[-0.07em]">
        Off
        <br />
        the page
      </h1>
      <Link
        to="/"
        className="mt-10 text-[0.72rem] uppercase tracking-[0.28em] underline underline-offset-8"
      >
        Return to the house
      </Link>
    </section>
  );
}
