const Sidebar = ({ chats, currentChatId, setCurrentChatId, onNewChat, isOpen }) => {
  return (
    <div className={`sidebar${isOpen ? " open" : ""}`}>
      {/* Logo / Header */}
      <div className="sidebar-header">
        <div className="sidebar-logo">Q</div>
        <span className="sidebar-title">QuickGPT</span>
      </div>

      {/* New Chat */}
      <button className="new-chat-btn" onClick={onNewChat}>
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="12" y1="5" x2="12" y2="19"/>
          <line x1="5" y1="12" x2="19" y2="12"/>
        </svg>
        New chat
      </button>

      {/* Chat history */}
      {chats.length > 0 && (
        <>
          <div className="sidebar-label">Recent</div>
          <div className="chat-list">
            {chats.map((chat) => (
              <div
                key={chat.id}
                className={`chat-item${chat.id === currentChatId ? " active" : ""}`}
                onClick={() => setCurrentChatId(chat.id)}
                title={chat.title}
              >
                {chat.title}
              </div>
            ))}
          </div>
        </>
      )}

      {/* Footer */}
      <div className="sidebar-footer">
        <div className="sidebar-user">
          <div className="user-avatar">U</div>
          <span className="user-name">User</span>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
