"use client";

import { useState } from "react";
import Link from "next/link";
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
      <div className="w-full max-w-md">
        <Link
          href="/"
          className="mb-6 inline-block text-sm text-white/40 transition hover:text-white/70"
        >
          ← Back
        </Link>

        <form
          onSubmit={handleSubmit}
          className="panel panel-glow rounded-2xl p-8"
        >
          <span className="badge">Guest signup</span>
          <h1 className="mt-4 text-2xl font-bold tracking-tight">
            Welcome to the room
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-white/55">
            One quick form — then you can vote in polls and submit questions.
          </p>

          <div className="mt-7 flex flex-col gap-4">
            <label className="flex flex-col gap-1.5">
              <span className="text-sm font-medium text-white/70">Name</span>
              <input
                type="text"
                value={form.name}
                onChange={handleChange("name")}
                required
                aria-label="Your name"
                placeholder="Ada Lovelace"
                className="input-field"
              />
            </label>

            <label className="flex flex-col gap-1.5">
              <span className="text-sm font-medium text-white/70">Email</span>
              <input
                type="email"
                value={form.email}
                onChange={handleChange("email")}
                required
                aria-label="Your email"
                placeholder="ada@example.com"
                className="input-field"
              />
            </label>

            <label className="flex flex-col gap-1.5">
              <span className="text-sm font-medium text-white/70">
                Company{" "}
                <span className="font-normal text-white/35">(optional)</span>
              </span>
              <input
                type="text"
                value={form.company}
                onChange={handleChange("company")}
                aria-label="Your company"
                placeholder="Acme Inc."
                className="input-field"
              />
            </label>
          </div>

          {error ? (
            <p
              className="mt-4 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300"
              role="alert"
            >
              {error}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={submitting}
            className="btn-primary mt-7 w-full"
          >
            {submitting ? "Joining…" : "Join the event"}
          </button>
        </form>
      </div>
    </main>
  );
};

export default JoinPage;
