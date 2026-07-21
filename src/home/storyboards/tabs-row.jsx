// Tabs & Variations row — static storyboard row (7 variations/tabs)
// Rendered on the Home Screen board via:
//   <x-import component="TabsRow" from="./storyboards/tabs-row.jsx" active="{{ activeFrameIndex }}">
// `active` = index 0-6 of the active snapshot (to highlight it on the canvas).

const STORYBOARD_FRAMES = [
  { id: 'home', name: 'Home — Maghrib Default', tab: 0, component: 'HomeScreen', props: { heroSel: null } },
  { id: 'home-login-nudge', name: 'Home — Guest Login Nudge', tab: 0, component: 'HomeScreen', props: { heroSel: null, userName: 'Guest', masjidName: 'Bangalore (Approx.)', prayer: 'Asr', loginNudge: true, onSignInTap: () => {} } },
  { id: 'home-privacy-consent', name: 'Home — Privacy Consent', tab: 0, component: 'HomeScreen', props: { heroSel: null, userName: 'Guest', masjidName: 'Bangalore (Approx.)', prayer: 'Asr' }, privacySheet: true },
  { id: 'home-att-prompt', name: 'Home — ATT Tracking Prompt', tab: 0, component: 'HomeScreen', props: { heroSel: null, userName: 'Guest', masjidName: 'Bangalore (Approx.)', prayer: 'Asr', loginNudge: true, onSignInTap: () => {} }, attDialog: true },
  { id: 'qaum', name: 'Qaum — community Feed', tab: 1, component: 'QaumScreen', props: {} },
  { id: 'quran', name: 'Quran — Surah Listing', tab: 2, component: 'QuranScreen', props: {} },
  { id: 'salaah', name: 'Salaah — Bilal Timings', tab: 3, component: 'SalaahScreen', props: {} },
  { id: 'profile', name: 'Profile — User Settings', tab: 4, component: 'ProfileScreen', props: {} }
];

const PRAYER_FRAMES = [
  { id: 'home-fajr', name: 'Home — Fajr View', tab: 0, component: 'HomeScreen', props: { prayer: 'Fajr' } },
  { id: 'home-zohar', name: 'Home — Zohar View', tab: 0, component: 'HomeScreen', props: { prayer: 'Zohar' } },
  { id: 'home-asr', name: 'Home — Asr View', tab: 0, component: 'HomeScreen', props: { prayer: 'Asr' } },
  { id: 'home-maghrib', name: 'Home — Maghrib View', tab: 0, component: 'HomeScreen', props: { prayer: 'Maghrib' } },
  { id: 'home-isha', name: 'Home — Isha View', tab: 0, component: 'HomeScreen', props: { prayer: 'Isha' } }
];

// Qaum audio-player variations. Appended at the END of the global frame index space
// (13,14,15) so the existing indices 0-12 + hash deep-links stay stable.
const QAUM_EXTRA_FRAMES = [
  { id: 'qaum-playing', name: 'Qaum — Audio Playing', tab: 1, component: 'QaumScreen', props: { audioPlaying: true, audioProgress: 1 } },
  { id: 'qaum-dock-top', name: 'Qaum — Player Docked (Top)', tab: 1, component: 'QaumScreen', props: { audioPlaying: true, audioProgress: 5, dock: 'top' } },
  { id: 'qaum-dock-bottom', name: 'Qaum — Player Docked (Bottom)', tab: 1, component: 'QaumScreen', props: { audioPlaying: true, audioProgress: 9, dock: 'bottom', dockBottomOffset: 12 } }
];

// Quran Juz view — appended at global index 16 (keeps indices 0-15 stable).
const QURAN_EXTRA_FRAMES = [
  { id: 'quran-juz', name: 'Quran — Juz View', tab: 2, component: 'QuranScreen', props: { activeTab: 1 } }
];

// Quran data states use appended indices 34-36 so all existing deep-link indices remain stable.
const QURAN_DATA_FRAMES = [
  { id: 'quran-loading', name: 'Quran — Loading', tab: 2, component: 'QuranScreen', props: { contentState: 'loading' } },
  { id: 'quran-empty', name: 'Quran — Empty', tab: 2, component: 'QuranScreen', props: { contentState: 'empty' } },
  { id: 'quran-error', name: 'Quran — Error & Retry', tab: 2, component: 'QuranScreen', props: { contentState: 'error', onRetry: () => {} } }
];

