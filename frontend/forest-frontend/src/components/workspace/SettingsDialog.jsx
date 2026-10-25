import { useEffect, useRef, useState } from "react";
import WorkspaceIcon from "./WorkspaceIcon";

const sections = [
  { id: "appearance", label: "Appearance", icon: "sun" },
  { id: "plans", label: "Plans", icon: "plan" },
  { id: "general", label: "General", icon: "settings" },
  { id: "data", label: "Data controls", icon: "shield" },
  { id: "account", label: "Account", icon: "profile" },
];

const plans = [
  {
    name: "Go",
    description: "Your current Forest workspace.",
    price: "Free",
    features: ["Forest conversations", "Recent chats", "Workspace access"],
  },
  {
    name: "Pro",
    description: "An expanded workspace.",
    price: "Upgrade",
    features: ["More workspace capacity", "More room for projects", "Additional features"],
  },
  {
    name: "Pro Max",
    description: "The complete Forest experience.",
    price: "Upgrade",
    features: ["Expanded workspace", "Advanced capabilities", "Additional features"],
  },
];

function Toggle({ checked, onChange, label, description, icon }) {
  return (
    <div className="setting-row">
      <span className="setting-row-icon">
        <WorkspaceIcon name={icon} size={17} />
      </span>
      <span className="setting-row-copy">
        <strong>{label}</strong>
        <span>{description}</span>
      </span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        className={`setting-switch ${checked ? "is-on" : ""}`}
        onClick={() => onChange(!checked)}
      >
        <span />
      </button>
    </div>
  );
}

function SectionHeading({ title, description }) {
  return (
    <div className="settings-section-heading">
      <h2>{title}</h2>
      <p>{description}</p>
    </div>
  );
}

function AppearanceSection({
  theme,
  onThemeChange,
  eyeProtection,
  onEyeProtectionChange,
}) {
  return (
    <>
      <SectionHeading
        title="Appearance"
        description="Make Forest feel comfortable, day or night."
      />
      <div className="settings-block">
        <h3>Theme</h3>
        <div className="theme-options" role="group" aria-label="Theme">
          {[
            { id: "light", label: "Light", icon: "sun" },
            { id: "dark", label: "Dark", icon: "moon" },
          ].map((option) => (
            <button
              type="button"
              className={`theme-option ${theme === option.id ? "is-selected" : ""}`}
              key={option.id}
              onClick={() => onThemeChange(option.id)}
              aria-pressed={theme === option.id}
            >
              <span className={`theme-preview theme-preview-${option.id}`}>
                <span />
                <span />
                <span />
              </span>
              <span className="theme-option-label">
                <WorkspaceIcon name={option.icon} size={15} />
                {option.label}
              </span>
              {theme === option.id && (
                <WorkspaceIcon name="check" size={15} className="theme-check" />
              )}
            </button>
          ))}
        </div>
      </div>
      <div className="settings-block settings-block-separated">
        <Toggle
          checked={eyeProtection}
          onChange={onEyeProtectionChange}
          icon="eye"
          label="Eye protection"
          description="Soften bright colors for a gentler reading experience."
        />
      </div>
    </>
  );
}

