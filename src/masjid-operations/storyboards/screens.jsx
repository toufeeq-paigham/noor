// Shared screen components for the Masjid Operations section board — the committee-only
// admin console plus the journeys that hang off it.
//
// Used by BOTH the static storyboards (./board-rows.jsx) and the live interactive device
// (../Masjid Operations.dc.html). Every screen takes ONE `data` object so the dc x-import
// binds a single value, and every handler is optional (the static frames pass none).
//
// Source of truth for behaviour is the Compose implementation:
//   modules/masjid/admin/MasjidAdminScreen.kt         → ConsoleScreen (Overview tab + tab shell)
//   modules/masjid/post/MasjidPostsAdminScreen.kt     → ConsoleScreen (Posts tab)
//   modules/masjid/members/MasjidMembersScreen.kt     → ConsoleScreen (Members tab)
//   modules/masjid/salaah/SalaahConfigScreen.kt       → ConsoleScreen (Salaah tab)
//   modules/masjid/post/CreatePostScreen.kt           → ComposePostScreen (./compose-post.jsx)
//   modules/masjid/post/PostVerificationPendingScreen → PostSentScreen
//   modules/masjid/invitations/InvitationsScreen.kt   → InvitationsScreen
// Role gating mirrors models/OrganisationMember.kt (MasjidPermissions) — UI gating only;
// the server stays authoritative.

const FONT_B = 'var(--font-body)';
const FONT_T = 'var(--font-title)';

// ══════════════════════════════════════════════════════════════════════
// Domain reference data (mirrors app/paigham/models)
// ══════════════════════════════════════════════════════════════════════

// PAIGHAM_ADMIN is internal-only and rejected server-side, so it is never assignable.
const OPS_ROLES = [
  'CHAIRMAN', 'ASSISTANT_CHAIRMAN', 'SECRETARY', 'ASSISTANT_SECRETARY',
  'TREASURER', 'ASSISTANT_TREASURER', 'MEMBER', 'IMAM', 'MUEZZIN',
];

// Title Case reads better than the raw enum on a dense console screen.
const roleLabel = (role) => (role || '')
  .toLowerCase()
  .split('_')
  .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
  .join(' ');

// ── Capabilities ──────────────────────────────────────────────────────
// A committee member's ROLE is a title; what they may DO is a set of capabilities granted
// per member. The registry is the extension point: new capabilities (azaan, live bayan,
// payments) appear here with `available: false` and the whole UI — hub rows, permission
// screen, invite screen — picks them up without new layout.
//
// Salaah timings are deliberately NOT a capability. Any signed-in Paigham user can update
// any masjid's timings; the safeguard is attribution and history (OPS_TIMING_HISTORY), not
// a grant. Do not reintroduce a 'timings' capability without changing that decision.
const OPS_CAPABILITIES = [
  {
    id: 'post', icon: 'campaign', label: 'Send paighams', short: 'Paighams', available: true,
    copy: 'Write, record and send updates to everyone following this masjid',
  },
  {
    id: 'committee', icon: 'groups', label: 'Manage the committee', short: 'Full admin', available: true,
    copy: 'Invite members, change roles and set what each member can do',
  },
  {
    id: 'azaan', icon: 'volume_up', label: 'Give the azaan', short: 'Azaan', available: false,
    copy: 'Call the azaan from the app so followers hear it live',
  },
  {
    id: 'live', icon: 'sensors', label: 'Go live with a bayan', short: 'Live bayan', available: false,
    copy: 'Stream a bayan or a programme to followers',
  },
  {
    id: 'payments', icon: 'money_bag', label: 'Manage payments', short: 'Payments', available: false,
    copy: 'Masjid QR, donations and the transaction record',
  },
];

const OPS_CAPS = {
  available: () => OPS_CAPABILITIES.filter((c) => c.available),
  planned: () => OPS_CAPABILITIES.filter((c) => !c.available),
  find: (id) => OPS_CAPABILITIES.find((c) => c.id === id),
  // Everything the console gates on. `caps` is the caller's granted set.
  can: (caps, id) => (caps || []).indexOf(id) !== -1,
  // A member holding `committee` is a full admin: they grant and revoke for everyone.
  isAdmin: (caps) => (caps || []).indexOf('committee') !== -1,
  // "Full admin" says everything, so it stands alone; otherwise list the short labels.
  summary: (caps) => {
    if (OPS_CAPS.isAdmin(caps)) return 'Full admin';
    const labels = (caps || []).map((id) => OPS_CAPS.find(id)).filter(Boolean).map((c) => c.short);
    return labels.length ? `Can: ${labels.join(', ')}` : 'View only';
  },
};

// Every masjid this member manages. The switcher only appears when there is more than one.
const OPS_MANAGED = [
  {
    id: 'bilal', name: 'Masjid E Bilal', code: 'PGM-BLR-1042', role: 'CHAIRMAN',
    city: 'Yelahanka New Town · 560064', followers: 1284,
    address: '12, 5th Cross, Yelahanka New Town, Bengaluru, Karnataka 560064',
    photo: '../../images/masjid-camera-preview.png',
  },
  {
    id: 'noor', name: 'Masjid-e-Noor', code: 'PGM-BLR-2251', role: 'SECRETARY',
    city: 'Vidyaranyapura · 560097', followers: 412, photo: null,
    address: '4th Main, Vidyaranyapura, Bengaluru, Karnataka 560097',
  },
];

const OPS_MASJID = {
  name: 'Masjid E Bilal',
  code: 'PGM-BLR-1042',
  maslak: 'Ahle Sunnat Wal Jamaat (Deoband)',
  contactName: 'Salim Shaikh',
  phone: '+91 98450 12345',
  address: '12, 5th Cross, Yelahanka New Town, Bengaluru, Karnataka 560064',
  stats: { followers: 1284, posts: 96, reactions: 3120 },
};

// Every committee member sees everything; `caps` decides what they can DO. A member with no
// capabilities still reads the console and can still update timings — that is open to
// everyone — they simply cannot send paighams or change the committee.
const OPS_MEMBERS = [
  { id: 'm1', name: 'Salim Shaikh', phone: '+91 98450 12345', role: 'CHAIRMAN', status: 'ACTIVE', you: true, caps: ['post', 'committee'] },
  { id: 'm2', name: 'Ayaan Khan', phone: '+91 98861 40219', role: 'SECRETARY', status: 'ACTIVE', caps: ['post', 'committee'] },
  { id: 'm3', name: 'Hafiz Bilal Ahmed', phone: '+91 90084 77120', role: 'IMAM', status: 'ACTIVE', caps: ['post'] },
  { id: 'm4', name: 'Yusuf Ali', phone: '+91 99001 23845', role: 'MUEZZIN', status: 'ACTIVE', caps: [] },
  { id: 'm5', name: 'Imran Sait', phone: '+91 80881 55403', role: 'TREASURER', status: 'INVITED', caps: [] },
];

const OPS_FOLLOWERS = [
  { id: 'f1', name: 'Abdul Rahman', phone: '+91 90362 11784', city: 'Yelahanka New Town', since: 'Mar 2026' },
  { id: 'f2', name: 'Imtiyaz Pasha', phone: '+91 73493 60012', city: 'Vidyaranyapura', since: 'Feb 2026' },
  { id: 'f3', name: '', phone: '+91 90080 44127', city: 'Yelahanka', since: 'Jan 2026' },
  { id: 'f4', name: 'Mohammed Rafi', phone: '+91 99862 30014', city: 'Attur Layout', since: 'Dec 2025' },
  { id: 'f5', name: 'Sameer Ahmed', phone: '+91 88842 51190', city: 'Yelahanka New Town', since: 'Dec 2025' },
  { id: 'f6', name: 'Nadeem Sharief', phone: '+91 97417 22608', city: 'Chikkabettahalli', since: 'Nov 2025' },
];

// Paighams go live immediately — there is no review state.
const OPS_POSTS = [
  {
    id: 'p1', kind: 'message', target: 'MASJID', author: 'Ayaan Khan', authorId: 'm2',
    when: 'Today · 9:12 AM', reactions: 42, images: 1,
    message: 'Jumah bayan begins at 1:00 PM this week. Please be seated by 12:45 PM, in shaa Allah.',
  },
  {
    id: 'p2', kind: 'audio', target: 'MASJID_MASLAK', author: 'Hafiz Bilal Ahmed', authorId: 'm3',
    when: 'Today · 7:40 AM', reactions: 16, duration: '1:24',
  },
  {
    id: 'p3', kind: 'message', target: 'MASJID', author: 'Salim Shaikh', authorId: 'm1',
    when: 'Yesterday · 6:05 PM', reactions: 118, images: 0,
    message: 'Ramadhan taraweeh programme and the sehri timetable for the whole month are now available at the masjid office and on the notice board. Hafiz Bilal Ahmed leads from the 1st, and guests are requested to arrive by 8:30 PM so the rows can be settled before takbeer.',
  },
  {
    id: 'p4', kind: 'image', target: 'MASJID_PINCODE', author: 'Yusuf Ali', authorId: 'm4',
    when: '2 days ago', reactions: 24, images: 3,
  },
];

// An invitation has to answer three questions before someone accepts: which masjid, what
// will I be able to do, and who asked me. It lives for 7 days.
const OPS_INVITATIONS = [
  {
    id: 'i1', name: 'Masjid E Bilal', city: 'Yelahanka New Town · 560064',
    photo: '../../images/masjid-camera-preview.png',
    role: 'SECRETARY', caps: ['post', 'committee'],
    invitedBy: 'Salim Shaikh', invitedByRole: 'CHAIRMAN', sent: '2 days ago', daysLeft: 5,
  },
  {
    id: 'i2', name: 'Masjid-e-Noor', city: 'Vidyaranyapura · 560097', photo: null,
    role: 'MUEZZIN', caps: [],
    invitedBy: 'Ayaan Khan', invitedByRole: 'SECRETARY', sent: '5 days ago', daysLeft: 1,
  },
  {
    id: 'i3', name: 'Jamia Masjid Shivajinagar', city: 'Shivajinagar · 560001', photo: null,
    role: 'MEMBER', caps: [], invitedBy: 'Imran Sait', invitedByRole: 'TREASURER',
    sent: '9 days ago', daysLeft: 0, expired: true,
  },
];

// SalaahConfigViewModel.kt variants + SalaahConfigEditors.kt option sets.
const VARIANT_FIXED = 'FIXED';
const VARIANT_ON_TIME = 'ON_TIME';
const VARIANT_VARIES = 'VARIES_WITH_ON_TIME';

const VARIANT_OPTIONS = [
  { value: VARIANT_FIXED, label: 'Fixed time', hint: 'Jamaat is at the set time every day.' },
  { value: VARIANT_ON_TIME, label: 'On time (calculated)', hint: 'Azaan follows the calculated prayer time; jamaat after the iqama delay.' },
  { value: VARIANT_VARIES, label: 'Varies with on-time', hint: 'Follows the calculated time, but never earlier than the floor and only moves in steps.' },
];

const VARIATION_OPTIONS = [
  { value: 'VARIES_EVERY_5_MINS', label: 'Every 5 minutes' },
  { value: 'VARIES_EVERY_10_MINS', label: 'Every 10 minutes' },
  { value: 'VARIES_EVERY_15_MINS', label: 'Every 15 minutes' },
];

const IQAMA_OPTIONS = Array.from({ length: 13 }, (_, i) => ({ value: i * 5, label: `${i * 5} min` }));

