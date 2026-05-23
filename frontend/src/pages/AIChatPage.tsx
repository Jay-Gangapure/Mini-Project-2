import { useState, useRef, useEffect } from "react";
import {
  Send,
  Mic,
  Bot,
  User as UserIcon,
  Plus,
  Trash2,
  ChevronRight,
  Scale,
  Volume2,
} from "lucide-react";
import { useLocation } from "react-router";
import { useAuth } from "../context/AuthContext";
import { useTranslation, getLangFont } from "../i18n/useTranslation";
import useVoice from "../hooks/useVoiceInput";
import {
  playVoice,
  stopVoice,
} from "../services/voice_service";
import { useDashboard } from "../context/DashboardContext";

interface Message {
  id: string;
  role: "user" | "ai";
  content: string;
  time: string;
}

interface ChatHistory {
  id: string;
  title: string;
  time: string;
  messages: Message[];
}

export default function AIChatPage() {
  const auth = useAuth();
  const user = (auth as any).user;

  const { t, lang } = useTranslation();

  const c = t.chat;

  const fontFamily = getLangFont(lang);

  const messagesEndRef =
    useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "ai",
      content:
        "नमस्ते! I'm NyaySathi AI 🙏\n\nI can help you with legal rights, cyber complaints, police rights, consumer issues, tenant rights and more.",
      time: "Now",
    },
  ]);

  const [chatHistory, setChatHistory] =
    useState<ChatHistory[]>([]);

  const [currentChatId, setCurrentChatId] =
    useState<string | null>(null);

  const [input, setInput] = useState("");

  const [loading, setLoading] =
    useState(false);

  const [sidebarOpen, setSidebarOpen] =
    useState(false);

  const [isSpeaking, setIsSpeaking] =
    useState(false);
  const location = useLocation();
  const {
    listening,
    startListening,
    stopListening,
  } = useVoice(lang);
  const { addNotification } = useDashboard();
  const { addActivity } = useDashboard();
