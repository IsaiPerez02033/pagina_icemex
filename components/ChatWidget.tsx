"use client";

import { useRef, useEffect, useState, useCallback } from "react";

type Role = "user" | "assistant";

interface Message {
  id: string;
  role: Role;
  content: string;
  timestamp: string;
}

const SUGGESTIONS = [
  "Necesito alumbrar un parque, ¿qué me recomiendan?",
  "¿Qué opciones de iluminación solar tienen?",
  "¿Qué certificaciones maneja ICEMEX?",
  "Quiero cotizar postes para una avenida",
];

function formatTime() {
  return new Date().toLocaleTimeString("es-MX", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

let idCounter = 0;
function genId() {
  return `msg_${++idCounter}_${Date.now()}`;
}

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "¡Hola! Soy el asistente virtual de **ICEMEX**. Cuéntame qué tipo de espacio necesitas iluminar y te ayudo a encontrar la luminaria ideal. Puedo recomendarte productos, darte fichas técnicas y resolver tus dudas sobre nuestros servicios.",
      timestamp: "",
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  // Focus input on open
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 350);
    }
  }, [open]);

  // En mobile, guarda/restaura el scroll al abrir/cerrar el chat fullscreen
  useEffect(() => {
    const isMobile = typeof window !== "undefined" && window.innerWidth <= 480;
    if (!isMobile) return;
    if (open) {
      const scrollY = window.scrollY;
      document.body.style.top = `-${scrollY}px`;
      document.body.style.position = "fixed";
      document.body.style.width = "100%";
    } else {
      const top = document.body.style.top;
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      if (top) {
        window.scrollTo(0, parseInt(top) * -1);
      }
    }
  }, [open]);

  // Close with Escape
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open]);

  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMsg: Message = {
      id: genId(),
      role: "user",
      content: text.trim(),
      timestamp: formatTime(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);
    setError(null);
    setHasInteracted(true);

    const allMessages = [...messages, userMsg].map((m) => ({
      role: m.role,
      content: m.content,
    }));

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: allMessages }),
        signal: controller.signal,
      });

      if (!res.ok) {
        throw new Error(`Error ${res.status}`);
      }

      const reader = res.body?.getReader();
      if (!reader) throw new Error("No se pudo leer la respuesta");

      const assistantId = genId();
      let fullContent = "";

      setMessages((prev) => [
        ...prev,
        {
          id: assistantId,
          role: "assistant",
          content: "",
          timestamp: formatTime(),
        },
      ]);

      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        fullContent += chunk;

        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId ? { ...m, content: fullContent } : m
          )
        );
      }

      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantId ? { ...m, content: fullContent } : m
        )
      );
    } catch (err: unknown) {
      if (err instanceof Error && err.name === "AbortError") return;
      setError(
        "Error al conectar con el asistente. Por favor intenta de nuevo."
      );
      // Remove empty assistant message
      setMessages((prev) => prev.filter((m) => m.content !== ""));
    } finally {
      setIsLoading(false);
      abortRef.current = null;
    }
  }, [messages, isLoading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const clickSuggestion = (text: string) => {
    sendMessage(text);
  };

  const renderContent = (content: string) => {
    if (!content) return null;
    const blocks = content.split("\n").filter(Boolean);
    return blocks.map((line, i) => {
      const trimmed = line.trim();
      if (trimmed.startsWith("**") && trimmed.endsWith("**")) {
        return (
          <strong
            key={i}
            style={{
              display: "block",
              color: "var(--text-primary)",
              marginTop: i > 0 ? 6 : 0,
              marginBottom: 2,
            }}
          >
            {trimmed.replace(/\*\*/g, "")}
          </strong>
        );
      }
      return (
        <span key={i} style={{ display: "block" }}>
          {trimmed}
        </span>
      );
    });
  };

  return (
    <>
      {/* Botón flotante */}
      <button
        type="button"
        aria-label={open ? "Cerrar chat" : "Abrir chat"}
        onClick={() => setOpen((v) => !v)}
        className="chat-toggle interactive"
        style={{
          position: "fixed",
          bottom: 108,
          right: 28,
          width: 56,
          height: 56,
          borderRadius: "50%",
          background: open ? "var(--bg-secondary)" : "var(--accent-cyan)",
          border: "1px solid rgba(var(--cyan-rgb), 0.3)",
          color: open ? "var(--accent-cyan)" : "var(--bg-primary)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 9001,
          boxShadow: open
            ? "0 8px 30px rgba(0,0,0,0.3)"
            : "0 8px 30px rgba(var(--cyan-rgb), 0.35)",
          transition:
            "background 0.25s ease, color 0.25s ease, box-shadow 0.25s ease, transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      >
        {open ? (
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            aria-hidden
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        ) : (
          <img
            src="/avatar_chatbot_icemex.png"
            alt="ICEMEXbot"
            style={{
              width: "100%",
              height: "100%",
              borderRadius: "50%",
              objectFit: "cover",
            }}
          />
        )}

        {/* Punto indicador */}
        {!open && !hasInteracted && (
          <span
            style={{
              position: "absolute",
              top: 4,
              right: 4,
              width: 10,
              height: 10,
              borderRadius: "50%",
              background: "var(--bg-primary)",
              boxShadow: "0 0 0 2px var(--accent-cyan)",
              animation: "chat-pulse 2s ease-in-out infinite",
            }}
          />
        )}
      </button>

      {/* Panel de chat */}
      {open && (
        <div
          className="chat-panel"
          style={{
            position: "fixed",
            bottom: 24,
            right: 24,
            width: "min(420px, calc(100vw - 32px))",
            height: "min(640px, calc(100dvh - 120px))",
            background: "var(--bg-primary)",
            border: "1px solid rgba(var(--cyan-rgb), 0.18)",
            borderRadius: 22,
            display: "flex",
            flexDirection: "column",
            zIndex: 9000,
            boxShadow:
              "0 20px 60px rgba(0,0,0,0.5), 0 0 60px rgba(var(--cyan-rgb), 0.08)",
            overflow: "hidden",
            animation:
              "chat-slide-up 0.35s cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: "14px 18px",
              borderBottom: "1px solid rgba(var(--cyan-rgb), 0.1)",
              display: "flex",
              alignItems: "center",
              gap: 10,
              flexShrink: 0,
              background: "var(--bg-secondary)",
            }}
          >
            <img
              src="/avatar_chatbot_icemex.png"
              alt="ICEMEXbot"
              style={{
                width: 36,
                height: 36,
                borderRadius: "50%",
                objectFit: "cover",
                flexShrink: 0,
                border: "1px solid rgba(var(--cyan-rgb), 0.2)",
              }}
            />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  color: "var(--text-primary)",
                  fontSize: 13,
                  fontWeight: 500,
                  letterSpacing: "0.02em",
                }}
              >
                ICEMEXbot
              </div>
              <div
                style={{
                  color: "var(--text-muted)",
                  fontSize: 10,
                  letterSpacing: "0.08em",
                }}
              >
                {isLoading
                  ? "escribiendo..."
                  : "en línea · responde al instante"}
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                setMessages([
                  {
                    id: "welcome",
                    role: "assistant",
                    content:
                      "¡Hola! Soy el asistente virtual de **ICEMEX**. Cuéntame qué tipo de espacio necesitas iluminar y te ayudo a encontrar la luminaria ideal.",
                    timestamp: "",
                  },
                ]);
                setError(null);
                setHasInteracted(false);
              }}
              aria-label="Nueva conversación"
              style={{
                width: 28,
                height: 28,
                borderRadius: "50%",
                background: "transparent",
                border: "1px solid rgba(var(--cyan-rgb), 0.15)",
                color: "var(--text-muted)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                fontSize: 12,
              }}
              title="Nueva conversación"
            >
              ↺
            </button>
          </div>

          {/* Mensajes */}
          <div
            style={{
              flex: 1,
              overflowY: "auto",
              padding: "16px 14px",
              display: "flex",
              flexDirection: "column",
              gap: 12,
            }}
          >
            {messages.map((m) => {
              const isUser = m.role === "user";
              const hasContent = m.content.length > 0;

              return (
                <div
                  key={m.id}
                  style={{
                    display: "flex",
                    justifyContent: isUser ? "flex-end" : "flex-start",
                  }}
                >
                  <div
                    style={{
                      maxWidth: "88%",
                      padding: "12px 16px",
                      borderRadius: isUser
                        ? "16px 16px 4px 16px"
                        : "16px 16px 16px 4px",
                      background: isUser
                        ? "var(--accent-cyan)"
                        : "rgba(var(--card-rgb), 0.75)",
                      color: isUser
                        ? "var(--bg-primary)"
                        : "var(--text-primary)",
                      fontSize: 13,
                      lineHeight: 1.6,
                      letterSpacing: "0.01em",
                      border: isUser
                        ? "none"
                        : "1px solid rgba(var(--cyan-rgb), 0.1)",
                      wordBreak: "break-word",
                    }}
                  >
                    {isUser ? (
                      <span style={{ fontSize: 13 }}>{m.content}</span>
                    ) : hasContent ? (
                      <div style={{ fontSize: 13 }}>
                        {renderContent(m.content)}
                      </div>
                    ) : (
                      <span style={{ color: "var(--text-muted)" }}>
                        ...
                      </span>
                    )}
                    {m.timestamp ? (
                      <div
                        style={{
                          fontSize: 9,
                          opacity: 0.5,
                          marginTop: 4,
                          textAlign: isUser ? "right" : "left",
                          letterSpacing: "0.06em",
                        }}
                      >
                        {m.timestamp}
                      </div>
                    ) : null}
                  </div>
                </div>
              );
            })}

            {/* Indicador de carga */}
            {isLoading && (
              <div style={{ display: "flex", justifyContent: "flex-start" }}>
                <div
                  style={{
                    padding: "12px 16px",
                    borderRadius: "16px 16px 16px 4px",
                    background: "rgba(var(--card-rgb), 0.6)",
                    border: "1px solid rgba(var(--cyan-rgb), 0.08)",
                    display: "flex",
                    gap: 6,
                    alignItems: "center",
                  }}
                >
                  <span
                    className="typing-dot"
                    style={{
                      width: 7,
                      height: 7,
                      borderRadius: "50%",
                      background: "var(--accent-cyan)",
                      animation: "typing-bounce 1.2s ease-in-out infinite",
                    }}
                  />
                  <span
                    className="typing-dot"
                    style={{
                      width: 7,
                      height: 7,
                      borderRadius: "50%",
                      background: "var(--accent-cyan)",
                      animation: "typing-bounce 1.2s ease-in-out infinite",
                      animationDelay: "0.2s",
                    }}
                  />
                  <span
                    className="typing-dot"
                    style={{
                      width: 7,
                      height: 7,
                      borderRadius: "50%",
                      background: "var(--accent-cyan)",
                      animation: "typing-bounce 1.2s ease-in-out infinite",
                      animationDelay: "0.4s",
                    }}
                  />
                </div>
              </div>
            )}

            {/* Error */}
            {error && (
              <div style={{ textAlign: "center" }}>
                <p
                  style={{
                    color: "var(--accent-red)",
                    fontSize: 12,
                    marginBottom: 6,
                  }}
                >
                  {error}
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setError(null);
                    const lastUser = [...messages]
                      .reverse()
                      .find((m) => m.role === "user");
                    if (lastUser) sendMessage(lastUser.content);
                  }}
                  style={{
                    fontSize: 11,
                    color: "var(--accent-cyan)",
                    background: "transparent",
                    border: "1px solid rgba(var(--cyan-rgb), 0.2)",
                    borderRadius: 999,
                    padding: "4px 14px",
                    cursor: "pointer",
                  }}
                >
                  Reintentar
                </button>
              </div>
            )}

            {/* Sugerencias iniciales */}
            {messages.length <= 1 && !isLoading && (
              <div style={{ marginTop: 8 }}>
                <p
                  style={{
                    fontSize: 10,
                    color: "var(--text-muted)",
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    marginBottom: 8,
                  }}
                >
                  Sugerencias
                </p>
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => clickSuggestion(s)}
                    style={{
                      display: "block",
                      width: "100%",
                      textAlign: "left",
                      padding: "10px 14px",
                      marginBottom: 6,
                      background: "rgba(var(--cyan-rgb), 0.04)",
                      border: "1px solid rgba(var(--cyan-rgb), 0.1)",
                      borderRadius: 12,
                      color: "var(--text-muted)",
                      fontSize: 12,
                      lineHeight: 1.5,
                      cursor: "pointer",
                      transition:
                        "border-color 0.2s ease, background 0.2s ease",
                    }}
                    onMouseEnter={(e) => {
                      const el = e.currentTarget as HTMLButtonElement;
                      el.style.borderColor = "rgba(var(--cyan-rgb), 0.35)";
                      el.style.background = "rgba(var(--cyan-rgb), 0.08)";
                    }}
                    onMouseLeave={(e) => {
                      const el = e.currentTarget as HTMLButtonElement;
                      el.style.borderColor = "rgba(var(--cyan-rgb), 0.1)";
                      el.style.background = "rgba(var(--cyan-rgb), 0.04)";
                    }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form
            onSubmit={handleSubmit}
            style={{
              display: "flex",
              gap: 8,
              padding: "10px 14px",
              borderTop: "1px solid rgba(var(--cyan-rgb), 0.1)",
              background: "var(--bg-secondary)",
              flexShrink: 0,
            }}
          >
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Escribe tu consulta..."
              disabled={isLoading}
              style={{
                flex: 1,
                padding: "12px 14px",
                background: "rgba(var(--text-rgb), 0.04)",
                border: "1px solid rgba(var(--cyan-rgb), 0.15)",
                borderRadius: 999,
                color: "var(--text-primary)",
                fontSize: 13,
                outline: "none",
              }}
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              aria-label="Enviar mensaje"
              style={{
                width: 42,
                height: 42,
                borderRadius: "50%",
                background: input.trim()
                  ? "var(--accent-cyan)"
                  : "rgba(var(--cyan-rgb), 0.08)",
                border: "none",
                color: input.trim()
                  ? "var(--bg-primary)"
                  : "var(--text-muted)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                cursor: input.trim() ? "pointer" : "default",
                transition: "background 0.2s ease, color 0.2s ease",
              }}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden
              >
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            </button>
          </form>
        </div>
      )}

      <style
        dangerouslySetInnerHTML={{
          __html: `
            @keyframes chat-slide-up {
              from {
                opacity: 0;
                transform: translateY(16px) scale(0.97);
              }
              to {
                opacity: 1;
                transform: translateY(0) scale(1);
              }
            }
            @keyframes typing-bounce {
              0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
              30% { transform: translateY(-6px); opacity: 1; }
            }
            @keyframes chat-pulse {
              0%, 100% { transform: scale(1); opacity: 1; }
              50% { transform: scale(1.25); opacity: 0.5; }
            }
            @media (max-width: 480px) {
              .chat-panel {
                inset: 0 !important;
                width: 100% !important;
                height: 100dvh !important;
                border-radius: 0 !important;
                border: none !important;
              }
              .chat-toggle {
                bottom: 100px !important;
                right: 16px !important;
                width: 48px !important;
                height: 48px !important;
              }
            }
          `,
        }}
      />
    </>
  );
}