const SALAAH_ORDER = [
  { key: 'fajr', label: 'Fajr' },
  { key: 'zohar', label: 'Zohar' },
  { key: 'asr', label: 'Asr' },
  { key: 'maghrib', label: 'Maghrib' },
  { key: 'isha', label: 'Isha' },
  { key: 'jumah', label: 'Jumah' },
];

const OPS_SALAAH_CONFIG = {
  fajr: { variant: VARIANT_FIXED, salaahTime: '05:30', iqamaDelay: 20 },
  zohar: { variant: VARIANT_FIXED, salaahTime: '13:30', iqamaDelay: 15 },
  asr: { variant: VARIANT_VARIES, neverBefore: '16:30', salaahTimeVariation: 'VARIES_EVERY_10_MINS', iqamaDelay: 15 },
  maghrib: { variant: VARIANT_ON_TIME, iqamaDelay: 5 },
  isha: { variant: VARIANT_FIXED, salaahTime: '20:15', iqamaDelay: 15 },
  jumah: { variant: VARIANT_FIXED, salaahTime: '13:20', iqamaDelay: 0 },
};

// Timings are public: any signed-in Paigham user can publish a change to any masjid. Nothing
// is reviewed, so the record IS the safeguard — every publish is attributed and kept. The
// newest entry is also what the console and the Salaah screen show as freshness, so there is
// one source for "when were these last touched".
const OPS_TIMING_HISTORY = [
  {
    id: 'h1', by: 'Ayaan Khan', role: 'Secretary', committee: true, when: '12 days ago',
    note: 'Isha was running late for the working brothers.',
    changes: ['Isha 8:00 PM → 8:15 PM'],
  },
  {
    id: 'h2', by: 'Abdul Rahman', role: 'Follower', committee: false, when: '26 Jun 2026',
    note: null,
    changes: ['Asr fixed 4:15 PM → varies, not before 4:30 PM', 'Asr iqama +10m → +15m'],
  },
  {
    id: 'h3', by: 'Salim Shaikh', role: 'Chairman', committee: true, when: '2 Jun 2026',
    note: 'Back to the summer schedule.',
    changes: ['Fajr 5:45 AM → 5:30 AM'],
  },
];

const latestTimingChange = () => OPS_TIMING_HISTORY[0] || null;

// ══════════════════════════════════════════════════════════════════════
// Formatting helpers
// ══════════════════════════════════════════════════════════════════════

// "HH:mm" (wire format) → "h:mm AM/PM" (TimeSelectField renders 12h in the app too).
const fmt12 = (time) => {
  if (!time) return '--:--';
  const [h, m] = time.split(':').map((n) => parseInt(n, 10));
  const pm = h >= 12;
  const hour12 = h % 12 === 0 ? 12 : h % 12;
  return `${hour12}:${String(m).padStart(2, '0')} ${pm ? 'PM' : 'AM'}`;
};

const variationLabel = (value) => (VARIATION_OPTIONS.find((o) => o.value === value) || {}).label || 'Not set';

// What is published right now, against the working copy being edited.
const salaahChanged = (working, prayerKey) => {
  const published = (OPS_SALAAH_CONFIG || {})[prayerKey] || {};
  const draft = (working || {})[prayerKey] || {};
  return ['variant', 'salaahTime', 'neverBefore', 'salaahTimeVariation', 'iqamaDelay']
    .some((field) => published[field] !== draft[field]);
};

const salaahChangeCount = (working) => (SALAAH_ORDER || [])
  .filter(({ key }) => salaahChanged(working, key)).length;

// The device frame's clock is a fixed 9:41 AM, so the console derives "next" from the same
// constant. Every storyboard frame has to render identically on every load; real time would
// make the board non-deterministic.
const FRAME_NOW_MINUTES = 9 * 60 + 41;

const prayerMinutes = (config = {}) => {
  const time = config.variant === VARIANT_VARIES ? config.neverBefore : config.salaahTime;
  if (!time) return null;
  const [h, m] = time.split(':').map((n) => parseInt(n, 10));
  return (h * 60) + m;
};

// Jumah is weekly, so it never answers "what is next today", and Maghrib follows sunset with
// no configured time — both appear in the strip, neither is a "next" candidate. Past Isha the
// answer rolls to tomorrow's Fajr rather than going blank.
const nextPrayer = (config = {}) => {
  const day = SALAAH_ORDER.filter(({ key }) => key !== 'jumah');
  const upcoming = day.find(({ key }) => {
    const mins = prayerMinutes(config[key]);
    return mins !== null && mins > FRAME_NOW_MINUTES;
  });
  if (upcoming) return { ...upcoming, tomorrow: false };
  const first = day.find(({ key }) => prayerMinutes(config[key]) !== null);
  return first ? { ...first, tomorrow: true } : null;
};

// The console's one-line form. describeConfig leads with the variant ("Fixed 1:30 PM"), which
// reads wrong after a prayer name — here the prayer is already named, so only the time matters.
const timeSummary = (config) => {
  if (!config) return '';
  if (config.variant === VARIANT_FIXED) return `${fmt12(config.salaahTime)} · iqama +${config.iqamaDelay}m`;
  if (config.variant === VARIANT_VARIES) return `not before ${fmt12(config.neverBefore)} · iqama +${config.iqamaDelay}m`;
  return `on time · iqama +${config.iqamaDelay}m`;
};

// Mirrors SalaahConfigScreen.describe(config).
const describeConfig = (config) => {
  if (!config) return '';
  if (config.variant === VARIANT_FIXED) return `Fixed ${fmt12(config.salaahTime)} · iqama +${config.iqamaDelay}m`;
  if (config.variant === VARIANT_VARIES) return `Varies, not before ${fmt12(config.neverBefore)} · iqama +${config.iqamaDelay}m`;
  return `On time · iqama +${config.iqamaDelay}m`;
};

const POST_TARGET_LABEL = { MASJID: 'My Masjid', MASJID_MASLAK: 'My Maslak', MASJID_PINCODE: 'My Pincode Area' };

const postPreview = (post) => {
  if (post.message) return post.message;
  if (post.kind === 'audio') return 'Audio paigham';
  return 'Image paigham';
};

const countLabel = (n) => (n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n));

// Feed grouping: an admin scans by day, so the feed carries Today / Yesterday / Earlier.
const postDay = (post) => {
  const when = post.when || '';
  if (when.startsWith('Today')) return 'Today';
  if (when.startsWith('Yesterday')) return 'Yesterday';
  return 'Earlier';
};

// Long bodies truncate with the same inline "Show more" the Qaum feed uses.
const POST_CLAMP = 150;
const postBody = (message) => {
  const text = message || '';
  if (text.length <= POST_CLAMP) return { text, clamped: false };
  return { text: `${text.slice(0, POST_CLAMP).replace(/\s+\S*$/, '')}… `, clamped: true };
};

// ══════════════════════════════════════════════════════════════════════
// Screen primitives (Components layer only — no raw primitives, no literal hex)
// ══════════════════════════════════════════════════════════════════════

function Screen({ children }) {
  return (
    <div style={{
      width: '100%', height: '100%', boxSizing: 'border-box', position: 'relative', overflow: 'hidden',
      display: 'flex', flexDirection: 'column',
      background: 'var(--color-surface-primary)', fontFamily: FONT_B, color: 'var(--color-info-primary)',
    }}>
      {children}
    </div>
  );
}

