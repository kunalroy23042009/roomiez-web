"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  listMessages,
  markConversationRead,
  sendMessage,
  type ChatMessage,
} from "@/lib/api";

export default function ThreadPage() {
  const { id } = useParams<{ id: string }>();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [draft, setDraft] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [sending, setSending] = useState(false);

  const refresh = useCallback(async () => {
    try {
      const msgs = await listMessages(id);
      setMessages(msgs);
      setMessage(null);
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "Could not load messages.");
    }
  }, [id]);

  useEffect(() => {
    refresh();
    markConversationRead(id).catch(() => {});
    const timer = setInterval(refresh, 5000);
    return () => clearInterval(timer);
  }, [id, refresh]);

  async function send(e: React.FormEvent) {
    e.preventDefault();
    if (!draft.trim()) return;
    setSending(true);
    try {
      await sendMessage(id, draft.trim());
      setDraft("");
      await refresh();
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Could not send.");
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="mx-auto flex max-w-3xl flex-col px-4 py-8">
      <Link href="/app/chats" className="text-sm text-muted hover:text-navy">
        ← All chats
      </Link>
      <h1 className="mt-2 font-display text-2xl font-bold tracking-tight">
        Chat
      </h1>
      {message && <p className="mt-2 text-sm text-muted">{message}</p>}
      <div className="mt-4 flex min-h-64 flex-col gap-2 rounded-2xl border border-navy/10 bg-white p-4">
        {messages.length === 0 ? (
          <p className="text-sm text-muted">
            No messages yet. Say hello about the room.
          </p>
        ) : (
          messages.map((m) => (
            <div
              key={m.id}
              className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm ${
                m.mine
                  ? "self-end bg-navy text-white"
                  : "self-start bg-cream"
              }`}
            >
              {!m.mine && m.sender_name && (
                <p className="text-xs font-bold text-muted">{m.sender_name}</p>
              )}
              <p>{m.body}</p>
            </div>
          ))
        )}
      </div>
      <form onSubmit={send} className="mt-3 flex gap-2">
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Type a message…"
          maxLength={2000}
          className="field flex-1"
        />
        <button type="submit" disabled={sending} className="btn-primary">
          Send
        </button>
      </form>
    </div>
  );
}
