import WorkspaceIcon from "./WorkspaceIcon";

const previewLines = [
  <><span className="code-purple">import</span> {"{ useState }"} <span className="code-purple">from</span> <span className="code-green">'react'</span></>,
  "",
  <><span className="code-purple">export default function</span> <span className="code-blue">Workspace</span>() {"{"}</>,
  <>{"  "}<span className="code-purple">const</span> [active, setActive] = <span className="code-blue">useState</span>(<span className="code-green">'chat'</span>)</>,
  "",
  <>{"  "}<span className="code-purple">return</span> (</>,
  <>{"    "}&lt;<span className="code-blue">main</span> <span className="code-orange">className</span>=<span className="code-green">"workspace"</span>&gt;</>,
  <>{"      "}&lt;<span className="code-blue">ConversationSidebar</span> /&gt;</>,
  <>{"      "}&lt;<span className="code-blue">ConversationPanel</span> /&gt;</>,
  <>{"      "}&lt;<span className="code-blue">ArtifactPanel</span> /&gt;</>,
  <>{"    "}&lt;/<span className="code-blue">main</span>&gt;</>,
  <>{"  "})</>,
  <>{"}"}</>,
];

export default function ArtifactPanel({ isOpen, onClose, onToggle }) {
  return (
    <aside
      className={`artifact-panel ${isOpen ? "is-open" : ""}`}
      aria-label="Artifacts"
    >
      <header className="artifact-header">
        <div className="artifact-header-title">
          <button
            type="button"
            className="icon-button artifact-mobile-close"
            onClick={onClose}
            aria-label="Close artifacts"
          >
            <WorkspaceIcon name="close" />
          </button>
          <span className="artifact-heading-icon">
            <WorkspaceIcon name="code" size={16} />
          </span>
          <h2>Artifacts</h2>
        </div>
        <button
          type="button"
          className="icon-button artifact-desktop-toggle"
          onClick={onToggle}
          aria-label="Toggle artifacts panel"
          aria-pressed={isOpen}
        >
          <WorkspaceIcon name="sidebar" size={17} />
        </button>
      </header>

      <div className="artifact-content">
        <div className="artifact-section-label">
          <span>PROJECT FILES</span>
          <button type="button" className="icon-button" aria-label="Add project file">
            <WorkspaceIcon name="add" size={16} />
          </button>
        </div>
        <button type="button" className="artifact-file is-current">
          <WorkspaceIcon name="code" size={16} />
          <span>Workspace.jsx</span>
          <span className="file-status" aria-label="Saved">
            <WorkspaceIcon name="check" size={13} />
          </span>
        </button>
        <button type="button" className="artifact-file">
          <WorkspaceIcon name="file" size={16} />
          <span>Getting started</span>
        </button>

        <div className="artifact-preview-heading">
          <div>
            <h3>Workspace.jsx</h3>
            <span>Code preview</span>
          </div>
          <button
            type="button"
            className="icon-button"
            aria-label="More file options"
          >
            <WorkspaceIcon name="dots" size={17} />
          </button>
        </div>
        <div className="code-preview" aria-label="Workspace code preview">
          <div className="code-window-bar">
            <span />
            <span />
            <span />
            <span className="code-language">JSX</span>
          </div>
          <pre>
            <code>
              {previewLines.map((line, index) => (
                <span className="code-line" key={index}>
                  <span className="code-line-number">{index + 1}</span>
                  <span>{line}</span>
                </span>
              ))}
            </code>
          </pre>
        </div>
        <div className="artifact-tip">
          <span className="artifact-tip-icon">
            <WorkspaceIcon name="sparkle" size={15} />
          </span>
          <p>
            Files created in your conversation will show up here, ready to
            preview.
          </p>
        </div>
      </div>
      <button
        type="button"
        className="artifact-mobile-chat"
        onClick={onClose}
      >
        <WorkspaceIcon name="message" size={17} />
        Back to conversation
      </button>
    </aside>
  );
}