function PlansSection({ onRequestPlan, notice }) {
  return (
    <>
      <SectionHeading
        title="Choose your plan"
        description="Pick the amount of room you need for your ideas."
      />
      <div className="plan-cards">
        {plans.map((plan) => (
          <article
            className={`plan-card ${plan.name === "Go" ? "is-current-plan" : ""} ${plan.name === "Pro" ? "is-featured-plan" : ""}`}
            key={plan.name}
          >
            {plan.name === "Pro" && <span className="plan-popular">POPULAR</span>}
            <div className="plan-card-top">
              <span className="plan-icon">
                <WorkspaceIcon name="plan" size={18} />
              </span>
              {plan.name === "Go" && <span className="plan-current-label">CURRENT</span>}
            </div>
            <h3>{plan.name}</h3>
            <p className="plan-description">{plan.description}</p>
            <p className="plan-price">
              {plan.price}
              {plan.price !== "Free" && <span> coming soon</span>}
            </p>
            <ul>
              {plan.features.map((feature) => (
                <li key={feature}>
                  <WorkspaceIcon name="check" size={14} />
                  {feature}
                </li>
              ))}
            </ul>
            <button
              type="button"
              className={`plan-action ${plan.name === "Pro" ? "plan-action-primary" : ""}`}
              disabled={plan.name === "Go"}
              onClick={() => onRequestPlan(plan.name)}
            >
              {plan.name === "Go" ? "Current plan" : `Choose ${plan.name}`}
            </button>
          </article>
        ))}
      </div>
      <p className="settings-inline-note" role="status">
        {notice || "Plan changes will be available when billing is connected."}
      </p>
    </>
  );
}

function GeneralSection({ language, onLanguageChange }) {
  return (
    <>
      <SectionHeading
        title="General settings"
        description="Choose a language preference for your workspace."
      />
      <div className="settings-block">
        <label className="setting-select-label" htmlFor="workspace-language">
          <span className="setting-row-icon">
            <WorkspaceIcon name="language" size={17} />
          </span>
          <span className="setting-row-copy">
            <strong>Language</strong>
            <span>Choose the language used in the workspace.</span>
          </span>
          <select
            id="workspace-language"
            value={language}
            onChange={(event) => onLanguageChange(event.target.value)}
          >
            <option value="en">English</option>
            <option value="es">Español</option>
            <option value="fr">Français</option>
            <option value="de">Deutsch</option>
            <option value="hi">हिन्दी</option>
            <option value="ja">日本語</option>
          </select>
        </label>
      </div>
    </>
  );
}

function DataSection({
  locationEnabled,
  onLocationChange,
  archivedConversations,
  onRestoreConversation,
  onDeleteArchived,
  onArchiveAll,
  onRequestDeleteAll,
  onExportData,
  notice,
}) {
  return (
    <>
      <SectionHeading
        title="Data controls"
        description="Manage your conversations and the data you share."
      />
      <div className="settings-block settings-block-separated">
        <Toggle
          checked={locationEnabled}
          onChange={onLocationChange}
          icon="location"
          label="Location"
          description="Set your location preference for Forest."
        />
      </div>
      <div className="settings-block settings-block-separated">
        <div className="setting-row setting-row-static">
          <span className="setting-row-icon">
            <WorkspaceIcon name="archive" size={17} />
          </span>
          <span className="setting-row-copy">
            <strong>Archived chats</strong>
            <span>
              {archivedConversations.length
                ? `${archivedConversations.length} conversation${archivedConversations.length === 1 ? "" : "s"} archived`
                : "No conversations are archived."}
            </span>
          </span>
          {archivedConversations.length > 0 && (
            <button
              type="button"
              className="settings-text-button"
              onClick={onDeleteArchived}
            >
              Clear
            </button>
          )}
        </div>
        {archivedConversations.length > 0 && (
          <div className="archived-chat-list">
            {archivedConversations.map((conversation) => (
              <div className="archived-chat-item" key={conversation.id}>
                <span>{conversation.title}</span>
                <button
                  type="button"
                  onClick={() => onRestoreConversation(conversation.id)}
                >
                  Restore
                </button>
              </div>
            ))}
          </div>
        )}
        <button type="button" className="settings-secondary-action" onClick={onArchiveAll}>
          <WorkspaceIcon name="archive" size={15} />
          Archive all conversations
        </button>
      </div>
      <div className="settings-block settings-block-separated">
        <div className="setting-row setting-row-static">
          <span className="setting-row-icon">
            <WorkspaceIcon name="download" size={17} />
          </span>
          <span className="setting-row-copy">
            <strong>Export data</strong>
            <span>Download a copy of your workspace conversations.</span>
          </span>
          <button
            type="button"
            className="settings-secondary-action compact-action"
            onClick={onExportData}
          >
            Export
          </button>
        </div>
      </div>
      <div className="settings-block settings-danger-block">
        <div className="setting-row setting-row-static">
          <span className="setting-row-icon danger-icon">
            <WorkspaceIcon name="trash" size={17} />
          </span>
          <span className="setting-row-copy">
            <strong>Delete all conversations</strong>
            <span>This will remove all conversations in this workspace.</span>
          </span>
          <button
            type="button"
            className="settings-danger-action"
            onClick={onRequestDeleteAll}
          >
            Delete all
          </button>
        </div>
      </div>
      {notice && <p className="settings-inline-note" role="status">{notice}</p>}
    </>
  );
}

