import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { useRef, useEffect, useState } from "react";
import { Send, StopCircle, Trash2, Bot, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useChat } from "@/hooks/useChat";
import ReactMarkdown from "react-markdown";

export default function ChatPage() {
  const [input, setInput] = useState("");
  const { messages, isLoading, send, stop, clear } = useChat();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    send(input.trim());
    setInput("");
  };

  return (
    <DashboardLayout title="AI Assistant">
      <div className="flex flex-col h-[calc(100vh-8rem)]">
        {/* Header bar */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
              <Bot className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h2 className="font-heading text-sm font-bold">Auto Scale AI Assistant</h2>
              <p className="text-xs text-muted-foreground">NAAC Accreditation Expert & App Guide</p>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={clear} className="gap-2 border-border">
            <Trash2 className="h-3 w-3" /> Clear
          </Button>
        </div>

        {/* Messages */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto glass-card p-6 space-y-5 mb-4">
          {messages.length === 0 && (
            <div className="text-center py-16 space-y-4">
              <Bot className="h-16 w-16 text-primary/20 mx-auto" />
              <h3 className="font-heading text-lg font-bold">How can I help?</h3>
              <p className="text-sm text-muted-foreground max-w-md mx-auto">
                I can answer questions about NAAC criteria, help you prepare evidence, suggest improvements, and guide you through AccredAI features.
              </p>
              <div className="flex flex-wrap gap-2 justify-center max-w-lg mx-auto">
                {[
                  "Explain NAAC Criterion 3 key indicators",
                  "What documents are needed for Criterion 5?",
                  "How to use the SAR Generator?",
                  "Tips to improve NAAC grade from B+ to A",
                ].map((q) => (
                  <button
                    key={q}
                    onClick={() => send(q)}
                    className="text-xs px-4 py-2 rounded-full border border-border hover:border-primary/50 hover:bg-primary/5 transition-colors text-muted-foreground"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((msg, i) => (
            <div key={i} className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              {msg.role === "assistant" && (
                <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0 mt-1">
                  <Bot className="h-4 w-4 text-primary" />
                </div>
              )}
              <div
                className={`max-w-[75%] rounded-2xl px-4 py-3 ${
                  msg.role === "user"
                    ? "bg-primary text-primary-foreground rounded-br-md"
                    : "bg-muted text-foreground rounded-bl-md"
                }`}
              >
                {msg.role === "assistant" ? (
                  <div className="prose prose-sm prose-invert max-w-none [&>*:first-child]:mt-0 [&>*:last-child]:mb-0">
                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                  </div>
                ) : (
                  <p className="text-sm">{msg.content}</p>
                )}
              </div>
              {msg.role === "user" && (
                <div className="h-8 w-8 rounded-full bg-secondary/20 flex items-center justify-center shrink-0 mt-1">
                  <User className="h-4 w-4 text-secondary" />
                </div>
              )}
            </div>
          ))}

          {isLoading && messages[messages.length - 1]?.role !== "assistant" && (
            <div className="flex gap-3">
              <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                <Bot className="h-4 w-4 text-primary" />
              </div>
              <div className="bg-muted rounded-2xl rounded-bl-md px-5 py-4">
                <div className="flex gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-primary/50 animate-bounce [animation-delay:0ms]" />
                  <span className="h-2 w-2 rounded-full bg-primary/50 animate-bounce [animation-delay:150ms]" />
                  <span className="h-2 w-2 rounded-full bg-primary/50 animate-bounce [animation-delay:300ms]" />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <form onSubmit={handleSubmit} className="flex gap-3">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about NAAC criteria, evidence, accreditation process..."
            className="flex-1 bg-muted rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 border border-border"
            disabled={isLoading}
          />
          {isLoading ? (
            <Button type="button" size="lg" variant="destructive" onClick={stop} className="rounded-xl gap-2">
              <StopCircle className="h-4 w-4" /> Stop
            </Button>
          ) : (
            <Button type="submit" size="lg" disabled={!input.trim()} className="rounded-xl gap-2">
              <Send className="h-4 w-4" /> Send
            </Button>
          )}
        </form>
      </div>
    </DashboardLayout>
  );
}
