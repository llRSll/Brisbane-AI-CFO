"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type FormState = {
  name: string;
  email: string;
  company: string;
};

const JoinPage = () => {
  const router = useRouter();
  const [form, setForm] = useState<FormState>({ name: "", email: "", company: "" });
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleChange =
    (field: keyof FormState) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setForm((prev) => ({ ...prev, [field]: event.target.value }));
    };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setSubmitting(true);

    const response = await fetch("/api/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      setError(data.error ?? "Something went wrong");
      setSubmitting(false);
      return;
    }

    router.push("/live");
  };

  return (
    <main className="stage-gradient flex min-h-screen items-center justify-center px-6 py-12">
      <form
        onSubmit={handleSubmit}
        className="panel w-full max-w-md rounded-2xl p-8"
      >
        <h1 className="text-2xl font-bold">Welcome 👋</h1>
        <p className="mt-1 text-sm text-white/60">
          Sign up to join the live polls and Q&A.
        </p>

        <div className="mt-6 flex flex-col gap-4">
          <label className="flex flex-col gap-1">
            <span className="text-sm text-white/70">Name</span>
            <input
              type="text"
              value={form.name}
              onChange={handleChange("name")}
              required
              aria-label="Your name"
              placeholder="Ada Lovelace"
              className="rounded-lg border border-stage-border bg-stage-bg px-3 py-2 outline-none focus:border-brand"
            />
          </label>

          <label className="flex flex-col gap-1">
            <span className="text-sm text-white/70">Email</span>
            <input
              type="email"
              value={form.email}
              onChange={handleChange("email")}
              required
              aria-label="Your email"
              placeholder="ada@example.com"
              className="rounded-lg border border-stage-border bg-stage-bg px-3 py-2 outline-none focus:border-brand"
            />
          </label>

          <label className="flex flex-col gap-1">
            <span className="text-sm text-white/70">
              Company <span className="text-white/40">(optional)</span>
            </span>
            <input
              type="text"
              value={form.company}
              onChange={handleChange("company")}
              aria-label="Your company"
              placeholder="Acme Inc."
              className="rounded-lg border border-stage-border bg-stage-bg px-3 py-2 outline-none focus:border-brand"
            />
          </label>
        </div>

        {error ? (
          <p className="mt-4 rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-300">
            {error}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={submitting}
          className="mt-6 w-full rounded-xl bg-brand px-6 py-3 font-semibold text-white transition hover:bg-brand-dark disabled:opacity-50"
        >
          {submitting ? "Joining…" : "Join the event"}
        </button>
      </form>
    </main>
  );
};

export default JoinPage;