// Qaum data states use appended indices 31-33 so all existing deep-link indices remain stable.
const QAUM_DATA_FRAMES = [
  { id: 'qaum-loading', name: 'Qaum — Loading', tab: 1, component: 'QaumScreen', props: { contentState: 'loading' } },
  { id: 'qaum-empty', name: 'Qaum — Empty', tab: 1, component: 'QaumScreen', props: { contentState: 'empty' } },
  { id: 'qaum-error', name: 'Qaum — Error & Retry', tab: 1, component: 'QaumScreen', props: { contentState: 'error', onRetry: () => {} } }
];

const QAUM_MEDIA_FRAMES = [
  {
    id: 'qaum-media',
    name: 'Qaum — Feed-backed Image Detail',
    tab: 1,
    component: 'QaumScreen',
    props: { mediaOpen: true, onCloseMedia: () => {} }
  }
];

// Supplied Compose evidence includes a Home state where timing content stays
// usable while only tracking data is loading. Keep that state explicit in Noor.
const HOME_DATA_FRAMES = [
  {
    id: 'home-tracking-loading',
    name: 'Home — Tracking Loading',
    tab: 0,
    component: 'HomeScreen',
    props: {
      prayer: 'Asr',
      masjidName: 'Bangalore (Approx.)',
      followNudge: true,
      trackingLoading: true,
      onFindMasjid: () => {},
      onCloseFollowNudge: () => {}
    }
  }
];

const PROFILE_EXTRA_FRAMES = [
  {
    id: 'profile-pending',
    name: 'Profile — Pending Setup',
    tab: 4,
    component: 'ProfileScreen',
    props: {
      userName: 'Paigham User',
      phone: '+91 81234 03269',
      showMyMasjids: false,
      onRegister: () => {},
      onInvite: () => {},
      onApprove: () => {},
      onTerms: () => {},
      onPrivacy: () => {},
      onAbout: () => {}
    }
  }
];

// NOTE: the guest / no-masjid / notification nudge STATES used to live here as extra frames.
// They moved to their own board — src/nudge-states/ — to declutter this storyboard and cut the
// canvas' pan/zoom cost. STORYBOARD_FRAMES indices 1-3 (login-nudge/privacy/ATT) are retained in
// the array only so the live-device state machine's index space stays stable; they are no longer
// rendered here.

function renderFrame(f, i, active, onSelectFrame) {
  const { HomeScreen, QaumScreen, QuranScreen, SalaahScreen, ProfileScreen, BottomNav, Dialog, MasjidNudgeSheet, NotificationNudgeSheet, PrivacyNudgeSheet, AttDialog } = window;
  const isActive = active === i;
  const ringClass = isActive ? 'is-active' : '';

  // Resolve which screen component to render
  let ScreenComp = null;
  if (f.component === 'HomeScreen') ScreenComp = HomeScreen;
  else if (f.component === 'QaumScreen') ScreenComp = QaumScreen;
  else if (f.component === 'QuranScreen') ScreenComp = QuranScreen;
  else if (f.component === 'SalaahScreen') ScreenComp = SalaahScreen;
  else if (f.component === 'ProfileScreen') ScreenComp = ProfileScreen;

  return (
    <div key={i} className="poc-board-item" onClick={() => onSelectFrame && onSelectFrame(i)}>
      <div className={`noor-frame ${ringClass}`} style={{ '--s': '0.46', cursor: 'pointer' }}>
        <div className="noor-frame-inner">
          <div className="noor-screen" style={{ display: 'flex', flexDirection: 'column', height: '100%', position: 'relative' }}>
            <div className="noor-island"></div>
            
            {/* Screen Content */}
            <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
              {ScreenComp && <ScreenComp {...f.props} />}
            </div>

            {/* Bottom Nav Bar (shared component, non-interactive preview) */}
            {BottomNav && !f.props.mediaOpen && <BottomNav activeIndex={f.tab} />}

            {/* Optional LoginSheet snapshot over the whole device (covers the nav, like the app) */}
            {f.sheet && Dialog && (
              <Dialog mode="sheet" isOpen title={f.sheet.title} description={f.sheet.description}
                      primary={{ text: 'Sign in', onClick: () => {} }} secondary={{ text: 'Cancel', onClick: () => {} }}
                      onClose={() => {}} />
            )}

            {/* Optional rich follow-masjid sheet snapshot */}
            {f.masjidSheet && MasjidNudgeSheet && (
              <MasjidNudgeSheet isOpen onClose={() => {}} onFindMasjid={() => {}} />
            )}

            {/* Optional rich notification sheet snapshot */}
            {f.notifSheet && NotificationNudgeSheet && (
              <NotificationNudgeSheet isOpen onClose={() => {}} onAllow={() => {}} />
            )}

            {/* Optional guest sign-in interrupt sheet snapshot (NudgeSheetFactory.kt GuestSignIn) */}
            {f.guestSignInSheet && Dialog && (
              <Dialog mode="sheet" isOpen title="Sign in to Paigham"
                      description="Save your masjid, get iqama times, and sync reminders across your devices."
                      primary={{ text: 'Sign in', onClick: () => {} }} secondary={{ text: 'Not now', onClick: () => {} }}
                      onClose={() => {}} />
            )}

            {/* Optional privacy / ATT pre-prompt sheet snapshot */}
            {f.privacySheet && PrivacyNudgeSheet && (
              <PrivacyNudgeSheet isOpen onClose={() => {}} onContinue={() => {}} />
            )}

            {/* Optional system ATT dialog snapshot */}
            {f.attDialog && AttDialog && (
              <AttDialog isOpen onChoice={() => {}} />
            )}

            <div className="noor-home"></div>
          </div>
        </div>
      </div>
      <div className="poc-frame-caption">{i + 1} · {f.name}</div>
    </div>
  );
}

