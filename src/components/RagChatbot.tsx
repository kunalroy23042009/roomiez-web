"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

type Message = { role: "user" | "assistant"; content: string; time: string; failed?: boolean };
type Chat = { id: string; messages: Message[] };
interface ChatbotProps { apiUrl?: string; title?: string; placeholder?: string; logoSrc?: string; primaryColor?: string; width?: number; height?: number }
const fresh = (): Chat => ({ id: crypto.randomUUID(), messages: [] });

export default function RagChatbot({ apiUrl = "/api/assistant/chat", title = "Roomiez Assistant", placeholder = "Ask about rooms, rent or visits…", logoSrc = "/logo.png", primaryColor = "#101c34", width = 380, height = 520 }: ChatbotProps) {
  const [open, setOpen] = useState(false);
  const [chats, setChats] = useState<Chat[]>([]);
  const [active, setActive] = useState("");
  const [historyOpen, setHistoryOpen] = useState(false);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [copied, setCopied] = useState<number | null>(null);
  const lock = useRef(false);
  const list = useRef<HTMLDivElement>(null);
  const messages = chats.find(c => c.id === active)?.messages || [];

  function openChat() {
    setOpen(true);
    if (chats.length) return;
    let saved: Chat[] = [];
    try {
      const parsed = JSON.parse(localStorage.getItem("roomiez_chats") || "[]");
      if (Array.isArray(parsed)) saved = parsed.filter(c => typeof c.id === "string" && Array.isArray(c.messages) && c.messages.every((m: Message) => typeof m.content === "string" && ["user", "assistant"].includes(m.role))).slice(0, 20);
    } catch { /* Local storage may be unavailable. */ }
    if (!saved.length) saved = [fresh()];
    setChats(saved);
    setActive(saved[0].id);
  }
  useEffect(() => {
    if (chats.length) try { localStorage.setItem("roomiez_chats", JSON.stringify(chats)); } catch { /* Chat remains usable without storage. */ }
  }, [chats]);
  useEffect(() => { if (list.current) list.current.scrollTop = list.current.scrollHeight; }, [chats, open, active]);

  async function send(retryIndex?: number) {
    if (lock.current || !active) return;
    const text = retryIndex === undefined ? input.trim() : messages[retryIndex - 1]?.content;
    if (!text) return;
    lock.current = true;
    setBusy(true);
    const id = active;
    const previous = retryIndex === undefined ? messages : messages.slice(0, retryIndex - 1);
    const next: Message[] = [...previous, { role: "user", content: text, time: new Date().toISOString() }];
    setChats(all => all.map(c => c.id === id ? { ...c, messages: next } : c));
    setInput("");
    let reply: Message;
    try {
      const res = await fetch(apiUrl, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ message: text, history: previous.filter(m => !m.failed).slice(-10).map(({ role, content }) => ({ role, content: content.slice(0, 4000) })) }), signal: AbortSignal.timeout(95000) });
      if (!res.ok) throw new Error("Request failed");
      const data = await res.json();
      if (typeof data.answer !== "string" || !data.answer.trim()) throw new Error("Empty reply");
      reply = { role: "assistant", content: data.answer, time: new Date().toISOString() };
    } catch {
      reply = { role: "assistant", content: "Could not reach the assistant. Check your connection and try again.", time: new Date().toISOString(), failed: true };
    }
    setChats(all => all.map(c => c.id === id ? { ...c, messages: [...next, reply] } : c));
    lock.current = false;
    setBusy(false);
  }

  function newChat() {
    const chat = fresh();
    setChats(all => [chat, ...all].slice(0, 20));
    setActive(chat.id);
    setHistoryOpen(false);
    setInput("");
  }

  function citations(text: string) {
    const matches = [...text.matchAll(/[\[(]([^\[\]()]+?\.(?:pdf|txt|xlsx?|docx?|csv|png|jpe?g|webp)),?\s*p\.?\s*(\d+)[\])]/gi)];
    const unique = new Map(matches.map(m => [`${m[1]}#${m[2]}`, m]));
    return [...unique.values()].slice(0, 6).map(m => <a key={`${m[1]}#${m[2]}`} className="rounded-full border border-navy/15 px-2 py-1 text-xs underline" href={`/api/assistant/documents/${encodeURIComponent(m[1].trim())}`} target="_blank" rel="noopener noreferrer">{m[1]} · p.{m[2]}</a>);
  }

  return <div className="fixed bottom-20 right-4 z-50 sm:bottom-6">
    {!open ? <button aria-label="Open Roomiez Assistant" onClick={openChat} className="rounded-full border-2 border-navy bg-white p-2 shadow-lg"><Image src={logoSrc} alt="Roomiez" width={44} height={44} className="rounded-full" /></button> :
      <section aria-label={title} className="flex flex-col overflow-hidden rounded-2xl border border-navy/15 bg-white shadow-xl" style={{ width: `min(${width}px, calc(100vw - 32px))`, height: `min(${height}px, 70dvh)` }}>
        <header className="flex items-center gap-2 p-3 text-white" style={{ background: primaryColor }}>
          <Image src={logoSrc} alt="" width={30} height={30} className="rounded-lg" />
          <h2 className="min-w-0 flex-1 text-sm font-semibold">{title}</h2>
          <button aria-label="Chat history" disabled={busy} onClick={() => setHistoryOpen(v => !v)} className="p-2 text-xs disabled:opacity-40">History</button>
          <button aria-label="New chat" disabled={busy} onClick={newChat} className="p-2 text-xl disabled:opacity-40">+</button>
          <button aria-label="Close assistant" onClick={() => setOpen(false)} className="p-2 text-xl">×</button>
        </header>
        {historyOpen ? <div className="min-h-0 flex-1 overflow-y-auto p-3">{chats.map(c => <button key={c.id} onClick={() => { setActive(c.id); setHistoryOpen(false); }} className="mb-2 block w-full truncate rounded-lg border border-navy/10 p-3 text-left text-sm">{c.messages.find(m => m.role === "user")?.content || "New chat"}</button>)}</div> :
          <div ref={list} role="log" aria-live="polite" className="min-h-0 flex-1 space-y-3 overflow-y-auto p-4">
            {!messages.length && <p className="py-8 text-center text-sm leading-6 text-muted">Find your next room.<br />Ask about rent, visits, agreements or safety.</p>}
            {messages.map((m, i) => <div key={i} className={`max-w-[90%] rounded-2xl p-3 text-sm ${m.role === "user" ? "ml-auto bg-navy text-white" : "bg-cream text-navy"}`}>
              <p className="whitespace-pre-wrap break-words leading-6">{m.content}</p>
              {m.role === "assistant" && <><div className="mt-2 flex flex-wrap gap-1">{citations(m.content)}</div><div className="mt-2 flex gap-3 text-xs"><button onClick={async () => { try { await navigator.clipboard.writeText(m.content); setCopied(i); } catch { setCopied(null); } }}>{copied === i ? "Copied" : "Copy"}</button>{m.failed && i > 0 && <button disabled={busy} onClick={() => send(i)} className="underline">Try again</button>}</div></>}
            </div>)}
            {busy && <p role="status" className="text-xs text-muted">Finding an answer…</p>}
          </div>}
        <form onSubmit={e => { e.preventDefault(); void send(); }} className="flex gap-2 border-t border-navy/10 p-3">
          <input aria-label="Message" value={input} onChange={e => setInput(e.target.value)} placeholder={placeholder} maxLength={2000} className="min-w-0 flex-1 rounded-lg border border-navy/20 px-3 py-2 text-sm focus:outline-2 focus:outline-navy" />
          <button disabled={busy || !input.trim()} type="submit" className="rounded-lg bg-navy px-3 py-2 text-sm font-semibold text-white disabled:opacity-40">Send</button>
        </form>
      </section>}
  </div>;
}
