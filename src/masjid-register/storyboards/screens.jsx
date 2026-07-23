// Shared screen components for the Masjid registration / onboarding flow.
// Used by BOTH the static storyboards (*-row.jsx) and the live device (Masjid Onboarding.dc.html).
//
// Ported from the old flat `src/Masjid Onboarding.dc.html`. Deliberate changes from the source:
//   1. My Masjids (Manage + Follow) is the single `MyMasjidsSheet` bottom sheet — opened by tapping
//      the masjid name on the Home / Salaah / Profile tab (those tabs are the REAL shared screens
//      from ../home/storyboards/screens.jsx). The left-column exploration gallery is dropped.
//   2. All hardcoded hex / font literals are mapped to semantic DS tokens; DS component classes
//      (.btn, .ib, .tbar, .input, .dlg) are used instead of inline re-implementations where they fit.
//
// Every screen takes ONE `data` object prop (built in the board's renderVals / in the rows), so the
// dc x-import only binds a single value per screen.

const MANAGE_DATA = [
  { id: 'dargha', name: 'Dargha Masjid 3', sub: 'Molakalmuru · 577535', letter: 'D' },
  { id: 'mohammadi', name: 'Masjid-e-Mohammadi', sub: 'Bengaluru · 560064', letter: 'M' }
];
const FOLLOW_DATA = [
  { id: 'subhania', name: 'Masjid-e-Subhania', sub: 'HBR Layout · 560064', letter: 'S', city: 'Bengaluru' },
  { id: 'bilal', name: 'Bilal Masjid', sub: 'BTM Layout · 560076', letter: 'B', city: 'Bengaluru' },
  { id: 'jamia', name: 'Jamia Masjid Shivajinagar', sub: 'Shivajinagar · 560001', letter: 'J', city: 'Bengaluru' },
  { id: 'noor', name: 'Noor Masjid', sub: 'Main Road · 577535', letter: 'N', city: 'Molakalmuru' },
  { id: 'aqsa', name: 'Masjid-e-Aqsa', sub: 'Gandhi Nagar · 577535', letter: 'M', city: 'Molakalmuru' }
];
const REGISTRATION_DATA = {
  id: 'registration-noor',
  name: 'Masjid-e-Noor',
  status: 'pending',
  statusLabel: 'Verification pending',
  description: 'Submitted for review. Tap to view progress.'
};
const CLAIM_DATA = [
  { id: 1, name: 'Jama Masjid Mahim', addr: 'St. Michael Church Rd, Mahim, Mumbai', dist: '0.4 km' },
  { id: 2, name: 'Masjid-e-Noor', addr: 'Kabutar Khana, Mahim, Mumbai', dist: '0.9 km' },
  { id: 3, name: 'Anjuman-e-Islam Masjid', addr: 'Cadell Road, Mahim, Mumbai', dist: '1.6 km' }
];
const ROLE_LIST = ['Chairman', 'Assistant Chairman', 'Secretary', 'Assistant Secretary', 'Treasurer', 'Assistant Treasurer', 'Member', 'Imam', 'Muezzin'];
const MASLAK_LIST = ['Ahle Hadith', 'Ahle Sunnat Wal Jamaat (Barelvi)', 'Ahle Sunnat Wal Jamaat (Deoband)'];
const STATE_LIST = [
  'Andaman and Nicobar Islands', 'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar',
  'Chandigarh', 'Chhattisgarh', 'Dadra and Nagar Haveli and Daman and Diu', 'Delhi', 'Goa',
  'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jammu and Kashmir', 'Jharkhand', 'Karnataka',
  'Kerala', 'Ladakh', 'Lakshadweep', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya',
  'Mizoram', 'Nagaland', 'Odisha', 'Puducherry', 'Punjab', 'Rajasthan', 'Sikkim',
  'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal'
];

const FONT_B = 'var(--font-body)';
const FONT_T = 'var(--font-title)';

// A tokenised text field shell (label + framed input) — the wizard reuses it for every text step.
function Field({ label, children, helper, error, mb = 16 }) {
  return (
    <div style={{ marginBottom: mb }}>
      {label ? <div style={{ fontFamily: FONT_B, fontSize: 13, fontWeight: 600, color: 'var(--color-info-primary)', marginBottom: 6 }}>{label}</div> : null}
      {children}
      {error ? <div className="helper err" role="alert">{error}</div> : null}
      {!error && helper ? <div className="helper">{helper}</div> : null}
    </div>
  );
}
// Consumes the DS `.input` atom (components.css). Pass `code` for the fixed-length numeric
// variant (`.input.code`) — pincode / PIN — reserved for entries where each digit should read
// distinctly. Standard (proportional 16px) is the default for all free-text fields.
function TextInput({ value, onChange, placeholder, maxLength, inputMode, code, error, readOnly }) {
  return (
    <div className={`${code ? 'input code' : 'input'} ${error ? 'error' : ''} ${readOnly ? 'disabled' : ''}`}>
      <div className="inner">
        <input className="val" value={value || ''} onChange={onChange} placeholder={placeholder} maxLength={maxLength} inputMode={inputMode} readOnly={readOnly} />
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════
// 1 · My Masjids — bottom sheet (Manage / Follow). Device-level overlay,
//     opened by tapping the masjid name/header on Home, Salaah or Profile.
//     Uses the DS .dlg-scrim.sheet + .dlg construction (same as the app's
//     other bottom sheets). `data.isOpen` gates it.
// ══════════════════════════════════════════════════════════════════════
function PrimaryMasjidSummary({ masjid }) {
  if (!masjid) return null;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '11px 12px', marginBottom: 12, borderRadius: 14,
      background: 'var(--color-surface-secondary)', border: '1px solid var(--color-action-primary)' }}>
      <div style={{ width: 38, height: 38, borderRadius: 11, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, background: 'var(--color-action-background)' }}>
        <span className="mi fill" style={{ fontSize: 20, color: 'var(--color-action-primary)', fontVariationSettings: "'FILL' 1" }} data-i="mosque"></span>
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: FONT_B, fontSize: 10.5, lineHeight: 1.3, fontWeight: 700, color: 'var(--color-action-primary)', marginBottom: 1 }}>PRIMARY MASJID</div>
        <div style={{ fontFamily: FONT_B, fontSize: 14, lineHeight: 1.3, fontWeight: 700, color: 'var(--color-info-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{masjid.name}</div>
        <div style={{ fontFamily: FONT_B, fontSize: 10.5, lineHeight: 1.35, color: 'var(--color-info-secondary)' }}>Your salaah timings use this masjid.</div>
      </div>
      <span className="badge sm teal">Current</span>
    </div>
  );
}

