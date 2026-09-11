import { MANIFESTO } from "@/lib/editorial";

export function EditorManifesto() {
  return (
    <section className="flex min-h-[100svh] flex-col justify-center bg-paper px-5 py-20 text-ink md:px-10 md:py-28">
      <p className="mb-10 text-[0.68rem] uppercase tracking-[0.32em] text-mute">
        From the editor
      </p>
      <p className="max-w-5xl font-serif text-[clamp(1.7rem,4.4vw,3.6rem)] leading-[1.25] tracking-[-0.03em]">
        {MANIFESTO}
      </p>
    </section>
  );
}
