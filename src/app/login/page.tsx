"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { getSupabase, isSupabaseConfigured } from "@/lib/supabase";
import { syncProfile } from "@/lib/api";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [devToken, setDevToken] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const configured = isSupabaseConfigured();

  async function signInWithGoogle() {
    const supabase = getSupabase();
    if (!supabase) return;
    setBusy(true);
    setMessage(null);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
    if (error) {
      setBusy(false);
      setMessage(error.message);
    }
  }

  async function signIn(e: React.FormEvent) {
    e.preventDefault();
    const supabase = getSupabase();
    if (!supabase) return;
    setBusy(true);
    setMessage(null);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      setBusy(false);
      setMessage(error.message);
      return;
    }
    try {
      await syncProfile();
    } catch (e) {
      setBusy(false);
      setMessage(
        e instanceof Error
          ? `Signed in, but profile sync failed: ${e.message}`
          : "Signed in, but profile sync failed.",
      );
      return;
    }
    setBusy(false);
    router.push("/app");
  }

  function saveDevToken(e: React.FormEvent) {
    e.preventDefault();
    localStorage.setItem("roomiez_web_token", devToken.trim());
    setMessage("Dev token saved. Browsing with live API where reachable.");
    router.push("/app");
  }

  return (
    <div className="mx-auto max-w-md px-4 py-12">
      <h1 className="text-3xl font-bold">Student login</h1>
      <p className="mt-1 text-muted">
        Log in to reveal owner contacts, request visits and chat.
      </p>

      {configured ? (
        <div className="mt-6 rounded-2xl border border-navy/10 bg-white p-5">
          <button
            onClick={signInWithGoogle}
            disabled={busy}
            className="w-full rounded-xl border-2 border-navy px-4 py-2 font-semibold hover:bg-navy hover:text-white disabled:opacity-60"
          >
            Continue with Google
          </button>
          <p className="my-3 text-center text-xs text-muted">or with email</p>
        <form
          onSubmit={signIn}
          className="space-y-3"
        >
          <input
            type="email"
            required
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-xl border border-navy/15 px-3 py-2"
          />
          <input
            type="password"
            required
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-xl border border-navy/15 px-3 py-2"
          />
          <button
            type="submit"
            disabled={busy}
            className="w-full rounded-xl bg-navy px-4 py-2 font-semibold text-white hover:bg-navy-light disabled:opacity-60"
          >
            Log in
          </button>
        </form>
        </div>
      ) : (
        <div className="mt-6 rounded-2xl border border-navy/10 bg-white p-5">
          <p className="text-sm text-muted">
            Supabase login isn&apos;t configured yet (missing{" "}
            <code>NEXT_PUBLIC_SUPABASE_URL</code> /{" "}
            <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code>). The site still works
            with demo data, or paste a backend access token below for local
            development.
          </p>
          <form onSubmit={saveDevToken} className="mt-3 space-y-3">
            <input
              placeholder="Paste access token (dev)"
              value={devToken}
              onChange={(e) => setDevToken(e.target.value)}
              className="w-full rounded-xl border border-navy/15 px-3 py-2"
            />
            <button
              type="submit"
              className="w-full rounded-xl bg-navy px-4 py-2 font-semibold text-white hover:bg-navy-light"
            >
              Save token & continue
            </button>
          </form>
        </div>
      )}

      {message && <p className="mt-4 text-sm text-muted">{message}</p>}
    </div>
  );
}
