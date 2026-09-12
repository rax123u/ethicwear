import { useEffect, useState, type FormEvent } from "react";
import { useSite } from "@/context/SiteContext";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import {
  contactAddress,
  contactEmail,
  contactPhone,
  socialLinks,
} from "@/lib/catalog";
import { fetchPage } from "@/lib/orbit";
import type { CmsPage } from "@/types/orbit";

interface ContactFormState {
  name: string;
  email: string;
  subject: string;
  message: string;
}

const EMPTY_FORM: ContactFormState = {
  name: "",
  email: "",
  subject: "",
  message: "",
};

type SubmitStatus = "idle" | "submitting" | "success" | "error";

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export function ContactPage() {
  const { settings } = useSite();
  const [page, setPage] = useState<CmsPage | null>(null);
  const email = contactEmail(settings);
  const phone = contactPhone(settings);
  const address = contactAddress(settings);
  const social = socialLinks(settings);
  useDocumentTitle("Contact");

  const [form, setForm] = useState<ContactFormState>(EMPTY_FORM);
  const [errors, setErrors] = useState<Partial<ContactFormState>>({});
  const [status, setStatus] = useState<SubmitStatus>("idle");

  useEffect(() => {
    void fetchPage("contact")
      .then((res) => setPage(res.data))
      .catch(() => setPage(null));
  }, []);

  function updateField<K extends keyof ContactFormState>(field: K, value: ContactFormState[K]) {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  }

  function validate(values: ContactFormState) {
    const next: Partial<ContactFormState> = {};
    if (!values.name.trim()) next.name = "Please share your name.";
    if (!values.email.trim()) {
      next.email = "Please share an email.";
    } else if (!isValidEmail(values.email)) {
      next.email = "That doesn't look like a valid email.";
    }
    if (!values.message.trim()) next.message = "Please add a message.";
    return next;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const validationErrors = validate(form);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    setStatus("submitting");
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!response.ok) throw new Error("Request failed");
      setStatus("success");
      setForm(EMPTY_FORM);
    } catch {
      setStatus("error");
    }
  }

  return (
    <div className="pt-24">
      <section className="px-5 py-16 md:px-8 md:py-24">
        <p className="text-[0.68rem] uppercase tracking-[0.32em] text-mute">Correspondence</p>
        <h1 className="mt-4 font-display text-[clamp(4rem,13vw,11rem)] leading-[0.78] tracking-[-0.07em]">
          Contact
        </h1>
      </section>

      <section className="grid gap-16 px-5 pb-24 md:grid-cols-2 md:px-8">
        <div className="space-y-8">
          {email && (
            <div>
              <p className="text-[0.68rem] uppercase tracking-[0.28em] text-mute">Email</p>
              <a href={`mailto:${email}`} className="mt-3 block font-display text-4xl tracking-[-0.03em]">
                {email}
              </a>
            </div>
          )}
          {phone && (
            <div>
              <p className="text-[0.68rem] uppercase tracking-[0.28em] text-mute">Telephone</p>
              <a href={`tel:${phone}`} className="mt-3 block font-display text-4xl tracking-[-0.03em]">
                {phone}
              </a>
            </div>
          )}
          {address && (
            <div>
              <p className="text-[0.68rem] uppercase tracking-[0.28em] text-mute">Atelier</p>
              <p className="mt-3 max-w-sm font-serif text-2xl">{address}</p>
            </div>
          )}
          {!email && !phone && !address && (
            <p className="max-w-md font-serif text-xl text-mute">
              Contact details will appear here when they are published in Orbit site settings.
            </p>
          )}
          {social.length > 0 && (
            <div className="flex flex-wrap gap-5 pt-4 text-[0.7rem] uppercase tracking-[0.24em]">
              {social.map((item) => (
                <a key={item.label} href={item.href} target="_blank" rel="noreferrer">
                  {item.label}
                </a>
              ))}
            </div>
          )}
        </div>

        {page?.content || page?.body ? (
          <div
            className="cms-content"
            dangerouslySetInnerHTML={{ __html: page.content || page.body || "" }}
          />
        ) : (
          <p className="font-serif text-2xl leading-relaxed text-ink/70">
            Write when the season turns, or when a piece needs another look. We keep the
            correspondence as considered as the shop floor.
          </p>
        )}
      </section>

      <section className="border-t border-ink/10 px-5 py-16 md:px-8 md:py-24">
        <p className="text-[0.68rem] uppercase tracking-[0.32em] text-mute">Send a message</p>
        <h2 className="mt-4 font-display text-[clamp(2.5rem,6vw,4.5rem)] leading-[0.9] tracking-[-0.04em]">
          We'd like to hear from you
        </h2>

        <form
          onSubmit={handleSubmit}
          noValidate
          className="mt-12 grid max-w-3xl gap-8 sm:grid-cols-2"
        >
          <div className="flex flex-col gap-2 sm:col-span-1">
            <label htmlFor="contact-name" className="text-[0.68rem] uppercase tracking-[0.28em] text-mute">
              Name
            </label>
            <input
              id="contact-name"
              name="name"
              type="text"
              autoComplete="name"
              value={form.name}
              onChange={(e) => updateField("name", e.target.value)}
              aria-invalid={Boolean(errors.name)}
              aria-describedby={errors.name ? "contact-name-error" : undefined}
              className="border-b border-ink/20 bg-transparent py-3 font-serif text-xl outline-none transition-colors focus:border-ink"
            />
            {errors.name && (
              <p id="contact-name-error" className="text-xs text-red-700">
                {errors.name}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-2 sm:col-span-1">
            <label htmlFor="contact-email" className="text-[0.68rem] uppercase tracking-[0.28em] text-mute">
              Email
            </label>
            <input
              id="contact-email"
              name="email"
              type="email"
              autoComplete="email"
              value={form.email}
              onChange={(e) => updateField("email", e.target.value)}
              aria-invalid={Boolean(errors.email)}
              aria-describedby={errors.email ? "contact-email-error" : undefined}
              className="border-b border-ink/20 bg-transparent py-3 font-serif text-xl outline-none transition-colors focus:border-ink"
            />
            {errors.email && (
              <p id="contact-email-error" className="text-xs text-red-700">
                {errors.email}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-2 sm:col-span-2">
            <label htmlFor="contact-subject" className="text-[0.68rem] uppercase tracking-[0.28em] text-mute">
              Subject
            </label>
            <input
              id="contact-subject"
              name="subject"
              type="text"
              value={form.subject}
              onChange={(e) => updateField("subject", e.target.value)}
              className="border-b border-ink/20 bg-transparent py-3 font-serif text-xl outline-none transition-colors focus:border-ink"
            />
          </div>

          <div className="flex flex-col gap-2 sm:col-span-2">
            <label htmlFor="contact-message" className="text-[0.68rem] uppercase tracking-[0.28em] text-mute">
              Message
            </label>
            <textarea
              id="contact-message"
              name="message"
              rows={5}
              value={form.message}
              onChange={(e) => updateField("message", e.target.value)}
              aria-invalid={Boolean(errors.message)}
              aria-describedby={errors.message ? "contact-message-error" : undefined}
              className="resize-none border-b border-ink/20 bg-transparent py-3 font-serif text-xl outline-none transition-colors focus:border-ink"
            />
            {errors.message && (
              <p id="contact-message-error" className="text-xs text-red-700">
                {errors.message}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-4 sm:col-span-2 sm:flex-row sm:items-center sm:justify-between">
          <button
            type="submit"
            disabled={status === "submitting"}
            className="w-full bg-ink px-8 py-4 text-[0.7rem] uppercase tracking-[0.28em] !text-white transition-opacity disabled:opacity-50 sm:w-auto"
            style={{ color: "#ffffff" }}
          >
            {status === "submitting" ? "Sending…" : "Send message"}
          </button>

            <p role="status" aria-live="polite" className="text-sm text-mute">
              {status === "success" && "Thank you — we'll be in touch shortly."}
              {status === "error" && "Something went wrong. Please try again."}
            </p>
          </div>
        </form>
      </section>
    </div>
  );
}