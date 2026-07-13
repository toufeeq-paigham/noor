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
          fontFamily: '"Nunito", sans-serif',
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
        fontFamily: '"Nunito", sans-serif',
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
// When both actions are omitted it falls back to Ok + Cancel, exactly like the Kotlin.
function Dialog({
  mode = 'alert',            // 'alert' | 'sheet'
  isOpen,
  onClose,
  title,
  description,
  primary,                   // { text, onClick }
  secondary,                 // { text, onClick }
  children,                  // optional content slot
  cornerClose,               // optional () => void — floating close button pinned to the sheet's top-right corner
  dismissOnScrim = true
}) {
  if (!isOpen) return null;
  const isSheet = mode === 'sheet';
  const prim = primary || { text: 'Ok', onClick: onClose };
  const sec = secondary || (primary ? null : { text: 'Cancel', onClick: onClose });

  return (
    <div
      className={`dlg-scrim ${isSheet ? 'sheet' : ''}`}
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
          <div className="dlg-actions">
            {prim && <button className="btn btn-filled" onClick={prim.onClick}>{prim.text}</button>}
            {sec && <button className="btn btn-tonal" onClick={sec.onClick}>{sec.text}</button>}
          </div>
        )}
      </div>
    </div>
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
        <div style={{ fontFamily: '"Nunito", sans-serif', fontSize: 14, color: 'var(--color-info-secondary)', textAlign: 'center', margin: '8px 8px 20px', lineHeight: 1.45 }}>{description}</div>

        {/* What you get */}
        <div style={{ fontFamily: 'var(--font-title)', fontSize: 20, color: 'var(--color-info-primary)', marginBottom: 14 }}>What you get</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {benefits.map((b, i) => (
            <div key={i} style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
              <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'color-mix(in oklab, var(--color-action-primary) 12%, transparent)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <span className="mi" style={{ fontSize: 22, color: 'var(--color-action-primary)' }} data-i={b.icon}></span>
              </div>
              <div>
                <div style={{ fontFamily: '"Nunito", sans-serif', fontSize: 16, fontWeight: 700, color: 'var(--color-info-primary)' }}>{b.title}</div>
                <div style={{ fontFamily: '"Nunito", sans-serif', fontSize: 13, color: 'var(--color-info-secondary)', marginTop: 2, lineHeight: 1.4 }}>{b.caption}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Dialog>
  );
}

Object.assign(window, { PromptCard, BottomSheet, Dialog, RichNudgeSheet });