function SwitchMasjidAction({ current, onClick }) {
  if (current) return <span className="badge sm teal">Current</span>;
  return (
    <button className="btn btn-tonal sm masjid-switch-action" onClick={(e) => { e.stopPropagation(); onClick && onClick(); }} style={{ flexShrink: 0 }}>
      <span className="mi" aria-hidden="true" data-i="swap_horiz"></span>
      <span>Switch</span>
    </button>
  );
}

function RegistrationTile({ registration }) {
  if (!registration) return null;
  const rejected = registration.status === 'rejected';
  return (
    <button className="registration-tile" onClick={registration.onOpen}>
      <span className="registration-tile-icon">
        <span className="mi" data-i={rejected ? 'error' : 'schedule'}></span>
      </span>
      <span className="registration-tile-copy">
        <span className="registration-tile-title">{registration.name}</span>
        <span className="registration-tile-subtitle">{rejected ? 'Update and resubmit' : 'Verification in progress'}</span>
        <span className={`badge sm ${rejected ? 'coral' : 'amber'}`}>{registration.statusLabel}</span>
      </span>
      <span className="mi registration-tile-chevron" data-i="chevron_right"></span>
    </button>
  );
}

function MyMasjidsSheet({ data = {} }) {
  const {
    isOpen,
    tab = 'manage',
    onTab,
    manageTiles = [],
    followRows = [],
    registration,
    onClose,
    onRegister,
    onFind,
  } = data;
  if (!isOpen) return null;
  const manageCount = manageTiles.length + (registration ? 1 : 0);
  const hasManage = manageCount > 0;
  const hasFollowing = followRows.length > 0;
  const showTabs = hasManage && hasFollowing;
  const activeSection = showTabs ? tab : (hasManage ? 'manage' : 'follow');
  const isManage = activeSection === 'manage';
  const manageItemCount = manageTiles.length + 1;
  const finalManageItemIsOdd = manageItemCount % 2 === 1;
  const primaryMasjid = manageTiles.find((masjid) => masjid.isPrimary)
    || followRows.find((masjid) => masjid.checked);
  const canSwitchInSection = isManage
    ? manageTiles.some((masjid) => !masjid.isPrimary)
    : followRows.some((masjid) => !masjid.checked);
  const sectionLabelStyle = {
    fontFamily: FONT_B,
    fontSize: 12,
    fontWeight: 700,
    color: 'var(--color-info-secondary)',
    marginBottom: 10,
  };
  return (
    <div className="dlg-scrim sheet" onClick={onClose}>
      <div className="dlg" onClick={(e) => e.stopPropagation()} style={{ maxHeight: '84%', overflow: 'hidden' }}>
        <div className="dlg-handle" />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14, flexShrink: 0 }}>
          <span className="dlg-title">My Masjids</span>
          <span onClick={onClose} className="mi" style={{ fontSize: 24, color: 'var(--color-info-faint)', cursor: 'pointer' }} data-i="close"></span>
        </div>
        <div style={{ flexShrink: 0 }}>
          <PrimaryMasjidSummary masjid={primaryMasjid} />
          {showTabs ? (
            <div className="tbar" style={{ marginBottom: 14 }}>
              <div className={`tab ${isManage ? 'active' : ''}`} onClick={() => onTab && onTab('manage')}>Manage ({manageCount})</div>
              <div className={`tab ${!isManage ? 'active' : ''}`} onClick={() => onTab && onTab('follow')}>Following ({followRows.length})</div>
            </div>
          ) : (
            <div style={sectionLabelStyle}>{isManage ? `Manage (${manageCount})` : `Following (${followRows.length})`}</div>
          )}
        </div>

        <div style={{ minHeight: 0, overflowY: 'auto', overscrollBehavior: 'contain' }}>
          {primaryMasjid && canSwitchInSection ? (
            <div style={{ fontFamily: FONT_B, fontSize: 10.5, lineHeight: 1.4, color: 'var(--color-info-secondary)', margin: '-2px 2px 10px' }}>
              Choose <b style={{ color: 'var(--color-info-primary)' }}>Switch</b> to use another masjid for salaah timings.
            </div>
          ) : null}

          {isManage ? (
            <div>
            <div className="masjid-manage-grid">
              {manageTiles.map((t) => (
                <div key={t.id} onClick={t.isPrimary ? undefined : t.onSelect} style={{ position: 'relative', borderRadius: 16, padding: '14px 12px', boxSizing: 'border-box', cursor: t.isPrimary ? 'default' : 'pointer', minHeight: 108,
                  background: t.isPrimary ? 'var(--color-action-primary)' : 'var(--color-surface-card)',
                  border: t.isPrimary ? '1px solid transparent' : '1px solid var(--color-neutral-border)',
                  boxShadow: t.isPrimary ? 'var(--shadow-button)' : 'none' }}>
                  {t.isPrimary && <span className="mi" style={{ position: 'absolute', top: 10, right: 10, fontSize: 16, color: 'var(--color-action-primary-inverse)' }} data-i="check_circle"></span>}
                  <span className={`mi ${t.isPrimary ? 'fill' : ''}`} style={{ fontSize: 22, color: t.isPrimary ? 'var(--color-action-primary-inverse)' : 'var(--color-info-secondary)', fontVariationSettings: t.isPrimary ? "'FILL' 1" : "'FILL' 0" }} data-i="mosque"></span>
                  <div style={{ fontFamily: FONT_B, fontSize: 13.5, fontWeight: 700, marginTop: 8, lineHeight: 1.25, color: t.isPrimary ? 'var(--color-action-primary-inverse)' : 'var(--color-info-primary)' }}>{t.name}</div>
                  <div style={{ fontFamily: FONT_B, fontSize: 10.5, marginTop: 2, color: t.isPrimary ? 'color-mix(in oklab, var(--color-action-primary-inverse) 80%, transparent)' : 'var(--color-info-secondary)' }}>{t.sub}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 8, fontFamily: FONT_B, fontSize: 10.5, fontWeight: 700, color: t.isPrimary ? 'var(--color-action-primary-inverse)' : 'var(--color-action-primary)' }}>
                    <span className="mi" style={{ fontSize: 15 }} data-i={t.isPrimary ? 'check' : 'swap_horiz'}></span>
                    {t.isPrimary ? 'Current' : 'Switch'}
                  </div>
                </div>
              ))}
              <div className={finalManageItemIsOdd ? 'masjid-manage-grid-item-wide' : undefined}>
                {registration ? (
                  <RegistrationTile registration={registration} />
                ) : (
                  <button className="register-masjid-tile" onClick={onRegister}>
                    <span className="mi" data-i="add"></span>
                    <span>Register masjid</span>
                  </button>
                )}
              </div>
            </div>
            {!hasFollowing ? (
              <button className="btn btn-tonal lg" onClick={onFind} style={{ width: '100%' }}>
                <span className="mi" style={{ fontSize: 20 }} data-i="travel_explore"></span>
                Find a masjid to follow
              </button>
            ) : null}
            </div>
          ) : (
            <div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginBottom: 12 }}>
              {followRows.map((f) => (
                <div key={f.id}>
                  <div onClick={f.checked ? undefined : f.onToggle} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 12, cursor: f.checked ? 'default' : 'pointer', background: f.checked ? 'var(--color-surface-secondary)' : 'transparent' }}>
                    <div style={{ width: 34, height: 34, borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, background: f.checked ? 'var(--color-action-primary)' : 'var(--color-input-background)' }}>
                      <span style={{ fontFamily: FONT_T, fontSize: 14, color: f.checked ? 'var(--color-action-primary-inverse)' : 'var(--color-info-secondary)' }}>{f.letter}</span>
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontFamily: FONT_B, fontSize: 14, color: 'var(--color-info-primary)', fontWeight: f.checked ? 700 : 400, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{f.name}</div>
                      <div style={{ fontFamily: FONT_B, fontSize: 11, color: 'var(--color-info-secondary)' }}>{f.sub}</div>
                    </div>
                    <SwitchMasjidAction current={f.checked} onClick={f.onToggle} />
                  </div>
                </div>
              ))}
            </div>
            <button className="btn btn-tonal lg" onClick={onFind} style={{ width: '100%' }}>
              <span className="mi" style={{ fontSize: 20 }} data-i="location_on"></span>
              Find another masjid
            </button>
            {!hasManage ? (
              <button className="btn btn-link" onClick={onRegister} style={{ width: '100%', marginTop: 12 }}>Register a masjid</button>
            ) : null}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════
