import { getConnectorStatuses } from "@/lib/connectors";

export const dynamic = "force-dynamic";

const HomePage = async () => {
  const connectors = await getConnectorStatuses();
  const allOk = connectors.every((connector) => connector.ok);

  return (
    <main className="stage-gradient flex min-h-screen flex-col items-center justify-center px-6 py-16">
      <div className="w-full max-w-lg text-center">
        <span className="mb-4 inline-block rounded-full border border-brand/40 bg-brand/10 px-4 py-1 text-sm text-brand-light">
          Live build
        </span>
        <h1 className="text-4xl font-bold leading-tight sm:text-5xl">
          Connectors ready.
        </h1>
        <p className="mt-4 text-lg text-white/60">
          Supabase, OpenAI, Vercel, and GitHub are wired. Open{" "}
          <code className="text-white/80">BUILD_SCRIPT.md</code> and start with
          Prompt 0.
        </p>
      </div>

      <ul
        className="panel mt-10 w-full max-w-lg rounded-2xl p-6"
        aria-label="Connector status"
      >
        {connectors.map((connector) => (
          <li
            key={connector.id}
            className="flex items-start justify-between gap-4 border-b border-stage-border py-4 first:pt-0 last:border-b-0 last:pb-0"
          >
            <div className="text-left">
              <p className="font-semibold">{connector.label}</p>
              <p className="mt-1 text-sm text-white/50">{connector.detail}</p>
            </div>
            <span
              className={
                connector.ok
                  ? "shrink-0 rounded-full bg-accent-green/15 px-3 py-1 text-xs font-medium text-accent-green"
                  : "shrink-0 rounded-full bg-accent-amber/15 px-3 py-1 text-xs font-medium text-accent-amber"
              }
              aria-label={connector.ok ? "Connected" : "Not connected"}
            >
              {connector.ok ? "OK" : "Check"}
            </span>
          </li>
        ))}
      </ul>

      <p className="mt-8 text-sm text-white/40">
        {allOk
          ? "All connectors green — start building."
          : "Fix any amber connectors in .env.local before going on stage."}
      </p>
    </main>
  );
};

export default HomePage;
