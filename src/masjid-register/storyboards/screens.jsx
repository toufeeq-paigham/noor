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
const CLAIM_DATA = [
  { id: 1, name: 'Jama Masjid Mahim', addr: 'St. Michael Church Rd, Mahim, Mumbai', dist: '0.4 km' },
  { id: 2, name: 'Masjid-e-Noor', addr: 'Kabutar Khana, Mahim, Mumbai', dist: '0.9 km' },
  { id: 3, name: 'Anjuman-e-Islam Masjid', addr: 'Cadell Road, Mahim, Mumbai', dist: '1.6 km' }
];
const ROLE_LIST = ['Chairman', 'Assistant Chairman', 'Secretary', 'Assistant Secretary', 'Treasurer', 'Assistant Treasurer', 'Member', 'Imam', 'Muezzin'];
const MASLAK_LIST = ['Ahle Hadith', 'Ahle Sunnat Wal Jamaat (Barelvi)', 'Ahle Sunnat Wal Jamaat (Deoband)'];

const FONT_B = 'var(--font-body)';
const FONT_T = 'var(--font-title)';

// A tokenised text field shell (label + framed input) — the wizard reuses it for every text step.
function Field({ label, children, mb = 16 }) {
  return (
    <div style={{ marginBottom: mb }}>
      {label ? <div style={{ fontFamily: FONT_B, fontSize: 13, fontWeight: 600, color: 'var(--color-info-primary)', marginBottom: 6 }}>{label}</div> : null}
      {children}
    </div>
  );
}
// Consumes the DS `.input` atom (components.css). Pass `code` for the fixed-length numeric
// variant (`.input.code`) — pincode / PIN — reserved for entries where each digit should read
// distinctly. Standard (proportional 16px) is the default for all free-text fields.
function TextInput({ value, onChange, placeholder, maxLength, inputMode, code }) {
  return (
    <div className={code ? 'input code' : 'input'}>
      <div className="inner">
        <input className="val" value={value} onChange={onChange} placeholder={placeholder} maxLength={maxLength} inputMode={inputMode} />
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
function MyMasjidsSheet({ data = {} }) {
  const { isOpen, tab = 'manage', onTab, manageTiles = [], followRows = [], onClose, onRegister, onExplore, onFind } = data;
  if (!isOpen) return null;
  const isManage = tab === 'manage';
  const linkStyle = { fontFamily: FONT_B, fontSize: 12.5, fontWeight: 700, color: 'var(--color-action-primary)' };
  return (
    <div className="dlg-scrim sheet" onClick={onClose}>
      <div className="dlg" onClick={(e) => e.stopPropagation()} style={{ maxHeight: '84%' }}>
        <div className="dlg-handle" />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <span className="dlg-title">My Masjids</span>
          <span onClick={onClose} className="mi" style={{ fontSize: 24, color: 'var(--color-info-faint)', cursor: 'pointer' }} data-i="close"></span>
        </div>
        <div className="tbar" style={{ marginBottom: 14 }}>
          <div className={`tab ${isManage ? 'active' : ''}`} onClick={() => onTab && onTab('manage')}>Manage ({manageTiles.length})</div>
          <div className={`tab ${!isManage ? 'active' : ''}`} onClick={() => onTab && onTab('follow')}>Follow ({followRows.length})</div>
        </div>

        {isManage ? (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 14 }}>
              {manageTiles.map((t) => (
                <div key={t.id} onClick={t.onSelect} style={{ position: 'relative', borderRadius: 16, padding: '14px 12px', boxSizing: 'border-box', cursor: 'pointer', minHeight: 96,
                  background: t.isPrimary ? 'var(--color-action-primary)' : 'var(--color-surface-card)',
                  border: t.isPrimary ? '1px solid transparent' : '1px solid var(--color-neutral-border)',
                  boxShadow: t.isPrimary ? 'var(--shadow-button)' : 'none' }}>
                  {t.isPrimary && <span className="mi" style={{ position: 'absolute', top: 10, right: 10, fontSize: 16, color: 'var(--color-action-primary-inverse)' }} data-i="check_circle"></span>}
                  <span className={`mi ${t.isPrimary ? 'fill' : ''}`} style={{ fontSize: 22, color: t.isPrimary ? 'var(--color-action-primary-inverse)' : 'var(--color-info-secondary)', fontVariationSettings: t.isPrimary ? "'FILL' 1" : "'FILL' 0" }} data-i="mosque"></span>
                  <div style={{ fontFamily: FONT_B, fontSize: 13.5, fontWeight: 700, marginTop: 8, lineHeight: 1.25, color: t.isPrimary ? 'var(--color-action-primary-inverse)' : 'var(--color-info-primary)' }}>{t.name}</div>
                  <div style={{ fontFamily: FONT_B, fontSize: 10.5, marginTop: 2, color: t.isPrimary ? 'color-mix(in oklab, var(--color-action-primary-inverse) 80%, transparent)' : 'var(--color-info-secondary)' }}>{t.sub}</div>
                </div>
              ))}
              <div onClick={onRegister} style={{ borderRadius: 16, padding: '14px 12px', border: '1.5px dashed var(--color-info-faint)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 5, cursor: 'pointer', boxSizing: 'border-box', minHeight: 96 }}>
                <span className="mi" style={{ fontSize: 20, color: 'var(--color-info-secondary)' }} data-i="add"></span>
                <div style={{ fontFamily: FONT_B, fontSize: 11, fontWeight: 700, color: 'var(--color-info-secondary)' }}>Register masjid</div>
              </div>
            </div>
            <div onClick={onExplore} style={{ textAlign: 'center', padding: '4px 0', cursor: 'pointer' }}><span style={linkStyle}>Explore masjids near you →</span></div>
          </div>
        ) : (
          <div>
            <div style={{ marginBottom: 10 }}>
              {followRows.map((f) => (
                <div key={f.id}>
                  {f.showHeader && <div style={{ fontFamily: FONT_B, fontSize: 10, fontWeight: 700, letterSpacing: '.06em', textTransform: 'uppercase', color: 'var(--color-info-faint)', padding: '8px 2px 6px' }}>{f.city}</div>}
                  <div onClick={f.onToggle} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 12, cursor: 'pointer', background: f.checked ? 'var(--color-surface-secondary)' : 'transparent' }}>
                    <div style={{ width: 34, height: 34, borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, background: f.checked ? 'var(--color-action-primary)' : 'var(--color-input-background)' }}>
                      <span style={{ fontFamily: FONT_T, fontSize: 14, color: f.checked ? 'var(--color-action-primary-inverse)' : 'var(--color-info-secondary)' }}>{f.letter}</span>
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontFamily: FONT_B, fontSize: 14, color: 'var(--color-info-primary)', fontWeight: f.checked ? 700 : 400, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{f.name}</div>
                      <div style={{ fontFamily: FONT_B, fontSize: 11, color: 'var(--color-info-secondary)' }}>{f.sub}</div>
                    </div>
                    <div style={{ width: 24, height: 24, borderRadius: 360, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxSizing: 'border-box',
                      background: f.checked ? 'var(--color-action-primary)' : 'transparent', border: f.checked ? 'none' : '1.5px solid var(--color-action-primary)' }}>
                      {f.checked && <span className="mi" style={{ fontSize: 18, color: 'var(--color-action-primary-inverse)' }} data-i="check"></span>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ background: 'var(--color-surface-card)', border: '1px solid var(--color-neutral-border)', borderRadius: 12, padding: '9px 12px', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
              <span className="mi" style={{ fontSize: 16, color: 'var(--color-neutral-brand)' }} data-i="notifications"></span>
              <span style={{ fontFamily: FONT_B, fontSize: 10.5, lineHeight: 1.45, color: 'var(--color-info-secondary)' }}>You get salaah timings &amp; announcements from masjids you follow</span>
            </div>
            <div onClick={onFind} style={{ textAlign: 'center', padding: '4px 0', cursor: 'pointer' }}><span style={linkStyle}>Find masjids to follow →</span></div>
          </div>
        )}
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
    <div>
      <div onClick={onClose} style={{ position: 'absolute', inset: 0, background: 'var(--color-surface-scrim)', zIndex: 40 }}></div>
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, background: 'var(--color-surface-primary)', borderRadius: '20px 20px 0 0', zIndex: 41, padding: '10px 8px 20px', maxHeight: '60%', overflowY: 'auto', boxShadow: 'var(--sheet-shadow)' }}>
        <div style={{ width: 40, height: 4, background: 'var(--color-neutral-border)', borderRadius: 2, margin: '4px auto 14px' }}></div>
        <div style={{ fontFamily: FONT_B, fontSize: 13, fontWeight: 700, color: 'var(--color-info-secondary)', padding: '0 12px 8px' }}>{title}</div>
        {options.map((opt, i) => (
          <div key={i} onClick={opt.onSelect} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '13px 16px', borderRadius: 12, cursor: 'pointer' }}>
            <span style={{ fontFamily: FONT_B, fontSize: 15, color: 'var(--color-info-primary)', fontWeight: opt.selected ? 700 : 400 }}>{opt.name}</span>
            {opt.selected && <span className="mi" style={{ fontSize: 20, color: 'var(--color-action-primary)' }} data-i="check"></span>}
          </div>
        ))}
      </div>
    </div>
  );
}

