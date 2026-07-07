// Shared screen components for the Onboarding flow.
// These are used both by the static storyboards (*-row.jsx) and the live interactive device (Onboarding.dc.html).

const KEYPAD_KEYS = [
  { label: '1', sub: '' },
  { label: '2', sub: 'ABC' },
  { label: '3', sub: 'DEF' },
  { label: '4', sub: 'GHI' },
  { label: '5', sub: 'JKL' },
  { label: '6', sub: 'MNO' },
  { label: '7', sub: 'PQRS' },
  { label: '8', sub: 'TUV' },
  { label: '9', sub: 'WXYZ' },
  { label: '', sub: '', isEmpty: true },
  { label: '0', sub: '' },
  { label: 'backspace', sub: '', isBackspace: true }
];

function Keypad({ onPress }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, paddingBottom: 30 }}>
      {KEYPAD_KEYS.map((k, i) => {
        if (k.isEmpty) {
          return <div key={i} style={{ height: 52, borderRadius: 12, background: 'transparent' }} />;
        }
        if (k.isBackspace) {
          return (
            <div
              key={i}
              className="kp-key"
              onClick={() => onPress && onPress('backspace')}
              style={{
                height: 52, borderRadius: 12, background: 'transparent',
                display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer'
              }}
            >
              <span className="material-symbols-rounded" style={{ fontSize: 22, color: 'var(--color-info-primary)' }}>
                backspace
              </span>
            </div>
          );
        }
        return (
          <div
            key={i}
            className="kp-key"
            onClick={() => onPress && onPress(k.label)}
            style={{
              height: 52, borderRadius: 12, background: 'var(--color-action-background)',
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', userSelect: 'none'
            }}
          >
            <span style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', lineHeight: 1 }}>
              <span style={{ fontFamily: '"Nunito", sans-serif', fontSize: 22, fontWeight: 600, color: 'var(--color-info-primary)' }}>
                {k.label}
              </span>
              <span style={{
                fontFamily: '"Nunito", sans-serif', fontSize: 9, fontWeight: 700,
                letterSpacing: '.12em', color: 'var(--color-info-secondary)', height: 10, marginTop: 2
              }}>
                {k.sub}
              </span>
            </span>
          </div>
        );
      })}
    </div>
  );
}

function IntroScreen({
  slide,
  showSkip = false,
  ctaLabel = "Next",
  activeDotIdx = 0,
  onSkip,
  onCta,
  onSelectDot
}) {
  const dots = [0, 1, 2].map((idx) => {
    const active = idx === activeDotIdx;
    return (
      <div
        key={idx}
        onClick={() => onSelectDot && onSelectDot(idx)}
        style={{ padding: '5px 2px', cursor: 'pointer' }}
      >
        <div
          style={{
            height: 6,
            borderRadius: 360,
            width: active ? 28 : 6,
            backgroundColor: active ? '#FFFFFF' : 'rgba(255,255,255,0.45)',
            transition: 'width 300ms, background 300ms'
          }}
        />
      </div>
    );
  });

  return (
    <div style={{ position: 'absolute', inset: 0 }} data-theme="dark">
      <img
        src={slide.img}
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: slide.pos }}
      />
      <div style={{ position: 'absolute', inset: 0, background: slide.gradient }} />
      
      {showSkip && (
        <button
          className="btn btn-tonal sm"
          onClick={onSkip}
          style={{ position: 'absolute', top: 70, right: 20, zIndex: 6 }}
        >
          Skip
        </button>
      )}

      <div style={{ position: 'absolute', left: 28, right: 28, top: '50%', transform: 'translateY(-58%)', textAlign: 'center' }}>
        <div style={{ fontFamily: '"DM Serif Display", Georgia, serif', fontSize: 40, lineHeight: 1.12, color: '#FFFFFF', letterSpacing: '-0.5px', marginBottom: 14, textWrap: 'balance' }}>
          {slide.title}
        </div>
        <div style={{ fontFamily: '"Nunito", sans-serif', fontSize: 16, lineHeight: 1.6, color: 'rgba(255,255,255,0.88)', fontWeight: 400, textWrap: 'balance' }}>
          {slide.sub}
        </div>
      </div>

      <div style={{ position: 'absolute', bottom: 46, left: 16, right: 16, display: 'flex', flexDirection: 'column', alignItems: 'stretch', gap: 0, zIndex: 5 }}>
        <button
          className="btn btn-filled lg"
          onClick={onCta}
          style={{ width: '100%' }}
        >
          {ctaLabel}
        </button>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 2, marginTop: 12 }}>
          {dots}
        </div>
        <div style={{ textAlign: 'center', marginTop: 10, fontFamily: '"Nunito", sans-serif', fontSize: 12, lineHeight: 1.6, color: 'rgba(255,255,255,0.8)' }}>
          By continuing, you agree to our <span style={{ color: 'var(--color-action-primary)', textDecoration: 'underline', textUnderlineOffset: 2 }}>Terms and Conditions</span> and <span style={{ color: 'var(--color-action-primary)', textDecoration: 'underline', textUnderlineOffset: 2 }}>Privacy Policy</span>
        </div>
      </div>
    </div>
  );
}

