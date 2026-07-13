// Reusable UI components for the Paigham Noor design system
// Exposed globally on `window` for screens and storyboards.

function PromptCard({
  variant = 'warning', // 'error' | 'warning' | 'success'
  title,
  description,
  primaryActionText,
  onPrimaryAction,
  onDismiss,
  style = {}
}) {
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
      
      {primaryActionText && onPrimaryAction && (
        <button className="btn btn-filled" onClick={onPrimaryAction} style={{ width: '100%', marginTop: 18 }}>{primaryActionText}</button>
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

Object.assign(window, { PromptCard, BottomSheet, Dialog });
