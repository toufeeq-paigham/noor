// Shared screen components for the Sehri (Find Sehri) section board.
// Used by both the static storyboard (sehri-row.jsx) and the live interactive device
// (Sehri.dc.html). Mirrors the Masjid Explore map view: full-bleed map, floating app bar,
// bottom sheet with a card carousel + list toggle, plus a list view. The map is treated as
// imagery, so its literal palette + on-imagery whites/blue are DS-whitelisted.

// ── Nearby Sehri (Suhoor) distribution points (real-ish Bengaluru sample data) ──
const SEHRI = [
  { name: 'Ramadhan Distribution', org: 'Queens Road & Nandidurga Road', areas: 'Shivajinagar, Vasanthnagar, Benson Town, Fraser Town, Jayamahal, Lingarajapuram', eligibility: 'Only for Ladies Hostel and PG', time: '3:30 AM onwards', tag: { label: 'Free', kind: 'free' }, phone: '+91 98455 12340', pos: { left: '48%', top: '40%' } },
  { name: 'Masjid E Bilal Sehri', org: 'Bannerghatta Main Road', areas: 'Hongasandra, BTM Layout, Arekere, Gottigere', eligibility: 'Open to all — dine-in & takeaway', time: '3:15 AM – 4:45 AM', tag: { label: 'Free', kind: 'free' }, phone: '+91 98455 20015', pos: { left: '70%', top: '48%' } },
  { name: 'Al-Barakah Kitchen', org: 'Tannery Road', areas: 'Tannery Road, Cox Town, Kaval Byrasandra', eligibility: 'Registration required', time: '3:00 AM – 4:30 AM', tag: { label: '₹40', kind: 'paid' }, phone: '+91 98455 33421', pos: { left: '60%', top: '25%' } },
  { name: 'Ramzan Food Point', org: 'Shivajinagar Bus Stand', areas: 'Shivajinagar, Bharathinagar, Vasanthnagar', eligibility: 'Open to all', time: '3:20 AM onwards', tag: { label: 'Free', kind: 'free' }, phone: '+91 98455 87762', pos: { left: '40%', top: '54%' } },
  { name: 'Noor Welfare Trust', org: 'Frazer Town, Mosque Road', areas: 'Fraser Town, Cooke Town, Pulikeshi Nagar', eligibility: 'For students & travellers', time: '2:45 AM – 4:15 AM', tag: { label: 'Free', kind: 'free' }, phone: '+91 98455 44190', pos: { left: '55%', top: '34%' } },
  { name: 'Sehri Seva Point', org: 'Nagawara Main Road', areas: 'Nagawara, Arabic College, HBR Layout', eligibility: 'Open to all', time: '3:10 AM – 4:40 AM', tag: { label: '₹30', kind: 'paid' }, phone: '+91 98455 61208', pos: { left: '32%', top: '30%' } },
];

// Circular glass control that floats over the map imagery.
// Literal translucent white + white glyph are whitelisted (on-color over imagery).
function GlassBtn({ icon, onClick, ariaLabel }) {
  return (
    <button
      className="ib md"
      onClick={onClick}
      aria-label={ariaLabel}
      style={{
        background: 'rgba(255,255,255,0.16)',
        border: '1px solid rgba(255,255,255,0.28)',
        backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)',
        boxShadow: '0 2px 10px rgba(0,0,0,0.28)',
      }}
    >
      <span className="mi" style={{ color: '#fff' }} data-i={icon}></span>
    </button>
  );
}

// Shared floating app bar (over map imagery) — same on the map and list views.
function SehriAppBar({ onBack, trailing }) {
  return (
    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 20, display: 'flex', alignItems: 'center', gap: 12, padding: '54px 16px 10px' }}>
      <GlassBtn icon="arrow_back" onClick={onBack} ariaLabel="Back" />
      <div className="ab-title" style={{ flex: 1, color: '#fff', fontSize: 26, textShadow: '0 1px 6px rgba(0,0,0,0.5)' }}>Find Sehri</div>
      {trailing || null}
    </div>
  );
}