function PhoneScreen({
  phoneDisplay = "",
  phoneMask = "00000 00000",
  phoneError = false,
  phoneFocused = false,
  phoneAnim = "none",
  onContinue,
  onBack,
  onKeyPress
}) {
  const isFilled = phoneDisplay.replace(/\s/g, '').length === 10;
  
  return (
    <div style={{ width: '100%', height: '100%', background: 'var(--color-surface-primary)', display: 'flex', flexDirection: 'column', padding: '62px 24px 0', boxSizing: 'border-box', position: 'relative', overflow: 'hidden' }}>
      <button className="ib ib-tonal md" onClick={onBack} style={{ marginTop: 8, alignSelf: 'flex-start' }}>
        <span className="material-symbols-rounded">arrow_back</span>
      </button>

      <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}>
        <div style={{ marginTop: 38 }}>
          <div style={{ fontFamily: '"DM Serif Display", Georgia, serif', fontSize: 38, lineHeight: 1.15, color: 'var(--color-info-primary)', letterSpacing: '-0.5px', marginBottom: 12 }}>
            Let's get started
          </div>
          <div style={{ fontFamily: '"Nunito", sans-serif', fontSize: 16, lineHeight: 1.55, color: 'var(--color-info-secondary)', fontWeight: 400 }}>
            Enter your phone number to receive a verification code.
          </div>
        </div>

        <div style={{ marginTop: 28, animation: phoneAnim }}>
          <div className={`input phone ${phoneFocused ? 'focused' : ''} ${phoneError ? 'error' : ''}`}>
            <div className="inner">
              <div className="prefix">
                <span style={{ fontSize: 18, lineHeight: 1 }}>🇮🇳</span>
                <span>+91</span>
              </div>
              <div className="divider" />
              <div className="entry">
                <span>{phoneDisplay}</span>
                {phoneFocused && <span className="lf-cursor" />}
                <span style={{ color: 'var(--color-input-placeholder)' }}>{phoneMask}</span>
              </div>
            </div>
            <div className="halo" />
          </div>
          
          <div style={{ height: 20, marginTop: 6 }}>
            {phoneError && (
              <span style={{ fontFamily: '"Nunito", sans-serif', fontSize: 13, color: 'var(--color-input-text-error)', fontWeight: 600 }}>
                Please enter a valid 10-digit number
              </span>
            )}
          </div>
        </div>

        <button
          className="btn btn-filled lg"
          onClick={onContinue}
          style={{ width: '100%', marginTop: 20 }}
        >
          Continue
        </button>
        <div style={{ flex: 1 }} />
      </div>

      <div style={{ textAlign: 'center', paddingBottom: 18 }}>
        <span style={{ fontFamily: '"Noto Nastaliq Urdu", "AlQuran IndoPak", serif', fontSize: 30, color: 'var(--color-info-primary)', opacity: 0.85, direction: 'rtl' }}>
          پیغام
        </span>
      </div>

      <Keypad onPress={onKeyPress} />
    </div>
  );
}

