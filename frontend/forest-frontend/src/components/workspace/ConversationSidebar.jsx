import WorkspaceIcon from "./WorkspaceIcon";

export default function ConversationSidebar({
  conversations,
  activeConversationId,
  user,
  onNewChat,
  onSelectConversation,
  onLogout,
  isLoggingOut,
  logoutError,
  isOpen,
  onClose,
}) {
  return (
    <aside
      className={`conversation-sidebar ${isOpen ? "is-open" : ""}`}
      aria-label="Conversations"
    >
      <div className="sidebar-brand">
        <a className="workspace-brand" href="/" aria-label="Forest home">
          <span className="workspace-brand-mark">
            <WorkspaceIcon name="sparkle" size={17} />
          </span>
          <span>forest</span>
        </a>
        <button
          type="button"
          className="icon-button sidebar-close"
          onClick={onClose}
          aria-label="Close conversations"
        >
          <WorkspaceIcon name="close" />
        </button>
      </div>

      <button type="button" className="new-chat-button" onClick={onNewChat}>
        <WorkspaceIcon name="add" size={17} />
        <span>New conversation</span>
        <span className="new-chat-shortcut">⌘ K</span>
      </button>

      <div className="conversation-list-heading">
        <span>Recent conversations</span>
        <button
          type="button"
          className="icon-button"
          aria-label="Search conversations"
          title="Search conversations"
        >
          <WorkspaceIcon name="search" size={16} />
        </button>
      </div>
      <nav className="conversation-list" aria-label="Recent conversations">
        {conversations.map((conversation, index) => (
          <div className="conversation-group" key={conversation.id}>
            {(index === 0 || conversation.time !== conversations[index - 1].time) && (
              <p className="conversation-date">{conversation.time}</p>
            )}
            <button
              type="button"
              className={`conversation-item ${activeConversationId === conversation.id ? "is-selected" : ""}`}
              onClick={() => onSelectConversation(conversation.id)}
              aria-current={
                activeConversationId === conversation.id ? "page" : undefined
              }
            >
              <WorkspaceIcon name="message" size={16} />
              <span>{conversation.title}</span>
              <WorkspaceIcon
                name="dots"
                size={17}
                className="conversation-more"
              />
            </button>
          </div>
        ))}
      </nav>

      <div className="sidebar-bottom">
        {logoutError && (
          <p className="workspace-error" role="alert">
            {logoutError}
          </p>
        )}
        <button
          type="button"
          className="profile-button"
          onClick={onLogout}
          disabled={isLoggingOut}
          aria-label={`Sign out${user.name ? `, signed in as ${user.name}` : ""}`}
        >
          <span className="profile-avatar">
            {(user.name || user.email || "U").charAt(0).toUpperCase()}
          </span>
          <span className="profile-copy">
            <strong>{user.name || "Your account"}</strong>
            <span>{isLoggingOut ? "Signing out…" : user.email}</span>
          </span>
          <WorkspaceIcon name="arrowDown" size={16} />
        </button>
      </div>
    </aside>
  );
}
