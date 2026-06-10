import Link from "next/link";

const HomePage = () => {
  return (
    <main className="stage-gradient relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 py-16 text-center">
      <div
        className="pointer-events-none absolute inset-0 opacity-30"
        aria-hidden="true"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.07) 1px, transparent 0)",
          backgroundSize: "32px 32px",
        }}
      />

      <div className="relative z-10 max-w-3xl">
        <span className="badge mb-6">Brisbane AI CFO 2026</span>
        <h1 className="text-4xl font-bold leading-[1.1] tracking-tight sm:text-6xl">
          Join, vote, and ask questions —{" "}
          <span className="bg-gradient-to-r from-brand-light to-accent-cyan bg-clip-text text-transparent">
            live.
          </span>
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-white/55">
          Scan the QR on the big screen, sign up in seconds, take part in live
          polls, and submit questions our AI groups for the panel Q&amp;A.
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <Link href="/join" className="btn-primary">
            Join the event
          </Link>
          <Link href="/live" className="btn-secondary">
            Live hub
          </Link>
        </div>

        <div className="mt-14 flex flex-wrap items-center justify-center gap-6 text-sm text-white/35">
          <Link
            href="/present"
            className="transition hover:text-brand-light"
          >
            Presenter screen
          </Link>
          <span aria-hidden="true">·</span>
          <Link href="/admin" className="transition hover:text-brand-light">
            Admin
          </Link>
        </div>
      </div>
    </main>
  );
};

export default HomePage;
