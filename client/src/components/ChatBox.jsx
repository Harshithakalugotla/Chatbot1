import { useState, useEffect, useRef } from "react";

const ChatBox = ({ messages, setMessages, onFirstMessage, onMenuClick }) => {
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  const sendMessage = async (text) => {
    const content = (text || input).trim();
    if (!content || isLoading) return;

    // Auto-title the chat from first message
    if (messages.length === 0 && onFirstMessage) {
      onFirstMessage(content.slice(0, 40) + (content.length > 40 ? "…" : ""));
    }

    const newMessage = { role: "user", content };
    const updatedMessages = [...messages, newMessage];

    setMessages(updatedMessages);
    setInput("");
    setIsLoading(true);

    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }

    try {
      const res = await fetch("http://localhost:5000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: updatedMessages }),
      });

      const data = await res.json();
      setMessages([
        ...updatedMessages,
        { role: "assistant", content: data.reply },
      ]);
    } catch (error) {
      console.error(error);
      setMessages([
        ...updatedMessages,
        { role: "assistant", content: "⚠️ Server not responding. Make sure the backend is running on port 5000." },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleTextareaChange = (e) => {
    setInput(e.target.value);
    e.target.style.height = "auto";
    e.target.style.height = Math.min(e.target.scrollHeight, 180) + "px";
  };

  return (
    <div className="chat-container">
      {/* Top bar */}
      <div className="chat-topbar">
        <button
          onClick={onMenuClick}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "var(--text-secondary)",
            display: "none",
            padding: "4px",
          }}
          className="mobile-menu-btn"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <line x1="3" y1="6" x2="21" y2="6"/>
            <line x1="3" y1="12" x2="21" y2="12"/>
            <line x1="3" y1="18" x2="21" y2="18"/>
          </svg>
        </button>

        <div style={{ flex: 1 }} />

        <div className="chat-model-badge">
          <span className="model-dot" />
          llama-3.1-8b
        </div>
      </div>

      {/* Messages */}
      <div className="messages-wrapper">
        <div className="messages-inner">
          {messages.length === 0 ? (
            <div className="empty-state">
              <div className="empty-logo">Q</div>
              <h1 className="empty-title">Start chatting</h1>
              <p className="empty-sub">Type a message below to begin.</p>
            </div>
          ) : (
            <>
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`message-row ${msg.role === "user" ? "user" : "bot"}`}
                >
                  <div className={`msg-avatar ${msg.role === "user" ? "user-avatar-msg" : "bot-avatar"}`}>
                    {msg.role === "user" ? "U" : "Q"}
                  </div>
                  <div className="msg-bubble">
                    {msg.content}
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="message-row bot">
                  <div className="msg-avatar bot-avatar">Q</div>
                  <div className="msg-bubble">
                    <div className="typing-dots">
                      <span /><span /><span />
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <div className="input-area">
        <div className="input-inner">
          <div className="input-box">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={handleTextareaChange}
              onKeyDown={handleKeyDown}
              placeholder="Message QuickGPT…"
              rows={1}
              disabled={isLoading}
            />
            <button
              className="send-btn"
              onClick={() => sendMessage()}
              disabled={!input.trim() || isLoading}
              aria-label="Send message"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="19" x2="12" y2="5"/>
                <polyline points="5 12 12 5 19 12"/>
              </svg>
            </button>
          </div>
          <p className="input-hint">QuickGPT can make mistakes. Shift+Enter for new line.</p>
        </div>
      </div>
    </div>
  );
};

export default ChatBox;