// Solid app bar: back · title (+ optional subtitle) · optional trailing action.
// `transitionName` carries the console's shared-element title (masjid name) from Profile.
function OpsAppBar({ title, subtitle, onBack, trailing, transitionName }) {
  return (
    <div style={{
      flexShrink: 0, display: 'flex', alignItems: 'center', gap: 12,
      padding: '54px 16px 12px', boxSizing: 'border-box',
      borderBottom: '1px solid var(--color-neutral-border)', background: 'var(--color-surface-primary)',
    }}>
      <button className="ib ib-tonal" onClick={onBack} aria-label="Back">
        <span className="mi" data-i="arrow_back"></span>
      </button>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div className="ab-title" style={{
          fontSize: 22, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
          viewTransitionName: transitionName || 'none',
        }}>{title}</div>
        {subtitle ? (
          <div style={{ fontSize: 12, marginTop: 3, color: 'var(--color-info-secondary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{subtitle}</div>
        ) : null}
      </div>
      {trailing || <div style={{ width: 48, flexShrink: 0 }} />}
    </div>
  );
}

// Scrollable screen body. `bottomInset` keeps content clear of the home indicator
// (and of a docked footer action when one is present).
function Body({ children, bottomInset = 44, gutter = 16, style = {}, scrollRef, onScroll }) {
  return (
    <div ref={scrollRef} onScroll={onScroll} style={{
      flex: 1, minHeight: 0, overflowY: 'auto', overscrollBehavior: 'contain',
      padding: `14px ${gutter}px ${bottomInset}px`, boxSizing: 'border-box',
      display: 'flex', flexDirection: 'column', gap: 12, ...style,
    }}>
      {children}
    </div>
  );
}

// The three state views come from the components layer (_theme/components.jsx) so every
// board shares one construction; these wrappers only supply this section's copy defaults.
function Loading({ label }) {
  const { Loader } = window;
  return Loader ? <Loader label={label} /> : null;
}

function ErrorState({ title, copy, actionText = 'Try again', onRetry }) {
  const { EmptyState } = window;
  if (!EmptyState) return null;
  return (
    <EmptyState
      tone="error"
      icon="error"
      title={title}
      description={copy}
      action={onRetry ? { text: actionText, onClick: onRetry } : undefined}
    />
  );
}

function Empty({ icon, title, copy, actionText, actionIcon, onAction }) {
  const { EmptyState } = window;
  if (!EmptyState) return null;
  return (
    <EmptyState
      icon={icon}
      title={title}
      description={copy}
      action={actionText ? { text: actionText, icon: actionIcon, onClick: onAction } : undefined}
    />
  );
}

function Card({ children, style = {}, onClick, ariaLabel }) {
  const Root = onClick ? 'button' : 'div';
  return (
    <Root
      className="surf"
      type={onClick ? 'button' : undefined}
      onClick={onClick}
      aria-label={ariaLabel}
      style={{
        borderRadius: 18, padding: 14, width: '100%', textAlign: 'left', flexShrink: 0,
        border: '1px solid var(--color-neutral-border)', background: 'var(--color-surface-card)',
        cursor: onClick ? 'pointer' : 'default', font: 'inherit', color: 'inherit', ...style,
      }}
    >
      {children}
    </Root>
  );
}

function Avatar({ text, size = 40, tone = 'tonal' }) {
  return (
    <span className={`avatar ${tone === 'accent' ? 'accent' : ''}`} style={{ '--tile': `${size}px` }} aria-hidden="true">
      {(text || '?').charAt(0).toUpperCase()}
    </span>
  );
}

function MasjidMark({ masjid = {}, size = 48 }) {
  if (masjid.photo) {
    return (
      <span className="masjid-mark" style={{ '--tile': `${size}px` }}>
        <img src={masjid.photo} alt="" />
      </span>
    );
  }
  return (
    <span className="icon-tile accent" style={{ '--tile': `${size}px` }} aria-hidden="true">
      <span className="mi" data-i="mosque"></span>
    </span>
  );
}

function IconTile({ icon, size = 40, tone = 'tonal' }) {
  return (
    <span className={`icon-tile ${tone === 'accent' ? 'accent' : ''}`} style={{ '--tile': `${size}px` }} aria-hidden="true">
      <span className="mi" data-i={icon}></span>
    </span>
  );
}

function SectionLabel({ children, hint }) {
  return (
    <div style={{ flexShrink: 0 }}>
      <div style={{ fontFamily: FONT_T, fontSize: 18, letterSpacing: '-0.2px' }}>{children}</div>
      {hint ? <div style={{ fontSize: 12, lineHeight: 1.45, marginTop: 4, color: 'var(--color-info-secondary)' }}>{hint}</div> : null}
    </div>
  );
}

function KeyValue({ label, value }) {
  return (
    <div style={{ minWidth: 0 }}>
      <div style={{ fontSize: 12, color: 'var(--color-info-secondary)' }}>{label}</div>
      <div style={{ fontSize: 14, marginTop: 2, lineHeight: 1.45 }}>{value}</div>
    </div>
  );
}

// Read-only .input shell that opens an anchored .dd-menu — the SelectDropdownField
// construction from SalaahConfigEditors.kt / the invite role picker.
function SelectField({ label, value, placeholder, options, open, onOpen, onPick, disabled, helper, menuMaxHeight = 208 }) {
  const selected = options.find((o) => String(o.value) === String(value));
  return (
    <div className="field" style={{ marginBottom: 0 }}>
      {label ? <div className="flabel">{label}</div> : null}
      <div style={{ position: 'relative' }}>
        <button
          type="button"
          className="picker-field"
          aria-haspopup="listbox"
          aria-expanded={!!open}
          disabled={disabled}
          onClick={() => !disabled && onOpen && onOpen(!open)}
        >
          <span className={selected ? 'picker-field-value' : 'picker-field-placeholder'}>
            {selected ? selected.label : (placeholder || 'Select')}
          </span>
          <span className={`mi chev ${open ? 'open' : ''}`} data-i="expand_more"></span>
        </button>
        {open ? (
          <div className="dd-menu" role="listbox" style={{ maxHeight: menuMaxHeight, overflowY: 'auto' }}>
            {options.map((o) => {
              const isSel = String(o.value) === String(value);
              return (
                <div
                  key={String(o.value)}
                  role="option"
                  aria-selected={isSel}
                  className={`dd-item ${isSel ? 'selected' : ''}`}
                  onClick={() => onPick && onPick(o.value)}
                >
                  <span style={{ flex: 1, minWidth: 0 }}>{o.label}</span>
                  {isSel ? <span className="mi" data-i="check"></span> : null}
                </div>
              );
            })}
          </div>
        ) : null}
      </div>
      {helper ? <div className="helper">{helper}</div> : null}
    </div>
  );
}

// Hour · Minute · AM/PM triple — mirrors TimeSelectField (12h display, "HH:mm" backed).
function TimeSelect({ label, value, menuKey, openMenu, onOpenMenu, onChange, helper }) {
  const [h24, m] = (value || '05:00').split(':').map((n) => parseInt(n, 10));
  const pm = h24 >= 12;
  const hour12 = h24 % 12 === 0 ? 12 : h24 % 12;
  const to24 = (hour, isPm) => (isPm ? (hour === 12 ? 12 : hour + 12) : (hour === 12 ? 0 : hour));
  const write = (hour, minute, isPm) => onChange && onChange(`${String(to24(hour, isPm)).padStart(2, '0')}:${String(minute).padStart(2, '0')}`);

  const hourOptions = Array.from({ length: 12 }, (_, i) => ({ value: i + 1, label: String(i + 1) }));
  const minuteOptions = Array.from({ length: 12 }, (_, i) => ({ value: i * 5, label: String(i * 5).padStart(2, '0') }));
  if (!minuteOptions.some((o) => o.value === m)) minuteOptions.push({ value: m, label: String(m).padStart(2, '0') });
  minuteOptions.sort((a, b) => a.value - b.value);

  return (
    <div>
      {label ? <div className="flabel">{label}</div> : null}
      <div className="time-select">
        <div>
          <SelectField
            value={hour12} options={hourOptions} menuMaxHeight={176}
            open={openMenu === `${menuKey}-hour`}
            onOpen={(next) => onOpenMenu && onOpenMenu(next ? `${menuKey}-hour` : null)}
            onPick={(v) => write(v, m, pm)}
          />
        </div>
        <div>
          <SelectField
            value={m} options={minuteOptions} menuMaxHeight={176}
            open={openMenu === `${menuKey}-minute`}
            onOpen={(next) => onOpenMenu && onOpenMenu(next ? `${menuKey}-minute` : null)}
            onPick={(v) => write(hour12, v, pm)}
          />
        </div>
        <div>
          <SelectField
            value={pm ? 'PM' : 'AM'}
            options={[{ value: 'AM', label: 'AM' }, { value: 'PM', label: 'PM' }]}
            open={openMenu === `${menuKey}-meridiem`}
            onOpen={(next) => onOpenMenu && onOpenMenu(next ? `${menuKey}-meridiem` : null)}
            onPick={(v) => write(hour12, m, v === 'PM')}
          />
        </div>
      </div>
      {helper ? <div className="helper">{helper}</div> : null}
    </div>
  );
}

// Docked primary action. Progress is rendered ABOVE the bar (never inside the button).
function FooterAction({ label, onClick, disabled, busy, busyLabel, secondary, helper }) {
  return (
    <div className="docked-action bordered">
      {busy ? (
        <div className="inline-loading-status" role="status">
          <span className="btn-spinner" aria-hidden="true"></span>{busyLabel || 'Saving…'}
        </div>
      ) : null}
      {!busy && helper ? <div className="docked-action-note">{helper}</div> : null}
      <button className="btn btn-filled lg" disabled={disabled || busy} onClick={onClick}>{label}</button>
      {secondary ? (
        <button className="btn btn-tonal lg" onClick={secondary.onClick}>{secondary.text}</button>
      ) : null}
    </div>
  );
}

function Snack({ snack, onClose }) {
  if (!snack) return null;
  return (
    <div className="snack docked" role="status">
      <span className={`mi snack-icon ${snack.tone === 'error' ? 'error' : ''}`} data-i={snack.tone === 'error' ? 'error' : 'check_circle'}></span>
      <span className="snack-copy">{snack.message}</span>
      <button className="snack-close" onClick={onClose} aria-label="Dismiss"><span className="mi" data-i="close"></span></button>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════
// 1 · Console — Overview tab
// ══════════════════════════════════════════════════════════════════════

// A screen's one persistent action. Extended so it names itself on arrival, compact once the
// reader scrolls — `compact` is passed in rather than measured here, so a static storyboard
// frame can demonstrate the collapsed state without a scroll event.
function Fab({ icon, label, compact, onClick, bottom }) {
  return (
    <button
      className={`fab ${compact ? 'compact' : ''}`}
      onClick={onClick}
      aria-label={label}
      style={bottom ? { bottom } : undefined}
    >
      <span className="mi" data-i={icon} aria-hidden="true"></span>
      <span className="fab-label">{label}</span>
    </button>
  );
}

// How far the reader has to move before the label gets out of the way. Small, but past the
// couple of pixels a rubber-band overscroll produces — otherwise the label flickers at rest.
const FAB_COLLAPSE_AT = 24;

function AttentionRow({ icon, title, copy, count, onClick }) {
  return (
    <button className="list-item actionable" onClick={onClick} type="button" style={{ padding: '12px 4px' }}>
      <span className="mi list-item-leading" style={{ color: 'var(--color-action-primary)' }} data-i={icon} aria-hidden="true"></span>
      <span className="list-item-copy">
        <span className="list-item-title">{title}</span>
        <span className="list-item-subtitle">{copy}</span>
      </span>
      <span className="badge sm amber" style={{ flexShrink: 0 }}>{count}</span>
      <span className="mi list-item-chevron" data-i="chevron_right" aria-hidden="true"></span>
    </button>
  );
}

function LockedConsole() {
  // The usual cause of no console access: the caller is not an ACTIVE committee member yet
  // (registration still in review, or an invitation not accepted).
  return (
    <div style={{ flex: 1, minHeight: 0, overflowY: 'auto' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '28px 24px 40px', gap: 12 }}>
        <div className="empty-state-icon" aria-hidden="true"><span className="mi" data-i="security"></span></div>
        <div style={{ fontFamily: FONT_T, fontSize: 22, marginTop: 6 }}>This console is committee-only</div>
        <div style={{ fontSize: 14, lineHeight: 1.55, color: 'var(--color-info-secondary)' }}>
          Only verified committee members of this masjid can manage it. If you just registered or
          claimed this masjid, your verification is still in review — the console opens automatically
          the moment it is approved. If someone else manages this masjid, ask them to send you a
          committee invitation from their committee list.
        </div>
        <div style={{ fontSize: 12, color: 'var(--color-info-tertiary)' }}>Committee membership not found for this account.</div>
      </div>
    </div>
  );
}

// A row on the console: leading icon, title, subtitle, trailing value, chevron.
function ConsoleRow({ icon, title, copy, value, onClick }) {
  return (
    <button className="list-item actionable" onClick={onClick} style={{ padding: '13px 4px', minHeight: 62 }}>
      <span className="mi list-item-leading" style={{ color: 'var(--color-action-primary)' }} data-i={icon} aria-hidden="true"></span>
      <span className="list-item-copy">
        <span className="list-item-title">{title}</span>
        {copy ? <span className="list-item-subtitle">{copy}</span> : null}
      </span>
      {value ? <span className="list-item-value">{value}</span> : null}
      <span className="mi list-item-chevron" data-i="chevron_right" aria-hidden="true"></span>
    </button>
  );
}

// ── The paigham feed — the Qaum post construction, plus the controls an admin needs ──
function ConsolePost({ post, masjid, canManage, menuOpen, deleting, onToggleMenu, onDelete }) {
  const audio = post.kind === 'audio';
  return (
    <article className="feed-post">
      <div className="feed-post-head">
        {masjid.photo
          ? <span className="masjid-mark round" style={{ '--tile': '44px' }} aria-hidden="true"><img src={masjid.photo} alt="" /></span>
          : <span className="avatar accent" style={{ '--tile': '44px' }} aria-hidden="true">{masjid.name.charAt(0)}</span>}
        <span className="feed-post-id">
          <span className="feed-post-name">{masjid.name}</span>
          <span className="feed-post-sub">Sent by {post.author}</span>
        </span>
        {canManage ? (
          <span style={{ position: 'relative', flexShrink: 0 }}>
            {deleting ? (
              <span className="btn-spinner" style={{ margin: 12, color: 'var(--color-info-secondary)' }} role="status" aria-label="Deleting"></span>
            ) : (
              <button
                className="ib ib-tonal md"
                aria-haspopup="menu"
                aria-expanded={!!menuOpen}
                aria-label={`Options for the paigham sent by ${post.author}`}
                onClick={onToggleMenu}
              >
                <span className="mi" data-i="more_vert"></span>
              </button>
            )}
            {menuOpen ? (
              <div className="dd-menu" role="menu" style={{ left: 'auto', right: 0, width: 176 }}>
                <div className="dd-item" role="menuitem" onClick={onDelete} style={{ color: 'var(--color-status-error)' }}>
                  <span className="mi" style={{ color: 'var(--color-status-error)' }} data-i="delete"></span>Delete paigham
                </div>
              </div>
            ) : null}
          </span>
        ) : null}
      </div>

      {audio ? (
        <div className="aplayer" style={{ marginBottom: 10 }}>
          <button className="ap-toggle" aria-label="Play recording">
            <span className="mi fill" data-i="play_arrow"></span>
          </button>
          <span className="ap-time">{post.duration}</span>
          <div className="ap-wave" aria-hidden="true">
            {[38, 62, 44, 78, 96, 70, 52, 84, 66, 40, 58, 88, 72, 46, 62, 34, 54, 76].map((h, i) => (
              <i key={i} className={i < 4 ? 'on' : ''} style={{ '--h': `${h}%` }}></i>
            ))}
          </div>
        </div>
      ) : (
        <div className="feed-post-body">
          {postBody(post.message || 'Photo notice').text}
          {postBody(post.message || 'Photo notice').clamped ? <span className="feed-post-more">Show more</span> : null}
        </div>
      )}

      {post.images ? (
        <div className="post-preview-photos count-1" style={{ marginBottom: 10, borderRadius: 'var(--radius-xl)', overflow: 'hidden' }}>
          <img src="../../images/masjid-camera-preview.png" alt="" />
        </div>
      ) : null}

      <div className="feed-post-actions">
        <span className="feed-post-react"><span className="mi" data-i="favorite" aria-hidden="true"></span></span>
        <span className="feed-post-count">{post.reactions}</span>
        <span className="feed-post-time">{(post.when || '').split(' · ').pop()}</span>
      </div>
      <div className="feed-post-admin">
        <span className="mi" data-i="groups" aria-hidden="true"></span>
        {POST_TARGET_LABEL[post.target] || 'My Masjid'} · seen by {(masjid.stats.followers || 0).toLocaleString('en-IN')} followers
      </div>
    </article>
  );
}

// ── The console — an eagle view of the masjid you manage ─────────────
// Ordered by what a committee member came to do: who they are, what is waiting on them,
// today's published timings, the places to go, then Send a paigham sitting directly on top
// of the feed it produces — in the same feed the community sees.
function ConsoleHome({ data, transitionEnabled }) {
  const {
    masjid = OPS_MASJID, role, caps = [], status, counts = {}, managed = [], me,
    attention = [], posts = {}, onRetry, onCreatePost, onOpenDest, onOpenSwitcher,
    onOpenAttention, onTogglePostMenu, onDeletePost,
  } = data;

  if (status === 'loading') return <Loading label="Loading console…" />;
  if (status === 'locked') return <LockedConsole />;
  if (status === 'error') {
    return (
      <ErrorState
        title="Couldn't load this masjid"
        copy="Your console data is safe. Check your connection and try again."
        onRetry={onRetry}
      />
    );
  }

  const items = posts.items || [];
  const canPost = OPS_CAPS.can(caps, 'post');
  const isAdmin = OPS_CAPS.isAdmin(caps);
  const canManagePost = (post) => isAdmin || (canPost && me && post.authorId === me.id);
  // The strip shows what followers see right now, never the working draft.
  const next = nextPrayer(OPS_SALAAH_CONFIG);
  const lastChange = latestTimingChange();

  // The send action floats over the feed, so it survives the scroll. Storyboard frames pass
  // `fabCompact` explicitly; the live device lets scroll position decide.
  const bodyRef = React.useRef(null);
  const [scrolled, setScrolled] = React.useState(false);
  const onBodyScroll = () => {
    const el = bodyRef.current;
    if (el) setScrolled(el.scrollTop > FAB_COLLAPSE_AT);
  };
  const fabCompact = data.fabCompact || scrolled;

  return (
    <React.Fragment>
    {/* The feed ends above the FAB's landing zone, so the last paigham is never half-covered. */}
    <Body scrollRef={bodyRef} onScroll={onBodyScroll} style={{ gap: 0, padding: 0, paddingBottom: canPost ? 96 : 24 }}>
      {/* identity — the header of the screen: back, the masjid's own mark, its name with the
          switch icon inline, then who you are here. No app-bar title above it. */}
      <div className="console-head">
        <button className="ib ib-tonal" aria-label="Back" onClick={data.onBack}>
          <span className="mi" data-i="arrow_back"></span>
        </button>
        <MasjidMark masjid={masjid} size={48} />
        <div className="console-head-copy">
          <button
            className="console-head-name"
            onClick={managed.length > 1 ? onOpenSwitcher : undefined}
            aria-haspopup={managed.length > 1 ? 'dialog' : undefined}
            aria-label={managed.length > 1 ? `${masjid.name} — switch masjid` : undefined}
            style={{ cursor: managed.length > 1 ? 'pointer' : 'default' }}
          >
            <span
              className="console-head-title"
              style={{ viewTransitionName: transitionEnabled ? CONSOLE_TITLE_TRANSITION : 'none' }}
            >{masjid.name}</span>
            <span className="mi console-head-verified" data-i="verified" aria-label="Verified masjid"></span>
            {managed.length > 1 ? (
              <span className="mi console-head-swap" data-i="unfold_more" aria-hidden="true"></span>
            ) : null}
          </button>
          {/* Who you are here. The masjid code is reference data, not identity — it lives on
              Masjid details rather than truncating this line. */}
          <div className="console-head-role">
            {roleLabel(role)}{isAdmin ? ' · full admin' : ''}
          </div>
        </div>
      </div>

      <div style={{ padding: '0 16px' }}>
        {/* 1 · what the committee owes someone. Nothing waiting → the block is not there at
            all, so an empty queue costs no space and no reading. */}
        {attention.length ? (
          <React.Fragment>
            <div className="console-eyebrow">Needs you</div>
            <div className="console-group attention">
              {attention.map((item) => (
                <AttentionRow
                  key={item.id}
                  icon={item.icon}
                  title={item.title}
                  copy={item.copy}
                  count={item.count}
                  onClick={() => onOpenAttention && onOpenAttention(item.id)}
                />
              ))}
            </div>
          </React.Fragment>
        ) : null}

        {/* 2 · today's published timings. Live data, not a chevron: the whole card is the
            door into the editor, and the strip is the same construction the Salaah screen
            uses for its published baseline so the two cannot drift apart. */}
        <button
          className="console-salaah"
          onClick={() => onOpenDest && onOpenDest('salaah')}
          aria-label="Salaah timings — update azaan, jamaat and iqama"
        >
          <span className="console-salaah-head">
            <span>Today's salaah</span>
            <span>{lastChange ? `Updated ${lastChange.when}` : 'Not set yet'}</span>
          </span>
          <span className="timings-published-grid">
            {SALAAH_ORDER.map(({ key, label }) => {
              const published = OPS_SALAAH_CONFIG[key] || {};
              return (
                <span key={key} className={next && next.key === key && !next.tomorrow ? 'next' : ''}>
                  <b>{label}</b>
                  <small>{published.salaahTime ? fmt12(published.salaahTime) : 'On time'}</small>
                </span>
              );
            })}
          </span>
          <span className="console-salaah-foot">
            <span>
              {next
                ? `${next.tomorrow ? 'Tomorrow' : 'Next'} — ${next.label} ${timeSummary(OPS_SALAAH_CONFIG[next.key])}`
                : 'Azaan, jamaat and iqama'}
            </span>
            <span className="mi" data-i="chevron_right" aria-hidden="true"></span>
          </span>
        </button>

        {/* 3 · the rest of the console. Followers is a destination like any other, not a
            number pretending to be a tile. */}
        <div className="console-group">
          <ConsoleRow
            icon="groups"
            title="Committee"
            copy={isAdmin ? 'Members, roles and permissions' : 'Members and what each can do'}
            value={String(counts.members || 0)}
            onClick={() => onOpenDest && onOpenDest('members')}
          />
          <ConsoleRow
            icon="favorite"
            title="Followers"
            copy="People following this masjid"
            value={countLabel(masjid.stats.followers)}
            onClick={() => onOpenDest && onOpenDest('followers')}
          />
          <ConsoleRow
            icon="settings"
            title="Masjid details"
            copy="Address, contact and masjid code"
            onClick={() => onOpenDest && onOpenDest('details')}
          />
        </div>
      </div>

      {/* the masjid's paighams, in the feed the community sees. The lifetime reaction count
          belongs here as context for the feed, not as a tile that looks tappable. */}
      <div className="console-feedhead">
        <span className="console-feedhead-title">Paighams</span>
        <span className="console-feedhead-count">
          {items.length} sent{items.length ? ` · ${countLabel(masjid.stats.reactions)} reactions` : ''}
        </span>
      </div>

      {posts.status === 'loading' ? <Loading label="Loading paighams…" /> : null}
      {posts.status === 'error' ? (
        <ErrorState title="Couldn't load paighams" copy="Check your connection and try again." onRetry={onRetry} />
      ) : null}
      {posts.status === 'loaded' && !items.length ? (
        <Empty
          icon="campaign"
          title="No paighams yet"
          copy={canPost
            ? 'Send the first one — a message, a photo notice or an audio announcement. Followers receive it straight away.'
            : 'Paighams sent by the committee appear here.'}
          actionText={canPost ? 'Send the first paigham' : undefined}
          actionIcon={canPost ? 'campaign' : undefined}
          onAction={onCreatePost}
        />
      ) : null}
      {posts.status === 'loaded' && items.length ? (
        <div style={{ borderTop: '1px solid var(--color-neutral-border)' }}>
          {items.map((post, index) => {
            const day = postDay(post);
            const newDay = index === 0 || postDay(items[index - 1]) !== day;
            return (
              <React.Fragment key={post.id}>
                {newDay ? <div className="console-day">{day}</div> : null}
                <ConsolePost
                  post={post}
                  masjid={masjid}
                  canManage={canManagePost(post)}
                  menuOpen={posts.menuFor === post.id}
                  deleting={posts.deleting === post.id}
                  onToggleMenu={() => onTogglePostMenu && onTogglePostMenu(posts.menuFor === post.id ? null : post.id)}
                  onDelete={() => onDeletePost && onDeletePost(post)}
                />
              </React.Fragment>
            );
          })}
          <div style={{ fontSize: 11, lineHeight: 1.5, textAlign: 'center', padding: '14px 20px 8px', color: 'var(--color-info-tertiary)' }}>
            {isAdmin
              ? 'As a full admin you can delete any paigham. Deleting removes it for every follower.'
              : canPost
                ? 'You can delete the paighams you sent.'
                : 'Only members with the Send paighams permission can add or delete.'}
          </div>
        </div>
      ) : null}
    </Body>

    {canPost ? (
      <Fab icon="campaign" label="Send a paigham" compact={fabCompact} onClick={onCreatePost} />
    ) : null}
    </React.Fragment>
  );
}

// ── Masjid switcher ──────────────────────────────────────────────────
function MasjidSwitcherSheet({ open, managed = [], currentId, onPick, onClose }) {
  const { Dialog } = window;
  if (!open || !Dialog) return null;
  return (
    <Dialog
      mode="sheet"
      isOpen
      onClose={onClose}
      title="Switch masjid"
      description="You manage more than one. Everything on the console follows the masjid you pick."
      primary={null}
      secondary={{ text: 'Close', onClick: onClose }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }} role="radiogroup" aria-label="Masjids you manage">
        {managed.map((m) => {
          const current = m.id === currentId;
          return (
            <button
              key={m.id}
              role="radio"
              aria-checked={current}
              className={`list-item ${current ? '' : 'actionable'}`}
              onClick={current ? undefined : () => onPick && onPick(m.id)}
              style={{ minHeight: 68, borderRadius: 'var(--radius-2xl)', background: current ? 'var(--color-action-background)' : 'transparent' }}
            >
              <IconTile icon="mosque" size={40} tone={current ? 'accent' : 'tonal'} />
              <span className="list-item-copy" style={{ gap: 2 }}>
                <span className="list-item-title">{m.name}</span>
                <span className="list-item-subtitle" style={{ WebkitLineClamp: 1 }}>
                  {roleLabel(m.role)} · {m.city} · {countLabel(m.followers)} followers
                </span>
              </span>
              {current
                ? <span className="badge sm teal" style={{ flexShrink: 0 }}>Current</span>
                : <span className="mi list-item-chevron" data-i="chevron_right"></span>}
            </button>
          );
        })}
      </div>
    </Dialog>
  );
}

// ── Masjid details — the verified record, read-only by design ─────────
// These fields were checked when the masjid was verified, so nothing here is editable in
// the app. A full admin can ask Paigham to correct something; everyone else can only read.
function DetailField({ label, value, mono }) {
  return (
    <div className="detail-field">
      <span className="detail-label">{label}</span>
      <span className={`detail-value${mono ? ' mono' : ''}`}>{value}</span>
    </div>
  );
}

function DetailsBody({ data }) {
  const { masjid = OPS_MASJID, caps = [], onRequestCorrection } = data;
  const isAdmin = OPS_CAPS.isAdmin(caps);
  const pincode = (masjid.address.match(/\d{6}/) || [''])[0];

  return (
    <Body bottomInset={40} style={{ gap: 0, padding: 0 }}>
      {/* the masjid as it was verified: its photo, name and code */}
      <div className="detail-hero">
        {masjid.photo ? <img src={masjid.photo} alt={`${masjid.name} entrance`} /> : null}
        <div className="detail-hero-copy">
          <div className="detail-hero-name">{masjid.name}</div>
          <div className="detail-hero-meta">
            <span className="badge sm gold"><span className="mi" data-i="verified"></span>Verified</span>
            <span className="detail-hero-code">{masjid.code}</span>
          </div>
        </div>
      </div>

      <div style={{ padding: '16px 16px 0' }}>
        <div className="detail-group-label">Identity</div>
        <div className="console-group detail-group">
          <DetailField label="Masjid name" value={masjid.name} />
          <DetailField label="Masjid code" value={masjid.code} mono />
          <DetailField label="Maslak" value={masjid.maslak} />
        </div>

        <div className="detail-group-label">Contact</div>
        <div className="console-group detail-group">
          <DetailField label="Contact person" value={masjid.contactName} />
          <DetailField label="Phone" value={masjid.phone} mono />
        </div>

        <div className="detail-group-label">Location</div>
        <div className="console-group detail-group">
          <DetailField label="Address" value={masjid.address} />
          {pincode ? <DetailField label="Pincode" value={pincode} mono /> : null}
        </div>

        {isAdmin ? (
          <button className="list-item actionable detail-correction" onClick={onRequestCorrection}>
            <span className="mi list-item-leading" style={{ color: 'var(--color-action-primary)' }} data-i="mail" aria-hidden="true"></span>
            <span className="list-item-copy">
              <span className="list-item-title">Request a correction</span>
              <span className="list-item-subtitle">Ask Paigham to fix a detail. The masjid code never changes.</span>
            </span>
            <span className="mi list-item-chevron" data-i="chevron_right" aria-hidden="true"></span>
          </button>
        ) : (
          <div className="detail-note">
            These details were checked when this masjid was verified. Only a full admin can
            request a correction.
          </div>
        )}
      </div>
    </Body>
  );
}

// ══════════════════════════════════════════════════════════════════════
// 2 · Console — Posts tab
// ══════════════════════════════════════════════════════════════════════

// ══════════════════════════════════════════════════════════════════════
// 3 · Console — Members tab (Committee + Followers)
// ══════════════════════════════════════════════════════════════════════

// A committee row: who they are, the title they hold, and — at a glance — what they may do.
function MemberRow({ member, manageable, onOpen }) {
  const invited = member.status === 'INVITED';
  const Root = manageable ? 'button' : 'div';
  return (
    <Root
      className={`list-item${manageable ? ' actionable' : ''}`}
      onClick={manageable ? onOpen : undefined}
      type={manageable ? 'button' : undefined}
      style={{ padding: '12px 4px', minHeight: 68 }}
    >
      <span style={{ flexShrink: 0 }}><Avatar text={member.name} size={42} /></span>
      <span className="list-item-copy" style={{ gap: 3 }}>
        <span className="list-item-title" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          {member.name}
          {member.you ? <span className="badge sm teal">You</span> : null}
        </span>
        <span className="member-caps">
          <span className="member-role">{roleLabel(member.role)}</span>
          {OPS_CAPS.available().map((capability) => {
            const on = OPS_CAPS.can(member.caps, capability.id);
            return (
              <span
                key={capability.id}
                className={`mi member-cap ${on ? 'on' : ''}`}
                data-i={capability.icon}
                title={`${capability.label}${on ? '' : ' — not granted'}`}
                aria-label={`${capability.label}${on ? '' : ' not granted'}`}
              ></span>
            );
          })}
        </span>
      </span>
      {invited ? <span className="badge sm amber" style={{ flexShrink: 0 }}>Invited</span> : null}
      {manageable ? <span className="mi list-item-chevron" data-i="chevron_right" aria-hidden="true"></span> : null}
    </Root>
  );
}

// Committee: everyone in the committee can SEE it; only a full admin can open a member to
// change their role, their permissions, or remove them. Active members and members who have
// not accepted yet are separate groups, because they need different attention.
function CommitteeBody({ data }) {
  const { caps = [], masjid = OPS_MASJID, members = {}, onRetry, onOpenInvite, onOpenMember } = data;
  const { status = 'loaded', items = [] } = members;
  const isAdmin = OPS_CAPS.isAdmin(caps);
  const active = items.filter((m) => m.status !== 'INVITED');
  const invited = items.filter((m) => m.status === 'INVITED');

  return (
    <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
      {status === 'loading' ? <Loading label="Loading committee…" /> : null}
      {status === 'error' ? (
        <ErrorState title="Couldn't load the committee" copy="Check your connection and try again." onRetry={onRetry} />
      ) : null}
      {status === 'loaded' && !items.length ? (
        <Empty
          icon="groups"
          title="Your committee starts here"
          copy={isAdmin
            ? 'Invite your imam, secretary, muezzin and other members by phone number, then choose what each of them can do. They get the invitation inside Paigham and can accept within 7 days.'
            : 'Committee members appear here once they accept their invitations. A full admin sends the invitations.'}
          actionText={isAdmin ? 'Invite the first member' : undefined}
          actionIcon={isAdmin ? 'add' : undefined}
          onAction={onOpenInvite}
        />
      ) : null}

      {status === 'loaded' && items.length ? (
        <Body bottomInset={isAdmin ? 8 : 40} style={{ gap: 0, paddingTop: 14 }}>
          <div className="committee-summary">
            <span className="icon-tile" style={{ '--tile': '38px' }}><span className="mi" data-i="groups"></span></span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 14, fontWeight: 700 }}>
                {active.length} {active.length === 1 ? 'member' : 'members'} running {masjid.name}
              </div>
              <div style={{ fontSize: 11.5, marginTop: 2, color: 'var(--color-info-secondary)' }}>
                {isAdmin
                  ? 'Tap anyone to change their role or permissions.'
                  : 'The icons show what each member is allowed to do.'}
              </div>
            </div>
          </div>

          <div className="console-group" style={{ marginTop: 14 }}>
            {active.map((member) => (
              <MemberRow
                key={member.id}
                member={member}
                manageable={isAdmin}
                onOpen={() => onOpenMember && onOpenMember(member)}
              />
            ))}
          </div>

          {invited.length ? (
            <>
              <div className="committee-label">
                Waiting to accept
                <span>{invited.length}</span>
              </div>
              <div className="console-group">
                {invited.map((member) => (
                  <MemberRow
                    key={member.id}
                    member={member}
                    manageable={isAdmin}
                    onOpen={() => onOpenMember && onOpenMember(member)}
                  />
                ))}
              </div>
              <div className="committee-note">
                An invitation is valid for 7 days. Until it is accepted the member has no access.
              </div>
            </>
          ) : null}

          <div className="committee-legend">
            {OPS_CAPS.available().map((capability) => (
              <span key={capability.id}>
                <span className="mi" data-i={capability.icon}></span>
                {capability.short}
              </span>
            ))}
          </div>
        </Body>
      ) : null}

      {isAdmin && status === 'loaded' && items.length ? (
        <div className="docked-action bordered">
          <button className="btn btn-filled lg" onClick={onOpenInvite}>
            <span className="mi" style={{ fontSize: 20 }} data-i="add"></span>Invite a member
          </button>
        </div>
      ) : null}
    </div>
  );
}

// ── Member permissions destination ───────────────────────────────────
// The extension point for the whole permission model: available capabilities are switch
// rows, planned ones are listed as Coming soon so the committee can see what is arriving.
function CapabilityRow({ capability, on, disabled, onToggle }) {
  return (
    <div className="toggle-row" aria-disabled={capability.available ? undefined : 'true'}>
      <span className="toggle-row-icon"><span className="mi" data-i={capability.icon}></span></span>
      <span className="toggle-row-copy">
        <strong>{capability.label}</strong>
        <small>{capability.copy}</small>
      </span>
      {capability.available ? (
        <button
          className={`sw ${on ? 'on' : ''}`}
          role="switch"
          aria-checked={!!on}
          aria-label={capability.label}
          disabled={disabled}
          onClick={disabled ? undefined : onToggle}
          style={disabled ? { opacity: 'var(--opacity-strong)', cursor: 'not-allowed' } : undefined}
        ></button>
      ) : (
        <span className="badge sm gold" style={{ flexShrink: 0 }}>Soon</span>
      )}
    </div>
  );
}

// One full screen for both scenarios: inviting someone new and viewing/editing an existing
// member. The role picker, the permission switches and the Coming-soon list are identical in
// both — only the header (a name vs. a phone field) and the committed action differ. Keeping
// them in one component is the point: the set of permissions you grant at invite time and the
// set you edit later cannot drift apart.
function MemberBody({ data }) {
  const {
    caps = [], members = {}, openMenu, onBack, onOpenMenu, onPickRole, onToggleCapability, onOpenRemove,
    onInvitePhone, onInviteRole, onInviteCapability, onSendInvite,
  } = data;
  const inviting = data.dest === 'invite';
  const invite = members.invite || {};
  const member = inviting ? null : members.editing;
  if (!inviting && !member) return <Loading label="Loading member…" />;

  const isAdmin = OPS_CAPS.isAdmin(caps);
  const grantedCaps = inviting ? (invite.caps || []) : member.caps;
  const memberIsAdmin = OPS_CAPS.isAdmin(grantedCaps);
  // The masjid must keep one full admin, so the last one cannot revoke their own grant.
  const soleAdmin = !inviting && memberIsAdmin && (members.adminCount || 0) <= 1;
  // Inviting is itself a full-admin action, so the switches are live; editing someone else
  // requires the grant.
  const canEdit = inviting || isAdmin;
  const phone = invite.phone || '';
  const inviteValid = phone.replace(/\D/g, '').length >= 10 && !!invite.role;

  return (
    <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
      {/* the person IS the header — identity once, not twice */}
      <div className="console-head">
        <button className="ib ib-tonal" aria-label="Back" onClick={onBack}>
          <span className="mi" data-i="arrow_back"></span>
        </button>
        {inviting
          ? <IconTile icon="person" size={48} tone="accent" />
          : <Avatar text={member.name} size={48} tone="accent" />}
        <div className="console-head-copy">
          <div className="member-head-name">{inviting ? 'Invite a member' : `${member.name}${member.you ? ' (you)' : ''}`}</div>
          <div className="member-head-meta">
            <span>{inviting ? 'They accept inside Paigham within 7 days' : member.phone}</span>
            {!inviting && member.status === 'INVITED' ? <span className="badge sm amber">Invitation pending</span> : null}
          </div>
        </div>
      </div>

      <Body bottomInset={inviting ? 16 : 40} style={{ gap: 14, paddingTop: 4 }}>
        {/* the only field the invite scenario adds: who is being invited */}
        {inviting ? (
          <div className="field" style={{ marginBottom: 0 }}>
            <div className="flabel">Phone number</div>
            <div className={`input ${invite.error ? 'error' : ''}`}>
              <div className="inner">
                <span className="mi" style={{ fontSize: 18, color: 'var(--color-info-secondary)' }} data-i="call"></span>
                <input
                  className="val"
                  value={phone}
                  inputMode="tel"
                  maxLength={14}
                  placeholder="Enter member's phone number"
                  aria-label="Member phone number"
                  onInput={(e) => onInvitePhone && onInvitePhone(e.target.value)}
                  style={{ border: 'none', outline: 'none', background: 'transparent', fontFamily: FONT_B }}
                />
              </div>
            </div>
            {invite.error
              ? <div className="helper err" role="alert">{invite.error}</div>
              : <div className="helper">The number they use for Paigham.</div>}
          </div>
        ) : null}

        <SelectField
          label="Role in the committee"
          value={inviting ? invite.role : member.role}
          placeholder={inviting ? 'Select a role' : undefined}
          options={OPS_ROLES.map((r) => ({ value: r, label: roleLabel(r) }))}
          disabled={!canEdit}
          open={openMenu === 'member-role'}
          onOpen={(next) => onOpenMenu && onOpenMenu(next ? 'member-role' : null)}
          onPick={(value) => (inviting ? onInviteRole && onInviteRole(value) : onPickRole && onPickRole(value))}
          helper="The role is a title. What they can do is set below."
        />

        <div>
          <SectionLabel hint={(() => {
            if (inviting) return 'They get these the moment they accept. Changeable any time afterwards.';
            return isAdmin ? 'Changes apply immediately.' : 'Only a full admin can change these.';
          })()}>
            Permissions
          </SectionLabel>
          <Card style={{ padding: '4px 12px', marginTop: 8 }}>
            {OPS_CAPS.available().map((capability) => {
              const on = OPS_CAPS.can(grantedCaps, capability.id);
              return (
                <CapabilityRow
                  key={capability.id}
                  capability={capability}
                  on={on}
                  disabled={!canEdit || (capability.id === 'committee' && soleAdmin)}
                  onToggle={() => (inviting
                    ? onInviteCapability && onInviteCapability(capability.id)
                    : onToggleCapability && onToggleCapability(member.id, capability.id))}
                />
              );
            })}
          </Card>
          {soleAdmin ? (
            <div style={{ fontSize: 11, lineHeight: 1.5, padding: '8px 4px 0', color: 'var(--color-info-tertiary)' }}>
              This masjid needs at least one full admin, so this permission can't be removed from
              the only one. Grant it to someone else first.
            </div>
          ) : null}
          {/* Says out loud what is no longer a permission, so its absence reads as a decision. */}
          <div style={{ fontSize: 11, lineHeight: 1.5, padding: '8px 4px 0', color: 'var(--color-info-tertiary)' }}>
            Salaah timings are not listed here — anyone using Paigham can update them, and every
            change is recorded with the name of the person who made it.
          </div>
        </div>

        <div>
          <SectionLabel hint="Planned — the committee will be able to grant these as they ship.">
            Coming soon
          </SectionLabel>
          <Card style={{ padding: '4px 12px', marginTop: 8, opacity: 'var(--opacity-emphasis)' }}>
            {OPS_CAPS.planned().map((capability) => (
              <CapabilityRow key={capability.id} capability={capability} on={false} disabled />
            ))}
          </Card>
        </div>

        {!inviting && isAdmin && !member.you ? (
          <button className="btn btn-destructive lg" style={{ width: '100%' }} onClick={() => onOpenRemove && onOpenRemove(member)}>
            <span className="mi" style={{ fontSize: 20 }} data-i="delete"></span>Remove from committee
          </button>
        ) : null}
      </Body>

      {/* Invite is the one scenario with a committed action; editing saves as you toggle. */}
      {inviting ? (
        <FooterAction
          label="Send invitation"
          busy={invite.sending}
          busyLabel="Sending invitation…"
          disabled={!inviteValid}
          onClick={onSendInvite}
        />
      ) : null}
    </div>
  );
}

// ── Followers — a read-only record of who receives this masjid's updates ──
// Nobody approves a follow, so this screen exists to answer "who are they?" and nothing
// else. The committee sees contact details, which is exactly why the screen says so.
function FollowerRow({ follower }) {
  return (
    <div className="list-item" style={{ padding: '12px 4px', minHeight: 64 }}>
      <span style={{ flexShrink: 0 }}>
        {follower.name ? <Avatar text={follower.name} size={42} /> : <IconTile icon="person" size={42} />}
      </span>
      <span className="list-item-copy" style={{ gap: 2 }}>
        <span className="list-item-title">{follower.name || follower.phone}</span>
        <span className="list-item-subtitle" style={{ WebkitLineClamp: 1 }}>
          {[follower.name ? follower.phone : 'Name not set yet', follower.city].filter(Boolean).join(' · ')}
        </span>
      </span>
      <span className="list-item-value" style={{ fontSize: 11 }}>{follower.since}</span>
    </div>
  );
}

function FollowersBody({ data }) {
  const { masjid = OPS_MASJID, members = {}, onLoadFollowers, onRetry } = data;
  const { followers = [], followersStatus = 'loaded', followersLoadingMore } = members;

  const total = masjid.stats.followers || followers.length;

  return (
    <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
      {followersStatus === 'loading' ? <Loading label="Loading followers…" /> : null}
      {followersStatus === 'error' ? (
        <ErrorState title="Couldn't load followers" copy="Check your connection and try again." onRetry={onRetry} />
      ) : null}
      {followersStatus === 'loaded' && !followers.length ? (
        <Empty
          icon="person"
          title="No followers yet"
          copy="People who follow this masjid receive its salaah timings and every paigham you send. Share the masjid QR or ask the jamaat to search for it in Paigham."
        />
      ) : null}

      {followersStatus === 'loaded' && followers.length ? (
        <>
          <div style={{ flexShrink: 0, padding: '14px 16px 0' }}>
            <div className="followers-hero">
              <span className="icon-tile accent" style={{ '--tile': '44px' }}><span className="mi" data-i="groups"></span></span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div className="followers-hero-value">{total.toLocaleString('en-IN')}</div>
                <div className="followers-hero-label">receiving timings and paighams</div>
              </div>
            </div>
          </div>

          <Body bottomInset={40} style={{ gap: 0, paddingTop: 12 }}>
            <div className="console-group">
              {followers.map((follower) => <FollowerRow key={follower.id} follower={follower} />)}
            </div>

            <div className="followers-more">
              <span>Showing {followers.length} of {total.toLocaleString('en-IN')}</span>
              {followersLoadingMore ? (
                <span className="inline-loading-status"><span className="btn-spinner" aria-hidden="true"></span>Loading…</span>
              ) : (
                <button className="btn btn-tonal" onClick={onLoadFollowers}>Load more</button>
              )}
            </div>

            <div className="followers-note">
              <span className="mi" data-i="security" aria-hidden="true"></span>
              <span>
                Names and numbers here are visible to the committee only. Followers never appear
                publicly, and Paigham never shares them.
              </span>
            </div>
          </Body>
        </>
      ) : null}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════
// 4 · Console — Salaah tab (shared with the standalone suggest screen)
// ══════════════════════════════════════════════════════════════════════

function PrayerCard({ name, label, config, expanded, editable, changed, openMenu, onToggle, onOpenMenu, onChange }) {
  const variant = config.variant;
  return (
    <Card style={{ padding: 0, overflow: 'visible' }}>
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={expanded}
        style={{
          width: '100%', display: 'flex', alignItems: 'center', gap: 12, padding: 14,
          border: 'none', background: 'transparent', font: 'inherit', color: 'inherit', cursor: 'pointer', textAlign: 'left',
        }}
      >
        <IconTile icon="mosque_clock2" size={36} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontSize: 15, fontWeight: 700 }}>{label}</span>
            {changed ? <span className="badge sm amber">Changed</span> : null}
          </div>
          <div style={{ fontSize: 12, marginTop: 2, color: 'var(--color-info-secondary)' }}>{describeConfig(config)}</div>
        </div>
        <span className={`mi chev ${expanded ? 'open' : ''}`} style={{ fontSize: 22, color: 'var(--color-info-faint)' }} data-i="keyboard_arrow_down" aria-hidden="true"></span>
      </button>

      {expanded ? (
        <div style={{ padding: '0 14px 14px', display: 'flex', flexDirection: 'column', gap: 12, borderTop: '1px solid var(--color-neutral-border)', paddingTop: 14 }}>
          <SelectField
            label="Timing type"
            value={variant}
            options={VARIANT_OPTIONS}
            placeholder="Select type"
            disabled={!editable}
            open={openMenu === `${name}-variant`}
            onOpen={(next) => onOpenMenu(next ? `${name}-variant` : null)}
            onPick={(value) => onChange({ variant: value })}
            helper={(VARIANT_OPTIONS.find((o) => o.value === variant) || {}).hint}
          />

          {variant === VARIANT_FIXED ? (
            <TimeSelect
              label="Jamaat time"
              value={config.salaahTime || '05:30'}
              menuKey={`${name}-time`}
              openMenu={openMenu}
              onOpenMenu={onOpenMenu}
              onChange={(value) => onChange({ salaahTime: value })}
            />
          ) : null}

          {variant === VARIANT_VARIES ? (
            <>
              <TimeSelect
                label="Never before"
                value={config.neverBefore || '05:00'}
                menuKey={`${name}-floor`}
                openMenu={openMenu}
                onOpenMenu={onOpenMenu}
                onChange={(value) => onChange({ neverBefore: value })}
              />
              <SelectField
                label="Time variation"
                value={config.salaahTimeVariation}
                options={VARIATION_OPTIONS}
                placeholder="Select variation"
                disabled={!editable}
                open={openMenu === `${name}-variation`}
                onOpen={(next) => onOpenMenu(next ? `${name}-variation` : null)}
                onPick={(value) => onChange({ salaahTimeVariation: value })}
              />
            </>
          ) : null}

          <SelectField
            label="Iqama delay after azaan"
            value={config.iqamaDelay}
            options={IQAMA_OPTIONS}
            disabled={!editable}
            open={openMenu === `${name}-iqama`}
            onOpen={(next) => onOpenMenu(next ? `${name}-iqama` : null)}
            onPick={(value) => onChange({ iqamaDelay: value })}
          />
        </div>
      ) : null}
    </Card>
  );
}

// Timings are public: no capability gates this screen, and there is no review step. Every
// publish is attributed and kept in the history, which is the only thing standing between a
// wrong Fajr time and nobody noticing — so the record is given real estate, not a footnote.
function SalaahTab({ data }) {
  const {
    salaah = {}, onRetry, onTogglePrayer, onOpenMenu, onConfigChange, onNoteChange,
    onSubmitSalaah, onOpenHistory, onDone,
    onOpenScan, onCloseScan, onScanCapture, onScanRetry,
  } = data;
  const {
    status = 'loaded', config = OPS_SALAAH_CONFIG, expanded, note = '',
    history = [], saving, dirty, scanStage, scanApplied,
  } = salaah;
  const openMenu = data.openMenu;
  const lastChange = history[0] || null;

  if (status === 'loading') return <Loading label="Loading salaah settings…" />;
  if (status === 'error') {
    return (
      <ErrorState
        title="Couldn't load salaah settings"
        copy="Your current timings are safe and still live for followers. Check your connection and try again."
        onRetry={onRetry}
      />
    );
  }
  if (status === 'saved') {
    const { EmptyState } = window;
    return EmptyState ? (
      <EmptyState
        tone="success"
        icon="check_circle"
        titleStyle={{ fontFamily: FONT_T, fontSize: 22 }}
        title="Salaah timings published"
        description="Every follower of this masjid now sees the updated azaan and iqama timings. Your name is on the change."
        action={{ text: 'Done', onClick: onDone, filled: true }}
      />
    ) : null;
  }

  return (
    <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
      <Body bottomInset={16} style={{ paddingTop: 12, gap: 12 }}>
        {/* what followers see right now — the baseline every edit is measured against */}
        <div className="timings-published">
          <div className="timings-published-head">
            <span>Published now</span>
            <span>What followers see</span>
          </div>
          <div className="timings-published-grid">
            {SALAAH_ORDER.map(({ key, label }) => {
              const published = OPS_SALAAH_CONFIG[key] || {};
              return (
                <span key={key} className={salaahChanged(config, key) ? 'changed' : ''}>
                  <b>{label}</b>
                  <small>{published.salaahTime ? fmt12(published.salaahTime) : 'On time'}</small>
                </span>
              );
            })}
          </div>
        </div>

        {/* Said plainly, once, before anyone edits: this is open, and it is signed. */}
        <div className="surf subtle" style={{ display: 'flex', gap: 10, padding: 12, borderRadius: 14 }}>
          <span className="mi" style={{ fontSize: 20, color: 'var(--color-action-primary)' }} data-i="info" aria-hidden="true"></span>
          <div style={{ fontSize: 12, lineHeight: 1.5, color: 'var(--color-info-secondary)' }}>
            Anyone using Paigham can keep these timings correct. Every change is published
            straight away and recorded with the name of the person who made it.
          </div>
        </div>

        {/* The record. Last change up front, the rest one tap away. */}
        {lastChange ? (
          <Card
            onClick={onOpenHistory}
            ariaLabel={`Last updated by ${lastChange.by}, ${lastChange.when}. View all changes.`}
            style={{ display: 'flex', alignItems: 'center', gap: 12 }}
          >
            <Avatar text={lastChange.by} size={36} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13.5, fontWeight: 700 }}>Last updated by {lastChange.by}</div>
              <div style={{ fontSize: 12, marginTop: 2, color: 'var(--color-info-secondary)' }}>
                {lastChange.role} · {lastChange.when}
              </div>
            </div>
            <span className="timings-history-count">{history.length}</span>
            <span className="mi" style={{ fontSize: 20, color: 'var(--color-info-faint)' }} data-i="chevron_right" aria-hidden="true"></span>
          </Card>
        ) : null}

        {/* The fast path: photograph the LED board instead of typing six times. OCR is an
            accelerator in front of this editor, never a gate — everything it fills stays
            editable below, and the camera offers a typed escape at every step. */}
        {!scanApplied ? (
          <Card
            onClick={onOpenScan}
            ariaLabel="Scan the timing board — the times fill in for you to check"
            style={{ display: 'flex', alignItems: 'center', gap: 12 }}
          >
            <IconTile icon="filter_center_focus" size={40} tone="accent" />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 14, fontWeight: 700 }}>Scan the timing board</div>
              <div style={{ fontSize: 12, marginTop: 2, lineHeight: 1.45, color: 'var(--color-info-secondary)' }}>
                Photograph the masjid's board — the times fill in below for you to check.
              </div>
            </div>
            <span className="mi" style={{ fontSize: 20, color: 'var(--color-info-faint)' }} data-i="chevron_right" aria-hidden="true"></span>
          </Card>
        ) : (
          /* What the scan did, said plainly — and what it did NOT read, named. LED boards
             defeat OCR often enough that the misses are the headline, not a footnote. */
          <div className="scan-result-banner" role="status">
            <span className="mi" data-i={scanApplied === 'full' ? 'check_circle' : 'error'} aria-hidden="true"></span>
            <div>
              {scanApplied === 'full'
                ? 'Read all 6 prayers from the board. Check each time below before publishing.'
                : 'Read 4 of 6 prayers — Zohar and Maghrib could not be read. Set them below.'}
            </div>
            <button className="btn btn-link" onClick={onOpenScan}>Rescan</button>
          </div>
        )}

        <SectionLabel hint="Changes go live for everyone following this masjid as soon as you publish.">
          Configure each salaah
        </SectionLabel>

        {SALAAH_ORDER.map(({ key, label }) => (
          <PrayerCard
            key={key}
            name={key}
            label={label}
            config={config[key]}
            expanded={expanded === key}
            editable
            changed={salaahChanged(config, key)}
            openMenu={openMenu}
            onToggle={() => onTogglePrayer && onTogglePrayer(expanded === key ? null : key)}
            onOpenMenu={(menu) => onOpenMenu && onOpenMenu(menu)}
            onChange={(patch) => onConfigChange && onConfigChange(key, patch)}
          />
        ))}

        {/* The reason line. Kept from the old suggestion form because unreviewed edits are
            only auditable if the record says why, not just who — it is written into the
            history entry. Only worth asking once something actually changed. */}
        {dirty ? (
          <div className="field" style={{ marginBottom: 0 }}>
            <div className="flabel">Reason (optional)</div>
            <div className="input">
              <div className="inner" style={{ alignItems: 'flex-start', minHeight: 84, padding: '12px 16px' }}>
                <textarea
                  className="val"
                  value={note}
                  onInput={(e) => onNoteChange && onNoteChange(e.target.value)}
                  placeholder="Why are these timings changing?"
                  rows={3}
                  style={{ border: 'none', outline: 'none', background: 'transparent', resize: 'none', width: '100%', whiteSpace: 'pre-wrap', fontFamily: FONT_B }}
                />
              </div>
            </div>
            <div className="helper">Shown to the committee and anyone reading the change history.</div>
          </div>
        ) : null}
      </Body>

      <FooterAction
        label="Save & publish"
        busy={saving}
        busyLabel="Publishing timings…"
        disabled={!dirty}
        helper={(() => {
          if (!dirty) return 'Edit a prayer to enable publishing.';
          const n = salaahChangeCount(config);
          return `${n} ${n === 1 ? 'prayer' : 'prayers'} changed — published in your name, straight away.`;
        })()}
        onClick={onSubmitSalaah}
      />

      {scanStage ? (
        <ScanBoardStage
          stage={scanStage}
          onClose={onCloseScan}
          onCapture={onScanCapture}
          onRetry={onScanRetry}
        />
      ) : null}
    </div>
  );
}