function AccountSection({ user, onAccountAction }) {
  const [name, setName] = useState(user.name || "");
  const [email, setEmail] = useState(user.email || "");
  const [password, setPassword] = useState("");
  const [notice, setNotice] = useState("");

  const handleAction = (action) => {
    setNotice(onAccountAction(action));
    if (action === "password") setPassword("");
  };

  return (
    <>
      <SectionHeading
        title="Account settings"
        description="Manage your profile and sign-in details."
      />
      <form
        className="account-settings-form"
        onSubmit={(event) => {
          event.preventDefault();
          handleAction("profile");
        }}
      >
        <label>
          <span>Name</span>
          <input
            type="text"
            autoComplete="name"
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
        </label>
        <label>
          <span>Email address</span>
          <input
            type="email"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </label>
        <div className="account-action-row">
          <span>Update your name or email address.</span>
          <button type="submit" className="settings-primary-action">
            Save changes
          </button>
        </div>
      </form>
      <div className="settings-block settings-block-separated">
        <div className="account-password-heading">
          <span className="setting-row-icon">
            <WorkspaceIcon name="lock" size={17} />
          </span>
          <span className="setting-row-copy">
            <strong>Change password</strong>
            <span>Choose a new password for your account.</span>
          </span>
        </div>
        <div className="password-change-row">
          <input
            type="password"
            autoComplete="new-password"
            placeholder="New password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
          <button
            type="button"
            className="settings-secondary-action"
            onClick={() => handleAction("password")}
            disabled={!password}
          >
            Update password
          </button>
        </div>
      </div>
      <div className="settings-block settings-block-separated">
        <div className="setting-row setting-row-static">
          <span className="setting-row-icon danger-icon">
            <WorkspaceIcon name="trash" size={17} />
          </span>
          <span className="setting-row-copy">
            <strong>Delete account</strong>
            <span>Permanently remove your account and associated data.</span>
          </span>
          <button
            type="button"
            className="settings-danger-action"
            onClick={() => handleAction("delete")}
          >
            Delete account
          </button>
        </div>
      </div>
      {notice && <p className="settings-inline-note" role="status">{notice}</p>}
    </>
  );
}

