"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { ChatMessage, sendChatMessage } from "../../lib/user-api";

const WELCOME_MESSAGE: ChatMessage = {
  role: "assistant",
  text: "Hi! I'm your JobMatch assistant. Ask me anything about your resume, job search, or how to use the platform.",
};

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([WELCOME_MESSAGE]);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, isOpen, isSending]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const text = input.trim();
    if (!text || isSending) return;

    const nextMessages = [...messages, { role: "user", text } as ChatMessage];
    setMessages(nextMessages);
    setInput("");
    setError("");
    setIsSending(true);

    try {
      const data = await sendChatMessage(nextMessages);
      setMessages((current) => [...current, { role: "assistant", text: data.reply }]);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Unable to reach the assistant");
    } finally {
      setIsSending(false);
    }
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {isOpen && (
        <section
          role="dialog"
          aria-label="JobMatch assistant"
          className="flex h-[520px] w-[360px] max-w-[calc(100vw-3rem)] flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl shadow-slate-900/20"
        >
          <header className="flex items-center justify-between gap-3 bg-[#151a35] px-5 py-4 text-white">
            <div>
              <p className="text-sm font-black">JobMatch Assistant</p>
              <p className="text-xs font-medium text-indigo-200">Ask me anything about JobMatch</p>
            </div>
            <button
              type="button"
              aria-label="Close chat"
              onClick={() => setIsOpen(false)}
              className="grid h-8 w-8 place-items-center rounded-full text-indigo-200 transition hover:bg-white/10 hover:text-white"
            >
              <svg aria-hidden="true" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
              </svg>
            </button>
          </header>

          <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto bg-slate-50 px-4 py-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <p
                  className={`max-w-[85%] whitespace-pre-line rounded-2xl px-4 py-2.5 text-sm leading-6 ${
                    message.role === "user"
                      ? "bg-indigo-600 text-white"
                      : "border border-slate-200 bg-white text-slate-700 shadow-sm"
                  }`}
                >
                  {message.text}
                </p>
              </div>
            ))}
            {isSending && (
              <div className="flex justify-start">
                <p className="rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-400 shadow-sm">
                  Thinking...
                </p>
              </div>
            )}
          </div>

          {error && (
            <p role="alert" className="border-t border-rose-100 bg-rose-50 px-4 py-2 text-xs font-bold text-rose-700">
              {error}
            </p>
          )}

          <form onSubmit={handleSubmit} className="flex items-center gap-2 border-t border-slate-200 bg-white p-3">
            <input
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Type your question..."
              disabled={isSending}
              className="h-11 flex-1 rounded-full border border-slate-200 bg-slate-50 px-4 text-sm outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100 disabled:opacity-60"
            />
            <button
              type="submit"
              disabled={isSending || !input.trim()}
              aria-label="Send message"
              className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-indigo-600 text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <svg aria-hidden="true" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m22 2-7 20-4-9-9-4Z" />
                <path d="M22 2 11 13" />
              </svg>
            </button>
          </form>
        </section>
      )}

      <button
        type="button"
        onClick={() => setIsOpen((current) => !current)}
        aria-label={isOpen ? "Close JobMatch assistant" : "Open JobMatch assistant"}
        className="grid h-14 w-14 place-items-center rounded-full bg-indigo-600 text-white shadow-xl shadow-indigo-500/30 transition hover:bg-indigo-700"
      >
        {isOpen ? (
          <svg aria-hidden="true" className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
          </svg>
        ) : (
          <svg aria-hidden="true" className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
          </svg>
        )}
      </button>
    </div>
  );
}