function OtpScreen({
  phoneFmt = "81234 03269",
  otp = "",
  otpError = false,
  verifying = false,
  success = false,
  resendIn = 0,
  smsVisible = false,
  onEditPhone,
  onResend,
  onBack,
  onKeyPress
}) {
  const activeCellIdx = success ? 5 : Math.min(otp.length, 5);
  
  const cells = [0, 1, 2, 3, 4, 5].map((i) => {
    const digit = otp[i] || '';
    const showCursor = i === activeCellIdx && !success && !verifying;
    const borderLeft = i === 0 ? 'none' : '1px solid var(--color-input-border-disabled)';
    const color = otpError
      ? 'var(--color-status-error)'
      : (success ? 'var(--color-action-primary)' : 'var(--color-input-text)');
    return { digit, showCursor, borderLeft, color };
  });

  let haloLeft = '2px';
  let haloWidth = 'calc((100% - 4px) / 6)';
  let haloRadius = '0';
  
  if (activeCellIdx === 0) {
    haloLeft = '0px';
    haloWidth = 'calc(2px + (100% - 4px) / 6)';
    haloRadius = '16px 0 0 16px';
  } else if (activeCellIdx === 5) {
    haloLeft = 'calc(2px + 5 * (100% - 4px) / 6)';
    haloWidth = 'calc(2px + (100% - 4px) / 6)';
    haloRadius = '0 16px 16px 0';
  } else {
    haloLeft = `calc(2px + ${activeCellIdx} * (100% - 4px) / 6)`;
    haloWidth = 'calc((100% - 4px) / 6)';
    haloRadius = '0';
  }

  const otpAnim = otpError ? 'lfshake .45s ease' : 'none';

  return (
    <div style={{ width: '100%', height: '100%', background: 'var(--color-surface-primary)', display: 'flex', flexDirection: 'column', padding: '62px 24px 0', boxSizing: 'border-box', position: 'relative', overflow: 'hidden' }}>
      
      {smsVisible && (
        <div className="otp-banner" style={{ position: 'absolute', top: 16, left: 12, right: 12, zIndex: 100, background: 'var(--color-surface-overlay)', border: '1px solid var(--color-neutral-border)', borderRadius: 16, padding: '12px 14px', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', boxShadow: 'var(--sheet-shadow)', display: 'flex', gap: 12, alignItems: 'flex-start', cursor: 'pointer' }}>
          <div style={{ width: 42, height: 42, borderRadius: 10, background: 'linear-gradient(135deg,#5E6AD2,#8B9DDF)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, position: 'relative' }}>
            <span className="material-symbols-rounded" style={{ fontSize: 22, color: '#fff', fontVariationSettings: "'FILL' 1" }}>corporate_fare</span>
            <div style={{ position: 'absolute', bottom: -3, right: -3, width: 16, height: 16, background: '#30D158', borderRadius: '50%', border: '2px solid var(--color-surface-overlay)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span className="material-symbols-rounded" style={{ fontSize: 9, color: '#fff', fontVariationSettings: "'FILL' 1" }}>chat_bubble</span>
            </div>
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 2 }}>
              <span style={{ fontFamily: '-apple-system, system-ui', fontSize: 14, fontWeight: 600, color: 'var(--color-info-primary)' }}>PAIGHM-S</span>
              <span style={{ fontFamily: '-apple-system, system-ui', fontSize: 13, color: 'var(--color-info-secondary)' }}>now</span>
            </div>
            <div style={{ fontFamily: '-apple-system, system-ui', fontSize: 13, color: 'var(--color-info-secondary)', lineHeight: 1.4, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>353357&nbsp; is your OTP for Paigham App login. OTP is valid for 10 minutes. Do not...</div>
          </div>
        </div>
      )}

      <button className="ib ib-tonal md" onClick={onBack} style={{ marginTop: 8, alignSelf: 'flex-start' }}>
        <span className="material-symbols-rounded">arrow_back</span>
      </button>

      <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}>
        <div style={{ marginTop: 32 }}>
          <div style={{ fontFamily: '"DM Serif Display", Georgia, serif', fontSize: 38, lineHeight: 1.15, color: 'var(--color-info-primary)', letterSpacing: '-0.5px', marginBottom: 12 }}>
            Enter OTP
          </div>
          <div style={{ fontFamily: '"Nunito", sans-serif', fontSize: 16, lineHeight: 1.55, color: 'var(--color-info-secondary)', fontWeight: 400 }}>
            Please enter the OTP sent to your phone number<br />
            <span style={{ fontWeight: 700, color: 'var(--color-info-primary)' }}>+91 {phoneFmt}</span>{' '}
            <span onClick={onEditPhone} style={{ fontWeight: 700, color: 'var(--color-action-primary)', cursor: 'pointer', fontSize: 14 }}>· Edit</span>
          </div>
        </div>

        <div style={{ marginTop: 28, animation: otpAnim }}>
          <div className={`otp ${otpError ? 'error' : ''} ${success ? 'success' : ''}`}>
            <div className="cells">
              {cells.map((c, i) => (
                <div key={i} className="cell" style={{ borderLeft: c.borderLeft }}>
                  {c.showCursor && <span className="otp-cursor" />}
                  <span style={{ color: c.color }}>{c.digit}</span>
                </div>
              ))}
            </div>
            <div className="halo" style={{ left: haloLeft, width: haloWidth, borderRadius: haloRadius, transition: 'left 120ms, width 120ms' }} />
          </div>
        </div>

        <div style={{ height: 22, marginTop: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
          {otpError && (
            <span style={{ fontFamily: '"Nunito", sans-serif', fontSize: 13, fontWeight: 700, color: 'var(--color-status-error)' }}>
              Incorrect OTP — use the code from the SMS above
            </span>
          )}
          {verifying && (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
              <span style={{ display: 'inline-block', width: 14, height: 14, border: '2px solid var(--color-action-primary)', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin .7s linear infinite' }} />
              <span style={{ fontFamily: '"Nunito", sans-serif', fontSize: 13, fontWeight: 700, color: 'var(--color-info-secondary)' }}>Verifying…</span>
            </span>
          )}
          {success && (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              <span className="material-symbols-rounded" style={{ fontSize: 18, color: 'var(--color-action-primary)', fontVariationSettings: "'FILL' 1" }}>check_circle</span>
              <span style={{ fontFamily: '"Nunito", sans-serif', fontSize: 13, fontWeight: 700, color: 'var(--color-action-primary)' }}>Verified — taking you home</span>
            </span>
          )}
        </div>

        <div style={{ marginTop: 8, textAlign: 'center', fontFamily: '"Nunito", sans-serif', fontSize: 15, color: 'var(--color-info-secondary)' }}>
          {resendIn > 0 && !success && (
            <span>Resend OTP in <span style={{ fontWeight: 700, color: 'var(--color-info-primary)' }}>{resendIn}s</span></span>
          )}
          {resendIn === 0 && !success && (
            <span onClick={onResend} style={{ fontWeight: 700, color: 'var(--color-action-primary)', cursor: 'pointer' }}>Resend OTP</span>
          )}
        </div>
        <div style={{ flex: 1 }} />
      </div>

      <div style={{ paddingBottom: 18, textAlign: 'center' }}>
        <span style={{ fontFamily: '"Noto Nastaliq Urdu", "AlQuran IndoPak", serif', fontSize: 30, color: 'var(--color-info-primary)', opacity: 0.85, direction: 'rtl' }}>
          پیغام
        </span>
      </div>

      <Keypad onPress={onKeyPress} />
    </div>
  );
}

Object.assign(window, { IntroScreen, PhoneScreen, OtpScreen });
