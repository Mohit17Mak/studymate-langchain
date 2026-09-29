import {
  BookOpen,
  Brain,
  Check,
  ChevronDown,
  Clock3,
  Menu,
  MessageSquare,
  Plus,
  Send,
  Settings,
  Sparkles,
  Target,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

const recentChats = [
  "Operating Systems revision",
  "DBMS normalization",
  "Java concepts",
];

const suggestions = [
  {
    icon: BookOpen,
    title: "Explain a topic",
    text: "Explain a difficult concept step by step",
  },
  {
    icon: Brain,
    title: "Test my knowledge",
    text: "Create a short quiz for me",
  },
  {
    icon: Target,
    title: "Plan my study",
    text: "Create a study plan for today",
  },
];

function Sidebar({
  mobileOpen,
  setMobileOpen,
  onNewChat,
  onSelectChat,
}) {
  return (
    <>
      {mobileOpen && (
        <button
          aria-label="Close sidebar"
          className="fixed inset-0 z-40 cursor-default bg-black/40 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[280px] flex-col border-r border-slate-200/70 bg-white/80 px-4 py-5 shadow-[10px_0_40px_-30px_rgba(15,23,42,0.2)] backdrop-blur-2xl transition-transform duration-300 dark:border-white/[0.07] dark:bg-slate-950/80 dark:shadow-none lg:static lg:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="mb-8 flex items-center justify-between px-2">
          <div className="flex items-center gap-3">
            <div className="relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-slate-950 text-white shadow-lg shadow-violet-500/10 dark:bg-white dark:text-slate-950">
              <div className="absolute inset-0 bg-gradient-to-br from-violet-500/30 via-transparent to-cyan-400/20" />
              <Sparkles className="relative" size={19} />
            </div>

            <div className="min-w-0">
              <h1 className="text-[15px] font-semibold tracking-tight text-slate-950 dark:text-white">
                StudyMate
              </h1>

              <p className="truncate text-[11px] text-slate-500 dark:text-slate-400">
                AI learning companion
              </p>
            </div>
          </div>

          <button
            aria-label="Close sidebar"
            className="rounded-xl p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 lg:hidden dark:hover:bg-white/10 dark:hover:text-white"
            onClick={() => setMobileOpen(false)}
          >
            <X size={18} />
          </button>
        </div>

        <button
          onClick={onNewChat}
          className="mb-7 flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-950 px-4 py-3 text-sm font-medium text-white shadow-lg shadow-slate-950/10 transition duration-200 hover:-translate-y-0.5 hover:shadow-xl active:translate-y-0 dark:bg-white dark:text-slate-950"
        >
          <Plus size={17} />
          New chat
        </button>

        <div className="mb-3 px-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">
          Recent
        </div>

        <div className="space-y-1">
          {recentChats.map((chat, index) => (
            <button
              key={chat}
              onClick={() => {
                onSelectChat(chat);
                setMobileOpen(false);
              }}
              className={`group flex w-full min-w-0 items-center gap-3 rounded-xl px-3 py-2.5 text-left text-[13px] transition duration-200 ${
                index === 0
                  ? "bg-slate-100/80 text-slate-950 dark:bg-white/[0.07] dark:text-white"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-950 dark:text-slate-400 dark:hover:bg-white/5 dark:hover:text-white"
              }`}
            >
              <MessageSquare
                size={15}
                className="shrink-0 opacity-70"
              />

              <span className="truncate">{chat}</span>
            </button>
          ))}
        </div>

        <div className="mt-auto space-y-1">
          <button className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] text-slate-500 transition hover:bg-slate-100 hover:text-slate-950 dark:hover:bg-white/5 dark:hover:text-white">
            <Clock3 size={16} />
            History
          </button>

          <button className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] text-slate-500 transition hover:bg-slate-100 hover:text-slate-950 dark:hover:bg-white/5 dark:hover:text-white">
            <Settings size={16} />
            Settings
          </button>
        </div>
      </aside>
    </>
  );
}

function TypingIndicator() {
  return (
    <div className="flex items-start gap-3 animate-[fadeIn_0.25s_ease-out]">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-violet-500/10 text-violet-500">
        <Sparkles size={15} />
      </div>

      <div className="flex items-center gap-1 rounded-2xl rounded-tl-lg bg-white px-4 py-3.5 shadow-sm ring-1 ring-slate-200/70 dark:bg-white/[0.04] dark:ring-white/10">
        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400 [animation-delay:-0.3s]" />
        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400 [animation-delay:-0.15s]" />
        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400" />
      </div>
    </div>
  );
}

function ChatMessage({ message }) {
  const isUser = message.role === "user";

  return (
    <div
      className={`flex w-full animate-[messageIn_0.3s_ease-out] ${
        isUser ? "justify-end" : "justify-start"
      }`}
    >
      {isUser ? (
        <div className="max-w-[85%] break-words rounded-3xl rounded-br-lg bg-slate-950 px-5 py-3.5 text-sm leading-6 text-white shadow-lg shadow-slate-950/10 dark:bg-white dark:text-slate-950">
          {message.content}
        </div>
      ) : (
        <div className="flex max-w-[90%] min-w-0 gap-3">
          <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-violet-500/10 text-violet-500">
            <Sparkles size={15} />
          </div>

          <div className="min-w-0 break-words rounded-2xl rounded-tl-lg bg-white px-5 py-3.5 text-sm leading-6 text-slate-700 shadow-sm ring-1 ring-slate-200/70 dark:bg-white/[0.04] dark:text-slate-300 dark:ring-white/10">
            {message.content}
          </div>
        </div>
      )}
    </div>
  );
}

function Composer({
  message,
  setMessage,
  sendMessage,
  handleKeyDown,
  textareaRef,
  isThinking,
}) {
  const canSend = Boolean(message.trim()) && !isThinking;

  return (
    <div className="w-full rounded-[26px] border border-slate-200/80 bg-white/90 p-3 shadow-[0_25px_70px_-30px_rgba(15,23,42,0.3)] backdrop-blur-2xl transition duration-300 focus-within:border-violet-300 focus-within:shadow-[0_25px_80px_-30px_rgba(124,58,237,0.25)] dark:border-white/[0.09] dark:bg-white/[0.045] dark:focus-within:border-violet-400/30">
      <textarea
        ref={textareaRef}
        value={message}
        onChange={(event) => setMessage(event.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Ask StudyMate anything..."
        rows={3}
        maxLength={2000}
        disabled={isThinking}
        className="block min-h-[76px] w-full resize-none bg-transparent px-3 py-2 text-sm leading-6 text-slate-900 outline-none placeholder:text-slate-400 disabled:cursor-not-allowed disabled:opacity-60 dark:text-white"
      />

      <div className="flex items-center justify-between gap-3 px-2 pb-1 pt-2">
        <div className="hidden min-w-0 items-center gap-3 text-[11px] text-slate-400 sm:flex">
          <span>Enter to send</span>
          <span className="h-1 w-1 shrink-0 rounded-full bg-slate-300 dark:bg-slate-600" />
          <span>Shift + Enter for a new line</span>
        </div>

        <div className="ml-auto flex shrink-0 items-center gap-3">
          {message.length > 0 && (
            <span className="text-[10px] tabular-nums text-slate-400">
              {message.length}/2000
            </span>
          )}

          <button
            onClick={() => sendMessage()}
            disabled={!canSend}
            aria-label="Send message"
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-white shadow-md transition duration-200 ${
              canSend
                ? "bg-slate-950 hover:scale-105 hover:shadow-lg active:scale-95 dark:bg-white dark:text-slate-950"
                : "cursor-not-allowed bg-slate-300/70 opacity-50 dark:bg-white/10 dark:text-slate-500"
            }`}
          >
            {isThinking ? (
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white dark:border-slate-950/20 dark:border-t-slate-950" />
            ) : (
              <Send size={16} />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

function App() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [isThinking, setIsThinking] = useState(false);
  const [selectedSuggestion, setSelectedSuggestion] = useState(null);

  const textareaRef = useRef(null);
  const messagesEndRef = useRef(null);

  const hasMessages = messages.length > 0;

  useEffect(() => {
    if (!hasMessages) {
      return;
    }

    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  }, [messages, isThinking, hasMessages]);

  const focusComposer = () => {
    requestAnimationFrame(() => {
      textareaRef.current?.focus();
    });
  };

  const sendMessage = (text = message) => {
    const trimmed = text.trim();

    if (!trimmed || isThinking) {
      return;
    }

    const userMessage = {
      id: Date.now(),
      role: "user",
      content: trimmed,
    };

    setMessages((current) => [...current, userMessage]);
    setMessage("");
    setSelectedSuggestion(null);
    setIsThinking(true);

    focusComposer();

    setTimeout(() => {
      setMessages((current) => [
        ...current,
        {
          id: Date.now() + 1,
          role: "assistant",
          content:
            "I'd break this down step by step and help you understand the reasoning behind it. Gemini will provide the actual StudyMate response once we connect the backend.",
        },
      ]);

      setIsThinking(false);
    }, 1000);
  };

  const startNewChat = () => {
    setMessages([]);
    setMessage("");
    setIsThinking(false);
    setSelectedSuggestion(null);

    focusComposer();
  };

  const handleSuggestion = (suggestion) => {
    setMessage(suggestion.text);
    setSelectedSuggestion(suggestion.title);

    focusComposer();
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  };

  const selectChat = (chat) => {
    setMessages([
      {
        id: Date.now(),
        role: "assistant",
        content: `This is the "${chat}" conversation. Chat history will be connected to the backend later.`,
      },
    ]);

    setMessage("");
    setSelectedSuggestion(null);
  };

  return (
    <div className="app-background min-h-screen bg-[#f7f8fa] text-slate-950 dark:bg-[#090b10] dark:text-white">
      <div className="flex min-h-screen w-full">
        <Sidebar
          mobileOpen={mobileOpen}
          setMobileOpen={setMobileOpen}
          onNewChat={startNewChat}
          onSelectChat={selectChat}
        />

        <main className="flex min-h-screen min-w-0 flex-1 flex-col overflow-visible">
          <header className="flex h-[72px] shrink-0 items-center border-b border-slate-200/70 bg-white/70 px-4 backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/60 sm:px-5 lg:px-8">
            <button
              aria-label="Open sidebar"
              className="rounded-xl p-2 text-slate-600 transition hover:bg-slate-100 lg:hidden dark:text-slate-300 dark:hover:bg-white/10"
              onClick={() => setMobileOpen(true)}
            >
              <Menu size={20} />
            </button>

            <div className="hidden items-center gap-2 text-sm text-slate-500 lg:flex">
              <span>{hasMessages ? "Study session" : "Workspace"}</span>
              <ChevronDown size={15} />
            </div>

            <div className="ml-auto flex items-center gap-2 sm:gap-3">
              <button className="hidden rounded-xl px-3 py-2 text-xs font-medium text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 sm:block dark:hover:bg-white/5 dark:hover:text-white">
                Student profile
              </button>

              <div className="relative flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-violet-500 to-cyan-400 text-xs font-bold text-white shadow-md shadow-violet-500/20">
                M
              </div>
            </div>
          </header>

          {!hasMessages ? (
            <section className="flex w-full flex-1 flex-col items-center px-4 pb-8 pt-10 sm:px-8 sm:pt-14 lg:pt-20">
              <div className="w-full max-w-4xl">
                <div className="mb-8 text-center sm:mb-10">
                  <div className="relative mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-[20px] border border-white/80 bg-white/80 shadow-[0_20px_50px_-20px_rgba(124,58,237,0.35)] backdrop-blur-xl sm:h-16 sm:w-16 dark:border-white/10 dark:bg-white/[0.05]">
                    <div className="absolute inset-2 rounded-[15px] bg-gradient-to-br from-violet-500/10 to-cyan-400/10" />

                    <Sparkles
                      className="relative text-violet-500"
                      size={23}
                    />
                  </div>

                  <p className="mb-2 text-sm font-medium text-violet-500">
                    Your learning companion
                  </p>

                  <h2 className="bg-gradient-to-br from-slate-950 via-slate-700 to-slate-500 bg-clip-text text-3xl font-semibold tracking-[-0.045em] text-transparent sm:text-4xl lg:text-5xl dark:from-white dark:via-slate-200 dark:to-slate-500">
                    What are you learning today?
                  </h2>

                  <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-slate-500 sm:text-base dark:text-slate-400">
                    Ask questions, understand difficult concepts, practice
                    what you know, or build a study plan that fits your goals.
                  </p>
                </div>

                <div className="mb-6 grid w-full gap-3 sm:mb-8 sm:grid-cols-3">
                  {suggestions.map(({ icon: Icon, title, text }) => {
                    const selected = selectedSuggestion === title;

                    return (
                      <button
                        key={title}
                        onClick={() =>
                          handleSuggestion({
                            title,
                            text,
                          })
                        }
                        className={`group relative min-w-0 overflow-hidden rounded-[20px] border p-4 text-left shadow-[0_10px_40px_-25px_rgba(15,23,42,0.3)] backdrop-blur-xl transition duration-300 ${
                          selected
                            ? "border-violet-300 bg-violet-50/80 shadow-[0_20px_50px_-25px_rgba(124,58,237,0.3)] dark:border-violet-400/30 dark:bg-violet-500/[0.08]"
                            : "border-slate-200/70 bg-white/75 hover:-translate-y-1 hover:border-violet-200 hover:shadow-[0_20px_50px_-25px_rgba(124,58,237,0.25)] dark:border-white/[0.08] dark:bg-white/[0.035] dark:hover:border-violet-400/20"
                        }`}
                      >
                        <div className="absolute -right-8 -top-8 h-20 w-20 rounded-full bg-violet-500/0 blur-2xl transition duration-500 group-hover:bg-violet-500/10" />

                        <div className="relative min-w-0">
                          <div
                            className={`mb-4 flex h-9 w-9 items-center justify-center rounded-xl transition duration-200 ${
                              selected
                                ? "bg-violet-500 text-white"
                                : "bg-slate-100 text-slate-700 group-hover:bg-slate-950 group-hover:text-white dark:bg-white/10 dark:text-slate-300 dark:group-hover:bg-white dark:group-hover:text-slate-950"
                            }`}
                          >
                            {selected ? (
                              <Check size={17} />
                            ) : (
                              <Icon size={17} />
                            )}
                          </div>

                          <p className="truncate text-sm font-semibold">
                            {title}
                          </p>

                          <p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-500 dark:text-slate-400">
                            {text}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>

                <Composer
                  message={message}
                  setMessage={setMessage}
                  sendMessage={sendMessage}
                  handleKeyDown={handleKeyDown}
                  textareaRef={textareaRef}
                  isThinking={isThinking}
                />

                <p className="mt-4 px-2 text-center text-[11px] text-slate-400">
                  StudyMate can make mistakes. Verify important information.
                </p>
              </div>
            </section>
          ) : (
            <section className="flex min-h-0 w-full flex-1 flex-col overflow-visible">
              <div className="min-h-0 flex-1 overflow-y-auto px-4 py-6 sm:px-8 sm:py-8">
                <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
                  {messages.map((item) => (
                    <ChatMessage key={item.id} message={item} />
                  ))}

                  {isThinking && <TypingIndicator />}

                  <div ref={messagesEndRef} className="h-px w-full" />
                </div>
              </div>

              <div className="shrink-0 px-4 pb-4 pt-2 sm:px-8 sm:pb-5">
                <div className="mx-auto w-full max-w-3xl">
                  <Composer
                    message={message}
                    setMessage={setMessage}
                    sendMessage={sendMessage}
                    handleKeyDown={handleKeyDown}
                    textareaRef={textareaRef}
                    isThinking={isThinking}
                  />

                  <p className="mt-3 px-2 text-center text-[10px] text-slate-400">
                    StudyMate can make mistakes. Verify important information.
                  </p>
                </div>
              </div>
            </section>
          )}
        </main>
      </div>
    </div>
  );
}

export default App;