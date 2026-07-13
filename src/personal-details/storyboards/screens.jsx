// Shared screen components for the Personal Details section board.
// Used by both the static storyboard (details-row.jsx) and the live interactive device
// (Personal Details.dc.html). Mirrors the app's onboarding/personaldetails module
// (PersonalDetailsScreen.kt, GenderSelector.kt, SuccessCelebrationOverlay.kt).

// ── "Almost There!" app bar (DS .app-bar) — shared by the form + success screens ──
function AlmostThereAppBar({ onBack }) {
  return (
    <div className="app-bar" style={{ alignItems: 'center', gap: 14, height: 96, padding: '52px 16px 10px' }}>
      <button className="ib ib-tonal md" onClick={onBack} aria-label="Back"><span className="mi" data-i="arrow_back"></span></button>
      <div className="ab-title">Almost There!</div>
    </div>
  );
}

// One gender card (Brother/Sister) — radio + emoji + label (GenderSelector.kt).
function GenderCard({ emoji, label, selected, onClick }) {
  return (
    <div onClick={onClick} style={{
      flex: 1, position: 'relative', cursor: 'pointer', borderRadius: 20, padding: '22px 16px 18px', textAlign: 'center', boxSizing: 'border-box',
      border: selected ? '2px solid var(--color-action-primary)' : '1px solid var(--color-action-border)',
      background: selected ? 'color-mix(in oklab, var(--color-action-primary) 10%, transparent)' : 'transparent',
      transition: 'background 200ms, border-color 200ms'
    }}>
      <span className="mi" data-i={selected ? 'radio_button_checked' : 'radio_button_unchecked'} style={{ position: 'absolute', top: 10, right: 10, fontSize: 20, color: selected ? 'var(--color-action-primary)' : 'var(--color-action-border)' }}></span>
      <div style={{ fontSize: 40, lineHeight: 1 }}>{emoji}</div>
      <div style={{ marginTop: 8, fontFamily: '"Nunito", sans-serif', fontSize: 16, fontWeight: 600, color: selected ? 'var(--color-action-primary)' : 'var(--color-info-secondary)' }}>{label}</div>
    </div>
  );
}

// PERSONAL DETAILS — profile completion form (PersonalDetailsScreen.kt). Complete Setup validates:
// name < 3 chars → nameError, no gender → genderError (the gender row shakes via `shakeKey`).
function PersonalDetailsScreen({ name = '', onNameTap, gender = null, onSelectGender, onCompleteSetup, onBack, nameError = false, genderError = false, shakeKey = 0 }) {
  const APPBAR_H = 96;
  return (
    <div style={{ width: '100%', height: '100%', position: 'relative', overflow: 'hidden', background: 'var(--color-surface-primary)' }}>
      {/* Content scrolls under the app bar */}
      <div style={{ position: 'absolute', inset: 0, overflowY: 'auto', WebkitOverflowScrolling: 'touch', paddingTop: APPBAR_H, paddingBottom: 96, boxSizing: 'border-box' }}>
        <div style={{ padding: '18px 24px 0' }}>
          <div style={{ fontFamily: '"Nunito", sans-serif', fontSize: 16, lineHeight: 1.55, color: 'var(--color-info-secondary)' }}>Help your masjid verify your membership by sharing a few details.</div>

          {/* Full Name */}
          <div style={{ marginTop: 28 }}>
            <div className="flabel">Full Name</div>
            <div className={`input ${nameError ? 'error' : ''}`} onClick={onNameTap} style={{ cursor: 'text' }}>
              <div className="inner">
                <div className="val">{name ? <span>{name}</span> : <span className="ph">Enter your full name</span>}</div>
              </div>
            </div>
            <div className="helper err" style={{ minHeight: 20 }}>{nameError ? 'Please enter your full name' : ''}</div>
          </div>

          {/* Gender */}
          <div style={{ marginTop: 16 }}>
            <div style={{ fontFamily: '"Nunito", sans-serif', fontSize: 15, color: 'var(--color-input-text)', marginBottom: 12 }}>How should we address you?</div>
            <div key={shakeKey} style={{ display: 'flex', gap: 12, animation: genderError ? 'ptshake .45s ease' : 'none' }}>
              <GenderCard emoji="👳🏻" label="Brother" selected={gender === 'male'} onClick={() => onSelectGender && onSelectGender('male')} />
              <GenderCard emoji="🧕🏻" label="Sister" selected={gender === 'female'} onClick={() => onSelectGender && onSelectGender('female')} />
            </div>
            <div className="helper err" style={{ minHeight: 20, marginTop: 8 }}>{genderError ? 'Please select your gender' : ''}</div>
          </div>
        </div>
      </div>

      <AlmostThereAppBar onBack={onBack} />

      {/* Bottom bar — Complete Setup (CompleteSetupBottomBar) */}
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, padding: '12px 16px 28px', background: 'var(--color-surface-primary)', boxSizing: 'border-box' }}>
        <button className="btn btn-filled lg" onClick={onCompleteSetup} style={{ width: '100%' }}>Complete Setup</button>
      </div>
    </div>
  );
}

