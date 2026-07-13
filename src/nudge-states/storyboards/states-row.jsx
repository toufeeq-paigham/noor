// Sign-in & Nudge States — static storyboard rows.
// The guest / no-masjid / notification nudge states that used to clutter the Home board live
// here now. Screens are REUSED from ../home/storyboards/screens.jsx (HomeScreen, QaumScreen,
// SalaahScreen + the nudge sheets); this file only supplies the per-state descriptors + rows.
// Copy sources: NudgeInline.kt (inline cards), NudgeSheetFactory.kt / *SheetContent.kt (sheets).
//
// Each descriptor: { id, name, tab (0 Home · 1 Qaum · 3 Salaah), component, props, sheet }
// sheet ∈ null | 'privacy' | 'att' | 'masjid' | 'notif' | 'profile' | 'guestSignin'
// The flat NUDGE_STATES list (index = global frame index) is shared with the live device.

const NO_TRACK = { Fajr: false, Zohar: false, Asr: false, Maghrib: false, Isha: false };

const GUEST_STATES = [
  { id: 'home-login-nudge', name: 'Home — Guest Login Nudge', tab: 0, component: 'HomeScreen', sheet: null, props: { heroSel: null, userName: 'Guest', masjidName: 'Bangalore (Approx.)', prayer: 'Asr', loginNudge: true, onSignInTap: () => {} } },
  { id: 'home-privacy', name: 'Home — Privacy Consent', tab: 0, component: 'HomeScreen', sheet: 'privacy', props: { heroSel: null, userName: 'Guest', masjidName: 'Bangalore (Approx.)', prayer: 'Asr' } },
  { id: 'home-att', name: 'Home — ATT Tracking Prompt', tab: 0, component: 'HomeScreen', sheet: 'att', props: { heroSel: null, userName: 'Guest', masjidName: 'Bangalore (Approx.)', prayer: 'Asr', loginNudge: true, onSignInTap: () => {} } },
  { id: 'home-guest-sheet', name: 'Home — Profile Sign-in Sheet', tab: 0, component: 'HomeScreen', sheet: 'profile', props: { heroSel: null, userName: 'Guest', masjidName: 'Bangalore (Approx.)', prayer: 'Asr', loginNudge: true, onSignInTap: () => {} } },
  { id: 'qaum-guest', name: 'Qaum — Guest Sign-in Nudge', tab: 1, component: 'QaumScreen', sheet: null, props: { loginNudge: true, onSignInTap: () => {} } },
  { id: 'qaum-guest-signin', name: 'Qaum — Sign in to Paigham Sheet', tab: 1, component: 'QaumScreen', sheet: 'guestSignin', props: { loginNudge: true, onSignInTap: () => {} } },
  { id: 'salaah-guest', name: 'Salaah — Guest (Approx. Timings)', tab: 3, component: 'SalaahScreen', sheet: null, props: { guest: true, loginNudge: true, onSignInTap: () => {} } }
];

const NO_MASJID_STATES = [
  { id: 'home-no-masjid', name: 'Home — Follow-a-Masjid Nudge', tab: 0, component: 'HomeScreen', sheet: null, props: { heroSel: null, userName: 'Toufeeq Ahamed', masjidName: 'Bangalore (Approx.)', prayer: 'Asr', followNudge: true, onFindMasjid: () => {} } },
  { id: 'qaum-no-masjid', name: 'Qaum — Follow-a-Masjid Nudge', tab: 1, component: 'QaumScreen', sheet: null, props: { followNudge: true, onFindMasjid: () => {} } },
  { id: 'qaum-masjid-sheet', name: 'Qaum — Pick Your Masjid Sheet', tab: 1, component: 'QaumScreen', sheet: 'masjid', props: { followNudge: true, onFindMasjid: () => {} } },
  { id: 'salaah-no-masjid', name: 'Salaah — No Masjid (Approx.)', tab: 3, component: 'SalaahScreen', sheet: null, props: { noMasjid: true, followNudge: true, onFindMasjid: () => {}, prayersChecked: NO_TRACK } },
  { id: 'salaah-masjid-sheet', name: 'Salaah — Pick Your Masjid Sheet', tab: 3, component: 'SalaahScreen', sheet: 'masjid', props: { noMasjid: true, followNudge: true, onFindMasjid: () => {}, prayersChecked: NO_TRACK } }
];

