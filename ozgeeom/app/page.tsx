import Link from "next/link";
import EventLogo from "@/components/EventLogo";
import { branding } from "@/lib/branding";

const HomePage = () => {
  return (
    <main className="stage-gradient flex min-h-screen flex-col">
      <div className="accent-bar w-full" />

      <div className="flex flex-1 flex-col items-center justify-center px-6 py-12 text-center">
        <EventLogo size="lg" className="mb-8 justify-center" />

        <span className="mb-4 rounded-full border border-brand/20 bg-brand-light px-4 py-1 text-sm font-medium text-brand">
          {branding.eventTitle}
        </span>

        <h1 className="max-w-3xl font-display text-4xl font-bold leading-tight text-ink sm:text-5xl">
          Join in, vote, and ask questions — live.
        </h1>
        <p className="mt-4 max-w-xl text-lg text-ink-muted">
          {branding.description}
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/join"
            className="rounded-xl bg-brand px-6 py-3 font-semibold text-white transition hover:bg-brand-dark"
          >
            Join the evening
          </Link>
          <Link
            href="/live"
            className="rounded-xl border border-stage-border bg-white px-6 py-3 font-semibold text-ink transition hover:border-brand/40 hover:bg-brand-light/50"
          >
            Go to live view
          </Link>
        </div>

        <div className="mt-12 flex gap-6 text-sm text-ink-faint">
          <Link href="/present" className="hover:text-ink-muted">
            Presenter screen
          </Link>
          <Link href="/admin" className="hover:text-ink-muted">
            Admin
          </Link>
        </div>
      </div>
    </main>
  );
};

export default HomePage;