// ── Scan-the-board stage — the camera-stage kit pointed at an LED board ──
// Three states in one surface: framing the board, reading it (a scan sweep over the frozen
// capture), and the honest failure that hands over to typing. The typed escape is on every
// state because seven-segment boards defeat OCR often enough to design for it.
function ScanBoardStage({ stage, onClose, onCapture, onRetry }) {
  const reading = stage === 'reading';
  const failed = stage === 'failed';

  return (
    <div className="camera-stage">
      <div className="camera-topbar">
        <button className="ib ib-tonal camera-control" aria-label="Close scanner" onClick={onClose}>
          <span className="mi" data-i="close"></span>
        </button>
        <div className="camera-title">
          {failed ? 'Couldn’t read the board' : 'Scan the timing board'}
          {!failed ? (
            <small>{reading ? 'Hold still…' : 'Fill the frame with the board, square-on'}</small>
          ) : null}
        </div>
        <span style={{ width: 48, flexShrink: 0 }}></span>
      </div>

      {failed ? (
        <div className="scan-failed">
          <span className="mi" data-i="filter_center_focus" aria-hidden="true"></span>
          <strong>The board didn’t read</strong>
          <span>
            LED boards can defeat the camera — glare, angle or a scrolling display. Get closer
            and square-on, or just type the timings; the editor is exactly one step away.
          </span>
          <button className="btn btn-filled lg" onClick={onRetry}>Try again</button>
          <button className="btn btn-link" onClick={onClose}>Type the timings instead</button>
        </div>
      ) : (
        <React.Fragment>
          <div className="camera-viewport">
            <img src="../../images/salaah-board-sample.jpeg" alt="" />
            <div className="camera-guide"></div>
            {reading ? (
              <div className="scan-reading" role="status" aria-label="Reading the board">
                <div className="scan-sweep"></div>
                <div className="scan-reading-label">
                  <span className="btn-spinner" aria-hidden="true"></span>Reading the board…
                </div>
              </div>
            ) : null}
          </div>

          <div className="camera-controls">
            <span></span>
            {reading
              ? <span className="camera-control" style={{ width: 72 }}></span>
              : <button className="camera-shutter" aria-label="Capture the board" onClick={onCapture}></button>}
            <span></span>
          </div>
          <div className="scan-stage-foot">
            {!reading ? (
              <button className="btn btn-link" onClick={onClose}>Type the timings instead</button>
            ) : null}
          </div>
        </React.Fragment>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════
// 5 · Overlays — confirmations and the timings change history
// ══════════════════════════════════════════════════════════════════════


// The audit trail that replaced review. Read-only by design: nothing here can be approved or
// undone in one tap, because a public edit is already live — the committee corrects a bad
// change by publishing the right one, under their own name.
function TimingHistorySheet({ salaah = {}, open, onClose }) {
  const { Dialog } = window;
  if (!open || !Dialog) return null;
  const { history = [] } = salaah;
  return (
    <Dialog
      mode="sheet"
      isOpen
      onClose={onClose}
      title="Change history"
      description="Every published change to this masjid's timings, newest first."
      primary={null}
      secondary={{ text: 'Close', onClick: onClose }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, maxHeight: 340, overflowY: 'auto' }}>
        {!history.length ? (
          <div style={{ fontSize: 14, padding: '8px 2px', color: 'var(--color-info-secondary)' }}>
            No changes recorded yet.
          </div>
        ) : null}
        {history.map((entry) => (
          <Card key={entry.id} style={{ padding: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <Avatar text={entry.by} size={32} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 700 }}>{entry.by}</div>
                <div style={{ fontSize: 11, color: 'var(--color-info-secondary)' }}>
                  {entry.role} · {entry.when}
                </div>
              </div>
              {/* Who is on the committee and who is not is the first thing a reader wants. */}
              {entry.committee ? null : <span className="badge sm">Not committee</span>}
            </div>
            <div style={{ marginTop: 8, display: 'flex', flexDirection: 'column', gap: 4 }}>
              {entry.changes.map((c) => (
                <div key={c} style={{ fontSize: 13, fontWeight: 600 }}>{c}</div>
              ))}
            </div>
            {entry.note ? (
              <div style={{ fontSize: 12, lineHeight: 1.5, marginTop: 8, color: 'var(--color-info-secondary)' }}>“{entry.note}”</div>
            ) : null}
          </Card>
        ))}
      </div>
    </Dialog>
  );
}

function ConfirmDialog({ confirm, onCancel }) {
  const { Dialog } = window;
  if (!confirm || !Dialog) return null;
  return (
    <Dialog
      mode="alert"
      isOpen
      onClose={onCancel}
      title={confirm.title}
      description={confirm.description}
      destructive={!!confirm.destructive}
      primary={{ text: confirm.confirmText, onClick: confirm.onConfirm }}
      secondary={{ text: 'Cancel', onClick: onCancel }}
    />
  );
}

// ══════════════════════════════════════════════════════════════════════
// 6 · ConsoleScreen — command deck: hub + one full screen per destination
// ══════════════════════════════════════════════════════════════════════

const CONSOLE_TITLE_TRANSITION = 'masjid-admin-masjid-e-bilal-title';

// Each destination's title is a shared element: the row label on the hub morphs into the
// destination's app-bar title. Only the live device sets the names (duplicates across the
// storyboard frames would invalidate the transition).
const destTransitionName = (dest) => `masjid-console-dest-${dest}`;

// One entry per destination: what the app bar says, and which body it hosts.
const CONSOLE_DESTINATIONS = {
  members: { title: 'Committee', body: CommitteeBody },
  followers: { title: 'Followers', body: FollowersBody },
  salaah: { title: 'Salaah timings', body: SalaahTab },
  details: { title: 'Masjid details', body: DetailsBody },
  // Opened from a committee row; its title is the member's name.
  // The member screen carries its own header (avatar + name + number), so no app bar.
  member: { title: 'Member', body: MemberBody, ownHeader: true },
  // Same screen, invite scenario — a full destination, not a sheet, because it holds the
  // same role picker and permission switches as the member screen.
  invite: { title: 'Invite a member', body: MemberBody, ownHeader: true },
};

function ConsoleScreen({ data = {}, transitionEnabled = false }) {
  const {
    role = 'CHAIRMAN', caps = [], dest = 'home', status = 'loaded', masjid = OPS_MASJID,
    onBack, snack, onCloseSnack, confirm, onCancelConfirm,
  } = data;

  const locked = status === 'locked';
  // A destination the role cannot reach falls back to the hub — the same rule the rows use.
  const reachable = !locked
    && dest !== 'home'
    && !!CONSOLE_DESTINATIONS[dest]
    && (dest !== 'member' || !!(data.members || {}).editing)
    && (dest !== 'invite' || OPS_CAPS.isAdmin(caps));
  const destination = reachable ? CONSOLE_DESTINATIONS[dest] : null;
  const DestBody = destination ? destination.body : null;

  return (
    <Screen>
      {destination && !destination.ownHeader ? (
        <OpsAppBar
          title={destination.title}
          subtitle={masjid.name}
          onBack={onBack}
          transitionName={transitionEnabled ? destTransitionName(dest) : undefined}
        />
      ) : null}
      {/* The console home carries its own header (masjid mark + name + switch icon); the
          locked state still needs a way back. */}
      {!destination && locked ? <OpsAppBar title="" onBack={onBack} /> : null}

      {destination
        ? <DestBody data={data} />
        : <ConsoleHome data={data} transitionEnabled={transitionEnabled} />}

      <MasjidSwitcherSheet
        open={!!data.switcherOpen}
        managed={data.managed}
        currentId={(data.masjid || {}).id}
        onPick={data.onPickMasjid}
        onClose={data.onCloseSwitcher}
      />
      <TimingHistorySheet
        salaah={data.salaah}
        open={!!(data.salaah || {}).historyOpen}
        onClose={data.onCloseHistory}
      />
      <ConfirmDialog confirm={confirm} onCancel={onCancelConfirm} />
      <Snack snack={snack} onClose={onCloseSnack} />
    </Screen>
  );
}

const MAX_POST_MESSAGE = 1024;
const MAX_POST_IMAGES = 4;

// ══════════════════════════════════════════════════════════════════════
// 9 · PostSentScreen — verification-pending outcome
// ══════════════════════════════════════════════════════════════════════

function PostSentScreen({ data = {} }) {
  const { onHome, onAnother, onBack } = data;
  return (
    <Screen>
      <OpsAppBar title="Paigham sent" onBack={onBack || onHome} />
      <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '24px 24px 40px', gap: 12 }}>
        <div className="empty-state-icon" style={{ background: 'color-mix(in oklab,var(--color-status-success) 14%,transparent)', color: 'var(--color-status-success)' }} aria-hidden="true">
          <span className="mi" data-i="check_circle"></span>
        </div>
        <div style={{ fontFamily: FONT_T, fontSize: 24, lineHeight: 1.2, marginTop: 6 }}>Your paigham is live</div>
        <div style={{ fontSize: 14, lineHeight: 1.55, color: 'var(--color-info-secondary)' }}>
          Every follower of this masjid has it now. You can see it — and delete it if something is
          wrong — from Paighams in the console.
        </div>
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 10, marginTop: 12 }}>
          <button className="btn btn-filled lg" style={{ width: '100%' }} onClick={onHome}>Take me home</button>
          <button className="btn btn-tonal lg" style={{ width: '100%' }} onClick={onAnother}>Send another paigham</button>
        </div>
      </div>
    </Screen>
  );
}

