// Shared screen components for the Masjid Console section board — the masjid
// console plus the journeys that hang off it.
//
// Used by BOTH the static storyboards (./broadcast-studio-board.jsx) and the live device
// (../Masjid Console.dc.html). Every screen takes ONE `data` object so the dc x-import
// binds a single value, and every handler is optional (the static frames pass none).
//
// Source of truth for behaviour is the Compose implementation:
//   modules/masjid/admin/MasjidAdminScreen.kt         → ConsoleScreen (Overview tab + tab shell)
//   modules/masjid/post/MasjidPostsAdminScreen.kt     → ConsoleScreen (Posts tab)
//   modules/masjid/members/MasjidMembersScreen.kt     → ConsoleScreen (Members tab)
//   modules/masjid/salaah/SalaahConfigScreen.kt       → ConsoleScreen (Salaah tab)
//   modules/masjid/post/CreatePostScreen.kt           → ComposePostScreen (./broadcast-studio-compose.jsx)
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

const isRepeatableCommitteeRole = (role) => role === 'MEMBER' || role === 'MUEZZIN';

const availableCommitteeRoles = (members, editingMemberId) => {
  const currentRole = (members || []).find((member) => member.id === editingMemberId)?.role;
  const occupied = (members || [])
    .filter((member) => member.id !== editingMemberId && member.status !== 'IN_ACTIVE')
    .map((member) => member.role)
    .filter((role) => !isRepeatableCommitteeRole(role));
  return OPS_ROLES.filter((role) => (
    role === currentRole || isRepeatableCommitteeRole(role) || occupied.indexOf(role) === -1
  ));
};

const canonicalCommitteePhone = (phone) => (phone || '').replace(/\D/g, '').slice(-10);