export default function SettingsDialog({
  initialSection,
  onClose,
  theme,
  onThemeChange,
  eyeProtection,
  onEyeProtectionChange,
  language,
  onLanguageChange,
  locationEnabled,
  onLocationChange,
  conversations,
  onRestoreConversation,
  onDeleteArchived,
  onArchiveAll,
  onDeleteAll,
  onExportData,
  user,
  onAccountAction,
}) {
  const [section, setSection] = useState(initialSection);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [dataNotice, setDataNotice] = useState("");
  const [planNotice, setPlanNotice] = useState("");
  const closeButtonRef = useRef(null);
  const cancelDeleteButtonRef = useRef(null);
  const showDeleteConfirmationRef = useRef(showDeleteConfirmation);
  const archivedConversations = conversations.filter((conversation) => conversation.archived);

  useEffect(() => {
    closeButtonRef.current?.focus();
    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        if (showDeleteConfirmationRef.current) {
          setShowDeleteConfirmation(false);
        } else {
          onClose();
        }
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  useEffect(() => {
    showDeleteConfirmationRef.current = showDeleteConfirmation;
    if (showDeleteConfirmation) cancelDeleteButtonRef.current?.focus();
  }, [showDeleteConfirmation]);

  const renderSection = () => {
    switch (section) {
      case "appearance":
        return (
          <AppearanceSection
            theme={theme}
            onThemeChange={onThemeChange}
            eyeProtection={eyeProtection}
            onEyeProtectionChange={onEyeProtectionChange}
          />
        );
      case "plans":
        return (
          <PlansSection
            onRequestPlan={(plan) =>
              setPlanNotice(`${plan} plan selection requires billing setup.`)
            }
            notice={planNotice}
          />
        );
      case "data":
        return (
          <DataSection
            locationEnabled={locationEnabled}
            onLocationChange={onLocationChange}
            archivedConversations={archivedConversations}
            onRestoreConversation={onRestoreConversation}
            onDeleteArchived={onDeleteArchived}
            onArchiveAll={() => {
              onArchiveAll();
              setDataNotice("All conversations have been archived.");
            }}
            onRequestDeleteAll={() => setShowDeleteConfirmation(true)}
            onExportData={onExportData}
            notice={dataNotice}
          />
        );
      case "account":
        return <AccountSection user={user} onAccountAction={onAccountAction} />;
      case "general":
      default:
        return <GeneralSection language={language} onLanguageChange={onLanguageChange} />;
    }
  };

  return (
    <div className="settings-backdrop" onMouseDown={(event) => {
      if (event.target === event.currentTarget) onClose();
    }}>
      <section
        className="settings-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="settings-title"
      >
        <header className="settings-dialog-header">
          <div>
            <span className="settings-dialog-kicker">YOUR WORKSPACE</span>
            <h1 id="settings-title">Settings</h1>
          </div>
          <button
            ref={closeButtonRef}
            type="button"
            className="icon-button settings-close-button"
            onClick={onClose}
            aria-label="Close settings"
          >
            <WorkspaceIcon name="close" />
          </button>
        </header>
        <div className="settings-dialog-body">
          <nav className="settings-navigation" aria-label="Settings sections">
            {sections.map((item) => (
              <button
                type="button"
                key={item.id}
                className={`settings-nav-item ${section === item.id ? "is-active" : ""}`}
                onClick={() => {
                  setSection(item.id);
                  setDataNotice("");
                }}
                aria-current={section === item.id ? "page" : undefined}
              >
                <WorkspaceIcon name={item.icon} size={17} />
                <span>{item.label}</span>
                <WorkspaceIcon name="chevron" size={14} className="settings-nav-chevron" />
              </button>
            ))}
          </nav>
          <div className="settings-content" key={section}>
            {renderSection()}
          </div>
        </div>
      </section>
      {showDeleteConfirmation && (
        <div className="settings-confirm-backdrop">
          <section
            className="settings-confirm-dialog"
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="delete-confirm-title"
            aria-describedby="delete-confirm-description"
          >
            <span className="settings-confirm-icon">
              <WorkspaceIcon name="trash" size={20} />
            </span>
            <h2 id="delete-confirm-title">Delete all conversations?</h2>
            <p id="delete-confirm-description">
              This removes every conversation from this workspace. This action
              cannot be undone.
            </p>
            <div className="settings-confirm-actions">
              <button
                type="button"
                ref={cancelDeleteButtonRef}
                className="settings-secondary-action"
                onClick={() => setShowDeleteConfirmation(false)}
              >
                Keep conversations
              </button>
              <button
                type="button"
                className="settings-danger-action"
                onClick={() => {
                  onDeleteAll();
                  setShowDeleteConfirmation(false);
                  setDataNotice("All conversations have been deleted.");
                }}
              >
                Delete all
              </button>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
