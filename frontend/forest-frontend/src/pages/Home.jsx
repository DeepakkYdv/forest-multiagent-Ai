import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { signOut } from "firebase/auth";
import { auth } from "../../utils/firebase";
import { useCurrentUser } from "../features/auth/hooks/useCurrentUser";
import { useLogout } from "../features/auth/hooks/useLogout";
import {
  deleteConversation,
  renameConversation,
} from "../features/chat/api/chat.api";
import { chatKeys } from "../features/chat/chat.keys";
import { useConversations } from "../features/chat/hooks/useConversations";
import { useCreateConversation } from "../features/chat/hooks/useCreateConversation";
import { useMessages } from "../features/chat/hooks/useMessages";
import { useSendMessage } from "../features/chat/hooks/useSendMessage";
import { getApiErrorMessage } from "../lib/api-client";
import ArtifactPanel from "../components/workspace/ArtifactPanel";
import ConversationPanel from "../components/workspace/ConversationPanel";
import ConversationSidebar from "../components/workspace/ConversationSidebar";
import SettingsDialog from "../components/workspace/SettingsDialog";
import WorkspaceIcon from "../components/workspace/WorkspaceIcon";

function getConversationTime(updatedAt) {
  const date = new Date(updatedAt);
  if (Number.isNaN(date.getTime())) return "Earlier";

  const today = new Date();
  const dateDay = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const todayDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const daysAgo = Math.round((todayDay - dateDay) / 86_400_000);

  if (daysAgo === 0) return "Today";
  if (daysAgo === 1) return "Yesterday";
  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
  }).format(date);
}

function formatConversation(conversation) {
  return {
    ...conversation,
    id: conversation._id ?? conversation.id,
    title: conversation.title || "New conversation",
    time: getConversationTime(conversation.updatedAt ?? conversation.createdAt),
  };
}

