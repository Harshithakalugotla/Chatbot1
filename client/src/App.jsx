import { useState } from "react";
import ChatBox from "./components/ChatBox";
import Sidebar from "./components/Sidebar";
import "./App.css";

function App() {
  const [chats, setChats] = useState([
    { id: 1, title: "New conversation" },
  ]);
  const [currentChatId, setCurrentChatId] = useState(1);
  const [messages, setMessages] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleNewChat = () => {
    const newChat = { id: Date.now(), title: "New conversation" };
    setChats((prev) => [newChat, ...prev]);
    setCurrentChatId(newChat.id);
    setMessages([]);
    setSidebarOpen(false);
  };

  const updateChatTitle = (title) => {
    setChats((prev) =>
      prev.map((c) =>
        c.id === currentChatId ? { ...c, title } : c
      )
    );
  };

  return (
    <div className="app-container">
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.5)",
            zIndex: 9,
          }}
        />
      )}

      <Sidebar
        chats={chats}
        currentChatId={currentChatId}
        setCurrentChatId={(id) => {
          setCurrentChatId(id);
          setSidebarOpen(false);
        }}
        onNewChat={handleNewChat}
        isOpen={sidebarOpen}
      />

      <ChatBox
        messages={messages}
        setMessages={setMessages}
        onFirstMessage={updateChatTitle}
        onMenuClick={() => setSidebarOpen(true)}
      />
    </div>
  );
}

export default App;
