import RagChatbot from "@/components/RagChatbot";

export default function ChatDemoPage() {
  return (
    <div className="min-h-screen bg-cream py-16 px-4">
      <div className="mx-auto max-w-3xl text-center mb-12">
        <h1 className="font-display text-4xl font-bold text-navy mb-4">
          Roomiez RAG Chatbot Demo
        </h1>
        <p className="text-muted text-lg">
          Ask about exam schedules, fees, events, placements, or any notice.
          The bot uses your RAG backend with Groq fallback.
        </p>
      </div>

      {/* The chatbot floats automatically — just drop it in */}
      <RagChatbot
        apiUrl={process.env.NEXT_PUBLIC_RAG_API_URL}
        title="Roomiez Assistant"
        placeholder="Ask about notices, exams, fees..."
      />
    </div>
  );
}