export default function Home() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [logoutError, setLogoutError] = useState("");
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isArtifactOpen, setArtifactOpen] = useState(false);
  const [settingsSection, setSettingsSection] = useState(null);
  const [theme, setTheme] = useState("light");
  const [eyeProtection, setEyeProtection] = useState(false);
  const [language, setLanguage] = useState("en");
  const [locationEnabled, setLocationEnabled] = useState(false);
  const [conversationState, setConversationState] = useState({});
  const [activeConversationId, setActiveConversationId] = useState(null);
  const [conversationError, setConversationError] = useState("");
  const [sendMessageError, setSendMessageError] = useState("");
  const currentUser = useCurrentUser();
  const logoutMutation = useLogout();
  const conversationsQuery = useConversations();
  const createConversationMutation = useCreateConversation();
  const sendMessageMutation = useSendMessage();

  const conversations = useMemo(
    () =>
      (conversationsQuery.data ?? [])
        .map((conversation) => {
          const formatted = formatConversation(conversation);
          return {
            ...formatted,
            ...conversationState[formatted.id],
          };
        })
        .filter((conversation) => !conversation.deleted)
        .sort((first, second) => Number(Boolean(second.pinned)) - Number(Boolean(first.pinned))),
    [conversationsQuery.data, conversationState],
  );
  const sharedConversationId = new URLSearchParams(window.location.search).get(
    "conversation",
  );
  const selectedConversationId = conversations.some(
    (conversation) =>
      conversation.id === activeConversationId && !conversation.archived,
  )
    ? activeConversationId
    : conversations.some(
          (conversation) =>
            conversation.id === sharedConversationId && !conversation.archived,
        )
      ? sharedConversationId
      : (conversations.find((conversation) => !conversation.archived)?.id ?? null);
  const messagesQuery = useMessages(selectedConversationId);
  const conversationMessages = [
    ...(messagesQuery.data ?? []).map((message) => ({
      ...message,
      id: message._id ?? message.id,
    })),
  ];

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

  const closeSettings = useCallback(() => setSettingsSection(null), []);
  const openSettings = (section) => {
    setSettingsSection(section);
    setSidebarOpen(false);
  };

  const handleNewChat = async () => {
    setConversationError("");
    try {
      const conversation = await createConversationMutation.mutateAsync();
      setActiveConversationId(conversation._id ?? conversation.id);
    } catch (error) {
      setConversationError(getApiErrorMessage(error));
    }
    setSidebarOpen(false);
  };

  const handleSelectConversation = (id) => {
    setActiveConversationId(id);
    setSendMessageError("");
    setSidebarOpen(false);
  };

  const handleConversationAction = async (action, conversation) => {
    setConversationError("");

    if (action === "pin") {
      setConversationState((previous) => ({
        ...previous,
        [conversation.id]: {
          ...previous[conversation.id],
          pinned: !conversation.pinned,
        },
      }));
      return;
    }

    if (action === "archive") {
      setConversationState((previous) => ({
        ...previous,
        [conversation.id]: { ...previous[conversation.id], archived: true },
      }));
      if (activeConversationId === conversation.id) {
        const nextConversation = conversations.find(
          (item) => item.id !== conversation.id && !item.archived,
        );
        setActiveConversationId(nextConversation?.id ?? null);
      }
      return;
    }

    if (action === "rename") {
      const title = window.prompt("Rename conversation", conversation.title)?.trim();
      if (!title || title === conversation.title) return;

      try {
        await renameConversation(conversation.id, title);
        setConversationState((previous) => ({
          ...previous,
          [conversation.id]: { ...previous[conversation.id], title },
        }));
        await queryClient.invalidateQueries({ queryKey: chatKeys.conversations() });
      } catch (error) {
        setConversationError(getApiErrorMessage(error));
      }
      return;
    }

    if (action === "share") {
      try {
        if (!navigator.clipboard?.writeText) {
          throw new Error("Clipboard access is unavailable in this browser.");
        }
        const shareUrl = new URL(window.location.href);
        shareUrl.searchParams.set("conversation", conversation.id);
        await navigator.clipboard.writeText(shareUrl.toString());
        setConversationError("Conversation link copied to clipboard.");
      } catch {
        setConversationError("Unable to copy a conversation link. Check clipboard permissions.");
      }
      return;
    }

    if (action === "delete") {
      if (!window.confirm(`Delete “${conversation.title}”? This cannot be undone.`)) {
        return;
      }
      try {
        await deleteConversation(conversation.id);
        setConversationState((previous) => ({
          ...previous,
          [conversation.id]: { ...previous[conversation.id], deleted: true },
        }));
        if (activeConversationId === conversation.id) {
          const nextConversation = conversations.find(
            (item) => item.id !== conversation.id && !item.archived,
          );
          setActiveConversationId(nextConversation?.id ?? null);
        }
        await queryClient.invalidateQueries({ queryKey: chatKeys.conversations() });
      } catch (error) {
        setConversationError(getApiErrorMessage(error));
      }
    }
  };

  const handleSendMessage = async (prompt) => {
    if (!selectedConversationId) {
      const error = new Error("Create a conversation before sending a message.");
      setSendMessageError(error.message);
      throw error;
    }

    setSendMessageError("");
    try {
      await sendMessageMutation.mutateAsync({
        conversationId: selectedConversationId,
        prompt,
      });
    } catch (error) {
      setSendMessageError(getApiErrorMessage(error));
      throw error;
    }
  };

  const handleArchiveAll = () => {
    setConversationState((previous) => ({
      ...previous,
      ...Object.fromEntries(
        conversations.map((conversation) => [
          conversation.id,
          { ...previous[conversation.id], archived: true },
        ]),
      ),
    }));
  };

  const handleRestoreConversation = (id) => {
    setConversationState((previous) => ({
      ...previous,
      [id]: { ...previous[id], archived: false },
    }));
  };

  const handleDeleteArchived = () => {
    setConversationState((previous) => ({
      ...previous,
      ...Object.fromEntries(
        conversations
          .filter((conversation) => conversation.archived)
          .map((conversation) => [
            conversation.id,
            { ...previous[conversation.id], deleted: true },
          ]),
      ),
    }));
  };

  const handleDeleteAllConversations = () => {
    setConversationState((previous) => ({
      ...previous,
      ...Object.fromEntries(
        conversations.map((conversation) => [
          conversation.id,
          { ...previous[conversation.id], deleted: true },
        ]),
      ),
    }));
    setActiveConversationId(null);
  };

  const handleExportData = () => {
    const exportPayload = {
      exportedAt: new Date().toISOString(),
      account: {
        name: currentUser.data.name ?? "",
        email: currentUser.data.email ?? "",
      },
      conversations,
      activeConversationMessages: conversationMessages,
    };
    const file = new Blob([JSON.stringify(exportPayload, null, 2)], {
      type: "application/json",
    });
    const downloadUrl = URL.createObjectURL(file);
    const link = document.createElement("a");
    link.href = downloadUrl;
    link.download = "forest-workspace-export.json";
    link.click();
    URL.revokeObjectURL(downloadUrl);
  };

  const handleAccountAction = (action) => {
    const messagesByAction = {
      profile: "Profile changes are not connected to the account service yet.",
      password: "Password changes are not connected to the account service yet.",
      delete: "Account deletion is not connected to the account service yet.",
    };
    return messagesByAction[action];
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
    (conversation) => conversation.id === selectedConversationId,
  );

  return (
    <main
      className={`workspace ${theme === "dark" ? "is-dark" : ""} ${eyeProtection ? "is-eye-protected" : ""}`}
    >
      <button
        className={`workspace-scrim ${isSidebarOpen ? "is-visible" : ""}`}
        aria-label="Close conversations menu"
        onClick={() => setSidebarOpen(false)}
        tabIndex={isSidebarOpen ? 0 : -1}
      />
      <ConversationSidebar
        conversations={conversations.filter((conversation) => !conversation.archived)}
        activeConversationId={selectedConversationId}
        user={currentUser.data}
        onNewChat={handleNewChat}
        onSelectConversation={handleSelectConversation}
        onConversationAction={handleConversationAction}
        onLogout={handleLogout}
        onOpenSettings={openSettings}
        isLoggingOut={logoutMutation.isPending}
        logoutError={logoutError}
        isOpen={isSidebarOpen}
        onClose={() => setSidebarOpen(false)}
        isLoadingConversations={conversationsQuery.isPending}
        conversationsError={
          conversationsQuery.isError
            ? getApiErrorMessage(conversationsQuery.error)
            : ""
        }
        onRetryConversations={conversationsQuery.refetch}
        isCreatingConversation={createConversationMutation.isPending}
        conversationError={conversationError}
      />
      <section className="workspace-main">
        <ConversationPanel
          title={activeConversation?.title ?? "New conversation"}
          messages={conversationMessages}
          onSendMessage={handleSendMessage}
          onToggleSidebar={() => setSidebarOpen(true)}
          onToggleArtifact={() => setArtifactOpen((open) => !open)}
          isArtifactOpen={isArtifactOpen}
          isLoadingMessages={messagesQuery.isPending && Boolean(selectedConversationId)}
          messagesError={
            messagesQuery.isError
              ? getApiErrorMessage(messagesQuery.error)
              : ""
          }
          onRetryMessages={messagesQuery.refetch}
          isSendingMessage={sendMessageMutation.isPending}
          sendMessageError={sendMessageError}
        />
      </section>
      <ArtifactPanel
        isOpen={isArtifactOpen}
        onClose={() => setArtifactOpen(false)}
        onToggle={() => setArtifactOpen((open) => !open)}
      />
      {settingsSection && (
        <SettingsDialog
          initialSection={settingsSection}
          onClose={closeSettings}
          theme={theme}
          onThemeChange={setTheme}
          eyeProtection={eyeProtection}
          onEyeProtectionChange={setEyeProtection}
          language={language}
          onLanguageChange={setLanguage}
          locationEnabled={locationEnabled}
          onLocationChange={setLocationEnabled}
          conversations={conversations}
          onRestoreConversation={handleRestoreConversation}
          onDeleteArchived={handleDeleteArchived}
          onArchiveAll={handleArchiveAll}
          onDeleteAll={handleDeleteAllConversations}
          onExportData={handleExportData}
          user={currentUser.data}
          onAccountAction={handleAccountAction}
        />
      )}
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
