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

Object.assign(window, { PromptCard, BottomSheet });
