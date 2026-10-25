import { useEffect, useLayoutEffect, useRef, useState } from "react";
import WorkspaceIcon from "./WorkspaceIcon";

export default function ActionDropdown({
  items,
  label = "Open actions",
  className = "",
}) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);
  const triggerRef = useRef(null);

  useLayoutEffect(() => {
    if (!isOpen) return;
    const trigger = triggerRef.current;
    const menu = menuRef.current?.querySelector(".action-dropdown-menu");
    if (!trigger || !menu) return;

    const triggerRect = trigger.getBoundingClientRect();
    const menuRect = menu.getBoundingClientRect();
    const margin = 10;
    const openBelow =
      triggerRect.bottom + menuRect.height + margin <= window.innerHeight;
    const top = openBelow
      ? triggerRect.bottom + 4
      : Math.max(margin, triggerRect.top - menuRect.height - 4);
    const left = Math.max(
      margin,
      Math.min(
        triggerRect.right - menuRect.width,
        window.innerWidth - menuRect.width - margin,
      ),
    );

    menu.style.top = `${top}px`;
    menu.style.left = `${left}px`;
    menu.style.visibility = "visible";
  }, [isOpen, items.length]);

  useEffect(() => {
    if (!isOpen) return undefined;

    const closeOnOutsideClick = (event) => {
      if (!menuRef.current?.contains(event.target)) setIsOpen(false);
    };
    const closeOnEscape = (event) => {
      if (event.key === "Escape") {
        setIsOpen(false);
        triggerRef.current?.focus();
      }
    };
    const closeOnScroll = () => setIsOpen(false);

    document.addEventListener("pointerdown", closeOnOutsideClick);
    document.addEventListener("keydown", closeOnEscape);
    document.addEventListener("scroll", closeOnScroll, true);
    window.addEventListener("resize", closeOnScroll);
    return () => {
      document.removeEventListener("pointerdown", closeOnOutsideClick);
      document.removeEventListener("keydown", closeOnEscape);
      document.removeEventListener("scroll", closeOnScroll, true);
      window.removeEventListener("resize", closeOnScroll);
    };
  }, [isOpen]);

  return (
    <div className={`action-dropdown ${className}`} ref={menuRef}>
      <button
        ref={triggerRef}
        type="button"
        className={`conversation-action-trigger ${isOpen ? "is-open" : ""}`}
        aria-label={label}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((open) => !open)}
      >
        <WorkspaceIcon name="dots" size={17} />
      </button>
      {isOpen && (
        <div
          className="action-dropdown-menu"
          role="menu"
        >
          {items.map((item) => (
            <div className="action-dropdown-entry" key={item.title}>
              {item.dividerBefore && <div className="action-dropdown-divider" />}
              <button
                type="button"
                role="menuitem"
                className={`action-dropdown-item ${item.destructive ? "is-destructive" : ""}`}
                disabled={item.disabled}
                onClick={() => {
                  setIsOpen(false);
                  item.onClick();
                }}
              >
                {item.icon && <WorkspaceIcon name={item.icon} size={17} />}
                <span>{item.title}</span>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