function HomeRow({ active = 0, onSelectFrame }) {
  return (
    <div>
      <div className="poc-row-label">
        <span className="mi" data-i="home"></span> 02 · Home Tab — Calculated or Masjid Timings
      </div>
      <div className="poc-board">
        {renderFrame(STORYBOARD_FRAMES[0], 0, active, onSelectFrame)}
        {HOME_DATA_FRAMES.map((f, i) => renderFrame(f, 37 + i, active, onSelectFrame))}
      </div>
    </div>
  );
}

function QaumRow({ active = 0, onSelectFrame }) {
  return (
    <div>
      <div className="poc-row-label">
        <span className="mi" data-i="groups"></span> 03 · Qaum Tab — Community Feed, Data States, Media &amp; Audio · 8 states
      </div>
      <div className="poc-board">
        {/* Base feed (idle audio) at global index 4, then the audio-player variations at 13-15 */}
        {renderFrame(STORYBOARD_FRAMES[4], 4, active, onSelectFrame)}
        {QAUM_EXTRA_FRAMES.map((f, i) => renderFrame(f, 13 + i, active, onSelectFrame))}
        {QAUM_DATA_FRAMES.map((f, i) => renderFrame(f, 31 + i, active, onSelectFrame))}
        {QAUM_MEDIA_FRAMES.map((f, i) => renderFrame(f, 39 + i, active, onSelectFrame))}
      </div>
    </div>
  );
}

function QuranRow({ active = 0, onSelectFrame }) {
  return (
    <div>
      <div className="poc-row-label">
        <span className="mi" data-i="menu_book"></span> 04 · Quran Tab — Surah, Juz &amp; Data States · 5 states
      </div>
      <div className="poc-board">
        {renderFrame(STORYBOARD_FRAMES[5], 5, active, onSelectFrame)}
        {QURAN_EXTRA_FRAMES.map((f, i) => renderFrame(f, 16 + i, active, onSelectFrame))}
        {QURAN_DATA_FRAMES.map((f, i) => renderFrame(f, 34 + i, active, onSelectFrame))}
      </div>
    </div>
  );
}

function SalaahRow({ active = 0, onSelectFrame }) {
  return (
    <div>
      <div className="poc-row-label">
        <span className="mi" data-i="mosque_clock2"></span> 05 · Salaah Tab — Bilal Timings · 1 Screen
      </div>
      <div className="poc-board">
        {renderFrame(STORYBOARD_FRAMES[6], 6, active, onSelectFrame)}
      </div>
    </div>
  );
}

function ProfileRow({ active = 0, onSelectFrame }) {
  return (
    <div>
      <div className="poc-row-label">
        <span className="mi" data-i="person"></span> 06 · Profile Tab — User Settings · 2 states
      </div>
      <div className="poc-board">
        {STORYBOARD_FRAMES.slice(7, 8).map((f, i) => renderFrame(f, 7 + i, active, onSelectFrame))}
        {PROFILE_EXTRA_FRAMES.map((f, i) => renderFrame(f, 38 + i, active, onSelectFrame))}
      </div>
    </div>
  );
}

function HomePrayerRow({ active = 0, onSelectFrame }) {
  return (
    <div>
      <div className="poc-row-label">
        <span className="mi" data-i="schedule"></span> 01 · Home Tab — Prayer Variations · 5 Screens
      </div>
      <div className="poc-board">
        {PRAYER_FRAMES.map((f, i) => renderFrame(f, 8 + i, active, onSelectFrame))}
      </div>
    </div>
  );
}

Object.assign(window, { HomeRow, QaumRow, QuranRow, SalaahRow, ProfileRow, HomePrayerRow });
