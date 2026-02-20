"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";

interface User {
  id: number;
  email: string;
  role: string;
  avatarUrl?: string;
}

interface Message {
  id: number;
  mensaje: string | null;
  user: User;
  createdAt: string;
  fileUrl?: string;
  fileName?: string;
  fileType?: string;
  fileSize?: number;
}

interface ChatProps {
  user: User;
  token: string;
}

function getInitial(email: string) {
  return (email?.trim()?.[0] || "?").toUpperCase();
}

function formatTime(dateStr: string) {
  try {
    const d = new Date(dateStr);
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  } catch {
    return "";
  }
}

function formatSize(bytes?: number) {
  if (!bytes && bytes !== 0) return "";
  const kb = bytes / 1024;
  if (kb < 1024) return `${Math.round(kb)} KB`;
  return `${(kb / 1024).toFixed(1)} MB`;
}

function Avatar({
  email,
  avatarUrl,
  variant = "message",
}: {
  email: string;
  avatarUrl?: string;
  variant?: "header" | "message";
}) {
  const initial = getInitial(email);
  const sizeClass = variant === "header" ? "w-9 h-9" : "w-8 h-8";

  return avatarUrl ? (
    <img
      src={`http://localhost:3001${avatarUrl}?v=${encodeURIComponent(
        avatarUrl
      )}&t=${Date.now()}`}
      alt={email}
      className={`${sizeClass} rounded-full object-cover border border-gray-3`}
    />
  ) : (
    <div
      className={`${sizeClass} rounded-full bg-gray-2 border border-gray-3 flex items-center justify-center text-xs font-semibold text-dark`}
      title={email}
    >
      {initial}
    </div>
  );
}

