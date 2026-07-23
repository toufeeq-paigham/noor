// Shared screen components for the Qibla section board.
// Used by BOTH the static storyboards (*-row.jsx) and the live device (Qibla.dc.html).
//
// Ported from Compose `modules/qibla` (QiblaScreen + InitialQiblaView + SmartQiblaView + QiblaOverlays
// + CompassPainter). Two screens drive the whole flow:
//   • InitialQiblaScreen — the dark compass instrument, with the permission request UI beneath it
//     (shown while there's no location). Mirrors InitialQiblaView.
//   • SmartQiblaScreen  — the AR camera view once location is known. Mirrors SmartQiblaView: a mini
//     compass + live angle readout, guided direction arrows when NOT pointing at the Qibla, the
//     "hold your phone upright" overlay when the phone is horizontal, and the Kaaba image when the
//     Qibla comes into view. Mirrors QiblaOverlays.
//
// The compass disc is a fixed dark instrument (like a real compass face) in both themes — its
// internal marks are composited on the dark disc. All screen chrome uses semantic tokens.

const FONT_B = 'var(--font-body)';
const FONT_T = 'var(--font-title)';

const QIBLA_AR_METRICS = Object.freeze({
  kaabaTop: '20%',
  kaabaSceneSize: 360,
  kaabaImageSize: 240,
  angleSize: 132,
  edgeInset: 16,
});

// Fixed Qibla bearing used for the mock (≈ WNW from India). Each state passes a screen-relative
// angle; heading is derived so the dial ticks/labels rotate consistently with the needle.
const QIBLA_BEARING = 293;

// Point on a circle for a screen bearing (0° = straight up, clockwise positive).
function bpt(cx, cy, r, bearingDeg) {
  const t = (bearingDeg * Math.PI) / 180;
  return [cx + r * Math.sin(t), cy - r * Math.cos(t)];
}

// ══════════════════════════════════════════════════════════════════════
// Compass instrument (mirrors CompassPainter): dark disc, rotating ticks +
// direction labels, red north pointer, green Qibla target at 12 o'clock, and
// a tapered "fire" needle to the Qibla with the Kaaba at its tip.
// ══════════════════════════════════════════════════════════════════════
function CompassDial({ size = 264, qiblaRel = 0, heading = 0, pointing = false }) {
  const c = size / 2;
  const r = c - 6;
  const GREEN = 'var(--color-action-primary)';
  const RED = '#E03030';           // instrument north — composited on the dark disc
  const ORANGE = '#FF9800';        // guidance hue when not aligned

  // Rotating tick marks every 10° (major every 30°).
  const ticks = [];
  for (let i = 0; i < 360; i += 10) {
    const major = i % 30 === 0;
    const br = i - heading;
    const [x1, y1] = bpt(c, c, r * (major ? 0.84 : 0.9), br);
    const [x2, y2] = bpt(c, c, r * 0.95, br);
    ticks.push(
      <line key={i} x1={x1} y1={y1} x2={x2} y2={y2}
        stroke={`rgba(255,255,255,${major ? 0.6 : 0.35})`} strokeWidth={major ? 2 : 1} />
    );
  }

  // Direction labels (N is red; N/E/S/W larger than intercardinals).
  const DIRS = [['N', 0], ['NE', 45], ['E', 90], ['SE', 135], ['S', 180], ['SW', 225], ['W', 270], ['NW', 315]];
  const labels = DIRS.map(([d, deg]) => {
    const [x, y] = bpt(c, c, r * 0.68, deg - heading);
    const main = deg % 90 === 0;
    return (
      <text key={d} x={x} y={y} textAnchor="middle" dominantBaseline="central"
        fontFamily={FONT_B} fontWeight={700} fontSize={main ? size * 0.058 : size * 0.044}
        fill={d === 'N' ? RED : `rgba(255,255,255,${main ? 0.9 : 0.6})`}>{d}</text>
    );
  });

  // Red north pointer (triangle) at the current north bearing.
  const nb = -heading;
  const [ntx, nty] = bpt(c, c, r * 0.95, nb);
  const [nlx, nly] = bpt(c, c, r * 0.84, nb - 5);
  const [nrx, nry] = bpt(c, c, r * 0.84, nb + 5);

  // Green Qibla target marker fixed at the top of the dial (12 o'clock).
  const qmTop = r * 0.98, qmBase = r * 0.82, qmHalf = size * 0.046;

  // Fire needle → Qibla (green when aligned, orange otherwise) with Kaaba at the tip.
  const len = r * 0.62;
  const [tipx, tipy] = bpt(c, c, len, qiblaRel);
  const [blx, bly] = bpt(c, c, size * 0.03, qiblaRel + 90);
  const [brx, bry] = bpt(c, c, size * 0.03, qiblaRel - 90);
  const needleFill = pointing ? GREEN : ORANGE;
  const needleStroke = pointing ? 'var(--color-action-primary)' : '#E53935';

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ display: 'block' }}>
      <circle cx={c} cy={c} r={r} fill="rgba(0,0,0,0.82)"
        stroke={pointing ? GREEN : 'rgba(255,255,255,0.7)'} strokeWidth={3} />
      {ticks}
      {labels}
      {/* Qibla target marker at top */}
      <polygon points={`${c},${c - qmTop} ${c - qmHalf},${c - qmBase} ${c + qmHalf},${c - qmBase}`}
        fill="var(--color-action-primary)" opacity={0.9} />
      {/* North pointer */}
      <polygon points={`${ntx},${nty} ${nlx},${nly} ${nrx},${nry}`} fill={RED} opacity={0.9} />
      {/* Fire needle */}
      <polygon points={`${blx},${bly} ${tipx},${tipy} ${brx},${bry}`} fill={needleFill}
        stroke={needleStroke} strokeWidth={1.5} strokeLinejoin="round" />
      <text x={tipx} y={tipy} textAnchor="middle" dominantBaseline="central" fontSize={size * 0.07}>🕋</text>
      {/* Center dot */}
      <circle cx={c} cy={c} r={size * 0.012} fill={pointing ? GREEN : 'rgba(0,0,0,0.85)'} />
    </svg>
  );
}

