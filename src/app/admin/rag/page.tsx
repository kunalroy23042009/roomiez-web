"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const API_BASE =
  (process.env.NEXT_PUBLIC_RAG_API_URL || "http://localhost:8000/chat/stream").replace(
    /\/chat\/stream\/?$/,
    ""
  );

const ACCEPT =
  ".jpg,.jpeg,.png,.webp,.pdf,.xlsx,.xls,.csv,.pptx,.docx,.txt,.md";

interface Health {
  status: string;
  indexed_chunks: number;
  ingest: string;
}

interface IngestStatus {
  running: boolean;
  last: string;
}

export default function RagAdminPage() {
  const [adminKey, setAdminKey] = useState("");
  const [unlocked, setUnlocked] = useState(false);
  const [health, setHealth] = useState<Health | null>(null);
  const [ingest, setIngest] = useState<IngestStatus | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("rag_admin_key");
    if (saved) {
      setAdminKey(saved);
      setUnlocked(true);
    }
    fetchHealth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => () => {
    if (pollRef.current) clearInterval(pollRef.current);
  }, []);

  async function fetchHealth() {
    try {
      const res = await fetch(`${API_BASE}/health`);
      if (!res.ok) throw new Error();
      setHealth(await res.json());
      setMessage(null);
    } catch {
      setHealth(null);
      setMessage("API unreachable — check the service is Live and the URL is right.");
    }
  }

  const fetchStatus = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/admin/ingest-status`, {
        headers: { "X-API-Key": adminKey },
      });
      if (res.status === 401) {
        setMessage("Wrong admin key.");
        return false;
      }
      if (!res.ok) throw new Error();
      const st: IngestStatus = await res.json();
      setIngest(st);
      setMessage(null);
      return st.running;
    } catch {
      setMessage("Could not reach ingest status.");
      return false;
    }
  }, [adminKey]);

  function startPolling() {
    if (pollRef.current) clearInterval(pollRef.current);
    pollRef.current = setInterval(async () => {
      const running = await fetchStatus();
      if (!running) {
        if (pollRef.current) clearInterval(pollRef.current);
        fetchHealth();
      }
    }, 3000);
  }

  function unlock(e: React.FormEvent) {
    e.preventDefault();
    if (!adminKey.trim()) return;
    localStorage.setItem("rag_admin_key", adminKey.trim());
    setUnlocked(true);
    fetchStatus();
  }

  function lock() {
    localStorage.removeItem("rag_admin_key");
    setAdminKey("");
    setUnlocked(false);
    setIngest(null);
  }

  async function upload(files: FileList | File[]) {
    const list = Array.from(files);
    if (list.length === 0 || uploading) return;
    setUploading(true);
    setMessage(null);
    try {
      const form = new FormData();
      for (const f of list) form.append("files", f);
      const res = await fetch(`${API_BASE}/admin/upload`, {
        method: "POST",
        headers: { "X-API-Key": adminKey },
        body: form,
      });
      if (res.status === 401) {
        setMessage("Wrong admin key.");
        return;
      }
      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.detail || "Upload failed.");
      }
      const out = await res.json();
      setMessage(`Accepted: ${(out.accepted || []).join(", ")} — ingesting…`);
      fetchStatus();
      startPolling();
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "Upload failed.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <p className="font-mono text-xs tracking-[0.2em] text-peach-dark">
        ADMIN · RAG CONSOLE
      </p>
      <h1 className="mt-2 font-display text-3xl font-bold tracking-tight">
        Notice brain admin
      </h1>
      <p className="mt-1 text-muted">
        Health, uploads and ingest tracking for the chatbot backend
        (<span className="font-mono text-xs">{API_BASE}</span>).
      </p>

      {!unlocked ? (
        <form
          onSubmit={unlock}
          className="mt-6 max-w-md space-y-3 rounded-2xl border border-navy/10 bg-white p-5"
        >
          <label className="block text-sm font-medium">
            Admin API key
            <input
              type="password"
              value={adminKey}
              onChange={(e) => setAdminKey(e.target.value)}
              placeholder="ADMIN_API_KEY from Render"
              className="field mt-1"
            />
          </label>
          <button type="submit" className="btn-primary w-full">
            Unlock console
          </button>
          <p className="text-xs text-muted">
            Same key as the RAG service env. Stored only in this browser.
          </p>
        </form>
      ) : (
        <div className="mt-6 space-y-5">
          <div className="flex flex-wrap items-center gap-3">
            <button onClick={fetchHealth} className="btn-soft">
              Refresh health
            </button>
            <button onClick={() => fetchStatus()} className="btn-soft">
              Check ingest
            </button>
            <button
              onClick={lock}
              className="ml-auto text-sm text-muted underline hover:text-navy"
            >
              Lock console
            </button>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-navy/10 bg-white p-4">
              <p className="font-mono text-[11px] tracking-widest text-muted">STATUS</p>
              <p className="mt-1 font-display text-xl font-bold">
                {health ? (health.status === "ok" ? "● Live" : "● Down") : "● Unknown"}
              </p>
            </div>
            <div className="rounded-2xl border border-navy/10 bg-white p-4">
              <p className="font-mono text-[11px] tracking-widest text-muted">INDEXED CHUNKS</p>
              <p className="mt-1 font-display text-xl font-bold">
                {health ? health.indexed_chunks : "—"}
              </p>
            </div>
            <div className="rounded-2xl border border-navy/10 bg-white p-4">
              <p className="font-mono text-[11px] tracking-widest text-muted">INGEST</p>
              <p className="mt-1 font-display text-xl font-bold">
                {ingest ? (ingest.running ? "… Running" : "Idle") : "—"}
              </p>
            </div>
          </div>
          {ingest && (
            <p className="rounded-xl border border-navy/10 bg-white px-4 py-3 font-mono text-xs text-muted">
              {ingest.last}
            </p>
          )}

          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragOver(false);
              upload(e.dataTransfer.files);
            }}
            onClick={() => fileRef.current?.click()}
            className={`cursor-pointer rounded-2xl border-2 border-dashed p-8 text-center transition-colors ${
              dragOver ? "border-blueprint bg-blueprint/5" : "border-navy/25 bg-white"
            }`}
          >
            <input
              ref={fileRef}
              type="file"
              multiple
              accept={ACCEPT}
              className="hidden"
              onChange={(e) => e.target.files && upload(e.target.files)}
            />
            <p className="font-display text-lg font-bold">
              {uploading ? "Uploading…" : "Drop notices here or click to browse"}
            </p>
            <p className="mt-1 font-mono text-[11px] tracking-wide text-muted">
              JPG PNG WEBP PDF XLSX XLS CSV PPTX DOCX TXT MD
            </p>
          </div>

          {message && (
            <p className="rounded-xl border border-navy/10 bg-white px-4 py-3 text-sm text-muted">
              {message}
            </p>
          )}

          <div className="rounded-2xl bg-navy p-5 text-sm leading-6 text-white/80">
            <p className="font-mono text-[11px] tracking-widest text-peach">HOW IT RUNS</p>
            <p className="mt-1">
              Uploads land in the API&apos;s inbox and ingest in the background —
              images/PDFs via Gemini vision, office files direct. This page polls
              every 3s while ingest runs, then refreshes the chunk count. New
              notices answer in the chatbot immediately after.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
