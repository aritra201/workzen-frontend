import { useId, useState } from 'react';
import Icon from './Icon.jsx';
import { useAccordionGroup } from './AccordionGroup.jsx';

/**
 * Expandable panel — header toggles body visibility.
 * With AccordionGroup + accordionId, only one section in the group stays open.
 */
export default function AccordionSection({
  accordionId,
  title,
  subtitle,
  trailing,
  headerActions,
  defaultOpen = false,
  className = '',
  panelClassName = '',
  children,
}) {
  const group = useAccordionGroup();
  const [localOpen, setLocalOpen] = useState(defaultOpen);
  const inGroup = group != null && accordionId != null;
  const open = inGroup ? group.isOpen(accordionId) : localOpen;

  function handleToggle() {
    if (inGroup) {
      group.toggle(accordionId);
    } else {
      setLocalOpen((value) => !value);
    }
  }

  const baseId = useId();
  const headerId = `${baseId}-header`;
  const panelId = `${baseId}-panel`;

  return (
    <section
      className={`overflow-hidden rounded-xl bg-surface-container-lowest shadow-card ${className}`}
    >
      <div className="flex items-stretch gap-1 sm:gap-2">
        <button
          type="button"
          id={headerId}
          aria-expanded={open}
          aria-controls={panelId}
          className="flex min-w-0 flex-1 items-center gap-3 p-3 text-left transition-colors hover:bg-surface-container-low/60"
          onClick={handleToggle}
        >
          <span
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-surface-container-low text-on-surface-variant"
            aria-hidden
          >
            <Icon name={open ? 'expand_less' : 'expand_more'} size={22} />
          </span>
          <span className="min-w-0 flex-1">
            {title ? <div className="font-semibold text-on-surface">{title}</div> : null}
            {subtitle ? (
              <p className="mt-0.5 text-xs text-on-surface-variant">{subtitle}</p>
            ) : null}
          </span>
          {trailing ? <span className="shrink-0">{trailing}</span> : null}
        </button>
        {headerActions ? (
          <div className="flex shrink-0 items-center gap-2 self-center pr-3">{headerActions}</div>
        ) : null}
      </div>
      <div
        id={panelId}
        role="region"
        aria-labelledby={headerId}
        hidden={!open}
        className={open ? `border-t border-outline-variant/30 ${panelClassName}` : 'hidden'}
      >
        {children}
      </div>
    </section>
  );
}
