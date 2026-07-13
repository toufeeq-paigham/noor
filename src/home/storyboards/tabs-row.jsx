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
            {BottomNav && <BottomNav activeIndex={f.tab} />}

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
        <span className="mi" data-i="home"></span> 02 · Home Tab — Maghrib Default · 1 Screen
      </div>
      <div className="poc-board">
        {renderFrame(STORYBOARD_FRAMES[0], 0, active, onSelectFrame)}
      </div>
    </div>
  );
}

function QaumRow({ active = 0, onSelectFrame }) {
  return (
    <div>
      <div className="poc-row-label">
        <span className="mi" data-i="group"></span> 03 · Qaum Tab — Community Feed &amp; Audio Player · 4 states
      </div>
      <div className="poc-board">
        {/* Base feed (idle audio) at global index 4, then the audio-player variations at 13-15 */}
        {renderFrame(STORYBOARD_FRAMES[4], 4, active, onSelectFrame)}
        {QAUM_EXTRA_FRAMES.map((f, i) => renderFrame(f, 13 + i, active, onSelectFrame))}
      </div>
    </div>
  );
}

function QuranRow({ active = 0, onSelectFrame }) {
  return (
    <div>
      <div className="poc-row-label">
        <span className="mi" data-i="menu_book"></span> 04 · Quran Tab — Surah &amp; Juz · 2 states
      </div>
      <div className="poc-board">
        {renderFrame(STORYBOARD_FRAMES[5], 5, active, onSelectFrame)}
        {QURAN_EXTRA_FRAMES.map((f, i) => renderFrame(f, 16 + i, active, onSelectFrame))}
      </div>
    </div>
  );
}

function SalaahRow({ active = 0, onSelectFrame }) {
  return (
    <div>
      <div className="poc-row-label">
        <span className="mi" data-i="mosque"></span> 05 · Salaah Tab — Bilal Timings · 1 Screen
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
        <span className="mi" data-i="person"></span> 06 · Profile Tab — User Settings · 1 Screen
      </div>
      <div className="poc-board">
        {STORYBOARD_FRAMES.slice(7, 8).map((f, i) => renderFrame(f, 7 + i, active, onSelectFrame))}
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
