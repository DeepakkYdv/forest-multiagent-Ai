import WorkspaceIcon from "./WorkspaceIcon";
import ProfileMenu from "./ProfileMenu";
import ActionDropdown from "./ActionDropdown";

export default function ConversationSidebar({
  conversations,
  activeConversationId,
  user,
  onNewChat,
  onSelectConversation,
  onConversationAction,
  onLogout,
  onOpenSettings,
  isLoggingOut,
  logoutError,
  isOpen,
  onClose,
  isLoadingConversations,
  conversationsError,
  onRetryConversations,
  isCreatingConversation,
  conversationError,
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

      <button
        type="button"
        className="new-chat-button"
        onClick={onNewChat}
        disabled={isCreatingConversation}
      >
        <WorkspaceIcon name="add" size={17} />
        <span>{isCreatingConversation ? "Creating…" : "New conversation"}</span>
        <span className="new-chat-shortcut">⌘ K</span>
      </button>
      {conversationError && (
        <p className="workspace-error" role="alert">
          {conversationError}
        </p>
      )}

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
        {isLoadingConversations && <p>Loading conversations…</p>}
        {conversationsError && (
          <div className="workspace-error" role="alert">
            <p>{conversationsError}</p>
            <button type="button" className="workspace-button" onClick={onRetryConversations}>
              Try again
            </button>
          </div>
        )}
        {!isLoadingConversations && !conversationsError && conversations.length === 0 && (
          <p>No conversations yet. Start a new one above.</p>
        )}
        {conversations.map((conversation, index) => {
          const groupName = conversation.pinned ? "Pinned" : conversation.time;
          const previousGroup = conversations[index - 1]?.pinned
            ? "Pinned"
            : conversations[index - 1]?.time;
          const menuItems = [
            {
              title: "Rename",
              icon: "rename",
              onClick: () => onConversationAction("rename", conversation),
            },
            {
              title: conversation.pinned ? "Unpin" : "Pin",
              icon: "pin",
              onClick: () => onConversationAction("pin", conversation),
            },
            {
              title: "Share",
              icon: "share",
              dividerBefore: true,
              onClick: () => onConversationAction("share", conversation),
            },
            {
              title: "Archive",
              icon: "archive",
              dividerBefore: true,
              onClick: () => onConversationAction("archive", conversation),
            },
            {
              title: "Delete",
              icon: "trash",
              destructive: true,
              onClick: () => onConversationAction("delete", conversation),
            },
          ];

          return (
            <div className="conversation-group" key={conversation.id}>
              {groupName !== previousGroup && (
                <p className="conversation-date">{groupName}</p>
              )}
              <div
                className={`conversation-row ${activeConversationId === conversation.id ? "is-selected" : ""}`}
              >
                <button
                  type="button"
                  className="conversation-item"
                  onClick={() => onSelectConversation(conversation.id)}
                  aria-current={
                    activeConversationId === conversation.id ? "page" : undefined
                  }
                >
                  <WorkspaceIcon name="message" size={16} />
                  <span>{conversation.title}</span>
                  {conversation.pinned && (
                    <WorkspaceIcon
                      name="pin"
                      size={13}
                      className="conversation-pinned-icon"
                    />
                  )}
                </button>
                <ActionDropdown
                  className="conversation-more"
                  label={`Actions for ${conversation.title}`}
                  items={menuItems}
                />
              </div>
            </div>
          );
        })}
      </nav>

      <div className="sidebar-bottom">
        {logoutError && (
          <p className="workspace-error" role="alert">
            {logoutError}
          </p>
        )}
        <ProfileMenu
          user={user}
          onOpenSettings={onOpenSettings}
          onLogout={onLogout}
          isLoggingOut={isLoggingOut}
        />
      </div>
    </aside>
  );
}