const cleanAIText = (text: string) => {
  return text
    .replace(/\*\*/g, "")
    .replace(/\*/g, "")
    .replace(/#/g, "")
    .replace(/`/g, "")
    .replace(/[-•]/g, "")
    .replace(/\n{2,}/g, "\n")
    .trim();
};

  // -----------------------------------
  // AUTO SCROLL
  // -----------------------------------

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  // -----------------------------------
  // LOAD CHAT HISTORY
  // -----------------------------------

  useEffect(() => {
    const saved =
      localStorage.getItem(
        "nyaysathi_chat_history"
      );

    if (saved) {
      setChatHistory(JSON.parse(saved));
    }
  }, []);

  // -----------------------------------
  // SAVE CHAT HISTORY
  // -----------------------------------

  useEffect(() => {
    localStorage.setItem(
      "nyaysathi_chat_history",
      JSON.stringify(chatHistory)
    );
  }, [chatHistory]);

  useEffect(() => {

    const voiceQuery =
      location.state?.voiceQuery;

    if (voiceQuery) {

      setInput(voiceQuery);

      sendMessage(voiceQuery);

      // Clear state
      window.history.replaceState(
        {},
        document.title
      );
    }

  }, []);

  // -----------------------------------
  // SEND MESSAGE
  // -----------------------------------

  const sendMessage = async (
    text?: string
  ) => {
    const content = text || input.trim();

    if (!content || loading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    const updatedUserMessages = [
      ...messages,
      userMsg,
    ];

    setMessages(updatedUserMessages);

    setInput("");

    setLoading(true);

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/ai/chat",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            message: content,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail || "API Error"
        );
      }

      const aiMsg: Message = {
        id: (
          Date.now() + 1
        ).toString(),

        role: "ai",

        content:
          data.response ||
          "No response received.",

        time:
          new Date().toLocaleTimeString(
            [],
            {
              hour: "2-digit",
              minute: "2-digit",
            }
          ),
      };
      addNotification({
        title: "AI Response Generated",
        message: content.slice(0, 40),
      });

      const finalMessages = [
        ...updatedUserMessages,
        aiMsg,
      ];

      setMessages(finalMessages);
      addActivity({
        title: "Legal AI Consultation",
        description: content,
        type: "rights",
      });

      // -----------------------------
      // AUTO SPEAK AI RESPONSE
      // -----------------------------

      playVoice(
        aiMsg.content,
        lang,
        () => setIsSpeaking(true),
        () => setIsSpeaking(false)
      );

      // -----------------------------
      // SAVE CHAT
      // -----------------------------

      if (currentChatId) {
        setChatHistory((prev) =>
          prev.map((chat) =>
            chat.id === currentChatId
              ? {
                ...chat,
                messages: finalMessages,
              }
              : chat
          )
        );
      } else {
        const newChat: ChatHistory = {
          id: Date.now().toString(),

          title:
            content.length > 30
              ? content.slice(0, 30) +
              "..."
              : content,

          time: "Just now",

          messages: finalMessages,
        };

        setChatHistory((prev) => [
          newChat,
          ...prev,
        ]);

        setCurrentChatId(newChat.id);
      }
    } catch (error) {
      console.error(
        "CHAT ERROR:",
        error
      );

      const errorMsg: Message = {
        id: (
          Date.now() + 2
        ).toString(),

        role: "ai",

        content:
          "AI service currently unavailable.",

        time:
          new Date().toLocaleTimeString(
            [],
            {
              hour: "2-digit",
              minute: "2-digit",
            }
          ),
      };

      setMessages((prev) => [
        ...prev,
        errorMsg,
      ]);
    } finally {
      setLoading(false);
    }
  };

  // -----------------------------------
  // SPEAK BUTTON
  // -----------------------------------

  const handleSpeak = (
    text: string
  ) => {
    playVoice(
      text,
      lang,
      () => setIsSpeaking(true),
      () => setIsSpeaking(false)
    );
  };

  // -----------------------------------
  // USER INITIALS
  // -----------------------------------

  const initials = user?.name
    ? user.name
      .split(" ")
      .map((n: string) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
    : "U";

  return (
    <div
      className="flex h-[calc(100vh-65px)] bg-white overflow-hidden"
      style={{ fontFamily }}
    >
      {/* SIDEBAR */}

      <div
        className={`
        ${sidebarOpen
            ? "translate-x-0"
            : "-translate-x-full"
          }
        md:translate-x-0
        fixed md:static
        z-30
        h-full
        w-72
        bg-white
        border-r
        border-slate-100
        flex
        flex-col
        transition-transform
        duration-300
      `}
      >
        <div className="p-4 border-b border-slate-100">
          <button
            onClick={() => {
              setMessages([
                {
                  id: "1",
                  role: "ai",
                  content:
                    "New conversation started.",
                  time: "Now",
                },
              ]);

              setCurrentChatId(null);
            }}
            className="w-full flex items-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-blue-700"
          >
            <Plus size={16} />
            {c.newConversation}
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-3">
          <p className="text-slate-400 text-xs font-semibold px-2 mb-3 uppercase">
            {c.recentChats}
          </p>

          {chatHistory.map((h) => (
            <button
              key={h.id}
              onClick={() => {
                setMessages(h.messages);
                setCurrentChatId(h.id);
              }}
              className="w-full text-left px-3 py-3 rounded-xl hover:bg-blue-50 mb-1"
            >
              <div className="flex items-center justify-between">
                <p className="truncate text-sm font-medium">
                  {h.title}
                </p>

                <ChevronRight size={14} />
              </div>

              <p className="text-xs text-slate-400">
                {h.time}
              </p>
            </button>
          ))}
        </div>

        <div className="p-4 border-t border-slate-100">
          <div className="flex items-center gap-3 px-3 py-3 rounded-xl bg-blue-50">
            <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center text-xs font-bold">
              {initials}
            </div>

            <div>
              <p className="text-sm font-medium">
                {user?.name || "User"}
              </p>

              <p className="text-xs text-slate-400">
                {t.common.freePlan}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* MAIN */}

      <div className="flex-1 flex flex-col">
        {/* HEADER */}

        <div className="px-4 py-3 border-b flex items-center gap-3">
          <button
            className="md:hidden"
            onClick={() =>
              setSidebarOpen(
                !sidebarOpen
              )
            }
          >
            <Scale size={18} />
          </button>

          <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white">
            <Bot size={18} />
          </div>

          <div>
            <p className="font-semibold text-sm">
              {t.common.appName} AI
            </p>

            <p className="text-xs text-green-600">
              {c.online}
            </p>
          </div>

          <button
            onClick={() => {
              // STOP VOICE
              stopVoice();

              setIsSpeaking(false);

              // DELETE CURRENT CHAT
              if (currentChatId) {

                const updatedChats =
                  chatHistory.filter(
                    (chat) =>
                      chat.id !== currentChatId
                  );

                setChatHistory(updatedChats);

                localStorage.setItem(
                  "nyaysathi_chat_history",
                  JSON.stringify(updatedChats)
                );

                // RESET CHAT WINDOW
                setMessages([
                  {
                    id: "1",
                    role: "ai",
                    content:
                      "New conversation started.",
                    time: "Now",
                  },
                ]);

                setCurrentChatId(null);

              } else {

                // CLEAR CURRENT TEMP CHAT
                setMessages([
                  {
                    id: "1",
                    role: "ai",
                    content:
                      "New conversation started.",
                    time: "Now",
                  },
                ]);
              }
            }}
            className="ml-auto p-2 rounded-lg hover:bg-red-50 text-red-500 transition"
          >
            <Trash2 size={16} />
          </button>
        </div>

        {/* MESSAGES */}

        <div className="flex-1 overflow-y-auto px-4 py-5 space-y-5">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 ${msg.role === "user"
                ? "flex-row-reverse"
                : ""
                }`}
            >
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center text-white ${msg.role === "ai"
                  ? "bg-blue-600"
                  : "bg-slate-700"
                  }`}
              >
                {msg.role === "ai" ? (
                  <Bot size={17} />
                ) : (
                  <UserIcon size={17} />
                )}
              </div>

              <div className="max-w-[80%] flex flex-col gap-1">
                <div
                  className={`rounded-2xl px-5 py-3 text-sm whitespace-pre-wrap ${msg.role === "ai"
                    ? "bg-white border"
                    : "bg-blue-600 text-white"
                    }`}
                >
                  <div className="whitespace-pre-line">
                    {cleanAIText(msg.content)}
                  </div>

                  {msg.role === "ai" && (
                    <div className="mt-3 flex gap-2">
                      <button
                        onClick={() =>
                          handleSpeak(
                            msg.content
                          )
                        }
                        className="flex items-center gap-1 text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded-lg"
                      >
                        <Volume2 size={14} />
                        Speak
                      </button>

                      {isSpeaking && (
                        <button
                          onClick={() => {
                            stopVoice();
                            setIsSpeaking(
                              false
                            );
                          }}
                          className="text-xs bg-red-50 text-red-600 px-2 py-1 rounded-lg"
                        >
                          Stop
                        </button>
                      )}
                    </div>
                  )}
                </div>

                <span className="text-xs text-slate-400">
                  {msg.time}
                </span>
              </div>
            </div>
          ))}

          {loading && (
            <div className="text-sm text-slate-400">
              AI is typing...
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* INPUT */}

        <div className="p-4 border-t bg-white">
          <div className="flex items-end gap-3 bg-slate-50 rounded-2xl border px-4 py-3">
            <textarea
              value={input}
              onChange={(e) =>
                setInput(e.target.value)
              }
              onKeyDown={(e) => {
                if (
                  e.key === "Enter" &&
                  !e.shiftKey
                ) {
                  e.preventDefault();
                  sendMessage();
                }
              }}
              placeholder={c.placeholder}
              rows={1}
              className="flex-1 bg-transparent resize-none focus:outline-none text-sm"
            />

            <div className="flex items-center gap-2">
              {/* MIC */}

              <button
                onClick={() => {
                  if (listening) {
                    stopListening();
                  } else {
                    startListening(
                      // FINAL RESULT
                      (finalText: string) => {
                        setInput(finalText);

                        setTimeout(() => {
                          sendMessage(finalText);
                        }, 300);
                      },
                    );
                  }
                }}
                className={`p-2 rounded-xl ${listening
                  ? "bg-red-100 text-red-600"
                  : "text-slate-400 hover:text-blue-600"
                  }`}
              >
                <Mic size={18} />
              </button>

              {/* SEND */}

              <button
                onClick={() =>
                  sendMessage()
                }
                disabled={
                  !input.trim() || loading
                }
                className="p-2.5 rounded-xl bg-blue-600 text-white disabled:opacity-50"
              >
                <Send size={16} />
              </button>
            </div>
          </div>

          <p className="text-center text-xs text-slate-400 mt-2">
            {c.disclaimer}
          </p>
        </div>
      </div>
    </div>
  );
}