// Transparent top bar — a single close action on the right (mirrors the Qibla AppBar).
function QiblaTopBar({ onClose, overCamera = false }) {
  return (
    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 20,
      display: 'flex', justifyContent: 'flex-end', padding: '52px 16px 0' }}>
      <button className="ib ib-tonal md" onClick={onClose} aria-label="Close">
        <span className="mi" style={overCamera ? { color: '#fff' } : null} data-i="close"></span>
      </button>
    </div>
  );
}

// Small labelled preview controls — ONLY rendered on the live device (rows pass no handlers),
// since a browser can't drive the real compass/accelerometer.
function PreviewChips({ items }) {
  return (
    <div style={{ position: 'absolute', left: 0, right: 0, bottom: 20, zIndex: 30,
      display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap', padding: '0 16px' }}>
      {items.map((it, i) => (
        <div key={i} onClick={it.onClick} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
          background: 'color-mix(in oklab, var(--color-info-primary) 82%, transparent)', borderRadius: 999,
          padding: '8px 14px', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)' }}>
          <span className="mi" style={{ fontSize: 16, color: 'var(--color-info-primary-inverse)' }} data-i={it.icon}></span>
          <span style={{ fontFamily: FONT_B, fontSize: 12, fontWeight: 700, color: 'var(--color-info-primary-inverse)' }}>{it.label}</span>
        </div>
      ))}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════
// 1 · InitialQiblaScreen — dark compass + (optional) permission request UI
// ══════════════════════════════════════════════════════════════════════
function InitialQiblaScreen({ showPermission = true, permissionState, qiblaRel = 300, pointing = false, onGrant, onClose }) {
  const heading = ((QIBLA_BEARING - qiblaRel) % 360 + 360) % 360;
  const mode = permissionState || (showPermission ? 'request' : 'locating');
  const copy = {
    request: {
      icon: 'explore',
      title: 'Help us find the Qibla',
      body: 'Paigham uses your location to calculate the direction and the camera for guided alignment.',
      action: 'Allow location and camera',
    },
    denied: {
      icon: 'no_photography',
      title: 'Camera and location are off',
      body: 'Allow both permissions in Settings to use the guided Qibla finder.',
      action: 'Open Settings',
    },
    services: {
      icon: 'location_off',
      title: 'Turn on location services',
      body: 'Location services are needed to calculate the Qibla direction from where you are.',
      action: 'Open Location Settings',
    },
  }[mode];
  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden',
      background: 'var(--color-surface-primary)', display: 'flex', flexDirection: 'column' }}>
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: 72, paddingBottom: mode !== 'locating' ? 0 : 40 }}>
        <CompassDial size={264} qiblaRel={qiblaRel} heading={heading} pointing={pointing} />
      </div>
      {mode !== 'locating' ? (
        <div style={{ flexShrink: 0, padding: '0 24px 40px' }}>
          <span className="mi" style={{ fontSize: 'var(--icon-lg)', color: mode === 'request' ? 'var(--color-action-primary)' : 'var(--color-status-warning)', marginBottom: 12 }} data-i={copy.icon}></span>
          <div style={{ fontFamily: FONT_T, fontSize: 26, lineHeight: 1.2, letterSpacing: '-0.4px', color: 'var(--color-info-primary)', marginBottom: 10 }}>{copy.title}</div>
          <div style={{ fontFamily: FONT_B, fontSize: 14, lineHeight: 1.6, color: 'var(--color-info-secondary)', marginBottom: 24 }}>{copy.body}</div>
          <button className="btn btn-filled lg" onClick={onGrant} style={{ width: '100%' }}>{copy.action}</button>
        </div>
      ) : (
        <div style={{ flexShrink: 0, padding: '0 24px 44px', textAlign: 'center' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontFamily: FONT_B, fontSize: 14, fontWeight: 600, color: 'var(--color-info-secondary)' }}>
            <span className="mi" style={{ fontSize: 18, color: 'var(--color-action-primary)' }} data-i="my_location"></span>
            Preparing guided Qibla…
          </span>
        </div>
      )}
      <QiblaTopBar onClose={onClose} />
    </div>
  );
}

