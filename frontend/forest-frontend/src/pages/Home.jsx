import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../../utils/firebase";
import { useCurrentUser } from "../features/auth/hooks/useCurrentUser";
import { useLogout } from "../features/auth/hooks/useLogout";
import { getApiErrorMessage } from "../lib/api-client";
import ArtifactPanel from "../components/workspace/ArtifactPanel";
import ConversationPanel from "../components/workspace/ConversationPanel";
import ConversationSidebar from "../components/workspace/ConversationSidebar";
import WorkspaceIcon from "../components/workspace/WorkspaceIcon";

const initialConversations = [
  { id: "forest-dashboard", title: "Forest dashboard design", time: "Today" },
  { id: "responsive-layout", title: "Responsive layouts", time: "Today" },
  { id: "api-structure", title: "API structure ideas", time: "Yesterday" },
  { id: "brand-voice", title: "A warmer brand voice", time: "Yesterday" },
];

const initialMessages = [
  {
    id: "welcome",
    role: "assistant",
    content:
      "Hi! I’m here to help you shape your ideas into something clear and useful. What would you like to work on?",
  },
  {
    id: "prompt",
    role: "user",
    content: "Can you help me make a simple, focused workspace for my project?",
  },
  {
    id: "response",
    role: "assistant",
    content:
      "Absolutely. We can keep the conversation front and center, with your chats close by and project files ready when you need them.",
  },
];

export default function Home() {
  const navigate = useNavigate();
  const [logoutError, setLogoutError] = useState("");
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isArtifactOpen, setArtifactOpen] = useState(false);
  const [conversations, setConversations] = useState(initialConversations);
  const [activeConversationId, setActiveConversationId] = useState(
    initialConversations[0].id,
  );
  const [messages, setMessages] = useState(initialMessages);
  const currentUser = useCurrentUser();
  const logoutMutation = useLogout();

  useEffect(() => {
    if (
      currentUser.error?.response?.status === 401 ||
      (!currentUser.isPending && !currentUser.data && !currentUser.error)
    ) {
      navigate("/login", { replace: true });
    }
  }, [currentUser.data, currentUser.error, currentUser.isPending, navigate]);

  const handleLogout = async () => {
    setLogoutError("");
    try {
      await logoutMutation.mutateAsync();
      await signOut(auth);
      navigate("/login", { replace: true });
    } catch (error) {
      setLogoutError(getApiErrorMessage(error));
    }
  };

  const handleNewChat = () => {
    const id = `conversation-${Date.now()}`;
    setConversations((previous) => [
      { id, title: "New conversation", time: "Now" },
      ...previous,
    ]);
    setActiveConversationId(id);
    setMessages([]);
    setSidebarOpen(false);
  };

  const handleSelectConversation = (id) => {
    setActiveConversationId(id);
    setMessages(id === initialConversations[0].id ? initialMessages : []);
    setSidebarOpen(false);
  };

  const handleSendMessage = (content) => {
    setMessages((previous) => [
      ...previous,
      { id: `message-${Date.now()}`, role: "user", content },
    ]);
  };

  if (currentUser.isError) {
    return (
      <main className="session-state" role="alert">
        <p>Unable to load your session.</p>
        <button className="workspace-button" onClick={() => currentUser.refetch()}>
          Try again
        </button>
      </main>
    );
  }
  if (currentUser.isPending || !currentUser.data) {
    return (
      <main className="session-state" aria-live="polite">
        Checking your session…
      </main>
    );
  }

  const activeConversation = conversations.find(
    (conversation) => conversation.id === activeConversationId,
  );

  return (
    <main className="workspace">
      <button
        className={`workspace-scrim ${isSidebarOpen ? "is-visible" : ""}`}
        aria-label="Close conversations menu"
        onClick={() => setSidebarOpen(false)}
        tabIndex={isSidebarOpen ? 0 : -1}
      />
      <ConversationSidebar
        conversations={conversations}
        activeConversationId={activeConversationId}
        user={currentUser.data}
        onNewChat={handleNewChat}
        onSelectConversation={handleSelectConversation}
        onLogout={handleLogout}
        isLoggingOut={logoutMutation.isPending}
        logoutError={logoutError}
        isOpen={isSidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      <section className="workspace-main">
        <ConversationPanel
          title={activeConversation?.title ?? "New conversation"}
          messages={messages}
          onSendMessage={handleSendMessage}
          onToggleSidebar={() => setSidebarOpen(true)}
          onToggleArtifact={() => setArtifactOpen((open) => !open)}
          isArtifactOpen={isArtifactOpen}
        />
      </section>
      <ArtifactPanel
        isOpen={isArtifactOpen}
        onClose={() => setArtifactOpen(false)}
        onToggle={() => setArtifactOpen((open) => !open)}
      />
      <div className="workspace-mobile-nav" aria-label="Workspace panels">
        <button
          type="button"
          className={isSidebarOpen ? "is-active" : ""}
          onClick={() => {
            setSidebarOpen(true);
            setArtifactOpen(false);
          }}
        >
          <WorkspaceIcon name="sidebar" />
          <span>Chats</span>
        </button>
        <button
          type="button"
          className={!isSidebarOpen && !isArtifactOpen ? "is-active" : ""}
          onClick={() => {
            setSidebarOpen(false);
            setArtifactOpen(false);
          }}
        >
          <WorkspaceIcon name="message" />
          <span>Chat</span>
        </button>
        <button
          type="button"
          className={isArtifactOpen ? "is-active" : ""}
          onClick={() => {
            setSidebarOpen(false);
            setArtifactOpen(true);
          }}
        >
          <WorkspaceIcon name="code" />
          <span>Files</span>
        </button>
      </div>
    </main>
  );
}
