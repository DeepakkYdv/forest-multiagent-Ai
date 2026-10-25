import { useEffect, useRef, useState } from "react";
import WorkspaceIcon from "./WorkspaceIcon";

const menuItems = [
  { label: "Upgrade plan", icon: "plan", section: "plans" },
  { label: "Personalization", icon: "sun", section: "appearance" },
  { label: "Profile", icon: "profile", section: "account" },
  { label: "Settings", icon: "settings", section: "general" },
];

export default function ProfileMenu({
  user,
  onOpenSettings,
  onLogout,
  isLoggingOut,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [helpMessage, setHelpMessage] = useState("");
  const menuRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return undefined;

    const closeOnOutsideClick = (event) => {
      if (!menuRef.current?.contains(event.target)) {
        setIsOpen(false);
        setHelpMessage("");
      }
    };
    const closeOnEscape = (event) => {
      if (event.key === "Escape") {
        setIsOpen(false);
        setHelpMessage("");
      }
    };
    document.addEventListener("pointerdown", closeOnOutsideClick);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("pointerdown", closeOnOutsideClick);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [isOpen]);

  const openSettings = (section) => {
    setIsOpen(false);
    setHelpMessage("");
    onOpenSettings(section);
  };

  return (
    <div className="profile-menu-anchor" ref={menuRef}>
      {isOpen && (
        <div className="profile-popover" role="menu" aria-label="Account menu">
          <div className="profile-menu-account">
            <span className="profile-avatar">
              {(user.name || user.email || "U").charAt(0).toUpperCase()}
            </span>
            <span className="profile-copy">
              <strong>{user.name || "Your account"}</strong>
              <span>{user.email}</span>
              <span className="profile-plan-label">Go plan</span>
            </span>
            <WorkspaceIcon name="chevron" size={16} />
          </div>
          <div className="profile-menu-divider" />
          {menuItems.map((item) => (
            <button
              type="button"
              role="menuitem"
              className="profile-menu-item"
              key={item.section}
              onClick={() => openSettings(item.section)}
            >
              <WorkspaceIcon name={item.icon} size={17} />
              <span>{item.label}</span>
            </button>
          ))}
          <div className="profile-menu-divider" />
          <button
            type="button"
            role="menuitem"
            className="profile-menu-item"
            onClick={() => setHelpMessage("The help center will be available here soon.")}
          >
            <WorkspaceIcon name="help" size={17} />
            <span>Help</span>
            <WorkspaceIcon name="chevron" size={14} className="profile-menu-chevron" />
          </button>
          {helpMessage && (
            <p className="profile-help-message" role="status">
              {helpMessage}
            </p>
          )}
          <button
            type="button"
            role="menuitem"
            className="profile-menu-item profile-logout-item"
            onClick={onLogout}
            disabled={isLoggingOut}
          >
            <WorkspaceIcon name="logout" size={17} />
            <span>{isLoggingOut ? "Signing out…" : "Log out"}</span>
          </button>
        </div>
      )}
      <button
        type="button"
        className={`profile-button ${isOpen ? "is-open" : ""}`}
        onClick={() => {
          setIsOpen((open) => !open);
          setHelpMessage("");
        }}
        aria-expanded={isOpen}
        aria-haspopup="menu"
        aria-label={`Account menu for ${user.name || user.email || "your account"}`}
      >
        <span className="profile-avatar">
          {(user.name || user.email || "U").charAt(0).toUpperCase()}
        </span>
        <span className="profile-copy">
          <strong>{user.name || "Your account"}</strong>
          <span>Go</span>
        </span>
        <WorkspaceIcon name="chevron" size={16} className="profile-trigger-chevron" />
      </button>
    </div>
  );
}