// 3 · Register wizard — one screen, `data.step` selects the body
// ══════════════════════════════════════════════════════════════════════
const WIZARD_TITLE = { fontFamily: FONT_T, letterSpacing: '-0.5px', color: 'var(--color-info-primary)' };
const WIZARD_SUB = { fontFamily: FONT_B, fontSize: 14, lineHeight: 1.6, color: 'var(--color-info-secondary)' };

function OptionSheet({ open, title, options, onClose }) {
  if (!open) return null;
  return (
    <div className="dlg-scrim sheet wizard-option-scrim" onClick={onClose}>
      <div className="dlg wizard-option-sheet" onClick={(event) => event.stopPropagation()}>
        <div className="dlg-handle"></div>
        <div className="wizard-option-header">
          <span className="dlg-title">{title}</span>
          <button className="ib ib-tonal md" onClick={onClose} aria-label="Close selection">
            <span className="mi" data-i="close"></span>
          </button>
        </div>
        <div className="wizard-option-list">
          {options.map((opt, i) => (
            <button key={i} className={`wizard-option ${opt.selected ? 'selected' : ''}`} onClick={opt.onSelect}>
              <span>{opt.name}</span>
              <span className="wizard-option-mark">
                <span className="mi" data-i={opt.selected ? 'radio_button_checked' : 'radio_button_unchecked'}></span>
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function PickerField({ display, filled, onOpen, error }) {
  return (
    <button className={`picker-field ${error ? 'error' : ''}`} onClick={onOpen} aria-haspopup="dialog">
      <span className={filled ? 'picker-field-value' : 'picker-field-placeholder'}>{display}</span>
      <span className="mi" data-i="expand_more"></span>
    </button>
  );
}

function ReviewRow({ label, value, onEdit, border }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: 14, borderBottom: border ? '1px solid var(--color-neutral-border)' : 'none' }}>
      <div style={{ flex: 1 }}>
        <div style={{ fontFamily: FONT_B, fontSize: 11.5, color: 'var(--color-info-secondary)' }}>{label}</div>
        <div style={{ fontFamily: FONT_B, fontSize: 14.5, fontWeight: 600, color: 'var(--color-info-primary)' }}>{value}</div>
      </div>
      <button className="btn btn-link sm" onClick={onEdit}>Edit</button>
    </div>
  );
}

function LocationMap({ d }) {
  return (
    <div className={`wizard-map ${d.locationExpanded ? 'expanded' : ''}`}>
      <div className="wizard-map-grid"></div>
      <div className="wizard-map-road"></div>
      <div className="wizard-map-pin">
        <span className="mi fill" style={{ fontVariationSettings: "'FILL' 1" }} data-i="location_on"></span>
      </div>
      <div className="wizard-map-actions">
        <button className="ib ib-tonal md" onClick={d.onRecenterLocation} aria-label="Use my current location">
          <span className="mi" data-i="my_location"></span>
        </button>
        <button className="ib ib-tonal md" onClick={d.onToggleLocationExpanded} aria-label={d.locationExpanded ? 'Collapse map' : 'Expand map'}>
          <span className="mi" data-i={d.locationExpanded ? 'contract' : 'unfold_more'}></span>
        </button>
      </div>
      <button className="wizard-map-status" onClick={d.onTogglePin}>
        <span className="mi" style={{ fontSize: 18, color: 'var(--color-action-primary)' }} data-i={d.pinDropped ? 'check_circle' : 'location_on'}></span>
        <span>{d.pinDropped ? 'Entrance pinned · tap the map to adjust' : 'Tap the map to pin the masjid entrance'}</span>
      </button>
    </div>
  );
}

function CameraPermission({ mode, state, onAllow, onOpenSettings, onClose }) {
  const denied = state === 'denied';
  return (
    <div className="camera-stage">
      <div className="camera-topbar">
        <button className="ib ib-tonal md camera-control" onClick={onClose} aria-label="Close camera">
          <span className="mi" data-i="close"></span>
        </button>
        <div className="camera-title">{mode === 'selfie' ? 'Identity photo' : 'Masjid photo'}</div>
        <div style={{ width: 40 }}></div>
      </div>
      <div className="camera-permission">
        <div className="camera-permission-icon">
          <span className="mi" data-i={denied ? 'videocam_off' : 'photo_camera'}></span>
        </div>
        <h2>{denied ? 'Camera access is off' : 'Allow camera access'}</h2>
        <p>
          {denied
            ? `Enable camera access in Settings, then return here to ${mode === 'selfie' ? 'verify your identity' : 'take a live masjid photo'}.`
            : `Paigham uses the camera only to ${mode === 'selfie' ? 'verify your identity for this registration' : 'add a recognisable photo of the masjid'}.`}
        </p>
        {denied ? (
          <div className="camera-permission-steps">
            <b>Settings</b> → <b>Privacy &amp; Security</b> → <b>Camera</b> → turn on <b>Paigham</b>.
          </div>
        ) : null}
        <button className="btn btn-filled lg" onClick={denied ? onOpenSettings : onAllow}>
          <span className="mi" data-i={denied ? 'settings' : 'photo_camera'}></span>
          {denied ? 'Open Settings' : 'Use camera'}
        </button>
        <button className="btn btn-link" onClick={onClose} style={{ marginTop: 10, color: 'color-mix(in oklab,var(--color-neutral-white) 76%,transparent)' }}>
          {mode === 'masjid' ? 'Not now' : 'Go back'}
        </button>
      </div>
    </div>
  );
}

function CameraStage({ d }) {
  if (!d.cameraMode) return null;
  if (d.cameraPermission !== 'granted') {
    return (
      <CameraPermission
        mode={d.cameraMode}
        state={d.cameraPermission}
        onAllow={d.onAllowCamera}
        onOpenSettings={d.onOpenCameraSettings}
        onClose={d.onCloseCamera}
      />
    );
  }
  const selfie = d.cameraMode === 'selfie';
  const imageSrc = selfie ? '../images/identity-camera-preview.png' : '../images/masjid-camera-preview.png';
  const captured = d.cameraStage === 'captured';
  const locationUnavailable = !selfie && d.captureLocationStatus === 'unavailable';
  return (
    <div className="camera-stage">
      <div className="camera-topbar">
        <button className="ib ib-tonal md camera-control" onClick={d.onCloseCamera} aria-label="Close camera">
          <span className="mi" data-i="close"></span>
        </button>
        <div className="camera-title">
          {captured ? 'Review photo' : (selfie ? 'Identity photo' : 'Masjid photo')}
          <small>{captured ? 'This is exactly what will be saved' : (selfie ? 'Keep your face inside the guide' : 'Keep the entrance within the frame')}</small>
        </div>
        <button className="ib ib-tonal md camera-control" onClick={d.onFlipCamera} aria-label="Switch camera">
          <span className="mi" data-i="swap_horiz"></span>
        </button>
      </div>
      <div className={`camera-viewport ${selfie ? 'selfie' : ''}`}>
        <img src={imageSrc} alt="" />
        {!captured ? <div className={`camera-guide ${selfie ? 'selfie' : ''}`}></div> : null}
        {!selfie && !locationUnavailable ? (
          <div className="camera-location-card">
            <div className="camera-location-map" aria-hidden="true">
              <span className="camera-location-road road-one"></span>
              <span className="camera-location-road road-two"></span>
              <span className="mi" data-i="location_on"></span>
            </div>
            <div className="camera-location-copy">
              <strong>{captured ? 'Location attached' : 'Live location'}</strong>
              <span>{d.capturePlace || 'Kabutar Khana, Mumbai'}</span>
              <small>
                {d.captureCoordinates || '19.0206, 72.8406'} · {d.captureAccuracy || '±8 m'}
              </small>
            </div>
          </div>
        ) : null}
        {!selfie && locationUnavailable ? (
          <div className={`camera-location-status ${locationUnavailable ? 'warning' : ''}`}>
            <span className="mi" data-i={locationUnavailable ? 'location_off' : 'my_location'}></span>
            Location unavailable
          </div>
        ) : null}
        {locationUnavailable ? (
          <div className="camera-location-recovery">
            <div>Turn on location so Paigham can compare this photo with the entrance pin.</div>
            <button className="btn btn-tonal sm" onClick={d.onRetryCaptureLocation}>Retry location</button>
          </div>
        ) : null}
        {!captured ? <div className="camera-help">{selfie ? 'Look directly at the camera in good light' : 'Show the entrance and masjid name if visible'}</div> : null}
      </div>
      {captured ? (
        <div className="camera-capture-actions">
          <button className="btn btn-filled lg camera-use-photo" onClick={d.onUseCapture}>
            <span className="mi" data-i="check"></span>
            Use this photo
          </button>
          <button className="btn btn-link camera-retake-photo" onClick={d.onRetakeCamera}>Retake photo</button>
        </div>
      ) : (
        <div className="camera-controls">
          {!selfie ? (
            <button className="ib ib-tonal md camera-control" onClick={d.onRetryCaptureLocation} aria-label="Refresh capture location">
              <span className="mi" data-i="my_location"></span>
            </button>
          ) : <div></div>}
          <button className="camera-shutter" onClick={d.onCapture} aria-label="Take photo"></button>
          <button className="ib ib-tonal md camera-control" onClick={d.onToggleFlash} aria-label="Toggle flash">
            <span className="mi" data-i="wb_sunny"></span>
          </button>
        </div>
      )}
    </div>
  );
}

function PhotoCaptureCard({ mode, captured, locationAttached, imageSrc, onOpen, onRemove, error }) {
  const selfie = mode === 'selfie';
  const resolvedImage = imageSrc || (selfie ? '../images/identity-camera-preview.png' : '../images/masjid-camera-preview.png');
  if (captured) {
    return (
      <div>
        <div className={`capture-thumbnail ${selfie ? 'selfie camera-source' : ''}`}>
          <img src={resolvedImage} alt={selfie ? 'Selected identity photo' : 'Selected masjid photo'} />
          <span className="badge sm teal" style={{ position: 'absolute', top: 10, right: 10 }}>
            <span className="mi" style={{ fontSize: 14 }} data-i={selfie ? 'check' : 'my_location'}></span>
            {selfie ? 'Captured' : (locationAttached ? 'Location attached' : 'Captured')}
          </span>
        </div>
        <button className="btn btn-tonal photo-retake-action" onClick={onOpen}>
          <span className="mi" data-i="photo_camera"></span>
          Retake photo
        </button>
        {!selfie && onRemove ? <button className="btn btn-link photo-remove-action" onClick={onRemove}>Remove photo</button> : null}
      </div>
    );
  }
  return (
    <div className={`photo-source-panel ${error ? 'error' : ''}`}>
      <div className="photo-source-intro">
        <div className="photo-source-icon">
          <span className="mi" data-i={selfie ? 'person' : 'photo_camera'}></span>
        </div>
        <div>
          <div className="photo-source-title">{selfie ? 'Add a recent photo of yourself' : 'Add a clear masjid photo'}</div>
          <div className="photo-source-copy">
            {selfie ? 'Face the camera in good light without covering your face.' : 'Show the entrance or masjid name if it is visible.'}
          </div>
        </div>
      </div>
      <div className="photo-source-actions">
        <button className="btn btn-filled lg" onClick={onOpen}>
          <span className="mi" data-i="photo_camera"></span>
          Open camera
        </button>
      </div>
      <div className="photo-source-note">
        <span className="mi" data-i={selfie ? 'verified' : 'my_location'}></span>
        {selfie ? 'The captured image is used only for verification.' : 'At capture, Paigham attaches the device location and compares it with the entrance pin.'}
      </div>
      {error ? (
        <div className="photo-source-error" role="alert">
          <span className="mi" data-i="error"></span>
          {error}
        </div>
      ) : null}
    </div>
  );
}

function WizardBody({ d }) {
  const step = d.step;
  if (step === 'pincode') {
    return (
      <div>
        <div style={{ ...WIZARD_TITLE, fontSize: 28, lineHeight: 1.2, marginBottom: 10 }}>Bring your masjid to Paigham</div>
        <div style={{ ...WIZARD_SUB, fontSize: 15, lineHeight: 1.55, marginBottom: 26 }}>Enter your masjid's pincode to check if it's already listed, or register it fresh.</div>
        <Field label="Pincode" error={d.errors && d.errors.pincode} mb={0}>
          <TextInput value={d.pincode} onChange={d.onPincodeChange} placeholder="6-digit pincode" maxLength={6} inputMode="numeric" code error={d.errors && d.errors.pincode} />
        </Field>
        <div style={{ fontFamily: FONT_B, fontSize: 12.5, color: 'var(--color-info-secondary)', marginTop: 14, lineHeight: 1.6 }}>Tip — try <b style={{ color: 'var(--color-info-primary)' }}>400001</b> to see claimable masjids, or any other 6 digits to see the register-new path.</div>
      </div>
    );
  }
  if (step === 'searching') {
    return (
      <div>
        <div style={{ ...WIZARD_TITLE, fontSize: 24, marginBottom: 4 }}>Searching near {d.pincode}</div>
        <div style={{ ...WIZARD_SUB, marginBottom: 18 }}>Checking for masjids already listed in this pincode…</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {[1, 2, 3].map((i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 14, borderRadius: 16, background: 'var(--color-surface-card)', border: '1px solid var(--color-neutral-border)' }}>
              <div style={{ width: 20, height: 20, borderRadius: '50%', background: 'var(--color-action-background)', flexShrink: 0, animation: 'pulse 1.1s ease-in-out infinite' }}></div>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
                <div style={{ width: '60%', height: 12, borderRadius: 6, background: 'var(--color-action-background)', animation: 'pulse 1.1s ease-in-out infinite' }}></div>
                <div style={{ width: '85%', height: 10, borderRadius: 6, background: 'var(--color-action-background)', animation: 'pulse 1.1s ease-in-out infinite' }}></div>
              </div>
              <div style={{ width: 40, height: 18, borderRadius: 999, background: 'var(--color-action-background)', flexShrink: 0, animation: 'pulse 1.1s ease-in-out infinite' }}></div>
            </div>
          ))}
        </div>
      </div>
    );
  }
  if (step === 'claimList') {
    return (
      <div>
        <div style={{ ...WIZARD_TITLE, fontSize: 24, marginBottom: 4 }}>Is your masjid here?</div>
        <div style={{ ...WIZARD_SUB, marginBottom: 18 }}>Unclaimed masjids near {d.pincode}. Select yours to continue.</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 8 }}>
          {d.claimResults.map((m) => (
            <div key={m.id} onClick={m.onSelect} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 14, borderRadius: 16, cursor: 'pointer',
              background: m.selected ? 'var(--color-surface-secondary)' : 'var(--color-surface-card)', border: `1.5px solid ${m.selected ? 'var(--color-action-primary)' : 'var(--color-neutral-border)'}` }}>
              <div style={{ width: 20, height: 20, borderRadius: '50%', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
                border: `2px solid ${m.selected ? 'var(--color-action-primary)' : 'var(--color-info-faint)'}`, background: m.selected ? 'var(--color-action-primary)' : 'transparent' }}>
                {m.selected && <div style={{ width: 9, height: 9, borderRadius: '50%', background: 'var(--color-action-primary-inverse)' }}></div>}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: FONT_B, fontSize: 15, fontWeight: 700, color: 'var(--color-info-primary)' }}>{m.name}</div>
                <div style={{ fontFamily: FONT_B, fontSize: 12.5, color: 'var(--color-info-secondary)' }}>{m.addr}</div>
              </div>
              <div style={{ background: 'var(--color-surface-secondary)', borderRadius: 999, padding: '4px 10px', flexShrink: 0 }}>
                <span style={{ fontFamily: FONT_B, fontSize: 11.5, fontWeight: 700, color: 'var(--color-action-primary)' }}>{m.dist}</span>
              </div>
            </div>
          ))}
        </div>
        {d.errors && d.errors.claim ? <div className="helper err" role="alert" style={{ marginBottom: 12 }}>{d.errors.claim}</div> : null}
        <div onClick={d.onRegisterManually} style={{ textAlign: 'center', padding: 14, borderRadius: 14, border: '1px dashed var(--color-neutral-brand)', cursor: 'pointer' }}>
          <span style={{ fontFamily: FONT_B, fontSize: 14, fontWeight: 700, color: 'var(--color-neutral-brand)' }}>Can't find your masjid? Add it manually</span>
        </div>
      </div>
    );
  }
  if (step === 'claimEmpty') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '30px 6px 10px' }}>
        <div style={{ width: 76, height: 76, borderRadius: '50%', background: 'var(--color-surface-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
          <span className="mi" style={{ fontSize: 36, color: 'var(--color-action-primary)' }} data-i="mosque"></span>
        </div>
        <div style={{ ...WIZARD_TITLE, fontSize: 22, marginBottom: 10 }}>No listed masjids in {d.pincode} yet</div>
        <div style={{ ...WIZARD_SUB, marginBottom: 26, maxWidth: 280 }}>That just means yours could be the first. Register it now — it takes about two minutes.</div>
      </div>
    );
  }
  if (step === 'register') {
    return (
      <div>
        <div style={{ ...WIZARD_TITLE, fontSize: 26, marginBottom: 8 }}>Masjid details</div>
        <div style={{ ...WIZARD_SUB, marginBottom: 18 }}>We use the pincode to suggest the city and state. You can correct them below.</div>
        {d.locationLookupFailed ? (
          <div className="resolved-location" style={{ borderColor: 'var(--color-status-warning)' }}>
            <span className="mi" style={{ color: 'var(--color-status-warning)' }} data-i="location_on"></span>
            <div style={{ fontFamily: FONT_B, fontSize: 12, lineHeight: 1.5, color: 'var(--color-info-primary)' }}>We could not resolve this pincode. Enter the city and choose a state below.</div>
          </div>
        ) : null}
        <Field label="Masjid name" error={d.errors && d.errors.masjidName}><TextInput value={d.masjidName} onChange={d.onMasjidNameChange} placeholder="e.g. Masjid-e-Noor" error={d.errors && d.errors.masjidName} /></Field>
        <Field label="Address and landmark" error={d.errors && d.errors.address}><TextInput value={d.address} onChange={d.onAddressChange} placeholder="Street, landmark" error={d.errors && d.errors.address} /></Field>
        <Field label="City" error={d.errors && d.errors.city}><TextInput value={d.city} onChange={d.onCityChange} placeholder="City" error={d.errors && d.errors.city} /></Field>
        <Field label="State" error={d.errors && d.errors.stateVal}><PickerField display={d.stateVal || 'Select state'} filled={!!d.stateVal} onOpen={d.onOpenStateSheet} error={d.errors && d.errors.stateVal} /></Field>
        <Field label="Pincode" error={d.errors && d.errors.pincode} mb={20}><TextInput value={d.pincode} onChange={d.onPincodeChange} maxLength={6} inputMode="numeric" code error={d.errors && d.errors.pincode} /></Field>
        <div style={{ fontFamily: FONT_B, fontSize: 13, fontWeight: 700, color: 'var(--color-info-primary)', marginBottom: 8 }}>Pin the masjid entrance</div>
        <LocationMap d={d} />
        {d.errors && d.errors.pinDropped ? <div className="helper err" role="alert">{d.errors.pinDropped}</div> : null}
      </div>
    );
  }
  if (step === 'contact') {
    return (
      <div>
        <div style={{ ...WIZARD_TITLE, fontSize: 26, marginBottom: 10 }}>Who should we contact?</div>
        <div style={{ ...WIZARD_SUB, marginBottom: 22 }}>Our verification team may call this number to confirm the details you've shared.</div>
        <Field label="Contact name" error={d.errors && d.errors.contactName} mb={0}><TextInput value={d.contactName} onChange={d.onContactNameChange} placeholder="Full name" error={d.errors && d.errors.contactName} /></Field>
      </div>
    );
  }
  if (step === 'role') {
    return (
      <div>
        <div style={{ ...WIZARD_TITLE, fontSize: 26, marginBottom: 10 }}>What's your role?</div>
        <div style={{ ...WIZARD_SUB, marginBottom: 22 }}>Your role is verified by our team before this masjid is approved.</div>
        <Field label="Your role" error={d.errors && d.errors.role} mb={0}><PickerField display={d.roleDisplay} filled={d.roleFilled} onOpen={d.onOpenRoleSheet} error={d.errors && d.errors.role} /></Field>
      </div>
    );
  }
  if (step === 'maslak') {
    return (
      <div>
        <div style={{ ...WIZARD_TITLE, fontSize: 26, marginBottom: 10 }}>Which maslak does the masjid follow?</div>
        <div style={{ ...WIZARD_SUB, marginBottom: 22 }}>This helps members find the right community.</div>
        <Field label="Maslak" error={d.errors && d.errors.maslak} mb={0}><PickerField display={d.maslakDisplay} filled={d.maslakFilled} onOpen={d.onOpenMaslakSheet} error={d.errors && d.errors.maslak} /></Field>
      </div>
    );
  }
  if (step === 'photo') {
    return (
      <div>
        <div style={{ ...WIZARD_TITLE, fontSize: 26, marginBottom: 10 }}>Add a photo of the masjid</div>
        <div style={{ ...WIZARD_SUB, marginBottom: 20 }}>This is optional, but it helps members recognise the masjid. A live photo also helps our team verify its location.</div>
        <PhotoCaptureCard
          mode="masjid"
          captured={d.photoTaken}
          locationAttached={d.photoLocationAttached}
          imageSrc={d.photoSrc}
          onOpen={d.onTakePhoto}
          onRemove={d.onRemovePhoto}
        />
      </div>
    );
  }
  if (step === 'selfie') {
    return (
      <div>
        <div style={{ ...WIZARD_TITLE, fontSize: 26, marginBottom: 10 }}>Verify it's you</div>
        <div style={{ ...WIZARD_SUB, marginBottom: 20 }}>Only Paigham's verification team sees this image. It is never shown on your profile.</div>
        <PhotoCaptureCard
          mode="selfie"
          captured={d.selfieTaken}
          imageSrc={d.selfieSrc}
          onOpen={d.onTakeSelfie}
          error={d.errors && d.errors.selfie}
        />
      </div>
    );
  }
  if (step === 'review') {
    const card = { background: 'var(--color-surface-card)', borderRadius: 16, border: '1px solid var(--color-neutral-border)' };
    return (
      <div>
        <div style={{ ...WIZARD_TITLE, fontSize: 28, marginBottom: 8 }}>Check everything</div>
        <div style={{ ...WIZARD_SUB, marginBottom: 20 }}>This is what our verification team will review. You can edit any section before submitting.</div>
        <div className="review-section">
          <div className="review-section-head">
            <span className="review-section-title">Masjid and location</span>
            {!d.masjidLocked ? <button className="btn btn-link sm" onClick={d.onEditRegister}>Edit</button> : null}
          </div>
          <div style={{ ...card, overflow: 'hidden' }}>
            <div style={{ padding: 14, display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 42, height: 42, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--color-action-background)', color: 'var(--color-action-primary)' }}>
                <span className="mi" data-i="mosque"></span>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: FONT_B, fontSize: 15, fontWeight: 700, color: 'var(--color-info-primary)' }}>{d.masjidSummaryName}</div>
                <div style={{ fontFamily: FONT_B, fontSize: 12, lineHeight: 1.45, color: 'var(--color-info-secondary)' }}>{d.masjidSummaryAddr}</div>
              </div>
              {d.masjidLocked ? <span className="badge sm teal">Listed</span> : null}
            </div>
            <div style={{ height: 82, position: 'relative', overflow: 'hidden', borderTop: '1px solid var(--color-neutral-border)', background: 'var(--color-surface-secondary)' }}>
              <div className="wizard-map-grid"></div>
              <div className="wizard-map-road"></div>
              <span className="mi fill" style={{ position: 'absolute', left: '50%', top: '52%', transform: 'translate(-50%,-100%)', color: 'var(--color-action-primary)', fontSize: 30, fontVariationSettings: "'FILL' 1" }} data-i="location_on"></span>
            </div>
          </div>
        </div>
        <div className="review-section">
          <div className="review-section-head"><span className="review-section-title">Your details</span></div>
          <div style={{ ...card, overflow: 'hidden' }}>
            <ReviewRow label="Contact name" value={d.contactName} onEdit={d.onEditContact} border />
            <ReviewRow label="Role" value={d.role} onEdit={d.onEditRole} border />
            <ReviewRow label="Maslak" value={d.maslak} onEdit={d.onEditMaslak} />
          </div>
        </div>
        <div className="review-section">
          <div className="review-section-head">
            <span className="review-section-title">Photos</span>
          </div>
          <div className="review-photo-grid">
            <div className="review-photo">
              {d.photoTaken ? <img src={d.photoSrc || '../images/masjid-camera-preview.png'} alt="Masjid photo for verification" /> : <span className="mi" style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-info-secondary)' }} data-i="photo_camera"></span>}
              <button className="review-photo-edit" onClick={d.onEditPhoto} aria-label="Edit masjid photo">Edit</button>
              <span className="review-photo-label">
                <strong>{d.photoTaken ? 'Masjid photo' : 'Skipped'}</strong>
                {d.photoTaken ? <small>{d.photoLocationAttached ? 'Location attached' : 'Camera'}</small> : null}
              </span>
            </div>
            <div className="review-photo selfie camera-source">
              <img src={d.selfieSrc || '../images/identity-camera-preview.png'} alt="Identity photo for verification" />
              <button className="review-photo-edit" onClick={d.onEditSelfie} aria-label="Edit identity photo">Edit</button>
              <span className="review-photo-label">
                <strong>Identity</strong>
                <small>Camera</small>
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }
  return null;
}

