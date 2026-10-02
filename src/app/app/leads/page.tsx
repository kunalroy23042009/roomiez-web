"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  cancelLead,
  listMyLeads,
  openConversation,
  type Lead,
} from "@/lib/api";

export default function LeadsPage() {
  const router = useRouter();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    listMyLeads()
      .then(setLeads)
      .catch((e: unknown) =>
        setMessage(e instanceof Error ? e.message : "Could not load leads."),
      )
      .finally(() => setLoading(false));
  }, []);

  async function chat(lead: Lead) {
    try {
      const conv = await openConversation(lead.id);
      router.push(`/app/chats/${conv.id}`);
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "Could not open chat.");
    }
  }

  async function cancel(lead: Lead) {
    try {
      const updated = await cancelLead(lead.id);
      setLeads((ls) => ls.map((l) => (l.id === lead.id ? updated : l)));
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "Could not cancel lead.");
    }
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="text-3xl font-bold">My leads</h1>
      <p className="mt-1 text-muted">
        Every contact reveal and visit request, tracked to move-in.
      </p>
      {loading ? (
        <p className="mt-4 text-muted">Loading…</p>
      ) : message && leads.length === 0 ? (
        <div className="mt-4 rounded-2xl bg-white p-6">
          <p className="text-muted">{message}</p>
          <Link href="/login" className="mt-2 inline-block underline">
            Log in to see your leads
          </Link>
        </div>
      ) : leads.length === 0 ? (
        <p className="mt-4 text-muted">
          No leads yet. Open a room and reveal contact or request a visit.
        </p>
      ) : (
        <div className="mt-6 space-y-4">
          {message && <p className="text-sm text-muted">{message}</p>}
          {leads.map((l) => (
            <div
              key={l.id}
              className="rounded-2xl border border-navy/10 bg-white p-4"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <Link
                    href={`/app/rooms/${l.room_id}`}
                    className="font-bold hover:underline"
                  >
                    {l.room_title ?? "Room"}
                  </Link>
                  <p className="text-sm text-muted">
                    {l.lead_type} · {l.lead_status}
                    {l.visit_slot
                      ? ` · visit ${new Date(l.visit_slot).toLocaleString()}`
                      : ""}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => chat(l)}
                    className="rounded-xl bg-navy px-4 py-1.5 text-sm font-semibold text-white hover:bg-navy-light"
                  >
                    Chat
                  </button>
                  {l.lead_status !== "CLOSED_LOST" && (
                    <button
                      onClick={() => cancel(l)}
                      className="rounded-xl border border-navy/20 px-4 py-1.5 text-sm hover:bg-cream"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
