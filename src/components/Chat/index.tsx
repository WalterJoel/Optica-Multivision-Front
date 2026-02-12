import React, { useEffect, useState, useRef } from "react";

interface User {
  id: number;
  email: string;
  role: string;
}

interface Message {
  id: number;
  mensaje: string;
  user: User;
  createdAt: string;
}

interface ChatProps {
  user: User;
  token: string;
}

const Chat: React.FC<ChatProps> = ({ user }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // 🔥 Traer mensajes cada 2 segundos
  useEffect(() => {
    const fetchMessages = () => {
      fetch("http://localhost:3001/chat")
        .then((res) => res.json())
        .then((data) => setMessages(data));
    };

    fetchMessages(); // primera carga

    const interval = setInterval(fetchMessages, 2000);

    return () => clearInterval(interval);
  }, []);

  // 🔥 Scroll automático
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // 🔥 Enviar mensaje
  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    await fetch("http://localhost:3001/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        mensaje: newMessage,
        userId: user.id,
      }),
    });

    setNewMessage("");
  };

  return (
    <div className="fixed bottom-5 right-5 w-[350px] bg-white shadow-lg rounded-lg flex flex-col overflow-hidden">
      <div className="bg-blue-dark text-white px-4 py-2 font-semibold">
        Chat
      </div>

      <div className="flex-1 p-4 overflow-y-auto h-80">
        {messages.map((msg) => (
          <div key={msg.id} className="mb-2">
            <span className="font-semibold">
              {msg.user.email === user.email ? "Yo" : msg.user.email}:
            </span>{" "}
            <span>{msg.mensaje}</span>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="flex p-2 border-t border-gray-200">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Escribe tu mensaje..."
          className="flex-1 px-3 py-2 border rounded-lg outline-none"
        />
        <button
          onClick={sendMessage}
          className="ml-2 px-4 py-2 bg-blue-dark text-white rounded-lg"
        >
          Enviar
        </button>
      </div>
    </div>
  );
};

export default Chat;
