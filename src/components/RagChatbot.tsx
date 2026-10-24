"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";

interface Message {
  role: "user" | "assistant";
  content: string;
  failed?: boolean;
}

interface ChatbotProps {
  apiUrl?: string;
  title?: string;
  placeholder?: string;
  logoSrc?: string;
  primaryColor?: string;
  width?: number;
  height?: number;
}

interface Citation {
  name: string;
  page: string;
}

export default function RagChatbot({
  apiUrl = process.env.NEXT_PUBLIC_RAG_API_URL || "http://localhost:8000/api/v1/assistant/chat",
  title = "Roomiez Assistant",
  placeholder = "Ask about rooms, pricing, visits, safety...",
  logoSrc = "/chatbot-logo.png",
  primaryColor = "#101c34",
  width = 360,
  height = 480,
}: ChatbotProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const historyRef = useRef<Array<{ role: string; content: string }>>([]);
  const windowRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const addMessage = (role: "user" | "assistant", content: string, failed = false) => {
    setMessages((prev) => [...prev, { role, content, failed }]);
    historyRef.current.push({ role, content });
    // Keep last 8 turns (16 messages max)
    if (historyRef.current.length > 16) {
      historyRef.current = historyRef.current.slice(-16);
    }
  };

  // Extract citations from answer text
  const extractCitations = (answer: string) => {
    const citeRe = /\(([^()]+?\.(?:pdf|xlsx?|docx?|csv|png|jpe?g|webp)),?\s*p\.?\s*(\d+)\)/gi;
    const seen = new Set<string>();
    const out: Array<{ name: string; page: string }> = [];
    for (const m of answer.matchAll(citeRe)) {
      const key = `${m[1]}#${m[2]}`;
      if (seen.add(key)) {
        out.push({ name: m[1].trim(), page: m[2] });
      }
      if (out.length >= 6) break;
    }
    return out;
  };

  const docUrl = (name: string) =>
    `${process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api/v1"}/assistant/documents/${encodeURIComponent(name)}`;

  // Helper to render citation chips for assistant messages
  const renderCitations = (content: string) => {
    const sources = extractCitations(content);
    if (sources.length === 0) return null;
    return (
      <div style={{ marginTop: 8, display: "flex", flexWrap: "wrap", gap: 6 }}>
        {sources.map((s) => (
          <a
            key={`${s.name}#${s.page}`}
            href={`${process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api/v1"}/assistant/documents/${encodeURIComponent(s.name)}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-flex",
              alignItems: "center",
              padding: "2px 8px",
              fontSize: 11,
              borderRadius: 100,
              background: "#e0e0e0",
              color: "#333",
              textDecoration: "none",
              border: "1px solid #d0d0d0",
            }}
          >
            {s.name} · p.{s.page}
          </a>
        ))}
      </div>
    );
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    const text = input.trim();
    if (!text || isLoading) return;

    setInput("");
    setIsLoading(true);
    addMessage("user", text);

    try {
      const res = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          history: historyRef.current.slice(0, -1), // exclude current user message
        }),
      });

      if (!res.ok) throw new Error("API error");

      const data = await res.json();
      const answer = data.answer || "Assistant gave no answer. Try again.";
      addMessage("assistant", answer);
    } catch (err) {
      console.error(err);
      const msg = err instanceof Error ? err.message : String(err);
      const friendly = msg.startsWith("[error:")
        ? "The assistant had trouble answering that — try rephrasing."
        : "Couldn't reach the assistant — check your connection and try again.";
      setMessages((prev) => {
        const next = [...prev];
        const last = next[next.length - 1];
        if (last && last.role === "assistant") {
          next[next.length - 1] = { role: "assistant", content: friendly, failed: true };
        } else {
          next.push({ role: "assistant", content: friendly, failed: true });
        }
        return next;
      });
    } finally {
      setIsLoading(false);
    }
  };

  const toggle = () => setIsOpen((o) => !o);

  const formatTime = (date: Date) =>
    date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: true });

  return (
    <div
      ref={windowRef}
      style={{
        position: "fixed",
        bottom: 24,
        right: 24,
        zIndex: 9999,
        fontFamily: "system-ui, sans-serif",
      }}
    >
      {!isOpen && (
        <button
          onClick={() => {
            setIsOpen(true);
            if (messages.length === 0) {
              setMessages([{ role: "assistant", content: "Hi! I'm the Roomiez Assistant. Ask me about rooms, pricing, visits, safety or any notice." }]);
            }
          }}
          aria-label="Open chat"
          style={{
            position: "relative",
            width: 64,
            height: 64,
            borderRadius: "50%",
            border: `3px solid ${primaryColor}`,
            background: "#fff",
            cursor: "pointer",
            padding: 6,
            boxShadow: "0 6px 24px rgba(0,0,0,0.25)",
            transition: "transform 0.2s",
            animation: "chatbot-pulse 2.4s ease-out infinite",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.08)")}
          onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
        >
          <style>{`@keyframes chatbot-pulse {
            0% { box-shadow: 0 6px 24px rgba(0,0,0,0.25), 0 0 0 0 rgba(16,28,52,0.35); }
            70% { box-shadow: 0 6px 24px rgba(0,0,0,0.25), 0 0 0 14px rgba(16,28,52,0); }
            100% { box-shadow: 0 6px 24px rgba(0,0,0,0.25), 0 0 0 0 rgba(16,28,52,0); }
          }`}</style>
          <Image
            src={logoSrc}
            alt="Chat with Roomiez"
            width={46}
            height={46}
            style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover", display: "block" }}
          />
          <span
            style={{
              position: "absolute",
              top: 2,
              right: 2,
              width: 14,
              height: 14,
              borderRadius: "50%",
              background: "#22c55e",
              border: "2px solid #fff",
            }}
          />
        </button>
      )}

      {isOpen && (
        <div
          style={{
            width: `min(${width}px, calc(100vw - 32px))`,
            maxHeight: `calc(100dvh - 120px)`,
            background: "#fff",
            border: "1px solid #e0e0e0",
            borderRadius: 16,
            boxShadow: "0 12px 40px rgba(0,0,0,0.15)",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            marginBottom: 8,
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: "14px 16px",
              background: primaryColor,
              color: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <Image src={logoSrc} alt="Logo" width={32} height={32} style={{ width: 32, height: 32, borderRadius: "50%", background: "#fff", padding: 2 }} />
              <div>
                <div style={{ fontWeight: 600, fontSize: 16 }}>{title}</div>
                <div style={{ fontSize: 12, opacity: 0.8 }}>Ask about rooms, rent, visits, safety…</div>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              style={{
                background: "transparent",
                border: "none",
                color: "#fff",
                cursor: "pointer",
                fontSize: 24,
                lineHeight: 1,
                padding: 4,
              }}
            >
              ×
            </button>
          </div>

          {/* Messages */}
          <div
            style={{
              flex: 1,
              overflowY: "auto",
              padding: 16,
              display: "flex",
              flexDirection: "column",
              gap: 12,
            }}
          >
            {messages.length === 0 && (
              <div
                style={{
                  color: "#6b7280",
                  fontSize: 14,
                  textAlign: "center",
                  marginTop: 40,
                }}
              >
                Hi! I'm the Roomiez Assistant. Ask me about rooms, pricing, visits, safety or any notice.
              </div>
            )}
            {messages.map((msg, i) => (
              <div
                key={i}
                style={{
                  alignSelf: msg.role === "user" ? "flex-end" : "flex-start",
                  maxWidth: "85%",
                }}
              >
                <div
                  style={{
                    padding: "10px 14px",
                    borderRadius: msg.role === "user" ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
                    background: msg.role === "user" ? primaryColor : "#f6f1e5",
                    color: msg.role === "user" ? "#fff" : "#101c34",
                    fontSize: 14,
                    lineHeight: 1.5,
                    boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
                    position: "relative",
                  }}
                >
                  <div style={{ marginBottom: 4 }}>{msg.content}</div>

                  {msg.failed && (
                    <button
                      onClick={() => {
                        if (i > 0 && messages[i - 1].role === "user") {
                          // Retry logic could be implemented here
                        }
                      }}
                      style={{
                        marginTop: 4,
                        padding: "4px 8px",
                        fontSize: 11,
                        border: "none",
                        background: "transparent",
                        color: msg.role === "user" ? "rgba(255,255,255,0.7)" : primaryColor,
                        cursor: "pointer",
                        textDecoration: "underline",
                      }}
                    >
                      Try again
                    </button>
                  )}

                  {/* Citations */}
                  {msg.role === "assistant" && renderCitations(msg.content)}

                  {/* Timestamp & Copy */}

                  {/* Timestamp & Copy */}
                  <div
                    style={{
                      marginTop: 6,
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      fontSize: 10,
                      opacity: 0.6,
                    }}
                  >
                    <span>{formatTime(new Date())}</span>
                    {msg.role !== "user" && (
                      <button
                        onClick={() => navigator.clipboard.writeText(msg.content)}
                        style={{
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          padding: 2,
                          color: "inherit",
                          opacity: 0.5,
                        }}
                        title="Copy message"
                      >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                        </svg>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form onSubmit={handleSend} style={{ padding: 12, borderTop: "1px solid #e0e0e0" }}>
            <div style={{ display: "flex", gap: 8 }}>
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={placeholder}
                disabled={isLoading}
                style={{
                  flex: 1,
                  padding: "12px 14px",
                  border: "1px solid #d1d5db",
                  borderRadius: 10,
                  fontSize: 14,
                  outline: "none",
                }}
                onFocus={(e) => (e.currentTarget.style.borderColor = primaryColor)}
                onBlur={(e) => (e.currentTarget.style.borderColor = "#d1d5db")}
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                style={{
                  padding: "12px 20px",
                  background: primaryColor,
                  color: "#fff",
                  border: "none",
                  borderRadius: 10,
                  fontWeight: 600,
                  cursor: isLoading ? "not-allowed" : "pointer",
                  opacity: isLoading ? 0.6 : 1,
                }}
              >
                {isLoading ? "..." : "Send"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}