"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { listConversations, type Conversation } from "@/lib/api";

export default function ChatsPage() {
  const [convs, setConvs] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    listConversations()
      .then(setConvs)
      .catch((e: unknown) =>
        setMessage(
          e instanceof Error ? e.message : "Could not load chats.",
        ),
      )
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="font-display text-3xl font-bold tracking-tight">Chats</h1>
      <p className="mt-1 text-muted">
        One thread per room enquiry, opened from a lead.
      </p>
      {loading ? (
        <p className="mt-4 text-muted">Loading…</p>
      ) : message && convs.length === 0 ? (
        <div className="mt-4 rounded-2xl border border-navy/10 bg-white p-6">
          <p className="text-muted">{message}</p>
          <Link href="/login" className="mt-2 inline-block underline">
            Log in to see chats
          </Link>
        </div>
      ) : convs.length === 0 ? (
        <p className="mt-4 text-muted">
          No chats yet. Reveal a contact or request a visit, then tap Chat.
        </p>
      ) : (
        <div className="mt-6 space-y-3">
          {convs.map((c) => (
            <Link
              key={c.id}
              href={`/app/chats/${c.id}`}
              className="block rounded-2xl border border-navy/10 bg-white p-4 hover:shadow"
            >
              <div className="flex items-center justify-between gap-2">
                <p className="font-bold">
                  {c.room_title ?? "Room enquiry"}
                  {c.other_name ? ` · ${c.other_name}` : ""}
                </p>
                {c.unread_count > 0 && (
                  <span className="rounded-full bg-peach px-2.5 py-0.5 text-xs font-bold">
                    {c.unread_count} new
                  </span>
                )}
              </div>
              {c.last_body && (
                <p className="mt-1 truncate text-sm text-muted">{c.last_body}</p>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
