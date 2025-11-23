import React, { useState, useRef, useEffect } from "react";
import "../style/ChatBox.css";

type Message = {
  id: number;
  from: "user" | "bot";
  text: string;
};

const ChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, from: "bot", text: "Xin chào 👋 Mình là trợ lý ảo của shop. Bạn cần tư vấn size, phong cách hay đơn hàng nào không?" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const toggleOpen = () => setIsOpen(prev => !prev);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  const handleSend = async () => {
    const trimmed = input.trim();
    if (!trimmed) return;

    const userMsg: Message = {
      id: Date.now(),
      from: "user",
      text: trimmed,
    };

    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      // Gửi lên backend gọi AI
      const res = await fetch("http://localhost:3001/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: trimmed }),
      });

      const data = await res.json();

      const botMsg: Message = {
        id: Date.now() + 1,
        from: "bot",
        text: data.reply ?? "Xin lỗi, hiện tại mình chưa trả lời được câu này 😢",
      };

      setMessages(prev => [...prev, botMsg]);
    } catch (err) {
      console.error(err);
      setMessages(prev => [
        ...prev,
        {
          id: Date.now() + 2,
          from: "bot",
          text: "Oops, hệ thống đang bận. Bạn thử lại sau một chút nhé 🛠️",
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

  return (
    <>
      {/* Nút bong bóng */}
      <button className="chat-bubble-btn" onClick={toggleOpen}>
        💬
      </button>

      {/* Cửa sổ chat */}
      {isOpen && (
        <div className="chat-widget">
          <div className="chat-header">
            <div>
              <div className="chat-title">Trợ lý ảo Stitched</div>
              <div className="chat-subtitle">Online 24/7 ✨</div>
            </div>
            <button className="chat-close-btn" onClick={toggleOpen}>✕</button>
          </div>

          <div className="chat-body">
            {messages.map(msg => (
              <div
                key={msg.id}
                className={`chat-message ${msg.from === "user" ? "from-user" : "from-bot"}`}
              >
                <div className="chat-bubble">
                  {msg.text}
                </div>
              </div>
            ))}
            {loading && (
              <div className="chat-message from-bot">
                <div className="chat-bubble typing">Đang trả lời...</div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="chat-input-area">
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Nhập câu hỏi của bạn..."
            />
            <button onClick={handleSend} disabled={loading || !input.trim()}>
              Gửi
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatWidget;
