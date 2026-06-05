import Link from "next/link";

const HomePage = () => {
  return (
    <main className="stage-gradient flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <span className="mb-4 rounded-full border border-brand/40 bg-brand/10 px-4 py-1 text-sm text-brand-light">
        Live Build Starter
      </span>
      <h1 className="max-w-3xl text-4xl font-bold leading-tight sm:text-6xl">
        Ready to build, live.
      </h1>
      <p className="mt-4 max-w-xl text-lg text-white/60">
        Plumbing is done: Supabase client, types, styling, and a QR component
        are wired. Build the features on stage — see BUILD_SCRIPT.md.
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/join"
          className="rounded-xl bg-brand px-6 py-3 font-semibold text-white transition hover:bg-brand-dark"
        >
          /join
        </Link>
        <Link
          href="/live"
          className="rounded-xl border border-stage-border px-6 py-3 font-semibold text-white/80 transition hover:border-brand/50"
        >
          /live
        </Link>
        <Link
          href="/admin"
          className="rounded-xl border border-stage-border px-6 py-3 font-semibold text-white/80 transition hover:border-brand/50"
        >
          /admin
        </Link>
      </div>
    </main>
  );
};

export default HomePage;