function PickerField({ display, filled, onOpen }) {
  return (
    <div onClick={onOpen} style={{ background: 'var(--color-input-background)', borderRadius: 16, border: '1px solid transparent', padding: 2, cursor: 'pointer' }}>
      <div style={{ borderRadius: 14, border: '1px solid var(--color-input-border-disabled)', minHeight: 48, display: 'flex', alignItems: 'center', padding: '0 14px' }}>
        <span style={{ flex: 1, fontFamily: FONT_B, fontSize: 16, color: filled ? 'var(--color-info-primary)' : 'var(--color-info-secondary)' }}>{display}</span>
        <span className="mi" style={{ fontSize: 20, color: 'var(--color-info-secondary)' }} data-i="expand_more"></span>
      </div>
    </div>
  );
}

function ReviewRow({ label, value, onEdit, border }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: 14, borderBottom: border ? '1px solid var(--color-neutral-border)' : 'none' }}>
      <div style={{ flex: 1 }}>
        <div style={{ fontFamily: FONT_B, fontSize: 11.5, color: 'var(--color-info-secondary)' }}>{label}</div>
        <div style={{ fontFamily: FONT_B, fontSize: 14.5, fontWeight: 600, color: 'var(--color-info-primary)' }}>{value}</div>
      </div>
      <span onClick={onEdit} style={{ fontFamily: FONT_B, fontSize: 13, fontWeight: 700, color: 'var(--color-action-primary)', cursor: 'pointer' }}>Edit</span>
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
        <Field label="Pincode" mb={0}>
          <TextInput value={d.pincode} onChange={d.onPincodeChange} placeholder="6-digit pincode" maxLength={6} inputMode="numeric" code />
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
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
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
        <div style={{ ...WIZARD_TITLE, fontSize: 24, marginBottom: 18 }}>Tell us about your masjid</div>
        <Field label="Masjid name"><TextInput value={d.masjidName} onChange={d.onMasjidNameChange} placeholder="e.g. Masjid-e-Noor" /></Field>
        <Field label="Address line"><TextInput value={d.address} onChange={d.onAddressChange} placeholder="Street, landmark" /></Field>
        <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
          <div style={{ flex: 1 }}><Field label="City" mb={0}><TextInput value={d.city} onChange={d.onCityChange} placeholder="City" /></Field></div>
          <div style={{ flex: 1 }}><Field label="State" mb={0}><TextInput value={d.stateVal} onChange={d.onStateChange} placeholder="State" /></Field></div>
        </div>
        <Field label="Pincode" mb={20}><TextInput value={d.pincode} onChange={d.onPincodeChange} maxLength={6} inputMode="numeric" code /></Field>
        <div style={{ fontFamily: FONT_B, fontSize: 13, fontWeight: 600, color: 'var(--color-info-primary)', marginBottom: 6 }}>Drop the pin on your masjid entrance</div>
        <div onClick={d.onTogglePin} style={{ position: 'relative', height: 170, borderRadius: 16, overflow: 'hidden', border: '1px solid var(--color-neutral-border)', cursor: 'grab', background: 'var(--color-surface-secondary)' }}>
          <div style={{ position: 'absolute', inset: 0, opacity: 0.6 }}>
            <div style={{ position: 'absolute', top: '30%', left: 0, right: 0, height: 10, background: 'var(--color-neutral-border)' }}></div>
            <div style={{ position: 'absolute', top: 0, bottom: 0, left: '35%', width: 10, background: 'var(--color-neutral-border)' }}></div>
            <div style={{ position: 'absolute', top: '65%', left: 0, right: 0, height: 8, background: 'var(--color-neutral-border)' }}></div>
            <div style={{ position: 'absolute', top: 0, bottom: 0, left: '70%', width: 8, background: 'var(--color-neutral-border)' }}></div>
          </div>
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-100%)' }}>
            <span className="mi fill" style={{ fontSize: 40, color: d.pinDropped ? 'var(--color-action-primary)' : 'var(--color-info-secondary)', fontVariationSettings: "'FILL' 1" }} data-i="location_on"></span>
          </div>
          <div style={{ position: 'absolute', bottom: 10, left: 10, right: 10, background: 'color-mix(in oklab, var(--color-surface-primary) 92%, transparent)', borderRadius: 10, padding: '8px 10px', textAlign: 'center' }}>
            <span style={{ fontFamily: FONT_B, fontSize: 12, fontWeight: 600, color: 'var(--color-info-primary)' }}>{d.pinDropped ? 'Pin dropped — tap to adjust' : 'Tap the map to drop the pin'}</span>
          </div>
        </div>
      </div>
    );
  }
  if (step === 'contact') {
    return (
      <div>
        <div style={{ ...WIZARD_TITLE, fontSize: 26, marginBottom: 10 }}>Who should we contact?</div>
        <div style={{ ...WIZARD_SUB, marginBottom: 22 }}>Our verification team may call this number to confirm the details you've shared.</div>
        <Field label="Contact name" mb={0}><TextInput value={d.contactName} onChange={d.onContactNameChange} placeholder="Full name" /></Field>
      </div>
    );
  }
  if (step === 'role') {
    return (
      <div>
        <div style={{ ...WIZARD_TITLE, fontSize: 26, marginBottom: 10 }}>What's your role?</div>
        <div style={{ ...WIZARD_SUB, marginBottom: 22 }}>Your role is verified by our team before this masjid is approved.</div>
        <Field label="Your role" mb={0}><PickerField display={d.roleDisplay} filled={d.roleFilled} onOpen={d.onOpenRoleSheet} /></Field>
      </div>
    );
  }
  if (step === 'maslak') {
    return (
      <div>
        <div style={{ ...WIZARD_TITLE, fontSize: 26, marginBottom: 10 }}>Which maslak does the masjid follow?</div>
        <div style={{ ...WIZARD_SUB, marginBottom: 22 }}>This helps members find the right community.</div>
        <Field label="Maslak" mb={0}><PickerField display={d.maslakDisplay} filled={d.maslakFilled} onOpen={d.onOpenMaslakSheet} /></Field>
      </div>
    );
  }
  if (step === 'photo') {
    return (
      <div>
        <div style={{ ...WIZARD_TITLE, fontSize: 26, marginBottom: 10 }}>Add a photo of the masjid</div>
        <div style={{ ...WIZARD_SUB, marginBottom: 20 }}>Optional, but it helps members recognise it. You can add this later too.</div>
        {d.photoTaken ? (
          <div style={{ position: 'relative', borderRadius: 16, overflow: 'hidden', height: 200, background: 'var(--gradient-brand), var(--color-surface-card)', marginBottom: 14 }}>
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span className="mi fill" style={{ fontSize: 52, color: 'color-mix(in oklab, var(--color-info-primary) 25%, transparent)', fontVariationSettings: "'FILL' 1" }} data-i="mosque"></span>
            </div>
            <div style={{ position: 'absolute', bottom: 10, right: 10, display: 'flex', gap: 8 }}>
              <div onClick={d.onRetakePhoto} style={{ background: 'var(--color-action-secondary-inverse)', borderRadius: 999, padding: '8px 14px', cursor: 'pointer' }}><span style={{ fontFamily: FONT_B, fontSize: 12.5, fontWeight: 700, color: 'var(--color-neutral-white)' }}>Retake</span></div>
              <div onClick={d.onRemovePhoto} style={{ background: 'var(--color-action-secondary-inverse)', borderRadius: 999, padding: '8px 14px', cursor: 'pointer' }}><span style={{ fontFamily: FONT_B, fontSize: 12.5, fontWeight: 700, color: 'var(--color-neutral-white)' }}>Remove</span></div>
            </div>
          </div>
        ) : (
          <div>
            <div onClick={d.onTakePhoto} style={{ border: '1.5px dashed var(--color-neutral-brand)', borderRadius: 16, height: 200, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 14, cursor: 'pointer', background: 'var(--color-surface-card)' }}>
              <span className="mi" style={{ fontSize: 34, color: 'var(--color-neutral-brand)' }} data-i="photo_camera"></span>
              <span style={{ fontFamily: FONT_B, fontSize: 13.5, fontWeight: 600, color: 'var(--color-neutral-brand)' }}>Tap to open camera</span>
            </div>
            <div onClick={d.onTakePhoto} style={{ textAlign: 'center', cursor: 'pointer', marginBottom: 6 }}>
              <span style={{ fontFamily: FONT_B, fontSize: 13.5, fontWeight: 600, color: 'var(--color-action-secondary)', borderBottom: '1px solid var(--color-action-secondary)' }}>Choose from gallery</span>
            </div>
          </div>
        )}
      </div>
    );
  }
  if (step === 'selfie') {
    return (
      <div>
        <div style={{ ...WIZARD_TITLE, fontSize: 26, marginBottom: 10 }}>Verify it's you</div>
        <div style={{ ...WIZARD_SUB, marginBottom: 20 }}>Only Paigham's verification team sees this photo. It's never shown on your profile.</div>
        {d.cameraDenied ? (
          <div style={{ borderRadius: 16, background: 'var(--color-surface-card)', border: '1px solid var(--color-neutral-border)', padding: '28px 20px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}>
            <span className="mi" style={{ fontSize: 38, color: 'var(--color-info-secondary)' }} data-i="videocam_off"></span>
            <div style={{ fontFamily: FONT_B, fontSize: 14, color: 'var(--color-info-primary)', fontWeight: 700 }}>Camera access is off</div>
            <div style={{ fontFamily: FONT_B, fontSize: 13, color: 'var(--color-info-secondary)', lineHeight: 1.6 }}>Paigham needs your camera to verify your identity. Enable it in Settings to continue.</div>
            <div onClick={d.onToggleCameraDenied} style={{ marginTop: 4, background: 'var(--color-action-primary)', borderRadius: 14, padding: '10px 22px', cursor: 'pointer' }}><span style={{ fontFamily: FONT_B, fontSize: 14, fontWeight: 700, color: 'var(--color-action-primary-inverse)' }}>Open Settings</span></div>
          </div>
        ) : (
          <div>
            {d.selfieTaken ? (
              <div>
                <div style={{ position: 'relative', borderRadius: 16, overflow: 'hidden', height: 260, background: 'var(--gradient-emerald), var(--color-surface-card)', marginBottom: 12 }}>
                  <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span className="mi" style={{ fontSize: 64, color: 'color-mix(in oklab, var(--color-info-primary) 28%, transparent)' }} data-i="person"></span>
                  </div>
                  <div style={{ position: 'absolute', top: 10, right: 10, background: 'var(--color-action-primary)', borderRadius: 999, padding: '5px 12px', display: 'flex', alignItems: 'center', gap: 4 }}>
                    <span className="mi" style={{ fontSize: 14, color: 'var(--color-action-primary-inverse)' }} data-i="check"></span>
                    <span style={{ fontFamily: FONT_B, fontSize: 11.5, fontWeight: 700, color: 'var(--color-action-primary-inverse)' }}>Captured</span>
                  </div>
                </div>
                <div onClick={d.onRetakeSelfie} style={{ textAlign: 'center', cursor: 'pointer', marginBottom: 16 }}>
                  <span style={{ fontFamily: FONT_B, fontSize: 13.5, fontWeight: 600, color: 'var(--color-action-secondary)', borderBottom: '1px solid var(--color-action-secondary)' }}>Retake photo</span>
                </div>
              </div>
            ) : (
              <div onClick={d.onTakeSelfie} style={{ position: 'relative', borderRadius: 16, overflow: 'hidden', height: 260, background: 'var(--color-action-secondary-inverse)', marginBottom: 16, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ width: 150, height: 190, borderRadius: '50% / 42%', border: '2.5px solid color-mix(in oklab, var(--color-neutral-white) 65%, transparent)' }}></div>
                <div style={{ position: 'absolute', bottom: 14, left: 0, right: 0, textAlign: 'center' }}>
                  <span style={{ fontFamily: FONT_B, fontSize: 12.5, color: 'color-mix(in oklab, var(--color-neutral-white) 80%, transparent)' }}>Fit your face inside the oval, tap to capture</span>
                </div>
              </div>
            )}
            <div onClick={d.onToggleCameraDenied} style={{ textAlign: 'center', cursor: 'pointer' }}>
              <span style={{ fontFamily: FONT_B, fontSize: 12, color: 'var(--color-info-secondary)', borderBottom: '1px solid var(--color-info-secondary)' }}>Preview: camera access denied</span>
            </div>
          </div>
        )}
      </div>
    );
  }
  if (step === 'review') {
    const card = { background: 'var(--color-surface-card)', borderRadius: 16, border: '1px solid var(--color-neutral-border)' };
    const sectionLabel = { fontFamily: FONT_B, fontSize: 12, fontWeight: 700, letterSpacing: '.06em', textTransform: 'uppercase', color: 'var(--color-info-secondary)', marginBottom: 8 };
    return (
      <div>
        <div style={{ ...WIZARD_TITLE, fontSize: 26, marginBottom: 18 }}>Review &amp; submit</div>
        <div style={sectionLabel}>Masjid</div>
        <div style={{ ...card, padding: 14, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 10 }}>
          <span className="mi" style={{ fontSize: 22, color: d.masjidLocked ? 'var(--color-info-secondary)' : 'var(--color-action-primary)' }} data-i={d.masjidLocked ? 'verified' : 'edit'}></span>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: FONT_B, fontSize: 15, fontWeight: 700, color: 'var(--color-info-primary)' }}>{d.masjidSummaryName}</div>
            <div style={{ fontFamily: FONT_B, fontSize: 12.5, color: 'var(--color-info-secondary)' }}>{d.masjidSummaryAddr}</div>
          </div>
          {!d.masjidLocked && <span onClick={d.onEditRegister} style={{ fontFamily: FONT_B, fontSize: 13, fontWeight: 700, color: 'var(--color-action-primary)', cursor: 'pointer' }}>Edit</span>}
        </div>
        <div style={sectionLabel}>Your details</div>
        <div style={{ ...card, overflow: 'hidden', marginBottom: 20 }}>
          <ReviewRow label="Contact name" value={d.contactName} onEdit={d.onEditContact} border />
          <ReviewRow label="Role" value={d.role} onEdit={d.onEditRole} border />
          <ReviewRow label="Maslak" value={d.maslak} onEdit={d.onEditMaslak} />
        </div>
        <div style={sectionLabel}>Photos</div>
        <div style={{ ...card, padding: 14, display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
          <div style={{ width: 52, height: 52, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, background: d.photoTaken ? 'var(--gradient-brand), var(--color-surface-card)' : 'var(--color-input-background)' }}>
            <span className="mi" style={{ fontSize: 22, color: 'color-mix(in oklab, var(--color-info-primary) 35%, transparent)' }} data-i="mosque"></span>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: FONT_B, fontSize: 13.5, fontWeight: 600, color: 'var(--color-info-primary)' }}>Masjid photo</div>
            <div style={{ fontFamily: FONT_B, fontSize: 12, color: 'var(--color-info-secondary)' }}>{d.photoTaken ? 'Added' : 'Skipped'}</div>
          </div>
          <span onClick={d.onEditPhoto} style={{ fontFamily: FONT_B, fontSize: 13, fontWeight: 700, color: 'var(--color-action-primary)', cursor: 'pointer' }}>Edit</span>
        </div>
        <div style={{ ...card, padding: 14, display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 52, height: 52, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, background: 'var(--gradient-emerald), var(--color-surface-card)' }}>
            <span className="mi" style={{ fontSize: 22, color: 'color-mix(in oklab, var(--color-info-primary) 35%, transparent)' }} data-i="person"></span>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: FONT_B, fontSize: 13.5, fontWeight: 600, color: 'var(--color-info-primary)' }}>Identity selfie</div>
            <div style={{ fontFamily: FONT_B, fontSize: 12, color: 'var(--color-info-secondary)' }}>Captured</div>
          </div>
          <span onClick={d.onEditSelfie} style={{ fontFamily: FONT_B, fontSize: 13, fontWeight: 700, color: 'var(--color-action-primary)', cursor: 'pointer' }}>Edit</span>
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
      <div style={{ flexShrink: 0, padding: '56px 20px 14px', display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <button className="ib ib-tonal md" onClick={d.onBack} aria-label="Back"><span className="mi" data-i="arrow_back"></span></button>
          <span style={{ fontFamily: FONT_B, fontSize: 12, fontWeight: 700, color: 'var(--color-info-secondary)', whiteSpace: 'nowrap', flexShrink: 0 }}>Step {d.progressIndex} of 8</span>
        </div>
        <div style={{ display: 'flex', gap: 5 }}>
          {dots.map((on, i) => <div key={i} style={{ flex: 1, height: 4, borderRadius: 2, background: on ? 'var(--color-action-primary)' : 'var(--color-action-background)' }}></div>)}
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '4px 20px 16px', position: 'relative' }}>
        <WizardBody d={d} />
        <OptionSheet open={d.roleSheetOpen} title="Select your role" options={d.roleOptions} onClose={d.onCloseSheets} />
        <OptionSheet open={d.maslakSheetOpen} title="Select maslak" options={d.maslakOptions} onClose={d.onCloseSheets} />
      </div>

      <div style={{ flexShrink: 0, padding: '12px 20px 26px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {d.showSkipLink && <div onClick={d.ctaOnClick} style={{ textAlign: 'center', cursor: 'pointer' }}><span style={{ fontFamily: FONT_B, fontSize: 14, fontWeight: 600, color: 'var(--color-info-secondary)' }}>Skip for now</span></div>}
        <button className={`btn btn-filled lg`} onClick={d.ctaOnClick} disabled={d.ctaDisabled} style={{ width: '100%' }}>{d.ctaLabel}</button>
        {d.step === 'review' && <div style={{ textAlign: 'center', fontFamily: FONT_B, fontSize: 12, color: 'var(--color-info-secondary)' }}>A member of our team reviews every submission by hand.</div>}
      </div>
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
        <div style={{ width: 52, height: 52, borderRadius: '50%', border: '4px solid var(--color-surface-secondary)', borderTopColor: 'var(--color-action-primary)', animation: 'spin 900ms linear infinite' }}></div>
        <div style={{ fontFamily: FONT_B, fontSize: 15, fontWeight: 600, color: 'var(--color-info-primary)' }}>Submitting for verification…</div>
      </div>
    );
  }
  if (d.variant === 'pending') {
    return (
      <div style={{ width: '100%', height: '100%', background: 'var(--color-surface-primary)', overflowY: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '70px 24px 24px', textAlign: 'center' }}>
        <div style={{ width: 84, height: 84, borderRadius: '50%', background: 'var(--color-surface-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 22 }}>
          <span className="mi" style={{ fontSize: 40, color: 'var(--color-action-primary)' }} data-i="hourglass_top"></span>
        </div>
        <div style={{ ...WIZARD_TITLE, fontSize: 26, marginBottom: 10 }}>Your masjid is under review</div>
        <div style={{ ...WIZARD_SUB, marginBottom: 24, maxWidth: 290 }}>Thank you, {d.contactName}. Our team typically completes verification within 2–3 working days.</div>
        <div style={{ width: '100%', background: 'var(--color-surface-card)', borderRadius: 16, border: '1px solid var(--color-neutral-border)', padding: 16, textAlign: 'left', marginBottom: 22 }}>
          {[['Masjid', d.masjidSummaryName], ['Your role', d.role], ['Submitted', d.submittedDate]].map(([k, v], i, a) => (
            <div key={k} style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: i < a.length - 1 ? 10 : 0, borderBottom: i < a.length - 1 ? '1px solid var(--color-neutral-border)' : 'none', marginBottom: i < a.length - 1 ? 10 : 0 }}>
              <span style={{ fontFamily: FONT_B, fontSize: 13, color: 'var(--color-info-secondary)' }}>{k}</span>
              <span style={{ fontFamily: FONT_B, fontSize: 13.5, fontWeight: 700, color: 'var(--color-info-primary)' }}>{v}</span>
            </div>
          ))}
        </div>
        <div style={{ width: '100%', textAlign: 'left', marginBottom: 26 }}>
          <div style={{ display: 'flex', gap: 10, marginBottom: 12 }}><span className="mi" style={{ fontSize: 18, color: 'var(--color-action-primary)' }} data-i="check_circle"></span><span style={{ fontFamily: FONT_B, fontSize: 13.5, color: 'var(--color-info-primary)' }}>Submission received</span></div>
          <div style={{ display: 'flex', gap: 10, marginBottom: 12 }}><span className="mi" style={{ fontSize: 18, color: 'var(--color-status-warning)' }} data-i="call"></span><span style={{ fontFamily: FONT_B, fontSize: 13.5, color: 'var(--color-info-primary)' }}>Our team calls to verify details</span></div>
          <div style={{ display: 'flex', gap: 10 }}><span className="mi" style={{ fontSize: 18, color: 'var(--color-info-secondary)' }} data-i="verified"></span><span style={{ fontFamily: FONT_B, fontSize: 13.5, color: 'var(--color-info-secondary)' }}>Masjid approved and published</span></div>
        </div>
        <button className="btn btn-filled lg" onClick={d.onDone} style={{ width: '100%', marginBottom: 14 }}>Done — take me home</button>
        <div onClick={d.onTogglePreview} style={{ cursor: 'pointer' }}><span style={{ fontFamily: FONT_B, fontSize: 12, color: 'var(--color-info-secondary)', borderBottom: '1px solid var(--color-info-secondary)' }}>Preview: rejected state</span></div>
      </div>
    );
  }
  // rejected
  return (
    <div style={{ width: '100%', height: '100%', background: 'var(--color-surface-primary)', overflowY: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '70px 24px 24px', textAlign: 'center' }}>
      <div style={{ width: 84, height: 84, borderRadius: '50%', background: 'color-mix(in oklab, var(--color-status-error) 8%, var(--color-surface-primary))', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 22 }}>
        <span className="mi" style={{ fontSize: 40, color: 'var(--color-status-error)' }} data-i="info"></span>
      </div>
      <div style={{ ...WIZARD_TITLE, fontSize: 26, marginBottom: 10 }}>We couldn't verify this submission</div>
      <div style={{ ...WIZARD_SUB, marginBottom: 20, maxWidth: 290 }}>This isn't final — most masjids are approved after a quick follow-up. Here's what our team noted.</div>
      <div style={{ width: '100%', background: 'var(--color-surface-card)', borderRadius: 16, border: '1px solid var(--color-neutral-border)', padding: 16, textAlign: 'left', marginBottom: 24 }}>
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
  MASJID_MANAGE_DATA: MANAGE_DATA, MASJID_FOLLOW_DATA: FOLLOW_DATA, MASJID_CLAIM_DATA: CLAIM_DATA,
  MASJID_ROLE_LIST: ROLE_LIST, MASJID_MASLAK_LIST: MASLAK_LIST
});