const Chat: React.FC<ChatProps> = ({ user, token }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const listRef = useRef<HTMLDivElement | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const autoScrollRef = useRef(true);
  const [me, setMe] = useState<User>(user);

  const authHeaders = useMemo(() => {
    return token ? { Authorization: `Bearer ${token}` } : {};
  }, [token]);

  // Si no hay token, no renderizar chat (evita 401 spam)
  if (!token) return null;

  // Cargar perfil (para avatar)
  useEffect(() => {
    const loadMe = async () => {
      try {
        const r = await fetch(`http://localhost:3001/users/${user.id}`, {
          headers: authHeaders,
        });

        if (!r.ok) return setMe(user);

        const u = await r.json();
        setMe(u);
      } catch {
        setMe(user);
      }
    };

    loadMe();
  }, [user.id, user, authHeaders]);

  // Traer mensajes cada 2s (token-only)
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await fetch("http://localhost:3001/chat", {
          headers: authHeaders,
        });

        if (res.status === 401) {
          setMessages([]);
          return;
        }

        if (!res.ok) throw new Error("Error trayendo mensajes");

        const data = await res.json();

        setMessages((prev) => {
          const prevLast = prev[prev.length - 1]?.id;
          const newLast = data?.[data.length - 1]?.id;
          if (prevLast === newLast) return prev;
          return data;
        });
      } catch (err) {
        console.error("Error trayendo mensajes:", err);
      }
    };

    fetchMessages();
    const interval = setInterval(fetchMessages, 2000);
    return () => clearInterval(interval);
  }, [authHeaders]);

  // Detectar si el usuario está leyendo arriba (para NO jalarlo)
  useEffect(() => {
    const el = listRef.current;
    if (!el) return;

    const onScroll = () => {
      const threshold = 60;
      const distanceFromBottom =
        el.scrollHeight - el.scrollTop - el.clientHeight;
      autoScrollRef.current = distanceFromBottom <= threshold;
    };

    el.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  // Auto-scroll solo si el usuario está abajo
  useEffect(() => {
    if (!autoScrollRef.current) return;
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    const text = newMessage.trim();
    if (!text && !selectedFile) return;

    try {
      // ✅ Con archivo (imagen/pdf)
      if (selectedFile) {
        const form = new FormData();
        form.append("file", selectedFile);
        if (text) form.append("mensaje", text);

        const res = await fetch("http://localhost:3001/chat/upload", {
          method: "POST",
          headers: authHeaders, // ✅ Bearer
          body: form, // ✅ NO Content-Type manual
        });

        if (!res.ok) {
          const t = await res.text();
          throw new Error(t || "Error subiendo archivo");
        }

        setSelectedFile(null);
        setNewMessage("");
        return;
      }

      // ✅ Solo texto
      const res = await fetch("http://localhost:3001/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...authHeaders, // ✅ Bearer
        },
        body: JSON.stringify({ mensaje: text }), // ✅ sin userId
      });

      if (!res.ok) {
        const t = await res.text();
        throw new Error(t || "Error enviando mensaje");
      }

      setNewMessage("");
    } catch (err) {
      console.error("Error enviando:", err);
    }
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") sendMessage();
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 w-[380px] bg-white shadow-1 rounded-[14px] border border-gray-3 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="bg-blue-dark text-white px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3 min-w-0">
          <Avatar email={me.email} avatarUrl={me.avatarUrl} variant="header" />
          <p className="text-xs opacity-80 truncate">{me.email}</p>
        </div>

        <div className="text-xs opacity-90 px-2 py-1 rounded-md bg-white/10">
          Chat
        </div>
      </div>

      {/* Body */}
      <div
        ref={listRef}
        className="flex-1 p-4 overflow-y-auto bg-gray-1 min-h-[320px] max-h-[420px]"
      >
        <div className="space-y-3">
          {messages.map((msg) => {
            const isMe = msg.user.email === user.email;
            const time = formatTime(msg.createdAt);

            return (
              <div
                key={msg.id}
                className={`flex items-end gap-2 ${
                  isMe ? "justify-end" : "justify-start"
                }`}
              >
                {!isMe && (
                  <Avatar
                    email={msg.user.email}
                    avatarUrl={msg.user.avatarUrl}
                    variant="message"
                  />
                )}

                <div
                  className={`max-w-[78%] rounded-[14px] border px-3 py-2 ${
                    isMe
                      ? "bg-blue text-white border-blue/30"
                      : "bg-white text-dark border-gray-3 shadow-1"
                  }`}
                >
                  <div
                    className={`text-[11px] mb-1 flex items-center justify-between gap-3 ${
                      isMe ? "text-white/80" : "text-dark-5"
                    }`}
                  >
                    <span className="truncate">{isMe ? "Yo" : msg.user.email}</span>
                    <span className="shrink-0">{time}</span>
                  </div>

                  {msg.mensaje && (
                    <p className="text-sm whitespace-pre-wrap">{msg.mensaje}</p>
                  )}

                  {msg.fileUrl && (
                    <div
                      className={`mt-2 rounded-md p-2 ${
                        isMe
                          ? "bg-white/10"
                          : "bg-gray-1 border border-gray-3"
                      }`}
                    >
                      {msg.fileType?.startsWith("image/") ? (
                        <img
                          src={`http://localhost:3001${msg.fileUrl}`}
                          alt={msg.fileName || "imagen"}
                          className="max-w-full rounded-md border border-gray-3"
                        />
                      ) : (
                        <a
                          href={`http://localhost:3001${msg.fileUrl}`}
                          target="_blank"
                          rel="noreferrer"
                          className={`text-sm underline ${
                            isMe ? "text-white" : "text-blue"
                          }`}
                        >
                          📄 {msg.fileName || "Ver archivo"}
                        </a>
                      )}

                      {!!msg.fileSize && (
                        <div
                          className={`mt-1 text-[11px] ${
                            isMe ? "text-white/70" : "text-dark-5"
                          }`}
                        >
                          {formatSize(msg.fileSize)}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {isMe && (
                  <Avatar
                    email={msg.user.email}
                    avatarUrl={msg.user.avatarUrl}
                    variant="message"
                  />
                )}
              </div>
            );
          })}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-gray-3 bg-white p-3">
        {selectedFile && (
          <div className="mb-2 flex items-center justify-between rounded-[10px] border border-gray-3 bg-gray-1 px-3 py-2">
            <div className="min-w-0">
              <p className="text-xs text-dark truncate">
                📎 <span className="font-medium">{selectedFile.name}</span>
              </p>
              <p className="text-[11px] text-dark-5">
                {formatSize(selectedFile.size)}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setSelectedFile(null)}
              className="ml-2 w-8 h-8 rounded-md border border-gray-3 bg-white hover:bg-gray-2 ease-out duration-200"
              title="Quitar archivo"
            >
              ✕
            </button>
          </div>
        )}

        <div className="flex items-center gap-2">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,application/pdf"
            onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
            className="hidden"
          />

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="w-10 h-10 rounded-full border border-gray-3 bg-gray-1 hover:bg-gray-2 ease-out duration-200 flex items-center justify-center"
            title="Adjuntar"
          >
            📎
          </button>

          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Escribe un mensaje..."
            className="flex-1 rounded-full border border-gray-3 bg-gray-1 px-4 py-2 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
          />

          <button
            type="button"
            onClick={sendMessage}
            className="w-10 h-10 rounded-full bg-blue text-white hover:bg-blue-dark ease-out duration-200 flex items-center justify-center"
            title="Enviar"
          >
            ➤
          </button>
        </div>

        <p className="mt-2 text-[11px] text-dark-5">
          Enter para enviar • Adjunta imagen o PDF
        </p>
      </div>
    </div>
  );
};

export default Chat;
