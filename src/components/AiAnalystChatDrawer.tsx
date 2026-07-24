import React, { useState } from "react";
import { X, Send, Sparkles, Bot, User, Brain } from "lucide-react";
import { ChatMessage, ProcessedDataset, AiExecutiveReport } from "../types";

interface AiAnalystChatDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  dataset: ProcessedDataset;
  report: AiExecutiveReport | null;
}

export const AiAnalystChatDrawer: React.FC<AiAnalystChatDrawerProps> = ({
  isOpen,
  onClose,
  dataset,
  report,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      sender: "ai",
      text: `Hello! I am your AI Financial Analyst Assistant. I have indexed "${dataset.name}" with ${dataset.rowCount} records. Ask me anything regarding revenue drivers, DuPont ratio breakdowns, risk scenarios, or board presentation summaries!`,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);

  if (!isOpen) return null;

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isSending) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      sender: "user",
      text: input,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsSending(true);

    try {
      const controller = new AbortController();
      const timeoutId = window.setTimeout(() => controller.abort(), 30000);
      const res = await fetch("/api/ai-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: controller.signal,
        body: JSON.stringify({
          question: userMessage.text,
          datasetContext: {
            name: dataset.name,
            rowCount: dataset.rowCount,
            columnsSummary: dataset.columnSummaries,
            sampleData: dataset.data.slice(0, 5),
            anomalies: dataset.anomalies.slice(0, 5),
          },
          previousReport: report,
        }),
      });
      window.clearTimeout(timeoutId);

      const data = await res.json().catch(() => ({}));
      if (!res.ok || data.success === false) {
        throw new Error(data.error || `AI service returned HTTP ${res.status}`);
      }
      const aiReplyText = data.answer || "Apologies, I could not generate an answer at this moment.";

      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: "ai",
        text: aiReplyText,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (err) {
      console.error("AI Chat error:", err);
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: "ai",
        text: err?.name === "AbortError"
          ? "The AI service took too long to respond. Please try again."
          : "An error occurred while connecting to the AI Financial Analyst service.",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex justify-end" onMouseDown={onClose}>
      <div className="w-full max-w-lg bg-white border-l border-slate-200 h-full flex flex-col shadow-xl animate-in slide-in-from-right duration-200" onMouseDown={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 bg-slate-100 text-slate-800 rounded">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">Analyst Assistant</h2>
              <p className="text-[11px] text-slate-500">Context-aware Q&A for your dataset</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Chat Message List */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4 text-xs bg-slate-50/50">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-start space-x-2.5 ${
                msg.sender === "user" ? "flex-row-reverse space-x-reverse" : ""
              }`}
            >
              <div
                className={`p-2 rounded shrink-0 ${
                  msg.sender === "user"
                    ? "bg-slate-900 text-white"
                    : "bg-white text-slate-800 border border-slate-200"
                }`}
              >
                {msg.sender === "user" ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
              </div>

              <div
                className={`p-3.5 rounded-lg max-w-[85%] leading-relaxed ${
                  msg.sender === "user"
                    ? "bg-slate-900 text-white rounded-tr-none"
                    : "bg-white text-slate-800 border border-slate-200 rounded-tl-none space-y-2 shadow-xs"
                }`}
              >
                <div className="whitespace-pre-wrap">{msg.text}</div>
                <span className={`text-[9px] block text-right mt-1 ${
                  msg.sender === "user" ? "text-slate-300" : "text-slate-400"
                }`}>
                  {msg.timestamp}
                </span>
              </div>
            </div>
          ))}

          {isSending && (
            <div className="flex items-center space-x-2 text-slate-600 text-xs font-medium pl-10">
              <Brain className="h-4 w-4 animate-pulse text-slate-700" />
              <span>Analyzing dataset and preparing answer...</span>
            </div>
          )}
        </div>

        {/* Quick Question Prompts */}
        <div className="px-4 py-2 border-t border-slate-200 bg-slate-50 flex overflow-x-auto space-x-2 text-[10px]">
          <button
            onClick={() => setInput("What are the main drivers affecting our data metrics?")}
            className="px-2.5 py-1 bg-white hover:bg-slate-100 text-slate-700 rounded shrink-0 cursor-pointer border border-slate-200 font-medium"
          >
            Main Drivers?
          </button>
          <button
            onClick={() => setInput("Explain the anomalies detected in this dataset.")}
            className="px-2.5 py-1 bg-white hover:bg-slate-100 text-slate-700 rounded shrink-0 cursor-pointer border border-slate-200 font-medium"
          >
            Explain Anomalies
          </button>
          <button
            onClick={() => setInput("Give me a 3-bullet summary of this dataset.")}
            className="px-2.5 py-1 bg-white hover:bg-slate-100 text-slate-700 rounded shrink-0 cursor-pointer border border-slate-200 font-medium"
          >
            Summary Brief
          </button>
        </div>

        {/* Input Bar */}
        <form onSubmit={handleSendMessage} className="p-4 border-t border-slate-200 bg-white">
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask a question about this data..."
              className="flex-1 bg-white border border-slate-200 rounded-md px-3.5 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-400"
            />
            <button
              type="submit"
              disabled={!input.trim() || isSending}
              className="p-2 bg-slate-900 hover:bg-slate-800 disabled:opacity-40 text-white rounded-md cursor-pointer transition-colors"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