// Deterministic confetti (decorative — literal data colors are DS-whitelisted). Pieces drift +
// rotate in place via the `confettidrift` keyframe declared in the board helmet.
const CONFETTI_COLORS = ['#00C950', '#009689', '#4A8AFF', '#E7000B', '#FE9A00', '#AD46FF'];
function Confetti({ count = 46 }) {
  const rnd = (i, s) => { const x = Math.sin((i + 1) * s) * 10000; return x - Math.floor(x); };
  const pieces = Array.from({ length: count }, (_, i) => ({
    left: rnd(i, 12.9898) * 100,
    top: rnd(i, 78.233) * 96,
    w: 5 + rnd(i, 5.5) * 5,
    h: 8 + rnd(i, 9.1) * 8,
    rot: Math.round(rnd(i, 3.14) * 360),
    color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
    delay: (rnd(i, 2.2) * 2).toFixed(2)
  }));
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
      {pieces.map((p, i) => (
        <div key={i} style={{ position: 'absolute', left: p.left + '%', top: p.top + '%' }}>
          <div style={{ width: p.w, height: p.h, background: p.color, borderRadius: 1, transform: `rotate(${p.rot}deg)`, animation: `confettidrift 3.2s ${p.delay}s ease-in-out infinite` }} />
        </div>
      ))}
    </div>
  );
}

// SUCCESS — celebration after Complete Setup (SuccessCelebrationOverlay.kt). In the masjid-follow
// flow the board auto-returns from here and follows the pending masjid.
function SuccessScreen({ onBack }) {
  const features = [
    'View Jamaah timings for your masjids',
    'Stay updated with Qaum announcements',
    'Never miss community events'
  ];
  return (
    <div style={{ width: '100%', height: '100%', position: 'relative', overflow: 'hidden', background: 'var(--color-surface-primary)' }}>
      <Confetti />
      <AlmostThereAppBar onBack={onBack} />
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 28px', textAlign: 'center' }}>
        <span className="mi" data-i="check_circle" style={{ fontSize: 96, color: 'var(--color-action-primary)' }}></span>
        <div style={{ marginTop: 20, fontFamily: '"DM Serif Display", Georgia, serif', fontSize: 34, lineHeight: 1.15, color: 'var(--color-info-primary)' }}>Welcome to Paigham!</div>
        <div style={{ marginTop: 12, fontFamily: '"Nunito", sans-serif', fontSize: 16, lineHeight: 1.5, color: 'var(--color-info-secondary)' }}>Your details have been sent to your masjid for verification</div>
        <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
          {features.map((t, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'center', fontFamily: '"Nunito", sans-serif', fontSize: 15, color: 'var(--color-info-secondary)' }}>
              <span className="mi" data-i="check" style={{ fontSize: 18, color: 'var(--color-info-secondary)' }}></span>
              <span>{t}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { PersonalDetailsScreen, SuccessScreen });
