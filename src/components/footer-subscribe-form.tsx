"use client";

import { useState } from "react";

type Status = "idle" | "loading" | "success" | "error";

export function FooterSubscribeForm({
  namePlaceholder,
  emailPlaceholder,
  submitLabel,
}: {
  namePlaceholder: string;
  emailPlaceholder: string;
  submitLabel: string;
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (status === "loading") return;

    setStatus("loading");
    setMessage("");

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email }),
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string };

      if (res.ok) {
        setStatus("success");
        setMessage("Almost there — check your inbox to confirm.");
        setName("");
        setEmail("");
      } else {
        setStatus("error");
        setMessage(data.error ?? "Something went wrong. Please try again.");
      }
    } catch {
      setStatus("error");
      setMessage("Something went wrong. Please try again.");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full" noValidate>
      <div className="flex flex-col sm:flex-row gap-3 mb-3">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={namePlaceholder}
          className="flex-1 bg-transparent border border-white/30 rounded-md px-4 py-2.5 text-sm text-white placeholder:text-white/50 focus:outline-none focus:border-white/60 transition-colors"
        />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={emailPlaceholder}
          required
          className="flex-1 bg-transparent border border-white/30 rounded-md px-4 py-2.5 text-sm text-white placeholder:text-white/50 focus:outline-none focus:border-white/60 transition-colors"
        />
      </div>
      <button
        type="submit"
        disabled={status === "loading"}
        className="w-full border-2 border-[#7c3aed] hover:bg-[#7c3aed] text-white rounded-md py-2.5 text-sm font-medium transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {status === "loading" ? "Sending…" : submitLabel}
      </button>
      {message ? (
        <p
          role="status"
          aria-live="polite"
          className={`mt-3 text-sm ${
            status === "error" ? "text-red-300" : "text-emerald-300"
          }`}
        >
          {message}
        </p>
      ) : null}
    </form>
  );
}