const isCommitteePhoneTaken = (members, phone) => {
  const canonical = canonicalCommitteePhone(phone);
  return canonical.length === 10 && (members || []).some((member) => (
    member.status !== 'IN_ACTIVE' && canonicalCommitteePhone(member.phone) === canonical
  ));
};

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
    copy: 'Call the azaan from the app so musalleen hear it live',
  },
  {
    id: 'live', icon: 'sensors', label: 'Go live with a bayan', short: 'Live bayan', available: false,
    copy: 'Stream a bayan or a programme to musalleen',
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
  // The recommended first-publish template mirrors the pattern committees already use: the three
  // seasonal prayers follow the calculated day, Zohar and Jumah hold a clock time, and Maghrib is
  // called at sunset. These wire variants never appear in the interface; the rule receipt below
  // explains them in the language a committee uses.
  fajr: { variant: VARIANT_VARIES, neverBefore: '00:00', salaahTimeVariation: 'VARIES_EVERY_15_MINS', iqamaDelay: 20 },
  zohar: { variant: VARIANT_FIXED, salaahTime: '13:30', iqamaDelay: 15 },
  asr: { variant: VARIANT_VARIES, neverBefore: '00:00', salaahTimeVariation: 'VARIES_EVERY_15_MINS', iqamaDelay: 15 },
  maghrib: { variant: VARIANT_ON_TIME, iqamaDelay: 5 },
  isha: { variant: VARIANT_VARIES, neverBefore: '00:00', salaahTimeVariation: 'VARIES_EVERY_15_MINS', iqamaDelay: 15 },
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
    id: 'h2', by: 'Abdul Rahman', role: 'Musalli', committee: false, when: '26 Jun 2026',
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

// Minutes → `1:15`. The scan sheet's pills are references, not statements — the same reasoning that
// drops the meridiem from the timeline's WAS/BOARD overlines — and six pills carrying ` PM` each
// stop fitting on one line exactly when the board read well.
const salaahShort12 = (mins) => fmt12(salaahToHHMM(mins)).replace(/\s[AP]M$/, '');

// What is published right now, against the working copy being edited.
// `baseline` exists so a storyboard frame can publish something other than the sample — the drift
// frames need a masjid whose PUBLISHED Fajr has fallen outside its window, which the default cannot
// express. Live callers keep the sample.
const salaahChanged = (working, prayerKey, baseline) => {
  const published = ((baseline || OPS_SALAAH_CONFIG) || {})[prayerKey] || {};
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

const prayerMinutes = (config = {}, key) => {
  const starts = { fajr: 292, zohar: 748, asr: 972, maghrib: 1128, isha: 1206 };
  if (config.variant === VARIANT_ON_TIME) return starts[key] == null ? null : starts[key];
  if (config.variant === VARIANT_VARIES) {
    const start = starts[key];
    const step = parseInt(String(config.salaahTimeVariation || '').replace(/\D/g, ''), 10);
    if (start == null || !step) return null;
    const floor = config.neverBefore ? salaahToMinutes(config.neverBefore) : 0;
    return Math.max((Math.floor(start / step) * step) + step, floor);
  }
  if (!config.salaahTime) return null;
  const [h, m] = config.salaahTime.split(':').map((n) => parseInt(n, 10));
  return (h * 60) + m;
};

// Jumah is weekly, so it never answers "what is next today", and Maghrib follows sunset with
// no configured time — both appear in the strip, neither is a "next" candidate. Past Isha the
// answer rolls to tomorrow's Fajr rather than going blank.
const nextPrayer = (config = {}) => {
  const day = SALAAH_ORDER.filter(({ key }) => key !== 'jumah');
  const upcoming = day.find(({ key }) => {
    const mins = prayerMinutes(config[key], key);
    return mins !== null && mins > FRAME_NOW_MINUTES;
  });
  if (upcoming) return { ...upcoming, tomorrow: false };
  const first = day.find(({ key }) => prayerMinutes(config[key], key) !== null);
  return first ? { ...first, tomorrow: true } : null;
};

// The console's one-line form. describeConfig leads with the variant ("Fixed 1:30 PM"), which
// reads wrong after a prayer name — here the prayer is already named, so only the time matters.
const timeSummary = (config) => {
  if (!config) return '';
  if (config.variant === VARIANT_FIXED) return `${fmt12(config.salaahTime)} · iqama +${config.iqamaDelay}m`;
  if (config.variant === VARIANT_VARIES) {
    const step = parseInt(String(config.salaahTimeVariation || '').replace(/\D/g, ''), 10) || 15;
    return `${step === 15 ? 'next quarter-hour' : `next ${step} minutes`} · iqama +${config.iqamaDelay}m`;
  }
  return `at sunset · iqama +${config.iqamaDelay}m`;
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
    <div className="bcs-shell" style={{
      width: '100%', height: '100%', boxSizing: 'border-box', position: 'relative', overflow: 'hidden',
      display: 'flex', flexDirection: 'column',
      background: 'var(--color-surface-primary)', fontFamily: FONT_B, color: 'var(--color-info-primary)',
    }}>
      {children}
    </div>
  );
}

// Top app bar — the DS `.app-bar` every other section uses: transparent, floating over the
// body, with the progressive-blur haze that fades out toward its bottom edge. Bodies below
// pass `BCS_APPBAR_H` as their top inset so content scrolls UNDER the bar rather than
// starting after it — the fade only reads when there is something behind it to blur.
// `transitionName` carries the console's shared-element title (masjid name) from Profile.
const BCS_APPBAR_H = 114; // 54px status inset + 48px control row + 12px bottom
function OpsAppBar({ title, subtitle, onBack, trailing, transitionName, backHref = './Masjid Console.dc.html#admin' }) {
  return (
    <div className="app-bar" style={{
      alignItems: 'center', gap: 12, height: BCS_APPBAR_H,
      padding: '54px 16px 12px', boxSizing: 'border-box',
    }}>
      <a
        className="ib ib-tonal"
        href={backHref}
        aria-label="Back"
      >
        <span className="mi" data-i="arrow_back"></span>
      </a>
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
function Body({ children, bottomInset = 44, gutter = 16, style = {}, scrollRef, onScroll, className = '' }) {
  return (
    <div className={`bcs-body ${className}`} ref={scrollRef} onScroll={onScroll} style={{
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
        {POST_TARGET_LABEL[post.target] || 'My Masjid'} · seen by {(masjid.stats.followers || 0).toLocaleString('en-IN')} musalleen
      </div>
    </article>
  );
}

// ══════════════════════════════════════════════════════════════════════
// Masjid Console — approved production direction
// ══════════════════════════════════════════════════════════════════════

function BroadcastStudioHeader({ masjid, role, caps, managed, onBack, onOpenSwitcher, transitionEnabled }) {
  const isAdmin = OPS_CAPS.isAdmin(caps);
  const access = isAdmin
    ? 'Full admin'
    : OPS_CAPS.can(caps, 'post')
      ? 'Can send paighams'
      : 'View only';
  return (
    <header className="bcs-header">
      <a className="ib ib-tonal" aria-label="Back" href="../home/Home Broadcast Studio.dc.html#home-managed">
        <span className="mi" data-i="arrow_back"></span>
      </a>
      <MasjidMark masjid={masjid} size={46} />
      <button
        className="bcs-identity"
        onClick={managed.length > 1 ? onOpenSwitcher : undefined}
        aria-haspopup={managed.length > 1 ? 'dialog' : undefined}
        aria-label={managed.length > 1 ? `${masjid.name} — switch masjid` : undefined}
      >
        <span className="bcs-name-line">
          <strong style={{ viewTransitionName: transitionEnabled ? CONSOLE_TITLE_TRANSITION : 'none' }}>{masjid.name}</strong>
          <span className="mi bcs-verified" data-i="verified"></span>
          {managed.length > 1 ? <span className="mi bcs-swap" data-i="unfold_more"></span> : null}
        </span>
        <small>{roleLabel(role)} · {access}</small>
      </button>
    </header>
  );
}

function BroadcastComposer({ followerCount, masjidName, onCreatePost }) {
  return (
    <section className="bcs-composer">
      <span className="bcs-kicker inverse">NEW PAIGHAM</span>
      <h1>What should musalleen know?</h1>
      {/* "Message all 0 musalleen" is a discouraging first line on a masjid that opened the
          console today, and it is not what the author needs to hear. Name the gap instead. */}
      <p>{followerCount
        ? `Message all ${countLabel(followerCount)} musalleen of ${masjidName}.`
        : `No musalleen yet — share the masjid QR and your paighams reach them from the next one.`}</p>
      {/* This is the first surface of the real message field, not a third action competing
          with Record and Photos. Focusing it opens Step 1 and hands focus to the full field. */}
      <textarea
        className="bcs-inline-message"
        rows={3}
        readOnly
        aria-label="Start a paigham"
        placeholder="Jumah bayan begins at 1:00 PM this week…"
        onFocus={() => onCreatePost()}
      />
      {/* The two existing intent shortcuts stay exactly that: recorder or photo picker.
          Neither skips step 1, because the paigham still needs text or a recording. */}
      <div className="bcs-tools">
        <button className="btn btn-tonal sm" onClick={() => onCreatePost('audio')}>
          <span className="mi" data-i="mic"></span>Record audio
        </button>
        <button className="btn btn-tonal sm" onClick={() => onCreatePost('photos')}>
          <span className="mi" data-i="photo_camera"></span>Add photos
        </button>
      </div>
    </section>
  );
}

function BroadcastReadOnlyStrip() {
  return (
    <section className="bcs-readonly">
      <span className="bcs-icon-orb"><span className="mi" data-i="visibility"></span></span>
      <span><strong>Published paighams</strong><small>You can view what the committee has sent.</small></span>
    </section>
  );
}

// The recent-paigham feed owns its own loading, error and empty states. They used to live
// in a latest-paigham summary card above the deck; with that card gone the feed is the only
// place the console talks about paighams, so it has to answer for all three.
function BroadcastFeedState({ status, hasItems, canPost, followerCount, onCreate, onRetry }) {
  if (status === 'loading') {
    return (
      <div className="bcs-feed-state loading">
        <span className="skeleton"></span><span className="skeleton"></span><span className="skeleton short"></span>
      </div>
    );
  }
  if (status === 'error') {
    return (
      <div className="bcs-feed-state error">
        <span className="bcs-icon-orb"><span className="mi" data-i="cloud_off"></span></span>
        <span><strong>Couldn’t load paighams</strong><small>Your console data is safe.</small></span>
        <button className="btn btn-tonal sm" onClick={onRetry}>Try again</button>
      </div>
    );
  }
  if (!hasItems) {
    return (
      <div className="bcs-feed-state empty">
        <span className="bcs-kicker">NO PAIGHAMS YET</span>
        <strong>{(() => {
          if (!canPost) return 'Paighams sent by the committee will appear here.';
          // Same reason as the composer: on a new masjid the count is zero, and "send the
          // first update to 0 musalleen" reads as pointless rather than encouraging.
          return followerCount
            ? `Send the first update to ${countLabel(followerCount)} musalleen.`
            : 'Send your first paigham — everyone who follows the masjid from now on will see it.';
        })()}</strong>
        {canPost ? (
          <button className="btn btn-tonal" onClick={onCreate}>
            <span className="mi" data-i="campaign"></span>Create first paigham
          </button>
        ) : null}
      </div>
    );
  }
  return null;
}

// Operations deck — the Bold board's "Bento Blocks" direction: every destination is a solid
// slab of its own colour and leads with its own state (the next jamaat clock, the committee
// size, the musalleen count) instead of four identical grey cards behind four small icons.
// Each tone is a semantic token paired with its on-colour partner; no literal hex.
//
// A tile leads with a number ONLY when there is a number worth leading with. On a masjid
// that opened its console this morning every count is zero, and a 29px "0" filling a gold
// slab is both the loudest thing on the screen and the most discouraging — so at zero the
// tile falls back to its icon and the caption becomes the thing to go and do.
function BroadcastOperationTile({ tone, value, icon, title, caption, badge, onClick, transitionName }) {
  return (
    <button className={`bcs-operation ${tone}`} onClick={onClick}>
      {badge ? <span className="bcs-operation-badge">{badge}</span> : null}
      {value
        ? <span className="bcs-operation-value">{value}</span>
        : <span className="mi bcs-operation-glyph" data-i={icon}></span>}
      <strong style={{ viewTransitionName: transitionName || 'none' }}>{title}</strong>
      {caption ? <small>{caption}</small> : null}
    </button>
  );
}

// The Salaah slab shouts the clock value; the caption names the prayer it belongs to and,
// for a varies-with-on-time prayer, that the value is the earliest jamaat rather than a
// fixed one. `nextPrayer` only ever returns a prayer that has a time, so there is always a
// value to show unless no prayer is configured at all.
const salaahTile = (config, next) => {
  if (!next) return { value: null, caption: 'Publish your timings' };
  const cfg = config[next.key] || {};
  const varies = cfg.variant === VARIANT_VARIES;
  return {
    value: fmt12(varies ? cfg.neverBefore : cfg.salaahTime),
    caption: `${next.tomorrow ? 'Tomorrow' : 'Next'} ${next.label}${varies ? ' · earliest' : ''} · iqama +${cfg.iqamaDelay}m`,
  };
};

function ConsoleHome({ data, transitionEnabled }) {
  const {
    masjid = OPS_MASJID, role, caps = [], status, counts = {}, managed = [], me,
    attention = [], posts = {}, salaahPublished = true, onRetry, onCreatePost, onOpenDest,
    onOpenSwitcher, onTogglePostMenu, onDeletePost,
  } = data;

  if (status === 'loading') return <Loading label="Loading broadcast studio…" />;
  if (status === 'locked') return <LockedConsole />;
  if (status === 'error') {
    return <ErrorState title="Couldn’t load this masjid" copy="Your console data is safe. Check your connection and try again." onRetry={onRetry} />;
  }

  const items = posts.items || [];
  const canPost = OPS_CAPS.can(caps, 'post');
  const isAdmin = OPS_CAPS.isAdmin(caps);
  const canManagePost = (post) => isAdmin || (canPost && me && post.authorId === me.id);
  const salaah = salaahTile(OPS_SALAAH_CONFIG, salaahPublished ? nextPrayer(OPS_SALAAH_CONFIG) : null);
  const inviteCount = attention.reduce((sum, item) => sum + (item.count || 0), 0);
  const feedLoaded = posts.status === 'loaded' && items.length > 0;
  const memberCount = counts.members || 0;
  const musalleenCount = masjid.stats.followers || 0;

  return (
    <Body className="bcs-studio-body" bottomInset={36} style={{ gap: 0, padding: '54px 16px 36px' }}>
      <BroadcastStudioHeader
        masjid={masjid}
        role={role}
        caps={caps}
        managed={managed}
        onBack={data.onBack}
        onOpenSwitcher={onOpenSwitcher}
        transitionEnabled={transitionEnabled}
      />

      {canPost
        ? <BroadcastComposer followerCount={masjid.stats.followers} masjidName={masjid.name} onCreatePost={onCreatePost} />
        : <BroadcastReadOnlyStrip />}

      <section className="bcs-section">
        <div className="bcs-section-head"><strong>Operations</strong><small>Run the masjid</small></div>
        <div className="bcs-operations">
          <BroadcastOperationTile
            tone="jade"
            value={salaah.value}
            icon="schedule"
            title="Salaah"
            caption={salaah.caption}
            onClick={() => onOpenDest && onOpenDest('salaah')}
            transitionName={transitionEnabled ? destTransitionName('salaah') : undefined}
          />
          <BroadcastOperationTile
            tone="teal"
            value={memberCount ? String(memberCount) : null}
            icon="groups"
            title="Committee"
            caption={(() => {
              if (isAdmin && inviteCount) return `${inviteCount} waiting to accept`;
              if (!memberCount) return 'Invite your imam and secretary';
              if (memberCount === 1) return 'Just you — invite the rest';
              return 'Roles and permissions';
            })()}
            badge={isAdmin ? inviteCount : 0}
            onClick={() => onOpenDest && onOpenDest('members')}
            transitionName={transitionEnabled ? destTransitionName('members') : undefined}
          />
          <BroadcastOperationTile
            tone="gold"
            value={musalleenCount ? countLabel(musalleenCount) : null}
            icon="favorite"
            title="Musalleen"
            caption={musalleenCount ? 'Receiving every paigham' : 'Share the masjid QR so they can follow'}
            onClick={() => onOpenDest && onOpenDest('followers')}
            transitionName={transitionEnabled ? destTransitionName('followers') : undefined}
          />
          <BroadcastOperationTile
            tone="plain"
            icon="mosque"
            title="Masjid details"
            caption={masjid.code}
            onClick={() => onOpenDest && onOpenDest('details')}
            transitionName={transitionEnabled ? destTransitionName('details') : undefined}
          />
        </div>
      </section>

      <section className="bcs-section">
        <div className="bcs-section-head">
          <strong>Recent paighams</strong>
          {feedLoaded ? <small>{items.length} sent · {countLabel(masjid.stats.reactions)} reactions</small> : null}
        </div>
        <BroadcastFeedState
          status={posts.status}
          hasItems={items.length > 0}
          canPost={canPost}
          followerCount={masjid.stats.followers}
          onCreate={onCreatePost}
          onRetry={onRetry}
        />
        {feedLoaded ? (
          <div className="bcs-feed-list">
            {items.map((post) => (
              <ConsolePost
                key={post.id}
                post={post}
                masjid={masjid}
                canManage={canManagePost(post)}
                menuOpen={posts.menuFor === post.id}
                deleting={posts.deleting === post.id}
                onToggleMenu={() => onTogglePostMenu && onTogglePostMenu(posts.menuFor === post.id ? null : post.id)}
                onDelete={() => onDeletePost && onDeletePost(post)}
              />
            ))}
          </div>
        ) : null}
      </section>

      {/* No floating `New paigham` action (removed 2026-08-10). The composer IS the top of this
          screen and the hub is short enough to return to; a second permanent send action restated
          the screen's own purpose over the feed it was covering. */}
    </Body>
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
      secondary={null}
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
                  {roleLabel(m.role)} · {m.city} · {countLabel(m.followers)} musalleen
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
    <Body bottomInset={40} style={{ gap: 0, padding: `${BCS_APPBAR_H}px 0 40px` }}>
      {/* the masjid as it was verified: its photo, name and code. The hero starts BELOW the
          app bar rather than under it: the bar's title is unscrimmed, and a committee photo
          cannot be art-directed, so a dark upload would swallow it. */}
      <div className="media-identity-hero">
        {masjid.photo ? <img src={masjid.photo} alt={`${masjid.name} entrance`} /> : null}
        <div className="media-identity-hero-copy">
          <div className="screen-title on-media">{masjid.name}</div>
          <div className="media-identity-hero-caption">
            <span className="badge sm gold"><span className="mi" data-i="verified"></span>Verified</span>
            <span className="detail-hero-code">{masjid.code}</span>
          </div>
        </div>
      </div>

      <div style={{ padding: '16px 16px 0' }}>
        <div className="eyebrow detail-group-label">Identity</div>
        <div className="list-group detail-group">
          <DetailField label="Masjid name" value={masjid.name} />
          <DetailField label="Masjid code" value={masjid.code} mono />
          <DetailField label="Maslak" value={masjid.maslak} />
        </div>

        <div className="eyebrow detail-group-label">Contact</div>
        <div className="list-group detail-group">
          <DetailField label="Contact person" value={masjid.contactName} />
          <DetailField label="Phone" value={masjid.phone} mono />
        </div>

        <div className="eyebrow detail-group-label">Location</div>
        <div className="list-group detail-group">
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
// 3 · Console — Members tab (Committee + Musalleen)
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
        <Body bottomInset={isAdmin ? 8 : 40} style={{ gap: 0, paddingTop: BCS_APPBAR_H + 14 }}>
          <div className="summary-hero">
            <span className="icon-tile" style={{ '--tile': '38px' }}><span className="mi" data-i="groups"></span></span>
            <div className="summary-hero-copy">
              <div className="summary-hero-title">
                {active.length} {active.length === 1 ? 'member' : 'members'} running {masjid.name}
              </div>
              <div className="summary-hero-label">
                {isAdmin
                  ? 'Tap anyone to change their role or permissions.'
                  : 'The icons show what each member is allowed to do.'}
              </div>
            </div>
          </div>

          <div className="list-group" style={{ marginTop: 14 }}>
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
              <div className="eyebrow committee-label">
                Waiting to accept
                <span>{invited.length}</span>
              </div>
              <div className="list-group">
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
  const [plannedOpen, setPlannedOpen] = React.useState(false);
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
  const availableRoles = availableCommitteeRoles(members.items, member && member.id);

  return (
    <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
      {/* the person IS the header — identity once, not twice */}
      <div className="console-head">
        <a className="ib ib-tonal" aria-label="Back" href="./Masjid Console.dc.html#members">
          <span className="mi" data-i="arrow_back"></span>
        </a>
        {inviting
          ? <IconTile icon="person" size={48} tone="accent" />
          : <Avatar text={member.name} size={48} tone="accent" />}
        <div className="console-head-copy">
          <div className="screen-title">{inviting ? 'Invite a member' : `${member.name}${member.you ? ' (you)' : ''}`}</div>
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
          options={availableRoles.map((r) => ({ value: r, label: roleLabel(r) }))}
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

        <Card style={{ padding: 0, overflow: 'hidden', opacity: 'var(--opacity-emphasis)' }}>
          <button
            type="button"
            aria-expanded={plannedOpen}
            onClick={() => setPlannedOpen(!plannedOpen)}
            style={{
              width: '100%', minHeight: 56, display: 'flex', alignItems: 'center', gap: 10,
              padding: '10px 14px', border: 0, background: 'transparent', color: 'inherit',
              font: 'inherit', textAlign: 'left', cursor: 'pointer',
            }}
          >
            <span className="mi" style={{ fontSize: 20, color: 'var(--color-info-secondary)' }} data-i="schedule"></span>
            <span style={{ flex: 1, minWidth: 0 }}>
              <strong style={{ display: 'block', fontSize: 13.5 }}>Coming later</strong>
              <small style={{ display: 'block', marginTop: 2, fontSize: 11.5, color: 'var(--color-info-secondary)' }}>
                Azaan, live bayan and payments
              </small>
            </span>
            <span className={`mi chev ${plannedOpen ? 'open' : ''}`} style={{ fontSize: 22, color: 'var(--color-info-faint)' }} data-i="keyboard_arrow_down"></span>
          </button>
          {plannedOpen ? (
            <div style={{ padding: '0 12px 4px', borderTop: '1px solid var(--color-neutral-border)' }}>
              {OPS_CAPS.planned().map((capability) => (
                <CapabilityRow key={capability.id} capability={capability} on={false} disabled />
              ))}
            </div>
          ) : null}
        </Card>

        {!inviting && isAdmin && !member.you ? (
          // Tonal, not filled. This screen exists to grant and revoke permissions, so the
          // toggles must stay the visual centre of gravity; a solid red bar outranks them and
          // makes the rarest action the loudest. The confirmation dialog carries the weight.
          <button className="btn lg btn-tonal destructive" style={{ width: '100%' }} onClick={() => onOpenRemove && onOpenRemove(member)}>
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

// ── Musalleen — a read-only record of who receives this masjid's updates ──
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
      {followersStatus === 'loading' ? <Loading label="Loading musalleen…" /> : null}
      {followersStatus === 'error' ? (
        <ErrorState title="Couldn't load musalleen" copy="Check your connection and try again." onRetry={onRetry} />
      ) : null}
      {followersStatus === 'loaded' && !followers.length ? (
        <Empty
          icon="person"
          title="No musalleen yet"
          copy="Musalleen who follow this masjid receive its salaah timings and every paigham you send. Share the masjid QR or ask the jamaat to search for it in Paigham."
        />
      ) : null}

      {followersStatus === 'loaded' && followers.length ? (
        <>
          <div style={{ flexShrink: 0, padding: `${BCS_APPBAR_H + 14}px 16px 0` }}>
            <div className="summary-hero">
              <span className="icon-tile accent" style={{ '--tile': '44px' }}><span className="mi" data-i="groups"></span></span>
              <div className="summary-hero-copy">
                <div className="summary-hero-value">{total.toLocaleString('en-IN')}</div>
                <div className="summary-hero-label">receiving timings and paighams</div>
              </div>
            </div>
          </div>

          <Body bottomInset={40} style={{ gap: 0, paddingTop: 12 }}>
            <div className="list-group">
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
                Names and numbers here are visible to the committee only. Musalleen never appear
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

// The timeline IS this destination. It replaced a three-way FIXED / ON_TIME / VARIES_WITH_ON_TIME
// picker with +/- steppers per prayer: the taxonomy is a storage concern the service derives from edit
// deltas, and a secretary standing in front of a board should set the azaan and the delay, not classify
// the masjid. The screen, the rows, the clamping rules and the drag all come from
// `storyboards/salaah-scroll-timeline.jsx`, so the console and the standalone board cannot drift apart.
//
// The console owns the DRAFT (salaahConfig, through onConfigChange) and the timeline owns the in-flight
// GESTURE. That split is the project's own Qibla rule: a frame-rate stream does not travel through MVI
// state, only the value it settles on does.
//
// Config is stored as "HH:MM" strings and the timeline works in minutes, so the two converters below
// are the whole seam. A VARIES prayer has no salaahTime, only a neverBefore floor — that floor IS the
// azaan the masjid currently calls, so it reads as the azaan here and a drag writes salaahTime without
// touching variant. The service reconciles the taxonomy afterwards; it proposes, it never rewrites.

const salaahToMinutes = (hhmm) => {
  const parts = String(hhmm || '00:00').split(':').map((n) => parseInt(n, 10));
  return (parts[0] * 60) + (parts[1] || 0);
};
const salaahToHHMM = (mins) => {
  const m = ((Math.round(mins) % 1440) + 1440) % 1440;
  return `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`;
};
// The digits in the variation's name ARE its step, so a backend that adds one needs no edit here.
const salaahVariationStep = (name) => {
  const n = parseInt(String(name || '').replace(/\D/g, ''), 10);
  return n > 0 ? n : null;
};

// An ON_TIME prayer stores no time at all — its azaan IS the calculated start, which is why Maghrib
// has neither salaahTime nor neverBefore. Falling back to "00:00" put its azaan at midnight.
//
// A VARIES prayer stores a FLOOR, not an azaan (corrected 2026-08-16). The backend calls it at the
// calculated start rounded UP to the next multiple of the variation, and uses the floor only when
// that rounding lands earlier — so reading `neverBefore` as the azaan states a time the masjid does
// not call. An Asr opening 4:12 with a 10-minute variation and a 4:30 floor is called at 4:30 here,
// but move the floor to 4:00 and it is 4:20, not 4:00.
const salaahAzaanMinutes = (cfg = {}, fallbackMinutes = 0) => {
  if (cfg.salaahTime) return salaahToMinutes(cfg.salaahTime);
  if (!cfg.neverBefore) return fallbackMinutes;
  const floor = salaahToMinutes(cfg.neverBefore);
  const step = salaahVariationStep(cfg.salaahTimeVariation);
  if (!step) return floor;
  return Math.max((Math.floor(fallbackMinutes / step) * step) + step, floor);
};

// ── The drift offer (approved 2026-08-16) ────────────────────────────────────────────────────────
// A `FIXED` azaan holds its clock time while the calculated start slides across the year — measured
// against adhan in Bangalore, the starts swing 31–65 minutes — so a timing that was legal when it was
// published eventually sits outside its own window. Nothing between the editor and a musalli catches
// that, and dragging it to a new fixed time only restarts the same clock.
//
// The durable fix is a rounding rule, and that is a question only the masjid can answer. It is asked
// HERE, at drift, rather than on every edit: most masjids read fixed times off a printed board, so
// asking each time an azaan moves taxes the majority to serve the minority. At drift the committee can
// see the problem, and one tap ends it.
//
// The step is inferred from the masjid's OWN published times rather than guessed. A masjid whose
// prayers all sit on quarter hours is describing quarter hours. Jumah is excluded: its time is a
// congregation convention set by the khutbah, not part of a daily rounding habit. Fewer than two
// times, or no common step, means no offer at all — the screen states the drift and says nothing it
// cannot deliver.
const salaahRoundingStep = (config = {}) => {
  const mins = SALAAH_ORDER
    .filter(({ key }) => key !== 'jumah')
    .map(({ key }) => config[key] || {})
    .filter((cfg) => cfg.salaahTime || cfg.neverBefore)
    .map((cfg) => salaahToMinutes(cfg.salaahTime || cfg.neverBefore));
  if (mins.length < 2) return null;
  return [15, 10, 5].find((step) => mins.every((m) => m % step === 0)) || null;
};

// What the rounding rule would call this prayer today. The offer must show its own consequence: a
// committee cannot accept "the next quarter-hour" without being told that today that is 5:00.
const salaahRoundedAzaan = (opens, step) => (Math.floor(opens / step) * step) + step;

// A scanned time has to clear the same two bounds a dragged one does. LED boards misread digits, so a
// proposal that cannot exist is a normal outcome, not an edge case: it is shown, named, and left out of
// the draft rather than silently clamped into a value nobody chose.
const salaahProposalFault = (p, proposal) => {
  if (!p || !proposal) return null;
  if (proposal.azaan < p.opens) return `before ${p.label} begins at ${window.SstFormat(p.opens)}`;
  if (proposal.azaan + proposal.iqama > p.closes) return `past ${p.ends}, after ${window.SstFormat(p.closes)}`;
  return null;
};

// The offer itself. Floating above the docked action and outside its measurement, for the same
// reason the capsule is: this card appears and retires while a finger may be on the axis, and a card
// in flow would resize the day under that finger. It carries ONE action — dragging is the other way
// out and it is the screen itself, so making it a button would only compete with the day.
function SalaahDriftOffer({ prayer, step, onAdopt }) {
  if (!prayer) return null;
  const today = salaahRoundedAzaan(prayer.opens, step);
  const stepWord = step === 15 ? 'quarter-hour' : `${step} minutes`;
  return (
    <div className="salaah-drift" role="status">
      <span className="mi" data-i="error" aria-hidden="true"></span>
      <div className="salaah-drift-copy">
        {/* Red may letter here — it is the one accent on this screen that clears contrast as type,
            and it is the same red the row itself is already wearing. */}
        {/* The card owns the OFFER and nothing else. It used to end with "drag it to a new time",
            which the footer already says under every state of this screen — two lines telling the
            same reader to drag, stacked. The manual path is the screen itself. */}
        <b>{prayer.label} can no longer be called at {window.SstFormat(prayer.azaan)}</b>
        <span>
          It now begins at {window.SstFormat(prayer.opens)}, and a fixed time will drift again. Let it
          follow the prayer instead:
        </span>
        <button type="button" className="chip solid" onClick={() => onAdopt(prayer.key, step)}>
          {step === 15 ? 'Next quarter-hour' : `Next ${stepWord}`} · {window.SstFormat(today)} today
        </button>
      </div>
    </div>
  );
}

// The editor stays a timeline, not a configuration form. This receipt is the only place the
// automatic behaviour is named, and it uses committee language rather than backend variants.
// First publish shows all six rules together; an ambiguous drag asks only about the prayer touched.
const salaahPolicy = (key, cfg, opens) => {
  const label = (SALAAH_ORDER.find((p) => p.key === key) || {}).label || key;
  if (!cfg) return { key, label, icon: 'schedule', title: 'Not set', detail: '' };
  if (cfg.variant === VARIANT_ON_TIME) {
    return { key, label, icon: 'wb_twilight', follows: true, title: 'At sunset', detail: `Moves every day · Iqama ${cfg.iqamaDelay} min later` };
  }
  if (cfg.variant === VARIANT_VARIES) {
    const step = salaahVariationStep(cfg.salaahTimeVariation) || 15;
    const today = salaahRoundedAzaan(opens || 0, step);
    return {
      key, label, icon: 'update', follows: true,
      title: step === 15 ? 'Next quarter-hour' : `Next ${step} minutes`,
      detail: `${window.SstFormat ? window.SstFormat(today) : fmt12(salaahToHHMM(today))} today · Iqama ${cfg.iqamaDelay} min later`,
    };
  }
  return {
    key, label, icon: 'keep', follows: false,
    title: key === 'jumah' ? `${fmt12(cfg.salaahTime)} every Friday` : `${fmt12(cfg.salaahTime)} every day`,
    detail: `Stays on the clock · Iqama ${cfg.iqamaDelay} min later`,
  };
};

function SalaahRulesBody({ data }) {
  const salaah = data.salaah || {};
  const config = salaah.config || OPS_SALAAH_CONFIG;
  const windows = (window.SstPrayerWindows || [])
    .concat(window.SstJumahWindow ? [window.SstJumahWindow] : []);
  const byKey = {};
  windows.forEach((p) => { byKey[p.key] = p; });
  const policies = SALAAH_ORDER.map(({ key }) => salaahPolicy(key, config[key], (byKey[key] || {}).opens));
  const groups = [
    { title: 'Moves with the prayer', copy: 'Paigham recalculates these as the days and seasons change.', rows: policies.filter((p) => p.follows) },
    { title: 'Stays on the clock', copy: 'These remain at the same clock time until someone changes them.', rows: policies.filter((p) => !p.follows) },
  ].filter((group) => group.rows.length);

  return (
    <Body bottomInset={24} style={{ paddingTop: BCS_APPBAR_H + 18, gap: 22 }}>
      <div className="salaah-rules-lead">
        <span className="mi" data-i="auto_awesome" aria-hidden="true"></span>
        <div>
          <strong>You set the time. Paigham keeps the pattern.</strong>
          <p>The choice is made automatically from the prayer and the time you set. There is nothing else to configure.</p>
        </div>
      </div>
      {groups.map((group) => (
        <section className="salaah-rules-section" key={group.title}>
          <div className="salaah-rules-section-head">
            <h2>{group.title}</h2>
            <p>{group.copy}</p>
          </div>
          <div className="salaah-rules-page-list" role="list">
            {group.rows.map((row) => (
              <div className="salaah-rules-page-row" role="listitem" key={row.key}>
                <span className="icon-tile"><span className="mi" data-i={row.icon} aria-hidden="true"></span></span>
                <span className="salaah-rules-page-prayer">{row.label}</span>
                <span className="salaah-rules-page-copy"><strong>{row.title}</strong><small>{row.detail}</small></span>
              </div>
            ))}
          </div>
        </section>
      ))}
      <p className="salaah-rules-foot">To change a pattern, go back and move that prayer’s azaan on the timeline. Paigham will work it out again.</p>
    </Body>
  );
}

function SalaahConfigBody({ data }) {
  const {
    salaah = {}, onRetry, onConfigChange, onSubmitSalaah, onDone,
    onOpenScan, onScanMeaning, onScanConsumed, onDiscardScan, onAdoptRounding,
    onTimingSettled,
  } = data;
  const {
    status = 'loaded', config = OPS_SALAAH_CONFIG, history = [], saving, dirty,
    scanProposal, scanColumnMeaning, scanMissed = [],
    published = OPS_SALAAH_CONFIG,
  } = salaah;

  const spineRef = React.useRef(null);
  const reach = ((window.OPS_MASJID || {}).stats || {}).followers;
  const reachText = reach ? reach.toLocaleString('en-IN') : null;

  // Windows (start, close, and what closes it) come from the timeline module's day fixture; the times
  // come from the console's config. Nothing new is asked of the backend — SalaahPeriodResolution
  // already models windowStart/windowEnd.
  const windows = window.SstPrayerWindows || [];
  const jumahWindow = window.SstJumahWindow;
  const withPublished = (w) => {
    const pub = published[w.key] || {};
    return Object.assign({}, w, { azaan: salaahAzaanMinutes(pub, w.opens), iqama: pub.iqamaDelay || 0 });
  };
  const prayers = windows.map(withPublished);
  const jumah = jumahWindow ? withPublished(jumahWindow) : null;
  const byKey = {};
  prayers.concat(jumah ? [jumah] : []).forEach((p) => { byKey[p.key] = p; });

  const pubOf = (p) => ({ azaan: p.azaan, iqama: p.iqama });
  const cfgOf = (p) => {
    const draft = config[p.key];
    if (!draft) return pubOf(p);
    return { azaan: salaahAzaanMinutes(draft, p.opens), iqama: draft.iqamaDelay || 0 };
  };
  const scanOf = (p) => {
    const proposal = scanProposal ? scanProposal[p.key] : null;
    if (!proposal) return null;
    const fault = salaahProposalFault(p, proposal);
    return fault ? Object.assign({}, proposal, { fault }) : proposal;
  };

  const commit = (key, value, meta) => onConfigChange && onConfigChange(key, {
    salaahTime: salaahToHHMM(value.azaan),
    iqamaDelay: value.iqama,
  }, meta);
  // The scrolling day (storyboards/salaah-scroll-timeline.jsx) replaced the compressed spine here:
  // the card is dragged directly at 1:1 and each prayer sits at its true position. The console still
  // owns the DRAFT and the timeline still owns the in-flight GESTURE — the Qibla rule is unchanged.
  const { drag, bad, onGrab, onMove, onRelease } = (window.useSstDrag || (() => ({})))({
    cfgOf, prayerOf: (key) => byKey[key], onCommit: commit,
    onSettle: onTimingSettled, live: true,
  });

  const roundingStep = salaahRoundingStep(published);
  const changedCount = salaah.neverPublished
    ? SALAAH_ORDER.length
    : SALAAH_ORDER.filter(({ key }) => salaahChanged(config, key, published)).length;
  const proposalKeys = scanProposal ? Object.keys(scanProposal) : [];
  const pending = proposalKeys.length > 0;
  const faulted = proposalKeys.filter((key) => salaahProposalFault(byKey[key], scanProposal[key]));
  const usable = proposalKeys.length - faulted.length;

  // ── The companion walk (approved 2026-08-12) ──
  // The reading lands as a SHEET, and Add never snaps: the sheet hands over to a narrating capsule
  // that rides the scroll while each usable reading lands on its own row — amber flash, then the
  // ordinary green `is-changed`. The values become real draft edits through the same `commit` a
  // drag uses, so everything stays draggable and Publish stays the only way anything reaches
  // musalleen. Faulted readings never land; the sheet named them and they die with it.
  const bodyScrollRef = React.useRef(null);
  const walkTimer = React.useRef(null);
  const [walk, setWalk] = React.useState(null); // { queue, i, landingKey, done }
  const [needMeaning, setNeedMeaning] = React.useState(false);

  // A prayer whose PUBLISHED pair cannot exist today, and whose draft has not yet rescued it.
  // Both halves matter: dragging it back inside its window retires the offer without needing a
  // dismissal, and so does accepting the offer, because a rounding of the start always resolves
  // inside the window. Withheld during a walk — a landing sequence owns the screen while it runs.
  const driftedPrayer = (roundingStep && !walk)
    ? prayers.concat(jumah ? [jumah] : []).find((p) => (
      salaahProposalFault(p, pubOf(p)) && salaahProposalFault(p, cfgOf(p))
    ))
    : null;
  React.useEffect(() => () => clearTimeout(walkTimer.current), []);

  const beginAdd = () => {
    // The one thing the sheet cannot decide itself. The question is right above the button, so the
    // press points at it instead of refusing silently — no dead affirmatives.
    if (!scanColumnMeaning) { setNeedMeaning(true); return; }
    const queue = SALAAH_ORDER
      .filter(({ key }) => scanProposal && scanProposal[key] && !faulted.includes(key))
      .map(({ key, label }) => ({
        key, label, azaan: scanProposal[key].azaan, iqama: scanProposal[key].iqama,
      }));
    onScanConsumed && onScanConsumed();
    if (!queue.length) return;
    // Reduced motion is immediate replacement, not a slower walk: every value lands at once and the
    // footer's changed-count is the announcement.
    const reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) {
      queue.forEach((it) => {
        const value = { azaan: it.azaan, iqama: it.iqama };
        commit(it.key, value, { field: 'azaan', source: 'scan' });
        onTimingSettled && onTimingSettled(it.key, value, { field: 'azaan', source: 'scan' });
      });
      return;
    }
    const step = (i) => {
      if (i >= queue.length) {
        setWalk({ queue, i: queue.length - 1, done: true });
        walkTimer.current = setTimeout(() => setWalk(null), 1800);
        return;
      }
      const it = queue[i];
      setWalk({ queue, i, landingKey: it.key, done: false });
      // Bring the row the capsule is naming into view — narration about something off screen is
      // exactly the "it snapped and I missed it" this flow replaces.
      const bodyEl = bodyScrollRef.current;
      const rowEl = bodyEl ? bodyEl.querySelector(`.sst-row[data-key="${it.key}"]`) : null;
      if (bodyEl && rowEl) {
        const b = bodyEl.getBoundingClientRect();
        const r = rowEl.getBoundingClientRect();
        bodyEl.scrollTo({ top: bodyEl.scrollTop + (r.top - b.top) - 150, behavior: 'smooth' });
      }
      walkTimer.current = setTimeout(() => {
        const value = { azaan: it.azaan, iqama: it.iqama };
        commit(it.key, value, { field: 'azaan', source: 'scan' });
        onTimingSettled && onTimingSettled(it.key, value, { field: 'azaan', source: 'scan' });
        walkTimer.current = setTimeout(() => step(i + 1), 650);
      }, 720);
    };
    step(0);
  };

  if (status === 'loading') return <Loading label="Loading salaah settings…" />;
  if (status === 'error') {
    return (
      <ErrorState
        title="Couldn't load salaah settings"
        copy="Your current timings are safe and still live for musalleen. Check your connection and try again."
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
        description="Every musalli of this masjid now sees the updated azaan and iqama timings. Your name is on the change."
        action={{ text: 'Done', onClick: onDone, filled: true }}
      />
    ) : null;
  }

  return (
    <div
      style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', position: 'relative' }}
      onPointerMove={onMove}
      onPointerUp={onRelease}
      onPointerCancel={onRelease}
    >
      {/* pan-y so the day scrolls from the gutter and the empty band, while the cards' own
          touch-action:none keeps the drag. */}
      <Body scrollRef={bodyScrollRef} bottomInset={16} style={{ paddingTop: BCS_APPBAR_H + 12, gap: 12, touchAction: 'pan-y' }}>
        {/* The scan leads the screen. Dragging fifteen values by hand is the fallback, not the
            intended path, and OCR was previously reachable only from a small action beside the
            title — an accelerator nobody finds is an accelerator that does not exist. It is an
            action rather than a description, so the band is pressable and its tile animates.
            Withdrawn while a reading is pending (the review sheet owns the scan then) and while
            the companion walk is landing values — a "scan the board" invitation over readings
            that are still arriving would compete with its own result. */}
        {!pending && !walk ? (
          <button type="button" className="summary-hero action" onClick={onOpenScan}>
            <span className="icon-tile scanning" style={{ '--tile': '38px' }}>
              <span className="mi" data-i="filter_center_focus" aria-hidden="true"></span>
            </span>
            <span className="summary-hero-copy">
              <span className="summary-hero-title" style={{ display: 'block' }}>Scan your timing board</span>
              <span className="summary-hero-label" style={{ display: 'block' }}>
                Point the camera at the board — the times come back as suggestions you check before publishing.
              </span>
            </span>
            <span className="mi" style={{ fontSize: 20, color: 'var(--color-info-faint)' }} data-i="chevron_right" aria-hidden="true"></span>
          </button>
        ) : null}

        {/* The attribution is no longer a card here. It is a reference the committee consults rather
            than the work, so it moved into the app bar as an icon-only action (SalaahHistoryAction)
            and the body's first row belongs to the action instead. Accountability survives in the
            record itself and in that action's label — this destination is open to any signed-in
            user, and the sheet is where the names are. */}
        {window.SstDay ? (
          <window.SstDay
            prayers={prayers}
            cfgOf={cfgOf} pubOf={pubOf} scanOf={scanOf}
            drag={drag} bad={bad} live onGrab={onGrab}
            landingKey={walk ? walk.landingKey : null}
          />
        ) : null}

        {/* Jumah is weekly and takes Zohar's place, so it gets its own axis rather than a position on
            today's — the same scale, gutter, delay bar and drag, scoped to the one window. */}
        {jumah && window.SstDay ? (
          <div className="sst-friday">
            <div className="sst-friday-head">
              <span className="sst-eyebrow">EVERY FRIDAY</span>
              <small>Replaces Zohar</small>
            </div>
            <window.SstDay
              prayers={[jumah]}
              cfgOf={cfgOf} pubOf={pubOf} scanOf={scanOf}
              spanFrom={jumah.opens} spanTo={jumah.closes} breaks={[]} showNow={false}
              drag={drag} bad={bad} live onGrab={onGrab}
              landingKey={walk ? walk.landingKey : null}
            />
          </div>
        ) : null}
      </Body>

      {/* The reading LANDS as a sheet (approved 2026-08-12, replacing the in-body strip): a wall of
          sentences above the timeline said a lot and asked nothing. The sheet is scannable — one
          pill per prayer — and carries exactly one affirmative. Nothing is written until Add. */}
      <ScanReviewSheet
        open={pending && !walk}
        proposal={scanProposal}
        faulted={faulted}
        missed={scanMissed}
        usable={usable}
        meaning={scanColumnMeaning}
        needMeaning={needMeaning}
        onMeaning={(v) => { setNeedMeaning(false); onScanMeaning && onScanMeaning(v); }}
        onAdd={beginAdd}
        onDiscard={onDiscardScan}
        onRescan={onOpenScan}
      />

      {/* The narrating capsule: what is happening, while it happens. It names the prayer the scroll
          is carrying the reader to, and ends by handing over to Publish — the one action that can
          make any of this reach musalleen. */}
      {walk ? (
        <div className={`scan-capsule${walk.done ? ' is-done' : ''}`} role="status" aria-live="polite">
          {walk.done
            ? <span className="mi fill" data-i="check_circle" aria-hidden="true"></span>
            : <span className="scan-capsule-ring" aria-hidden="true"></span>}
          <b>
            {walk.done
              ? `${walk.queue.length} added · publish when ready`
              : `Adding ${walk.i + 1} of ${walk.queue.length} · ${walk.queue[walk.i].label}…`}
          </b>
        </div>
      ) : null}

      {salaah.scanStage ? (
        <ScanBoardStage
          stage={salaah.scanStage}
          onClose={data.onCloseScan}
          onCapture={data.onScanCapture}
          onRetry={data.onScanRetry}
        />
      ) : null}

      {/* One primary at a time, and it is always Publish now: the review SHEET owns the scan's
          decision (approved 2026-08-12), so the footer never trades its one job away. A scan still
          cannot reach musalleen without a human pressing Publish on values they have seen land. */}
      {/* The drift offer sits above the refusal strip's slot but out of flow, so the two can coexist:
          the strip is the transient "that move was refused", this is the standing "this timing has
          stopped being possible, and here is the fix that lasts". */}
      <SalaahDriftOffer
        prayer={driftedPrayer}
        step={roundingStep}
        onAdopt={(key, step) => onAdoptRounding && onAdoptRounding(key, step)}
      />

      {bad ? (
        <div className="salaah-refuse" role="alert">
          <span className="mi" data-i="error" aria-hidden="true"></span>
          <span>{bad.why}</span>
        </div>
      ) : null}
      <FooterAction
        label={reachText ? `Publish to ${reachText} musalleen` : 'Publish timings'}
        busy={saving}
        busyLabel="Publishing timings…"
        helper={dirty
          ? `${changedCount} ${salaah.neverPublished ? 'prayers ready' : `${changedCount === 1 ? 'prayer' : 'prayers'} changed`} · publishing updates musalleen and records your name.`
          : 'Drag a prayer’s azaan, or its iqama, to correct it.'}
        onClick={onSubmitSalaah}
      />
    </div>
  );
}

// ── The scan review sheet — the reading lands as a decision, not as prose ──
// Replaces the in-body strip (approved 2026-08-12). The strip was one paragraph that grew a clause
// per condition; committees read it as noise and could not find the next action. The sheet is a
// receipt — one pill per prayer, in day order — under exactly one affirmative. The ok pills keep
// the ordinary ink (amber still never letters), red says refused and may letter, muted says the
// board did not show it. The column question keeps its place-of-answer directly above the button
// that needs it, remembered per masjid and editable on every scan; pressing Add without answering
// points at the question instead of refusing silently — no dead affirmatives.
function ScanReviewSheet({ open, proposal, faulted, missed, usable, meaning, needMeaning, onMeaning, onAdd, onDiscard, onRescan }) {
  const { Dialog } = window;
  if (!open || !Dialog) return null;
  const counts = [
    usable ? `${usable} usable` : null,
    faulted.length ? `${faulted.length} outside ${faulted.length === 1 ? 'its' : 'their'} window` : null,
    missed.length ? `${missed.length} not read` : null,
  ].filter(Boolean).join(' · ');
  const pills = SALAAH_ORDER.map(({ key, label }) => {
    const p = proposal ? proposal[key] : null;
    if (!p) return { key, label, kind: 'mut' };
    // The pill shows the time as the board PRINTED it: a jamaat column prints the jamaat. The
    // azaan the reading will set is derived on landing, exactly as the strip flow derived it.
    const printed = meaning === 'azaan' ? p.azaan : p.azaan + p.iqama;
    return { key, label, kind: faulted.includes(key) ? 'bad' : 'ok', time: salaahShort12(printed) };
  });
  return (
    <Dialog
      mode="sheet"
      isOpen
      onClose={onDiscard}
      title="Board read"
      description={counts}
      primary={usable
        ? { text: `Add ${usable} to draft`, onClick: onAdd }
        // Nothing usable is not a dead end and never a dead button: the honest affirmative is the
        // hand-over to the editor, with the rescan one step below it.
        : { text: 'Set them by hand instead', onClick: onDiscard }}
      secondary={usable
        ? { text: 'Discard reading', onClick: onDiscard }
        : { text: 'Scan again', onClick: onRescan }}
    >
      <div className="scan-sheet-pills" role="list">
        {pills.map((p) => (
          <span key={p.key} role="listitem" className={`scan-sheet-pill is-${p.kind}`}>
            {p.label}
            <em>{p.kind === 'mut' ? '—' : p.time}</em>
            {p.kind === 'ok' ? <span className="mi" data-i="check" aria-hidden="true"></span> : null}
            {p.kind === 'bad' ? <small>outside window</small> : null}
          </span>
        ))}
      </div>
      <div className={`scan-sheet-meaning${needMeaning ? ' is-asking' : ''}`} role="radiogroup" aria-label="What the scanned column shows">
        <span className="eyebrow">What does that column show?</span>
        <div>
          {[{ value: 'jamaat', label: 'Jamaat times' }, { value: 'azaan', label: 'Azaan times' }].map((o) => (
            <button
              key={o.value}
              type="button"
              role="radio"
              aria-checked={meaning === o.value}
              className={`chip ${meaning === o.value ? 'solid' : 'outline'}`}
              onClick={() => onMeaning(o.value)}
            >
              {o.label}
            </button>
          ))}
        </div>
      </div>
    </Dialog>
  );
}

// ── Scan-the-board stage — the camera-stage kit pointed at an LED board ──
// Recognition has its own review destination. OCR never edits the timing form in the
// background: the user sees every proposed value against the current value and explicitly
// applies the changes before returning to the editor.
function ScanBoardStage({ stage, onClose, onCapture, onRetry }) {
  const reading = stage === 'reading';
  const failed = stage === 'failed';

  return (
    <div className="camera-stage scan-camera-stage">
      <div className="camera-topbar">
        <button className="ib ib-tonal camera-control" aria-label="Close scanner" onClick={onClose}>
          <span className="mi" data-i="close"></span>
        </button>
        <div className="camera-title">
          {failed ? 'Couldn’t read the board' : 'Scan the timing board'}
          {!failed ? (
            <small>{reading ? 'Reading the captured photo…' : 'Fill the frame with the board, square-on'}</small>
          ) : null}
        </div>
        <span style={{ width: 48, flexShrink: 0 }}></span>
      </div>

      {failed ? (
        <div className="fullscreen-notice">
          <span className="mi" data-i="filter_center_focus" aria-hidden="true"></span>
          <strong>The board didn’t read</strong>
          <span>
            LED boards can defeat the camera — glare, angle or a scrolling display. Get closer
            and square-on, or just drag the timings; the editor is exactly one step away.
          </span>
          <button className="btn btn-filled lg" onClick={onRetry}>Try again</button>
          <button className="btn btn-link" onClick={onClose}>Set them by hand instead</button>
        </div>
      ) : (
        <React.Fragment>
          <div className="camera-viewport">
            <img src="../../images/salaah-board-sample.jpeg" alt="" />
            <div className="camera-guide scan-board-guide" aria-hidden="true">
              <span className="scan-guide-corner tl"></span>
              <span className="scan-guide-corner tr"></span>
              <span className="scan-guide-corner bl"></span>
              <span className="scan-guide-corner br"></span>
            </div>
            {!reading ? <div className="scan-capture-tip">Full board in frame · avoid glare</div> : null}
            {reading ? (
              <div className="scan-reading" role="status" aria-label="Reading the captured photo">
                <div className="scan-sweep"></div>
                <div className="scan-reading-label">
                  <span className="btn-spinner" aria-hidden="true"></span>Reading captured photo…
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
          {/* Recognition lands the reader back ON the timeline with amber proposals against every
              current time in its place. There is no intermediate comparison destination to leave. */}
          <div className="scan-stage-foot">
            {!reading ? (
              <button className="btn btn-link" onClick={onClose}>Set them by hand instead</button>
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
  // No dismissal control: this sheet asks for nothing, and the scrim and the drag handle already
  // close it. A `Close` button — full-width or a corner × — spends the sheet's most prominent
  // position on the one thing the user can already do by tapping away.
  return (
    <Dialog
      mode="sheet"
      isOpen
      onClose={onClose}
      title="Change history"
      description="Every published change to this masjid's timings, newest first."
      primary={null}
      secondary={null}
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

/**
 * The timings' change record, icon-only beside the title.
 *
 * It used to lead the body as a "Last updated by …" card, which put a reference above the action.
 * Offered only once there is a record: an icon that opens an empty sheet is a dead end, and
 * "nobody has published yet" is already said on the publish bar.
 */
function SalaahActions(data) {
  const history = ((data.salaah || {}).history) || [];
  const last = history[0];
  return (
    <div className="salaah-appbar-actions">
      <button type="button" className="ib ib-tonal" onClick={data.onOpenSalaahRules} aria-label="How timings update">
        <span className="mi" data-i="info" aria-hidden="true"></span>
      </button>
      {last ? (
        <button
          type="button"
          className="ib ib-tonal"
          onClick={data.onOpenHistory}
          aria-label={`Timing changes — last updated by ${last.by}`}
        >
          <span className="mi" data-i="receipt_long" aria-hidden="true"></span>
        </button>
      ) : null}
    </div>
  );
}

// One entry per destination: what the app bar says, which body it hosts, and any trailing action.
const CONSOLE_DESTINATIONS = {
  members: { title: 'Committee', body: CommitteeBody },
  followers: { title: 'Musalleen', body: FollowersBody },
  salaah: { title: 'Salaah timings', body: SalaahConfigBody, trailing: SalaahActions },
  salaahRules: { title: 'How timings update', body: SalaahRulesBody },
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
          trailing={destination.trailing ? destination.trailing(data) : undefined}
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
      <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: `${BCS_APPBAR_H}px 24px 40px`, gap: 12 }}>
        <div className="empty-state-icon" style={{ background: 'color-mix(in oklab,var(--color-status-success) 14%,transparent)', color: 'var(--color-status-success)' }} aria-hidden="true">
          <span className="mi" data-i="check_circle"></span>
        </div>
        <div style={{ fontFamily: FONT_T, fontSize: 24, lineHeight: 1.2, marginTop: 6 }}>Your paigham is live</div>
        <div style={{ fontSize: 14, lineHeight: 1.55, color: 'var(--color-info-secondary)' }}>
          Every musalli of this masjid has it now. You can see it — and delete it if something is
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
            <div className="section-title truncate invite-card-name">{invitation.name}</div>
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
          <div className="section-title truncate invite-card-name">{invitation.name}</div>
          <div className="invite-card-city">{invitation.city}</div>
        </div>
        {/* Expired is muted, not coral: an invitation you can still save and one that is already
            gone must not read the same. Coral stays reserved for "act now". */}
        {invitation.expired
          ? <span className="badge sm muted">Expired</span>
          : <span className={`badge sm ${urgent ? 'coral' : 'amber'}`}>
              <span className="mi" data-i="schedule"></span>
              {invitation.daysLeft <= 0 ? 'Last day' : `${invitation.daysLeft} ${invitation.daysLeft === 1 ? 'day' : 'days'} left`}
            </span>}
      </div>

      <div className="invite-card-role">
        <span className="invite-card-role-label">Invited as</span>
        <strong>{roleLabel(invitation.role)}</strong>
      </div>

      <div className={`invite-card-caps ${caps.length ? '' : 'empty'}`}>
        <span className="eyebrow accent invite-card-caps-label">
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
          {/* .lg, not base .btn: base is 40px, and accepting or declining a committee role is the
              highest-consequence pair of taps in the console. It must clear 48dp / 44pt. */}
          <button className="btn lg btn-tonal" onClick={onDecline}>Decline</button>
          <button className="btn lg btn-filled" onClick={onAccept}>Accept</button>
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
        <Body bottomInset={40} style={{ gap: 12, paddingTop: BCS_APPBAR_H + 14 }}>
          <div className="eyebrow">
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
  // shared by the compose wizard (./broadcast-studio-compose.jsx)
  OpsConfirmDialog: ConfirmDialog,
  // Shared with the compose wizard: switching masjid mid-compose uses the console's sheet.
  MasjidSwitcherSheet,
  PostSentScreen,
  InvitationsScreen,
  // reference data + helpers shared with the board rows and the live device
  OPS_ROLES,
  opsAvailableCommitteeRoles: availableCommitteeRoles,
  opsCanonicalCommitteePhone: canonicalCommitteePhone,
  opsIsCommitteePhoneTaken: isCommitteePhoneTaken,
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
