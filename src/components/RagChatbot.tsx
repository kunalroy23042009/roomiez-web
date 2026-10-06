"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";

interface Message {
  role: "user" | "assistant";
  content: string;
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

export default function RagChatbot({
  apiUrl = process.env.NEXT_PUBLIC_RAG_API_URL || "http://localhost:8000/chat/stream",
  title = "Roomiez Assistant",
  placeholder = "Ask about notices...",
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

  const addMessage = (role: "user" | "assistant", content: string) => {
    setMessages((prev) => [...prev, { role, content }]);
    historyRef.current.push({ role, content });
    // Keep last 8 turns (16 messages max)
    if (historyRef.current.length > 16) {
      historyRef.current = historyRef.current.slice(-16);
    }
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

      const reader = res.body?.getReader();
      if (!reader) throw new Error("No stream.");
      const decoder = new TextDecoder();
      let buffer = "";
      let assistantMessage = "";
      // Index captured inside the updater — never stale.
      const indexRef: { i: number | null } = { i: null };
      setMessages((prev) => {
        indexRef.i = prev.length;
        return [...prev, { role: "assistant", content: "" }];
      });
      const paint = (text: string) =>
        setMessages((prev) => {
          if (indexRef.i === null || indexRef.i >= prev.length) return prev;
          const next = [...prev];
          next[indexRef.i] = { role: "assistant", content: text };
          return next;
        });

      // SSE framing that survives newlines inside a chunk.
      const pushEvent = (raw: string) => {
        const text = raw
          .split("\n")
          .filter((l) => l.startsWith("data: "))
          .map((l) => l.slice(6))
          .join("\n");
        if (!text) return;
        if (text.startsWith("[error:")) {
          throw new Error(text);
        }
        assistantMessage += text;
        paint(assistantMessage);
      };

      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const events = buffer.split("\n\n");
        buffer = events.pop() || "";
        for (const ev of events) pushEvent(ev);
      }
      if (buffer.trim()) pushEvent(buffer);
      if (!assistantMessage.trim()) throw new Error("Empty reply.");

      // Update history with final answer
      historyRef.current.push({ role: "assistant", content: assistantMessage });
      if (historyRef.current.length > 16) {
        historyRef.current = historyRef.current.slice(-16);
      }
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
          next[next.length - 1] = { role: "assistant", content: friendly };
        } else {
          next.push({ role: "assistant", content: friendly });
        }
        return next;
      });
    } finally {
      setIsLoading(false);
    }
  };

  const toggle = () => setIsOpen((o) => !o);

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
          onClick={toggle}
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
            height: `min(${height}px, calc(100dvh - 120px))`,
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
              <Image src={logoSrc} alt="Logo" width={28} height={28} style={{ width: 28, height: 28, borderRadius: "50%", background: "#fff", padding: 2 }} />
              <span style={{ fontWeight: 600, fontSize: 16 }}>{title}</span>
            </div>
            <button
              onClick={toggle}
              style={{
                background: "transparent",
                border: "none",
                color: "#fff",
                cursor: "pointer",
                fontSize: 20,
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
                Hi! Ask me about exam dates, fees, events, placements, or any notice.
              </div>
            )}
            {messages.map((msg, i) => (
              <div
                key={i}
                style={{
                  alignSelf: msg.role === "user" ? "flex-end" : "flex-start",
                  maxWidth: "85%",
                  padding: "10px 14px",
                  borderRadius: msg.role === "user" ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
                  background: msg.role === "user" ? primaryColor : "#f6f1e5",
                  color: msg.role === "user" ? "#fff" : "#101c34",
                  fontSize: 14,
                  lineHeight: 1.5,
                  boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
                }}
              >
                {msg.content}
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