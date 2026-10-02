"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { getSupabase } from "@/lib/supabase";
import { syncProfile } from "@/lib/api";

function CallbackInner() {
  const router = useRouter();
  const params = useSearchParams();
  const [message, setMessage] = useState("Signing you in…");

  useEffect(() => {
    async function run() {
      const supabase = getSupabase();
      if (!supabase) {
        setMessage("Supabase isn't configured.");
        return;
      }
      const oauthError =
        params.get("error_description") ?? params.get("error");
      if (oauthError) {
        setMessage(`Sign-in failed: ${oauthError}`);
        return;
      }
      const code = params.get("code");
      if (!code) {
        setMessage("No sign-in code found. Please try again.");
        return;
      }
      const { error } = await supabase.auth.exchangeCodeForSession(code);
      if (error) {
        setMessage(error.message);
        return;
      }
      try {
        await syncProfile();
      } catch (e) {
        setMessage(
          e instanceof Error
            ? `Signed in, but profile sync failed: ${e.message}`
            : "Signed in, but profile sync failed.",
        );
        return;
      }
      router.replace("/app");
    }
    run();
  }, [params, router]);

  return (
    <div className="mx-auto max-w-md px-4 py-12 text-center">
      <p>{message}</p>
      <Link href="/login" className="mt-4 inline-block underline">
        Back to login
      </Link>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-md px-4 py-12 text-center">
          <p>Signing you in…</p>
        </div>
      }
    >
      <CallbackInner />
    </Suspense>
  );
}
