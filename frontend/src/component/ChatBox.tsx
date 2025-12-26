import React, { useState, useRef, useEffect } from "react";
import "../style/ChatBox.css";

type Message = {
  id: number;
  from: "user" | "bot";
  text: string;
};

const ChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [size, setSize] = useState<"normal" | "expanded" | "fullscreen">("normal");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      from: "bot",
      text:
        "Hello, I'm the shop's virtual assistant. How can I help you today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const toggleOpen = () => setIsOpen((prev) => !prev);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen, size]);

  const handleSend = async () => {
    const trimmed = input.trim();
    if (!trimmed) return;

    const userMsg: Message = {
      id: Date.now(),
      from: "user",
      text: trimmed,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:3000/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: trimmed }),
      });

      const data = await res.json();

      const botMsg: Message = {
        id: Date.now() + 1,
        from: "bot",
        text:
          data.reply ??
          "Sorry, I can't answer this question right now.",
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 2,
          from: "bot",
          text:
            "The system is currently unavailable. Please try again later.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSend();
    }
  };

  const toggleSize = () => {
    setSize((prev) =>
      prev === "normal"
        ? "expanded"
        : prev === "expanded"
        ? "fullscreen"
        : "normal"
    );
  };

  return (
    <>
      {/* Nút bong bóng */}
      <button className="chat-bubble-btn" onClick={toggleOpen}>
        💬
      </button>

      {/* Cửa sổ chat */}
      {isOpen && (
        <div className={`chat-widget ${size}`}>
          <div className="chat-header">
            <div className="chat-title">Virtual Assistant</div>

            <div className="chat-actions">
              <button
                className="chat-action-btn"
                onClick={toggleSize}
                title="Phóng to / Thu nhỏ"
              >
                ⛶
              </button>
              <button className="chat-close-btn" onClick={toggleOpen}>
                ✕
              </button>
            </div>
          </div>

          <div className="chat-body">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`chat-message ${
                  msg.from === "user" ? "from-user" : "from-bot"
                }`}
              >
                <div className="chat-bubble">{msg.text}</div>
              </div>
            ))}

            {loading && (
              <div className="chat-message from-bot">
                <div className="chat-bubble typing">
                  Typing...
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          <div className="chat-input-area">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Enter your question..."
            />
            <button
              onClick={handleSend}
              disabled={loading || !input.trim()}
            >
              Send
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatWidget;