function WizardScreen({ data = {} }) {
  const d = data;
  const dots = Array.from({ length: 8 }, (_, i) => (i + 1) <= d.progressIndex);
  return (
    <div style={{ width: '100%', height: '100%', background: 'var(--color-surface-primary)', display: 'flex', flexDirection: 'column', overflow: 'hidden', position: 'relative' }}>
      <div className="app-bar" style={{ height: 130, flexShrink: 0, position: 'relative', padding: '54px 20px 14px', display: 'flex', flexDirection: 'column', alignItems: 'stretch', gap: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button className="ib ib-tonal md" onClick={d.onBack} aria-label="Back"><span className="mi" data-i="arrow_back"></span></button>
          <span className="ab-title" style={{ flex: 1, fontSize: 23 }}>Register masjid</span>
          <span style={{ fontFamily: FONT_B, fontSize: 12, fontWeight: 700, color: 'var(--color-info-secondary)', whiteSpace: 'nowrap', flexShrink: 0 }}>Step {d.progressIndex} of 8</span>
        </div>
        <div style={{ display: 'flex', gap: 5 }}>
          {dots.map((on, i) => <div key={i} style={{ flex: 1, height: 4, borderRadius: 2, background: on ? 'var(--color-action-primary)' : 'var(--color-action-background)' }}></div>)}
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '12px 20px 16px', position: 'relative' }}>
        <WizardBody d={d} />
        <OptionSheet open={d.roleSheetOpen} title="Select your role" options={d.roleOptions} onClose={d.onCloseSheets} />
        <OptionSheet open={d.maslakSheetOpen} title="Select maslak" options={d.maslakOptions} onClose={d.onCloseSheets} />
        <OptionSheet open={d.stateSheetOpen} title="Select state" options={d.stateOptions} onClose={d.onCloseSheets} />
      </div>

      <div style={{ flexShrink: 0, padding: '12px 20px 26px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {d.showSkipLink && <div onClick={d.ctaOnClick} style={{ textAlign: 'center', cursor: 'pointer' }}><span style={{ fontFamily: FONT_B, fontSize: 14, fontWeight: 600, color: 'var(--color-info-secondary)' }}>Skip for now</span></div>}
        <div className="wizard-cta-feedback" aria-live="polite">{d.ctaFeedback || ''}</div>
        <button className="btn btn-filled lg" onClick={d.ctaOnClick} disabled={d.ctaDisabled} aria-busy={d.ctaBusy ? 'true' : 'false'} style={{ width: '100%' }}>
          {d.ctaBusy ? <span className="btn-spinner"></span> : null}
          {d.ctaLabel}
        </button>
        {d.step === 'review' && <div style={{ textAlign: 'center', fontFamily: FONT_B, fontSize: 12, color: 'var(--color-info-secondary)' }}>A member of our team reviews every submission by hand.</div>}
      </div>
      <CameraStage d={d} />
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════
// 4 · Outcome — submitting · pending · rejected
// ══════════════════════════════════════════════════════════════════════
function OutcomeScreen({ data = {} }) {
  const d = data;
  if (d.variant === 'submitting') {
    return (
      <div style={{ width: '100%', height: '100%', background: 'var(--color-surface-primary)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 18 }}>
        <div className="registration-spinner" style={{ width: 52, height: 52, borderRadius: '50%', border: '4px solid var(--color-surface-secondary)', borderTopColor: 'var(--color-action-primary)', animation: 'spin var(--motion-celebration) linear infinite' }}></div>
        <div style={{ fontFamily: FONT_B, fontSize: 15, fontWeight: 600, color: 'var(--color-info-primary)' }}>Submitting for verification…</div>
      </div>
    );
  }
  if (d.variant === 'pending') {
    return (
      <div className="outcome-screen" style={{ width: '100%', height: '100%', boxSizing: 'border-box', background: 'var(--color-surface-primary)', overflowY: 'auto', overflowX: 'hidden', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '70px 24px 24px', textAlign: 'center' }}>
        <div style={{ width: 84, height: 84, borderRadius: '50%', background: 'var(--color-surface-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 22 }}>
          <span className="mi" style={{ fontSize: 40, color: 'var(--color-action-primary)' }} data-i="hourglass_top"></span>
        </div>
        <div className="outcome-title" style={{ ...WIZARD_TITLE, fontSize: 26, marginBottom: 10 }}>Your masjid is under review</div>
        <div style={{ ...WIZARD_SUB, marginBottom: 24, maxWidth: 290 }}>Thank you, {d.contactName}. Our team typically completes verification within 2–3 working days.</div>
        <div className="outcome-summary" style={{ width: '100%', boxSizing: 'border-box', background: 'var(--color-surface-card)', borderRadius: 16, border: '1px solid var(--color-neutral-border)', padding: 16, textAlign: 'left', marginBottom: 22 }}>
          {[['Masjid', d.masjidSummaryName], ['Your role', d.role], ['Submitted', d.submittedDate]].map(([k, v], i, a) => (
            <div className="outcome-summary-row" key={k} style={{ display: 'flex', justifyContent: 'space-between', gap: 16, paddingBottom: i < a.length - 1 ? 10 : 0, borderBottom: i < a.length - 1 ? '1px solid var(--color-neutral-border)' : 'none', marginBottom: i < a.length - 1 ? 10 : 0 }}>
              <span className="outcome-summary-label" style={{ fontFamily: FONT_B, fontSize: 13, color: 'var(--color-info-secondary)' }}>{k}</span>
              <span className="outcome-summary-value" style={{ fontFamily: FONT_B, fontSize: 13.5, fontWeight: 700, color: 'var(--color-info-primary)' }}>{v}</span>
            </div>
          ))}
        </div>
        <div style={{ width: '100%', textAlign: 'left', marginBottom: 26 }}>
          <div style={{ display: 'flex', gap: 10, marginBottom: 12 }}><span className="mi" style={{ fontSize: 18, color: 'var(--color-action-primary)' }} data-i="check_circle"></span><span style={{ fontFamily: FONT_B, fontSize: 13.5, color: 'var(--color-info-primary)' }}>Submission received</span></div>
          <div style={{ display: 'flex', gap: 10, marginBottom: 12 }}><span className="mi" style={{ fontSize: 18, color: 'var(--color-status-warning)' }} data-i="call"></span><span style={{ fontFamily: FONT_B, fontSize: 13.5, color: 'var(--color-info-primary)' }}>Our team calls to verify details</span></div>
          <div style={{ display: 'flex', gap: 10 }}><span className="mi" style={{ fontSize: 18, color: 'var(--color-info-secondary)' }} data-i="verified"></span><span style={{ fontFamily: FONT_B, fontSize: 13.5, color: 'var(--color-info-secondary)' }}>Masjid approved and published</span></div>
        </div>
        <button className="btn btn-filled lg" onClick={d.onDone} style={{ width: '100%', marginBottom: 14 }}>Done — take me home</button>
        <button className="btn btn-tonal lg" onClick={d.onUpdate} style={{ width: '100%', marginBottom: 14 }}>Update details</button>
        <div onClick={d.onTogglePreview} style={{ cursor: 'pointer' }}><span style={{ fontFamily: FONT_B, fontSize: 12, color: 'var(--color-info-secondary)', borderBottom: '1px solid var(--color-info-secondary)' }}>Preview: rejected state</span></div>
      </div>
    );
  }
  // rejected
  return (
    <div className="outcome-screen" style={{ width: '100%', height: '100%', boxSizing: 'border-box', background: 'var(--color-surface-primary)', overflowY: 'auto', overflowX: 'hidden', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '70px 24px 24px', textAlign: 'center' }}>
      <div style={{ width: 84, height: 84, borderRadius: '50%', background: 'color-mix(in oklab, var(--color-status-error) 8%, var(--color-surface-primary))', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 22 }}>
        <span className="mi" style={{ fontSize: 40, color: 'var(--color-status-error)' }} data-i="info"></span>
      </div>
      <div className="outcome-title" style={{ ...WIZARD_TITLE, fontSize: 26, marginBottom: 10 }}>We couldn't verify this submission</div>
      <div style={{ ...WIZARD_SUB, marginBottom: 20, maxWidth: 290 }}>This isn't final — most masjids are approved after a quick follow-up. Here's what our team noted.</div>
      <div className="outcome-summary" style={{ width: '100%', boxSizing: 'border-box', background: 'var(--color-surface-card)', borderRadius: 16, border: '1px solid var(--color-neutral-border)', padding: 16, textAlign: 'left', marginBottom: 24 }}>
        <div style={{ fontFamily: FONT_B, fontSize: 12, fontWeight: 700, color: 'var(--color-info-secondary)', textTransform: 'uppercase', letterSpacing: '.05em', marginBottom: 8 }}>Reason noted by our team</div>
        <div style={{ fontFamily: FONT_B, fontSize: 14, lineHeight: 1.6, color: 'var(--color-info-primary)' }}>We couldn't reach {d.contactName} on the contact number provided. Please re-apply with an active number our team can call.</div>
      </div>
      <button className="btn btn-filled lg" onClick={d.onReapply} style={{ width: '100%', marginBottom: 12 }}>Re-apply</button>
      <button className="btn btn-tonal lg" onClick={d.onContactSupport} style={{ width: '100%', marginBottom: 14 }}>Contact support</button>
      <div onClick={d.onTogglePreview} style={{ cursor: 'pointer' }}><span style={{ fontFamily: FONT_B, fontSize: 12, color: 'var(--color-info-secondary)', borderBottom: '1px solid var(--color-info-secondary)' }}>Back to pending preview</span></div>
    </div>
  );
}

Object.assign(window, {
  MyMasjidsSheet, WizardScreen, OutcomeScreen,
  MASJID_MANAGE_DATA: MANAGE_DATA, MASJID_FOLLOW_DATA: FOLLOW_DATA, MASJID_REGISTRATION_DATA: REGISTRATION_DATA, MASJID_CLAIM_DATA: CLAIM_DATA,
  MASJID_ROLE_LIST: ROLE_LIST, MASJID_MASLAK_LIST: MASLAK_LIST, MASJID_STATE_LIST: STATE_LIST
});
