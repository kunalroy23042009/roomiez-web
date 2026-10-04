"use client";

import { useState, useRef, useEffect } from "react";

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
  logoSrc = "/logo.png",
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
      const decoder = new TextDecoder();
      let buffer = "";
      let assistantMessage = "";
      let messageIndex = messages.length;

      // Add placeholder for assistant message
      setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

      while (reader) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n\n");
        buffer = lines.pop() || "";
        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const chunk = line.slice(6);
            assistantMessage += chunk;
            setMessages((prev) => {
              const next = [...prev];
              next[messageIndex] = { role: "assistant", content: assistantMessage };
              return next;
            });
          }
        }
      }

      // Update history with final answer
      historyRef.current.push({ role: "assistant", content: assistantMessage });
      if (historyRef.current.length > 16) {
        historyRef.current = historyRef.current.slice(-16);
      }
    } catch (err) {
      console.error(err);
      setMessages((prev) => {
        const next = [...prev];
        next[next.length - 1] = { role: "assistant", content: "Error — please try again." };
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
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "12px 18px",
            background: primaryColor,
            color: "#fff",
            border: "none",
            borderRadius: 9999,
            cursor: "pointer",
            fontWeight: 600,
            fontSize: 15,
            boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
            transition: "transform 0.2s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.03)")}
          onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
        >
          <img
            src={logoSrc}
            alt="Logo"
            style={{ width: 22, height: 22, borderRadius: 4 }}
          />
          Chat with Roomiez
        </button>
      )}

      {isOpen && (
        <div
          style={{
            width,
            height,
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
              <img src={logoSrc} alt="Logo" style={{ width: 26, height: 26, borderRadius: 6 }} />
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