const NOTIF_STATES = [
  { id: 'home-notif', name: 'Home — Enable Notifications', tab: 0, component: 'HomeScreen', sheet: null, props: { heroSel: null, userName: 'Toufeeq Ahamed', masjidName: 'Masjid E Bilal', prayer: 'Asr', notifNudge: true, onAllowNotif: () => {} } },
  { id: 'qaum-notif', name: 'Qaum — Enable Notifications', tab: 1, component: 'QaumScreen', sheet: null, props: { notifNudge: true, onAllowNotif: () => {} } },
  { id: 'qaum-notif-sheet', name: 'Qaum — Stay in the Loop Sheet', tab: 1, component: 'QaumScreen', sheet: 'notif', props: { notifNudge: true, onAllowNotif: () => {} } },
  { id: 'salaah-notif', name: 'Salaah — Enable Notifications', tab: 3, component: 'SalaahScreen', sheet: null, props: { notifNudge: true, onAllowNotif: () => {} } },
  { id: 'salaah-notif-sheet', name: 'Salaah — Stay in the Loop Sheet', tab: 3, component: 'SalaahScreen', sheet: 'notif', props: { notifNudge: true, onAllowNotif: () => {} } }
];

// Flat list — global frame index = position here. Shared with the live device (window.NUDGE_STATES).
const NUDGE_STATES = GUEST_STATES.concat(NO_MASJID_STATES, NOTIF_STATES);

// One static frame: the tab screen + an optional device-level sheet overlay.
function renderNudgeFrame(f, i, active, onSelectFrame) {
  const { HomeScreen, QaumScreen, SalaahScreen, BottomNav, Dialog, MasjidNudgeSheet, NotificationNudgeSheet, PrivacyNudgeSheet, AttDialog } = window;
  const ring = active === i ? 'is-active' : '';
  const Screen = f.component === 'HomeScreen' ? HomeScreen : f.component === 'QaumScreen' ? QaumScreen : SalaahScreen;

  return (
    <div key={i} className="poc-board-item" onClick={() => onSelectFrame && onSelectFrame(i)}>
      <div className={`noor-frame ${ring}`} style={{ '--s': '0.46', cursor: 'pointer' }}>
        <div className="noor-frame-inner">
          <div className="noor-screen" style={{ display: 'flex', flexDirection: 'column', height: '100%', position: 'relative' }}>
            <div className="noor-island"></div>
            <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
              {Screen && <Screen {...f.props} />}
            </div>
            {BottomNav && <BottomNav activeIndex={f.tab} />}

            {f.sheet === 'masjid' && MasjidNudgeSheet && <MasjidNudgeSheet isOpen onClose={() => {}} onFindMasjid={() => {}} />}
            {f.sheet === 'notif' && NotificationNudgeSheet && <NotificationNudgeSheet isOpen onClose={() => {}} onAllow={() => {}} />}
            {f.sheet === 'privacy' && PrivacyNudgeSheet && <PrivacyNudgeSheet isOpen onClose={() => {}} onContinue={() => {}} />}
            {f.sheet === 'att' && AttDialog && <AttDialog isOpen onChoice={() => {}} />}
            {f.sheet === 'profile' && Dialog && (
              <Dialog mode="sheet" isOpen title="Your profile is waiting for you"
                      description="Sign in with your phone number to save your preferences, follow masjids you care about, and pick up where you left off."
                      primary={{ text: 'Sign in', onClick: () => {} }} secondary={{ text: 'Cancel', onClick: () => {} }} onClose={() => {}} />
            )}
            {f.sheet === 'guestSignin' && Dialog && (
              <Dialog mode="sheet" isOpen title="Sign in to Paigham"
                      description="Save your masjid, get iqama times, and sync reminders across your devices."
                      primary={{ text: 'Sign in', onClick: () => {} }} secondary={{ text: 'Not now', onClick: () => {} }} onClose={() => {}} />
            )}

            <div className="noor-home"></div>
          </div>
        </div>
      </div>
      <div className="poc-frame-caption">{i + 1} · {f.name}</div>
    </div>
  );
}

function makeRow(label, icon, states, offset) {
  return function Row({ active = -1, onSelectFrame }) {
    return (
      <div>
        <div className="poc-row-label"><span className="mi" data-i={icon}></span> {label} · {states.length} states</div>
        <div className="poc-board">
          {states.map((f, k) => renderNudgeFrame(f, offset + k, active, onSelectFrame))}
        </div>
      </div>
    );
  };
}

const GuestRow = makeRow('01 · Guest — sign in to continue', 'login', GUEST_STATES, 0);
const NoMasjidRow = makeRow('02 · Signed in, no masjid — follow a masjid', 'mosque', NO_MASJID_STATES, GUEST_STATES.length);
const NotifRow = makeRow('03 · Notifications off — enable notifications', 'notifications', NOTIF_STATES, GUEST_STATES.length + NO_MASJID_STATES.length);

Object.assign(window, { NUDGE_STATES, GuestRow, NoMasjidRow, NotifRow });