// Stylized dark map (imagery). Roads/water/parks are decorative data colors.
function MapCanvas({ points, selectedIdx, onSelectPoint }) {
  return (
    // zIndex:0 makes this a stacking context so the pins' z-index stays contained
    // (they must sit BEHIND the list sheet in the list view, not bleed over it).
    <div style={{ position: 'absolute', inset: 0, background: '#1C2535', overflow: 'hidden', zIndex: 0 }}>
      <svg width="100%" height="100%" viewBox="0 0 402 874" preserveAspectRatio="xMidYMid slice" style={{ position: 'absolute', inset: 0, opacity: 0.9 }}>
        {/* water body */}
        <path d="M -20 470 Q 120 400 250 470 T 460 460 L 460 620 Q 260 560 90 630 L -20 600 Z" fill="#16324f" />
        {/* parks */}
        <rect x="292" y="600" width="120" height="130" rx="10" fill="rgba(28,120,60,0.35)" />
        <rect x="20" y="150" width="70" height="60" rx="8" fill="rgba(28,120,60,0.28)" />
        {/* major roads */}
        <g stroke="#31415a" strokeWidth="13" strokeLinecap="round">
          <line x1="0" y1="300" x2="402" y2="330" />
          <line x1="210" y1="0" x2="180" y2="874" />
        </g>
        <g stroke="#28374d" strokeWidth="7" strokeLinecap="round">
          <line x1="70" y1="0" x2="90" y2="874" />
          <line x1="330" y1="0" x2="300" y2="874" />
          <line x1="0" y1="180" x2="402" y2="150" />
          <line x1="0" y1="640" x2="402" y2="690" />
          <line x1="0" y1="90" x2="300" y2="470" />
          <line x1="120" y1="0" x2="402" y2="520" />
        </g>
        <text x="215" y="322" fill="rgba(190,205,225,0.5)" fontSize="10" fontFamily="sans-serif" textAnchor="middle">1ST MAIN ROAD</text>
        <text x="28" y="380" fill="rgba(190,205,225,0.45)" fontSize="9" fontFamily="sans-serif" transform="rotate(-88,28,380)">QUEENS ROAD</text>
        <text x="150" y="520" fill="rgba(190,205,225,0.45)" fontSize="9" fontFamily="sans-serif">NANDIDURGA ROAD</text>
        <text x="120" y="455" fill="rgba(120,170,215,0.75)" fontSize="10" fontFamily="sans-serif">Attur Lake</text>
      </svg>

      {/* user location */}
      <div style={{ position: 'absolute', left: '50%', top: '44%', transform: 'translate(-50%,-50%)', width: 16, height: 16, borderRadius: '50%', background: '#4A8AFF', border: '3px solid rgba(255,255,255,0.92)', boxShadow: '0 0 0 7px rgba(74,138,255,0.18)' }} />

      {/* Sehri pins — cream/brand teardrops carrying the mosque mark */}
      {points.map((p, i) => {
        const active = i === selectedIdx;
        const size = active ? 40 : 30;
        return (
          <div
            key={i}
            onClick={() => onSelectPoint && onSelectPoint(i)}
            style={{ position: 'absolute', left: p.pos.left, top: p.pos.top, transform: 'translate(-50%,-100%)', cursor: 'pointer', zIndex: active ? 6 : 5, transition: 'all 180ms' }}
          >
            <div style={{ width: size, height: size, borderRadius: '50% 50% 50% 0', background: active ? '#fff' : '#C9AD7B', transform: 'rotate(-45deg)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: active ? '0 4px 16px rgba(0,0,0,0.5)' : '0 2px 8px rgba(0,0,0,0.4)' }}>
              <span className="mi fill" style={{ transform: 'rotate(45deg)', fontSize: active ? 21 : 16, color: active ? 'var(--color-action-primary)' : '#1A2030', fontVariationSettings: "'FILL' 1" }} data-i="mosque"></span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// Coloured status tab pinned to the card's top-right corner (Free = green, Paid = gold).
// On-fill white text + accent hues are DS-whitelisted data colors.
function StatusTab({ tag }) {
  const free = tag.kind === 'free';
  return (
    <div style={{ position: 'absolute', top: 0, right: 0, background: free ? 'var(--color-action-primary)' : 'var(--color-neutral-brand)', color: 'var(--color-action-primary-inverse)', fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 800, padding: '6px 14px', borderRadius: '0 var(--radius-card) 0 14px' }}>{tag.label}</div>
  );
}

// A single detail row: leading icon + text (areas / eligibility / timing).
function DetailRow({ icon, children, clamp }) {
  const textStyle = { fontFamily: 'var(--font-body)', fontSize: 14, fontWeight: 600, color: 'var(--color-info-primary)', lineHeight: 1.35, minWidth: 0 };
  if (clamp) {
    Object.assign(textStyle, { display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' });
  }
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
      <span className="mi" style={{ fontSize: 18, color: 'var(--color-action-primary)', flexShrink: 0, marginTop: 1 }} data-i={icon}></span>
      <div style={textStyle}>{children}</div>
    </div>
  );
}

// A single Sehri distribution card — DS .surf card + .ib components.
function SehriCard({ p, onCall, onNavigate }) {
  return (
    <div className="surf" style={{ borderRadius: 'var(--radius-card)', position: 'relative', overflow: 'hidden' }}>
      <StatusTab tag={p.tag} />

      {/* Heading */}
      <div style={{ paddingRight: 84, minWidth: 0 }}>
        <div style={{ fontFamily: 'var(--font-title)', fontSize: 22, color: 'var(--color-info-primary)', letterSpacing: '-0.3px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.name}</div>
        <div style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--color-info-secondary)', marginTop: 3, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.org}</div>
      </div>

      <div style={{ height: 1, background: 'var(--color-neutral-border)', margin: '13px 0' }} />

      {/* Details */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, paddingRight: 96 }}>
        <DetailRow icon="location_on" clamp>{p.areas}</DetailRow>
        <DetailRow icon="delivery_dining">{p.eligibility}</DetailRow>
        <DetailRow icon="schedule">{p.time}</DetailRow>
      </div>

      {/* Actions — call + directions, pinned bottom-right */}
      <div style={{ position: 'absolute', right: 16, bottom: 16, display: 'flex', gap: 10 }}>
        <button className="ib ib-tonal md" onClick={onCall} aria-label="Call"><span className="mi" data-i="call"></span></button>
        <button className="ib ib-tonal primary md" onClick={onNavigate} aria-label="Directions"><span className="mi" data-i="near_me"></span></button>
      </div>
    </div>
  );
}

function SehriStatusCard({ kind, onRetry }) {
  const isLoading = kind === 'loading';
  const isError = kind === 'error';
  const icon = isLoading ? 'hourglass_top' : isError ? 'error' : 'delivery_dining';
  const title = isLoading ? 'Searching this area' : isError ? 'Nearby results unavailable' : 'Try another area';
  const description = isLoading
    ? 'Looking for Sehri providers near the map centre.'
    : isError
      ? 'Check your connection and try again. Your map position is unchanged.'
      : 'Move the map or use your location to search somewhere nearby.';

  return (
    <div className="surf" style={{ borderRadius: 'var(--radius-card)', overflow: 'hidden' }}>
      <div className="empty-state" role={isError ? 'alert' : 'status'} aria-live="polite" style={{ minHeight: 'var(--illustration-large)', padding: 'var(--size-xl) var(--content-gutter)' }}>
        <div className="empty-state-icon"><span className="mi" data-i={icon}></span></div>
        <div className="empty-state-title">{title}</div>
        <div className="empty-state-description">{description}</div>
        {isError && <button className="btn btn-filled empty-state-action" onClick={onRetry}>Try again</button>}
      </div>
    </div>
  );
}

// iOS-style location permission alert (system chrome over the map imagery).
// System accent blue + translucent materials are whitelisted (system UI over imagery).
function LocationPermissionSheet({ onAllowOnce, onAllowWhileUsing, onDeny }) {
  const btn = {
    display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: 52,
    borderRadius: 14, fontFamily: 'var(--font-body)', fontSize: 16, fontWeight: 700,
    background: 'rgba(120,120,128,0.24)', color: 'var(--color-info-primary)', cursor: 'pointer',
  };
  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 40, background: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 20px', backdropFilter: 'blur(2px)', WebkitBackdropFilter: 'blur(2px)' }}>
      <div style={{ width: '100%', maxWidth: 300, background: 'color-mix(in oklab, var(--color-surface-primary) 94%, transparent)', backdropFilter: 'blur(24px) saturate(180%)', WebkitBackdropFilter: 'blur(24px) saturate(180%)', border: '1px solid var(--color-neutral-border)', borderRadius: 22, padding: '22px 20px 16px', boxSizing: 'border-box' }}>
        {/* App icon */}
        <div style={{ position: 'relative', width: 60, height: 60, borderRadius: 15, background: 'linear-gradient(160deg, #3D9BFF, #1E6FE8)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16, boxShadow: '0 4px 12px rgba(30,111,232,0.4)' }}>
          <span className="mi fill" style={{ fontSize: 30, color: '#fff', transform: 'rotate(0deg)', fontVariationSettings: "'FILL' 1" }} data-i="near_me"></span>
          <div style={{ position: 'absolute', right: -4, bottom: -4, width: 26, height: 26, borderRadius: 8, background: 'linear-gradient(160deg, #4AA3FF, #2A7BEC)', border: '2px solid var(--color-surface-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span className="mi fill" style={{ fontSize: 14, color: '#fff', fontVariationSettings: "'FILL' 1" }} data-i="front_hand"></span>
          </div>
        </div>

        <div style={{ fontFamily: 'var(--font-body)', fontSize: 20, fontWeight: 800, color: 'var(--color-info-primary)', lineHeight: 1.25 }}>Allow &ldquo;Paigham&rdquo; to use your location?</div>
        <div style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--color-info-secondary)', marginTop: 8, lineHeight: 1.45 }}>Location access is needed to find nearby Sehri distribution points and show the Qibla direction accurately.</div>

        {/* Mini map preview */}
        <div style={{ position: 'relative', height: 128, borderRadius: 14, overflow: 'hidden', margin: '16px 0', background: '#26405c', backgroundImage: 'repeating-linear-gradient(48deg, rgba(255,255,255,0.06) 0 1px, transparent 1px 22px), repeating-linear-gradient(-40deg, rgba(255,255,255,0.05) 0 1px, transparent 1px 26px)' }}>
          <div style={{ position: 'absolute', top: 8, left: 8, display: 'inline-flex', alignItems: 'center', gap: 5, background: 'rgba(0,0,0,0.5)', borderRadius: 360, padding: '4px 10px' }}>
            <span className="mi fill" style={{ fontSize: 13, color: '#4AA3FF', fontVariationSettings: "'FILL' 1" }} data-i="near_me"></span>
            <span style={{ fontFamily: 'var(--font-body)', fontSize: 12, fontWeight: 800, color: '#4AA3FF' }}>Precise: On</span>
          </div>
          <div style={{ position: 'absolute', left: '50%', top: '54%', transform: 'translate(-50%,-50%)', width: 16, height: 16, borderRadius: '50%', background: '#4A8AFF', border: '3px solid #fff', boxShadow: '0 0 0 6px rgba(74,138,255,0.22)' }} />
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
          <div style={btn} onClick={onAllowOnce}>Allow Once</div>
          <div style={{ ...btn, color: 'var(--color-action-primary)', fontWeight: 800 }} onClick={onAllowWhileUsing}>Allow While Using App</div>
          <div style={btn} onClick={onDeny}>Don&rsquo;t Allow</div>
        </div>
      </div>
    </div>
  );
}

// ── Map view: full-bleed map, floating app bar, bottom sheet with a Sehri carousel ──
function SehriMapScreen({
  points = SEHRI,
  selectedIdx = 0,
  onSelectPoint,
  onBack,
  onOpenList,
  permission = false,
  onAllowOnce,
  onAllowWhileUsing,
  onDeny,
  loading = false,
  error = false,
  onRetry,
}) {
  const list = points || SEHRI;
  const statusKind = error ? 'error' : loading && list.length === 0 ? 'loading' : !loading && list.length === 0 ? 'empty' : null;
  const sheetTitle = error
    ? 'Couldn’t load nearby Sehri'
    : loading && list.length === 0
      ? 'Finding nearby Sehri'
      : list.length === 0
        ? 'No Sehri nearby'
        : `${list.length} Sehri Locations Nearby`;
  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden', background: '#1C2535' }}>
      <MapCanvas points={list} selectedIdx={selectedIdx} onSelectPoint={onSelectPoint} />

      <SehriAppBar onBack={onBack} />

      {/* Bottom sheet */}
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, zIndex: 20, background: 'color-mix(in oklab, var(--color-surface-primary) 92%, transparent)', backdropFilter: 'blur(24px) saturate(180%)', WebkitBackdropFilter: 'blur(24px) saturate(180%)', borderTop: '1px solid var(--color-neutral-border)', borderRadius: '24px 24px 0 0', padding: '10px 16px 22px', boxSizing: 'border-box' }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 12 }}>
          <div style={{ width: 38, height: 4, borderRadius: 2, background: 'var(--color-info-faint)' }} />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginBottom: 14 }}>
          <span style={{ fontFamily: 'var(--font-title)', fontSize: 22, color: 'var(--color-info-primary)', letterSpacing: '-0.3px', minWidth: 0 }}>{sheetTitle}</span>
          {list.length > 0 && (
            <button className="ib ib-tonal primary md" onClick={onOpenList} aria-label="List view">
              <span className="mi" data-i="format_list_bulleted"></span>
            </button>
          )}
        </div>

        {statusKind ? (
          <SehriStatusCard kind={statusKind} onRetry={onRetry} />
        ) : (
          <div style={{ overflow: 'hidden' }}>
            <div style={{ display: 'flex', transform: `translateX(-${selectedIdx * 100}%)`, transition: 'transform var(--motion-standard) var(--ease-out)' }}>
              {list.map((p, i) => (
                <div key={i} style={{ flex: '0 0 100%', minWidth: 0, boxSizing: 'border-box' }}>
                  <SehriCard p={p} onCall={() => {}} onNavigate={() => {}} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Dots */}
        {!statusKind && <div style={{ display: 'flex', justifyContent: 'center', gap: 5, marginTop: 14 }}>
          {list.map((p, i) => {
            const active = i === selectedIdx;
            return (
              <div key={i} onClick={() => onSelectPoint && onSelectPoint(i)} style={{ height: 4, width: active ? 20 : 6, borderRadius: 2, background: active ? 'var(--color-info-primary)' : 'var(--color-info-faint)', transition: 'width var(--motion-standard) var(--ease-out)', cursor: 'pointer' }} />
            );
          })}
        </div>}
      </div>

      {/* Location permission (system alert over the map) */}
      {permission && (
        <LocationPermissionSheet onAllowOnce={onAllowOnce} onAllowWhileUsing={onAllowWhileUsing} onDeny={onDeny} />
      )}
    </div>
  );
}

// ── List view: map fixed behind, a vertical list of Sehri cards scrolls over it ──
function SehriListScreen({
  points = SEHRI,
  onBack,
  onOpenMap,
}) {
  const list = points || SEHRI;
  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden', background: 'var(--color-surface-primary)' }}>
      {/* Map backdrop (markers sit behind, contained by MapCanvas' stacking context) */}
      <MapCanvas points={list} selectedIdx={-1} />
      {/* Frosted sheet — translucent + blur so the map & markers read faintly behind; the
          mask keeps a clear map strip at top for the headline (same technique as .app-bar). */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 1,
        background: 'color-mix(in oklab, var(--color-surface-primary) 80%, transparent)',
        backdropFilter: 'blur(22px) saturate(160%)', WebkitBackdropFilter: 'blur(22px) saturate(160%)',
        WebkitMaskImage: 'linear-gradient(to bottom, transparent 0, transparent 12%, #000 30%, #000 100%)',
        maskImage: 'linear-gradient(to bottom, transparent 0, transparent 12%, #000 30%, #000 100%)'
      }} />

      {/* Scrolling list */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 2, overflowY: 'auto', WebkitOverflowScrolling: 'touch', paddingTop: 140, paddingBottom: 28, boxSizing: 'border-box' }}>
        {/* Headline — sits over the visible map strip */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, padding: '0 16px', marginBottom: 16 }}>
          <div style={{ fontFamily: 'var(--font-title)', fontSize: 26, color: '#fff', letterSpacing: '-0.3px', textShadow: '0 1px 6px rgba(0,0,0,0.55)', minWidth: 0 }}>{list.length} Sehri Locations Nearby</div>
          <button
            className="ib md"
            onClick={onOpenMap}
            aria-label="Map view"
            style={{ flexShrink: 0, background: 'rgba(255,255,255,0.16)', border: '1px solid rgba(255,255,255,0.28)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', boxShadow: '0 2px 10px rgba(0,0,0,0.28)' }}
          >
            <span className="mi" style={{ color: 'var(--color-action-primary)' }} data-i="map"></span>
          </button>
        </div>

        {/* Cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, padding: '0 16px' }}>
          {list.map((p, i) => (
            <SehriCard key={i} p={p} onCall={() => {}} onNavigate={() => {}} />
          ))}
        </div>
      </div>

      <SehriAppBar onBack={onBack} />
    </div>
  );
}

Object.assign(window, { SEHRI, SehriMapScreen, SehriListScreen, LocationPermissionSheet });