// ══════════════════════════════════════════════════════════════════════
// 10 · InvitationsScreen — accept / decline committee invitations
// ══════════════════════════════════════════════════════════════════════

// ── Invitations — decide before you accept ────────────────────────────
// An invitation is a grant of power, so the card states what the role will let you DO, who
// asked, and how long the invitation has left. Accepting hands you straight into that
// masjid's console; an invitation older than 7 days is shown expired rather than hidden.
function InvitationCard({ invitation, actioning, accepted, onAccept, onDecline, onOpenConsole }) {
  const caps = (invitation.caps || [])
    .map((id) => OPS_CAPS.find(id))
    .filter(Boolean);
  const urgent = !invitation.expired && invitation.daysLeft <= 1;

  if (accepted) {
    return (
      <div className="invite-card accepted">
        <div className="invite-card-head">
          {invitation.photo
            ? <span className="masjid-mark" style={{ '--tile': '44px' }}><img src={invitation.photo} alt="" /></span>
            : <IconTile icon="mosque" size={44} tone="accent" />}
          <div className="invite-card-id">
            <div className="invite-card-name">{invitation.name}</div>
            <div className="invite-card-city">You are now {roleLabel(invitation.role)} here</div>
          </div>
          <span className="mi invite-card-tick" data-i="check_circle" aria-hidden="true"></span>
        </div>
        <button className="btn btn-filled invite-card-open" onClick={onOpenConsole}>
          <span className="mi" style={{ fontSize: 18 }} data-i="dashboard"></span>Open the console
        </button>
      </div>
    );
  }

  return (
    <div className={`invite-card${invitation.expired ? ' expired' : ''}`}>
      <div className="invite-card-head">
        {invitation.photo
          ? <span className="masjid-mark" style={{ '--tile': '44px' }}><img src={invitation.photo} alt="" /></span>
          : <IconTile icon="mosque" size={44} />}
        <div className="invite-card-id">
          <div className="invite-card-name">{invitation.name}</div>
          <div className="invite-card-city">{invitation.city}</div>
        </div>
        {invitation.expired
          ? <span className="badge sm coral">Expired</span>
          : <span className={`badge sm ${urgent ? 'coral' : 'amber'}`}>
              <span className="mi" data-i="schedule"></span>
              {invitation.daysLeft <= 0 ? 'Last day' : `${invitation.daysLeft} ${invitation.daysLeft === 1 ? 'day' : 'days'} left`}
            </span>}
      </div>

      <div className="invite-card-role">
        <span className="invite-card-role-label">Invited as</span>
        <strong>{roleLabel(invitation.role)}</strong>
      </div>

      <div className="invite-card-caps">
        <span className="invite-card-caps-label">
          {caps.length ? 'You will be able to' : 'This role has no permissions yet'}
        </span>
        {caps.length ? (
          <span className="invite-card-caps-list">
            {caps.map((capability) => (
              <span className="invite-card-cap" key={capability.id}>
                <span className="mi" data-i={capability.icon}></span>
                {capability.label}
              </span>
            ))}
          </span>
        ) : (
          <span className="invite-card-caps-none">
            You will see everything the committee sees. A full admin can grant permissions later.
          </span>
        )}
      </div>

      <div className="invite-card-from">
        <Avatar text={invitation.invitedBy} size={26} />
        <span>{invitation.invitedBy} · {roleLabel(invitation.invitedByRole)} · {invitation.sent}</span>
      </div>

      {invitation.expired ? (
        <div className="invite-card-note">
          This invitation has run out. Ask {invitation.invitedBy.split(' ')[0]} to send a new one.
        </div>
      ) : actioning ? (
        <div className="inline-loading-status" style={{ marginTop: 12 }} role="status">
          <span className="btn-spinner" aria-hidden="true"></span>Working…
        </div>
      ) : (
        <div className="invite-card-actions">
          <button className="btn btn-tonal" onClick={onDecline}>Decline</button>
          <button className="btn btn-filled" onClick={onAccept}>Accept</button>
        </div>
      )}
    </div>
  );
}

