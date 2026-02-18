"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";

interface User {
  id: number;
  email: string;
  role: string;
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

const Chat: React.FC<ChatProps> = ({ user }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const listRef = useRef<HTMLDivElement | null>(null);
  const shouldAutoScrollRef = useRef(true);
  const autoScrollRef = useRef(true);



  // Traer mensajes cada 2s
  useEffect(() => {
    const fetchMessages = () => {
      fetch("http://localhost:3001/chat")
        .then((res) => res.json())
        .then((data) => setMessages(data))
        .catch((err) => console.error("Error trayendo mensajes:", err));
    };

    fetchMessages();
    const interval = setInterval(fetchMessages, 2000);
    return () => clearInterval(interval);
  }, []);

  // Scroll al final
useEffect(() => {
  const el = listRef.current;
  if (!el) return;

  const onScroll = () => {
    const threshold = 60; // px
    const distanceFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;

    // Si NO está cerca del final, significa que subió -> apagamos auto scroll
    autoScrollRef.current = distanceFromBottom <= threshold;
  };

  el.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  return () => el.removeEventListener("scroll", onScroll);
}, []);

useEffect(() => {
  if (!autoScrollRef.current) return;
  messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
}, [messages]);




  // Enviar mensaje / archivo
  const sendMessage = async () => {
    const text = newMessage.trim();
    if (!text && !selectedFile) return;

    try {
      if (selectedFile) {
        const form = new FormData();
        form.append("file", selectedFile);
        form.append("userId", String(user.id));
        if (text) form.append("mensaje", text);

        await fetch("http://localhost:3001/chat/upload", {
          method: "POST",
          body: form,
        });

        setSelectedFile(null);
        setNewMessage("");
        return;
      }

      await fetch("http://localhost:3001/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mensaje: text, userId: user.id }),
      });

      setNewMessage("");
    } catch (err) {
      console.error("Error enviando:", err);
    }
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") sendMessage();
  };

  const myInitial = useMemo(() => getInitial(user.email), [user.email]);

  return (
    <div className="fixed bottom-5 right-5 z-50 w-[380px] bg-white shadow-1 rounded-[14px] border border-gray-3 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="bg-blue-dark text-white px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 rounded-full bg-white/15 flex items-center justify-center font-semibold">
            {myInitial}
          </div>
          <div className="min-w-0">
            <p className="font-medium leading-tight">Soporte</p>
            <p className="text-xs opacity-80 truncate">
              {user.email} • en línea
            </p>
          </div>
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
            const initial = getInitial(msg.user.email);
            const time = formatTime(msg.createdAt);

            return (
              <div
                key={msg.id}
                className={`flex items-end gap-2 ${
                  isMe ? "justify-end" : "justify-start"
                }`}
              >
                {!isMe && (
                  <div className="w-8 h-8 rounded-full bg-gray-2 border border-gray-3 flex items-center justify-center text-xs font-semibold text-dark">
                    {initial}
                  </div>
                )}

                <div
                  className={`max-w-[78%] rounded-[14px] border px-3 py-2 ${
                    isMe
                      ? "bg-blue text-white border-blue/30"
                      : "bg-white text-dark border-gray-3 shadow-1"
                  }`}
                >
                  {/* Nombre + hora */}
                  <div
                    className={`text-[11px] mb-1 flex items-center justify-between gap-3 ${
                      isMe ? "text-white/80" : "text-dark-5"
                    }`}
                  >
                    <span className="truncate">
                      {isMe ? "Yo" : msg.user.email}
                    </span>
                    <span className="shrink-0">{time}</span>
                  </div>

                  {/* Texto */}
                  {msg.mensaje && (
                    <p className="text-sm whitespace-pre-wrap">{msg.mensaje}</p>
                  )}

                  {/* Archivo */}
                  {msg.fileUrl && (
                    <div className={`mt-2 rounded-md p-2 ${isMe ? "bg-white/10" : "bg-gray-1 border border-gray-3"}`}>
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
                          className={`text-sm underline ${isMe ? "text-white" : "text-blue"}`}
                        >
                          📄 {msg.fileName || "Ver archivo"}
                        </a>
                      )}
                    </div>
                  )}
                </div>

                {isMe && (
                  <div className="w-8 h-8 rounded-full bg-blue border border-blue/30 flex items-center justify-center text-xs font-semibold text-white">
                    {myInitial}
                  </div>
                )}
              </div>
            );
          })}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-gray-3 bg-white p-3">
        {/* Preview archivo */}
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
          {/* file input oculto */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,application/pdf"
            onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
            className="hidden"
          />

          {/* Adjuntar */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="w-10 h-10 rounded-full border border-gray-3 bg-gray-1 hover:bg-gray-2 ease-out duration-200 flex items-center justify-center"
            title="Adjuntar"
          >
            📎
          </button>

          {/* Input */}
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Escribe un mensaje..."
            className="flex-1 rounded-full border border-gray-3 bg-gray-1 px-4 py-2 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
          />

          {/* Enviar */}
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
