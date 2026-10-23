import { useRef, useState } from "react";
import WorkspaceIcon from "./WorkspaceIcon";

function Message({ message }) {
  if (message.role === "user") {
    return (
      <article className="message-row user-message">
        <div className="message-bubble">{message.content}</div>
      </article>
    );
  }

  return (
    <article className="message-row assistant-message">
      <div className="assistant-avatar">
        <WorkspaceIcon name="sparkle" size={16} />
      </div>
      <div className="assistant-message-content">
        <span className="message-author">Forest</span>
        <p>{message.content}</p>
        <div className="message-actions" aria-label="Message actions">
          <button type="button" aria-label="Copy response" title="Copy response">
            <WorkspaceIcon name="file" size={15} />
          </button>
          <button type="button" aria-label="More options" title="More options">
            <WorkspaceIcon name="dots" size={16} />
          </button>
        </div>
      </div>
    </article>
  );
}

function MessageComposer({ onSendMessage }) {
  const [value, setValue] = useState("");
  const inputRef = useRef(null);

  const submitMessage = (event) => {
    event.preventDefault();
    const content = value.trim();
    if (!content) return;
    onSendMessage(content);
    setValue("");
    inputRef.current?.focus();
  };

  return (
    <form className="message-composer" onSubmit={submitMessage}>
      <label className="sr-only" htmlFor="message-input">
        Message Forest
      </label>
      <textarea
        id="message-input"
        ref={inputRef}
        value={value}
        onChange={(event) => setValue(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault();
            event.currentTarget.form.requestSubmit();
          }
        }}
        placeholder="Message Forest…"
        rows={1}
      />
      <div className="composer-toolbar">
        <div className="composer-tools">
          <button
            type="button"
            className="composer-tool"
            aria-label="Attach a file"
            title="Attach a file"
          >
            <WorkspaceIcon name="paperclip" size={17} />
          </button>
          <button type="button" className="model-picker">
            <span className="model-status" />
            Forest assistant
            <WorkspaceIcon name="arrowDown" size={14} />
          </button>
        </div>
        <div className="composer-submit-group">
          <span className="composer-hint">Enter to send</span>
          <button
            type="submit"
            className="send-button"
            aria-label="Send message"
            disabled={!value.trim()}
          >
            <WorkspaceIcon name="arrowUp" size={17} />
          </button>
        </div>
      </div>
    </form>
  );
}

export default function ConversationPanel({
  title,
  messages,
  onSendMessage,
  onToggleSidebar,
  onToggleArtifact,
  isArtifactOpen,
}) {
  return (
    <div className="conversation-panel">
      <header className="chat-header">
        <div className="chat-header-leading">
          <button
            type="button"
            className="icon-button mobile-sidebar-trigger"
            onClick={onToggleSidebar}
            aria-label="Open conversations"
          >
            <WorkspaceIcon name="menu" />
          </button>
          <div className="chat-title-wrap">
            <h1>{title}</h1>
            <span className="chat-model-label">
              <span className="model-status" />
              Forest assistant
            </span>
          </div>
        </div>
        <div className="chat-header-actions">
          <button
            type="button"
            className={`header-artifact-button ${isArtifactOpen ? "is-active" : ""}`}
            onClick={onToggleArtifact}
            aria-pressed={isArtifactOpen}
          >
            <WorkspaceIcon name="code" size={16} />
            <span>Artifacts</span>
          </button>
          <button
            type="button"
            className="icon-button header-more"
            aria-label="More conversation options"
          >
            <WorkspaceIcon name="dots" />
          </button>
        </div>
      </header>

      <section
        className="message-history"
        aria-label="Conversation"
        aria-live="polite"
        aria-relevant="additions"
      >
        {messages.length === 0 ? (
          <div className="empty-conversation">
            <span className="empty-conversation-icon">
              <WorkspaceIcon name="sparkle" size={23} />
            </span>
            <h2>Where shall we begin?</h2>
            <p>Ask a question, explore an idea, or start with a simple hello.</p>
          </div>
        ) : (
          <div className="message-thread">
            {messages.map((message) => (
              <Message message={message} key={message.id} />
            ))}
          </div>
        )}
      </section>

      <footer className="chat-footer">
        <MessageComposer onSendMessage={onSendMessage} />
        <p className="chat-disclaimer">
          Forest can make mistakes. Check important information.
        </p>
      </footer>
    </div>
  );
}