function InvitationsScreen({ data = {} }) {
  const {
    invitations = {}, onBack, onAccept, onDecline, onRetry, snack, onCloseSnack, onExplore,
    onOpenAcceptedConsole,
  } = data;
  const { status = 'loaded', items = [], actioning, acceptedId } = invitations;
  const live = items.filter((i) => !i.expired);

  return (
    <Screen>
      <OpsAppBar title="Invitations" subtitle="Committee roles you have been invited to" onBack={onBack} />

      {status === 'loading' ? <Loading label="Loading invitations…" /> : null}
      {status === 'error' ? (
        <ErrorState title="Couldn't load invitations" copy="Check your connection and try again." onRetry={onRetry} />
      ) : null}
      {status === 'loaded' && !items.length ? (
        <Empty
          icon="mail"
          title="No invitations"
          copy="When a masjid committee invites you, it appears here for 7 days — with the role you are offered and what it will let you do."
          actionText="Explore masjids"
          actionIcon="travel_explore"
          onAction={onExplore}
        />
      ) : null}
      {status === 'loaded' && items.length ? (
        <Body bottomInset={40} style={{ gap: 12 }}>
          <div className="invite-summary">
            {live.length
              ? `${live.length} ${live.length === 1 ? 'invitation' : 'invitations'} waiting for you`
              : 'Nothing waiting — these have run out'}
          </div>
          {items.map((invitation) => (
            <InvitationCard
              key={invitation.id}
              invitation={invitation}
              actioning={actioning === invitation.id}
              accepted={acceptedId === invitation.id}
              onAccept={() => onAccept && onAccept(invitation)}
              onDecline={() => onDecline && onDecline(invitation)}
              onOpenConsole={() => onOpenAcceptedConsole && onOpenAcceptedConsole(invitation)}
            />
          ))}
          <div className="invite-foot">
            Accepting adds you to that masjid's committee. You can leave at any time by asking a
            full admin to remove you.
          </div>
        </Body>
      ) : null}

      <ConfirmDialog confirm={data.confirm} onCancel={data.onCancelConfirm} />
      <Snack snack={snack} onClose={onCloseSnack} />
    </Screen>
  );
}

