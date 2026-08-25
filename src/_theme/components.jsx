// Reusable UI components for the Paigham Noor design system
// Exposed globally on `window` for screens and storyboards.

function PromptCard({
  variant = 'warning', // 'error' | 'warning' | 'success'
  title,
  description,
  primaryActionText,
  primaryActionIcon,   // optional leading icon name (e.g. 'mosque'), mirrors PromptCard.kt primaryActionIcon
  onPrimaryAction,
  onDismiss,
  style = {}
}) {
  // Prop-less mounts (the loader `<x-import hint-size="0,0">` pattern that
  // pulls this file into scope) must not paint an empty card shell.
  if (!title && !description) return null;

  let gradientScheme = 'var(--gradient-tangerine)';
  let titleColor = 'var(--color-info-primary)';
  let borderColor = 'color-mix(in oklab, var(--color-action-secondary) 25%, transparent)';
  
  if (variant === 'error') {
    gradientScheme = 'var(--gradient-coral)';
    titleColor = 'var(--color-status-error)';
    borderColor = 'color-mix(in oklab, var(--color-status-error) 25%, transparent)';
  } else if (variant === 'success') {
    gradientScheme = 'var(--gradient-emerald)';
    titleColor = 'var(--color-status-success)';
    borderColor = 'color-mix(in oklab, var(--color-status-success) 25%, transparent)';
  }
  
  return (
    <div style={{
      background: `${gradientScheme}, var(--color-surface-card)`,
      border: `1.5px solid ${borderColor}`,
      borderRadius: 24,
      padding: 20,
      position: 'relative',
      boxSizing: 'border-box',
      ...style
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
        <div style={{
          fontFamily: 'var(--font-body)',
          fontSize: 18,
          fontWeight: 700,
          color: titleColor,
          lineHeight: 1.25
        }}>{title}</div>
        
        {onDismiss && (
          <div onClick={onDismiss} style={{
            width: 24,
            height: 24,
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            flexShrink: 0
          }}>
            <span className="mi" style={{ fontSize: 16, color: 'var(--color-info-primary)' }} data-i="close"></span>
          </div>
        )}
      </div>
      
      <div style={{
        fontFamily: 'var(--font-body)',
        fontSize: 13,
        color: 'var(--color-info-primary)',
        marginTop: 6,
        lineHeight: 1.45
      }}>{description}</div>
      
      {primaryActionText && (
        <button
          className="btn btn-filled"
          onClick={onPrimaryAction}
          style={{
            width: '100%',
            marginTop: 18,
            // Warning variant uses a contained status-warning button (PromptCard.kt: TonalButton
            // Contained, Noor.colors.status.warning); error/success keep the filled primary.
            ...(variant === 'warning' ? {
              background: 'var(--color-status-warning)',
              boxShadow: '0 8px 20px -8px color-mix(in oklab, var(--color-status-warning) 60%, transparent)'
            } : {})
          }}
        >
          {primaryActionIcon && <span className="mi fill" style={{ fontSize: 18 }} data-i={primaryActionIcon}></span>}
          {primaryActionText}
        </button>
      )}
    </div>
  );
}

function BottomSheet({
  isOpen,
  onClose,
  bottomOffset = 80,
  children
}) {
  if (!isOpen) return null;
  
  return (
    <div 
      onClick={onClose}
      onWheel={(e) => { e.stopPropagation(); e.preventDefault(); }}
      onTouchMove={(e) => { e.stopPropagation(); e.preventDefault(); }}
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: bottomOffset,
        background: 'rgba(0, 0, 0, 0.4)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        zIndex: 100,
        display: 'flex',
        alignItems: 'flex-end',
        animation: 'fadeIn 200ms ease-out'
      }}
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        onWheel={(e) => e.stopPropagation()}
        onTouchMove={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          background: 'rgba(22, 22, 22, 0.96)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '32px 32px 0 0',
          padding: '8px 0 0',
          boxSizing: 'border-box',
          maxHeight: '90%',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {/* Notch/Handle */}
        <div style={{
          width: 36,
          height: 4,
          background: 'rgba(255, 255, 255, 0.2)',
          borderRadius: 2,
          margin: '8px auto 16px',
          flexShrink: 0
        }} />
        
        {children}
      </div>
    </div>
  );
}

// ── Dialog — ONE component for alerts + sheets ──
// Mirrors NoorUI AlertDialog + SheetDialog (dialog/AlertDialog.kt, dialog/SheetDialog.kt):
// same body (TitleH2 + BodyMedium + optional content + primary(Filled)/secondary(Tonal) row)
// and the same AlertAction { text, onClick } API. `mode` picks the surface:
//   'alert' → centred modal card (all corners rounded)
//   'sheet' → bottom sheet (top-rounded + drag handle)
// Styling is the .dlg / .dlg-scrim kit in components.css. Keep it mounted and toggle `isOpen`.
// Actions follow the Kotlin `AlertAction?` contract: omit (undefined) to get the Ok / Cancel
// default, pass `null` to render NO button on that side (a sheet whose actions live in its
// body, or a single-action dismiss). `destructive` promotes the primary to DestructiveButton
// for irreversible actions (delete, remove, reject).
function Dialog({
  mode = 'alert',            // 'alert' | 'sheet'
  isOpen,
  onClose,
  title,
  description,
  primary,                   // { text, onClick } | null
  secondary,                 // { text, onClick } | null
  destructive = false,       // primary uses the destructive fill
  children,                  // optional content slot
  cornerClose,               // optional () => void — floating close button pinned to the sheet's top-right corner
  dismissOnScrim = true,
  className = ''             // extra class on the scrim, for presets that restyle the shell (.opt-sheet)
}) {
  if (!isOpen) return null;
  const isSheet = mode === 'sheet';
  const prim = primary === null ? null : (primary || { text: 'Ok', onClick: onClose });
  const sec = secondary === null
    ? null
    : (secondary || (primary ? null : { text: 'Cancel', onClick: onClose }));

  return (
    <div
      className={`dlg-scrim ${isSheet ? 'sheet' : ''} ${className}`.trim()}
      onClick={dismissOnScrim ? onClose : undefined}
      onWheel={(e) => e.stopPropagation()}
      onTouchMove={(e) => e.stopPropagation()}
    >
      <div className="dlg" onClick={(e) => e.stopPropagation()}>
        {cornerClose && (
          <button className="ib ib-tonal primary sm dlg-close" onClick={cornerClose} aria-label="Close">
            <span className="mi" data-i="close"></span>
          </button>
        )}
        {isSheet && <div className="dlg-handle" />}
        {title && <div className="dlg-title">{title}</div>}
        {description && <div className="dlg-desc">{description}</div>}
        {children ? <div className="dlg-body">{children}</div> : null}
        {(prim || sec) && (
          // Action order is platform convention, owned here so every alert and sheet in the
          // system inherits it: the dismissing action sits on the LEFT and the affirmative on
          // the RIGHT, matching UIAlertController and Material. Do not reorder per screen — a
          // destructive primary landing where Cancel normally sits is how mis-taps happen.
          <div className="dlg-actions">
            {sec && <button className="btn lg btn-tonal" onClick={sec.onClick}>{sec.text}</button>}
            {prim && <button className={`btn lg ${destructive ? 'btn-destructive' : 'btn-filled'}`} onClick={prim.onClick}>{prim.text}</button>}
          </div>
        )}
      </div>
    </div>
  );
}

// ── PickerField — the read-only field that opens a picker ──
// The tap target for a choice made elsewhere. It states the current value (or a placeholder)
// and carries the chevron that says the value can be changed; a bare read-only field reads as
// a value someone else set, with no way in. Pair it with OptionSheet.
function PickerField({ value, placeholder = 'Select', error, disabled, onOpen, ariaLabel }) {
  const filled = value !== undefined && value !== null && value !== '';
  return (
    <button
      type="button"
      className={`picker-field ${error ? 'error' : ''}`}
      aria-haspopup="dialog"
      aria-label={ariaLabel}
      disabled={disabled}
      onClick={() => !disabled && onOpen && onOpen()}
    >
      <span className={filled ? 'picker-field-value' : 'picker-field-placeholder'}>{filled ? value : placeholder}</span>
      <span className="mi" data-i="expand_more" aria-hidden="true"></span>
    </button>
  );
}

// ── OptionSheet — the app's ONE single-choice picker ──
// Mirrors the Compose OptionSheetField: a PickerField opens this sheet, every option is a
// bordered row with a radio mark, and picking one commits and closes. Built on the Dialog
// sheet with both action slots explicitly null — the rows ARE the affirmative, so a button
// row underneath would be a second way to do the thing that just happened.
//   options: [{ value, label }] · `value` is the current one · onPick(value)
function OptionSheet({ isOpen, onClose, title, options = [], value, onPick }) {
  const list = React.useRef(null);
  // Open ON the chosen row. A list long enough to scroll — every Indian state, every committee
  // role — that starts at the top makes the reader hunt for the value the field is already
  // showing them. The list's own scrollTop is moved rather than scrollIntoView(): this sheet is
  // mounted inside a scrolling screen body, and scrollIntoView walks up and scrolls that too.
  React.useEffect(() => {
    const box = list.current;
    if (!isOpen || !box) return;
    const chosen = box.querySelector('.opt-row.selected');
    if (!chosen) return;
    const boxRect = box.getBoundingClientRect();
    const rowRect = chosen.getBoundingClientRect();
    box.scrollTop += (rowRect.top - boxRect.top) - (boxRect.height - rowRect.height) / 2;
  }, [isOpen]);

  return (
    <Dialog
      mode="sheet"
      className="opt-sheet"
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      primary={null}
      secondary={null}
    >
      <div className="opt-list" role="listbox" aria-label={title} ref={list}>
        {options.map((option) => {
          const selected = String(option.value) === String(value);
          return (
            <button
              key={String(option.value)}
              type="button"
              role="option"
              aria-selected={selected}
              className={`opt-row ${selected ? 'selected' : ''}`}
              onClick={() => { if (onPick) onPick(option.value); if (onClose) onClose(); }}
            >
              <span>{option.label}</span>
              <span className="opt-row-mark">
                <span className="mi" data-i={selected ? 'radio_button_checked' : 'radio_button_unchecked'} aria-hidden="true"></span>
              </span>
            </button>
          );
        })}
      </div>
    </Dialog>
  );
}

// ── RichNudgeSheet — one-time nudge bottom sheet ──
// Mirrors NoorUI RichNudgeSheetContent.kt: illustration header, brand serif title +
// description, a "What you get" benefit list, a floating corner close, and a
// primary/secondary action row. Built on the Dialog sheet. Feature-specific presets
// (follow-masjid, notification) supply the illustration/title/benefits/copy.
//   benefits: [{ icon, title, caption }]  ·  header is either `illustration` (image URL) or
//   `icon` (a glyph in a tinted circle, e.g. the ATT pre-prompt) · showClose toggles the corner ×.
function RichNudgeSheet({ isOpen, onClose, illustration, icon, title, description, benefits = [], primaryText, onPrimary, secondaryText = 'Not now', showClose = true }) {
  return (
    <Dialog
      mode="sheet"
      isOpen={isOpen}
      onClose={onClose}
      cornerClose={showClose ? onClose : undefined}
      primary={{ text: primaryText, onClick: onPrimary }}
      secondary={{ text: secondaryText, onClick: onClose }}
    >
      <div>
        {/* Header — illustration image, or an icon in a tinted circle */}
        {illustration ? (
          <img src={illustration} style={{ display: 'block', width: 180, maxWidth: '62%', margin: '8px auto 16px' }} />
        ) : icon ? (
          <div style={{ width: 88, height: 88, borderRadius: '50%', background: 'color-mix(in oklab, var(--color-action-primary) 10%, transparent)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '8px auto 16px' }}>
            <span className="mi" style={{ fontSize: 44, color: 'var(--color-action-primary)' }} data-i={icon}></span>
          </div>
        ) : null}

        {/* Brand serif title + description (centered) */}
        <div style={{ fontFamily: 'var(--font-title)', fontSize: 26, color: 'var(--color-neutral-brand)', textAlign: 'center', lineHeight: 1.2 }}>{title}</div>
        <div style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--color-info-secondary)', textAlign: 'center', margin: '8px 8px 20px', lineHeight: 1.45 }}>{description}</div>

        {/* What you get */}
        <div style={{ fontFamily: 'var(--font-title)', fontSize: 20, color: 'var(--color-info-primary)', marginBottom: 14 }}>What you get</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {benefits.map((b, i) => (
            <div key={i} style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
              <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'color-mix(in oklab, var(--color-action-primary) 12%, transparent)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <span className="mi" style={{ fontSize: 22, color: 'var(--color-action-primary)' }} data-i={b.icon}></span>
              </div>
              <div>
                <div style={{ fontFamily: 'var(--font-body)', fontSize: 16, fontWeight: 700, color: 'var(--color-info-primary)' }}>{b.title}</div>
                <div style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--color-info-secondary)', marginTop: 2, lineHeight: 1.4 }}>{b.caption}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Dialog>
  );
}

// ── EmptyState — quiet absence, a recoverable failure, or a finished outcome ──
// `tone` colours the icon well: 'neutral' (default) uses the action tint, 'error' the error
// tint, 'success' the success tint. `action` renders a Noor button underneath, so a screen
// never has to rebuild the empty/error/success trio itself:
//   <EmptyState tone="error" icon="error" title="Couldn't load posts"
//               description="Check your connection and try again."
//               action={{ text: 'Try again', onClick: retry }} />
const EMPTY_STATE_TONES = {
  neutral: { bg: 'color-mix(in oklab, var(--color-action-primary) 10%, transparent)', fg: 'var(--color-action-primary)' },
  error: { bg: 'color-mix(in oklab, var(--color-status-error) 12%, transparent)', fg: 'var(--color-status-error)' },
  success: { bg: 'color-mix(in oklab, var(--color-status-success) 14%, transparent)', fg: 'var(--color-status-success)' },
};

function EmptyState({
  icon, title, description, iconLabel, tone = 'neutral', action, titleStyle = {}, style = {},
}) {
  if (!title) return null;
  const palette = EMPTY_STATE_TONES[tone] || EMPTY_STATE_TONES.neutral;
  return (
    <div className="empty-state" role={tone === 'error' ? 'alert' : undefined} style={style}>
      <div
        className="empty-state-icon"
        aria-hidden={iconLabel ? undefined : true}
        aria-label={iconLabel}
        style={tone === 'neutral' ? undefined : { background: palette.bg, color: palette.fg }}
      >
        <span className="mi" data-i={icon || 'info'}></span>
      </div>
      <div className="empty-state-title" style={titleStyle}>{title}</div>
      {description ? <div className="empty-state-description">{description}</div> : null}
      {action ? (
        <div className="empty-state-action">
          <button className={`btn ${action.filled ? 'btn-filled' : 'btn-tonal'} lg`} onClick={action.onClick}>
            {action.icon ? <span className="mi" style={{ fontSize: 20 }} data-i={action.icon}></span> : null}
            {action.text}
          </button>
        </div>
      ) : null}
    </div>
  );
}

// ── Loader — the screen/section scale loading state (RevolvingLoader + label) ──
function Loader({ label, style = {} }) {
  return (
    <div style={{
      flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      gap: 14, padding: 32, ...style,
    }}>
      <span className="loader" aria-hidden="true"></span>
      {label ? <div style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--color-info-secondary)' }} role="status">{label}</div> : null}
    </div>
  );
}

// Generic settings / metadata row. This is deliberately separate from the
// numbered, content-specific ListRow used by Quran and chapter indexes.
function ListItem({
  icon,
  title,
  subtitle,
  value,
  destructive = false,
  showChevron = true,
  onClick,
  style = {}
}) {
  if (!title) return null;
  const Root = onClick ? 'button' : 'div';
  return (
    <Root
      className={`list-item${destructive ? ' destructive' : ''}${onClick ? ' actionable' : ''}`}
      onClick={onClick}
      type={onClick ? 'button' : undefined}
      style={style}
    >
      {icon ? <span className="mi list-item-leading" data-i={icon} aria-hidden="true"></span> : null}
      <span className="list-item-copy">
        <span className="list-item-title">{title}</span>
        {subtitle ? <span className="list-item-subtitle">{subtitle}</span> : null}
      </span>
      {value ? <span className="list-item-value">{value}</span> : null}
      {showChevron ? <span className="mi list-item-chevron" data-i="chevron_right" aria-hidden="true"></span> : null}
    </Root>
  );
}

function SearchBar({
  value = '',
  placeholder = 'Search',
  ariaLabel = 'Search',
  onChange,
  onClear,
  disabled = false,
  autoFocus = false,
  style = {}
}) {
  const clear = () => {
    if (onClear) onClear();
    else if (onChange) onChange('');
  };

  return (
    <div className={`search-bar${disabled ? ' disabled' : ''}`} style={style}>
      <div className="inner">
        <span className="mi search-bar-icon" data-i="search" aria-hidden="true"></span>
        <input
          className="search-bar-input"
          type="search"
          value={value}
          placeholder={placeholder}
          aria-label={ariaLabel}
          disabled={disabled}
          readOnly={!onChange}
          autoFocus={autoFocus}
          onInput={(event) => onChange && onChange(event.target.value)}
        />
        {value ? (
          <button className="search-bar-clear" type="button" onClick={clear} aria-label="Clear search">
            <span className="mi" data-i="close" aria-hidden="true"></span>
          </button>
        ) : null}
      </div>
    </div>
  );
}

Object.assign(window, { PromptCard, BottomSheet, Dialog, PickerField, OptionSheet, RichNudgeSheet, EmptyState, Loader, ListItem, SearchBar });