// Stable recovery when the route cannot obtain the data needed to start the guided finder.
// This is intentionally motion-free: recovery should be immediately understandable and actionable.
function RecoveryQiblaScreen({ reason = 'location', onRetry, onClose }) {
  const copy = reason === 'sensors'
    ? {
        icon: 'sensors',
        title: 'Qibla sensors are unavailable',
        body: 'This device is not reporting the compass or motion data needed for guided alignment.',
      }
    : {
        icon: 'location_off',
        title: "We couldn't find your location",
        body: 'Check location services and try again from a place with a clear signal.',
      };

  return (
    <div className="qibla-recovery">
      <div className="qibla-recovery-content" role="status" aria-live="polite">
        <div className="qibla-recovery-icon" aria-hidden="true">
          <span className="mi" data-i={copy.icon}></span>
        </div>
        <div className="qibla-recovery-title">{copy.title}</div>
        <div className="qibla-recovery-body">{copy.body}</div>
      </div>
      <button className="btn btn-filled lg" onClick={onRetry}>Try again</button>
      <QiblaTopBar onClose={onClose} />
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════
// 2 · SmartQiblaScreen — AR camera view with mini compass, angle readout,
//     guided arrows, hold-upright overlay, and the Kaaba when in view.
//     stage: 'searching' (upright, seeking) | 'horizontal' (phone flat) | 'inview' (aligned)
// ══════════════════════════════════════════════════════════════════════
function SmartQiblaScreen({ stage = 'searching', onClose, onPointQibla, onLayFlat, onHoldUpright, onTurnAway }) {
  const pointing = stage === 'inview';
  const captureMode = new URLSearchParams(window.location.search).get('capture');
  const isAssetCapture = captureMode === 'android' || captureMode === '1';
  const showArrows = stage === 'searching' || stage === 'horizontal';
  const showScrim = stage === 'horizontal';
  const showKaaba = stage === 'inview';
  const angleDeg = pointing ? 2 : -45;      // signed: negative = Qibla to the left
  const qiblaRel = ((angleDeg % 360) + 360) % 360;
  const heading = ((QIBLA_BEARING - qiblaRel) % 360 + 360) % 360;
  const isLeft = angleDeg < 0;
  const hasDemo = !isAssetCapture && !!(onPointQibla || onLayFlat || onHoldUpright || onTurnAway);

  const demoItems = stage === 'searching'
    ? [{ icon: 'near_me', label: 'Point to Qibla', onClick: onPointQibla }, { icon: 'phone_iphone', label: 'Lay phone flat', onClick: onLayFlat }]
    : stage === 'inview'
      ? [{ icon: 'explore', label: 'Turn away', onClick: onTurnAway }]
      : [];

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden', background: '#1E1C1A' }}>
      {/* Camera feed placeholder (imagery) */}
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 32% 38%, rgba(86,76,64,0.55) 0%, rgba(28,26,24,0.92) 78%), linear-gradient(135deg,#211E1B 0%,#2C2926 100%)' }} />

      {/* Kaaba comes into view when aligned */}
      {showKaaba && (
        <div style={{ position: 'absolute', top: QIBLA_AR_METRICS.kaabaTop, left: 0, right: 0, display: 'flex', justifyContent: 'center' }}>
          <div style={{ position: 'relative', width: QIBLA_AR_METRICS.kaabaSceneSize, height: QIBLA_AR_METRICS.kaabaSceneSize, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle, rgba(10,8,5,0.45) 0%, rgba(10,8,5,0.12) 55%, transparent 78%)' }} />
            <img src="../../images/kaaba.webp" alt="Kaaba" style={{
              width: isAssetCapture ? 340 : QIBLA_AR_METRICS.kaabaImageSize,
              height: isAssetCapture ? 340 : QIBLA_AR_METRICS.kaabaImageSize,
              objectFit: 'contain',
              position: 'relative',
            }} />
          </div>
        </div>
      )}

      {/* Guided direction arrow — points to where the user should turn (pulsing) */}
      {showArrows && (
        <div style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)',
          [isLeft ? 'left' : 'right']: 12, zIndex: 8 }}>
          <span className="mi qibla-arrow" style={{ fontSize: 92, color: '#FF9800',
            transform: `rotate(${isLeft ? 90 : -90}deg)`, display: 'block' }} data-i="expand_more"></span>
        </div>
      )}

      {/* Live angle readout, bottom-left */}
      <div style={{ position: 'absolute', bottom: QIBLA_AR_METRICS.edgeInset, left: QIBLA_AR_METRICS.edgeInset, width: QIBLA_AR_METRICS.angleSize, height: QIBLA_AR_METRICS.angleSize, zIndex: 6,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'radial-gradient(circle, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.3) 45%, transparent 72%)' }}>
        <span style={{ fontFamily: FONT_T, fontSize: 30, color: 'var(--color-info-on-media)' }}>{angleDeg}°</span>
      </div>

      {/* Mini compass, bottom-right */}
      <div style={{ position: 'absolute', bottom: 20, right: 16, zIndex: 6 }}>
        <CompassDial size={108} qiblaRel={qiblaRel} heading={heading} pointing={pointing} />
      </div>

      {/* Hold-upright overlay when the phone is horizontal */}
      {showScrim && (
        <div style={{ position: 'absolute', inset: 0, zIndex: 15, background: 'rgba(0,0,0,0.42)' }}>
          <div onClick={onHoldUpright} style={{ position: 'absolute', left: 16, right: 16, bottom: 92,
            background: 'var(--color-status-error)', borderRadius: 25, padding: '13px 20px',
            display: 'flex', alignItems: 'center', gap: 12, cursor: onHoldUpright ? 'pointer' : 'default' }}>
            <span className="mi" style={{ fontSize: 22, color: '#fff', transform: 'rotate(180deg)', display: 'block' }} data-i="expand_more"></span>
            <span style={{ fontFamily: FONT_B, fontSize: 14, fontWeight: 600, color: '#fff' }}>Hold your phone upright to experience the AR view</span>
          </div>
        </div>
      )}

      <QiblaTopBar onClose={onClose} overCamera />
      {hasDemo && demoItems.length > 0 && <PreviewChips items={demoItems} />}
    </div>
  );
}

Object.assign(window, { CompassDial, InitialQiblaScreen, RecoveryQiblaScreen, SmartQiblaScreen });