Object.assign(window, {
  // screens
  ConsoleScreen,
  // shared by the compose wizard (./compose-post.jsx)
  OpsConfirmDialog: ConfirmDialog,
  // Shared with the compose wizard: switching masjid mid-compose uses the console's sheet.
  MasjidSwitcherSheet,
  PostSentScreen,
  InvitationsScreen,
  // reference data + helpers shared with the board rows and the live device
  OPS_ROLES,
  OPS_CAPABILITIES,
  OPS_CAPS,
  OPS_MASJID,
  OPS_MANAGED,
  OPS_MEMBERS,
  OPS_FOLLOWERS,
  OPS_POSTS,
  OPS_INVITATIONS,
  OPS_SALAAH_CONFIG,
  OPS_TIMING_HISTORY,
  OPS_VARIANTS: { FIXED: VARIANT_FIXED, ON_TIME: VARIANT_ON_TIME, VARIES: VARIANT_VARIES },
  OPS_SALAAH_ORDER: SALAAH_ORDER,
  opsRoleLabel: roleLabel,
  opsDescribeConfig: describeConfig,
  opsFmt12: fmt12,
  opsVariationLabel: variationLabel,
  MAX_POST_MESSAGE,
  MAX_POST_IMAGES,
  CONSOLE_TITLE_TRANSITION,
  opsDestTransitionName: destTransitionName,
});
