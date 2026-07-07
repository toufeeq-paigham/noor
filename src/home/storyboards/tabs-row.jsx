// Tabs & Variations row — static storyboard row (7 variations/tabs)
// Rendered on the Home Screen board via:
//   <x-import component="TabsRow" from="./storyboards/tabs-row.jsx" active="{{ activeFrameIndex }}">
// `active` = index 0-6 of the active snapshot (to highlight it on the canvas).

const STORYBOARD_FRAMES = [
  { id: 'home', name: 'Home — Maghrib Default', tab: 0, component: 'HomeScreen', props: { heroSel: null } },
  { id: 'home-suhoor', name: 'Home — Suhoor Info Card', tab: 0, component: 'HomeScreen', props: { heroSel: 'suhoor' } },
  { id: 'home-iftaar', name: 'Home — Iftaar Info Card', tab: 0, component: 'HomeScreen', props: { heroSel: 'iftaar' } },
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

function renderFrame(f, i, active, onSelectFrame) {
  const { HomeScreen, QaumScreen, QuranScreen, SalaahScreen, ProfileScreen, BottomNav } = window;
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
        <span className="material-symbols-rounded">home</span> 02 · Home Tab — Maghrib &amp; Variations · 3 Screens
      </div>
      <div className="poc-board">
        {STORYBOARD_FRAMES.slice(0, 3).map((f, i) => renderFrame(f, i, active, onSelectFrame))}
      </div>
    </div>
  );
}

function QaumRow({ active = 0, onSelectFrame }) {
  return (
    <div>
      <div className="poc-row-label">
        <span className="material-symbols-rounded">group</span> 03 · Qaum Tab — Community Feed · 1 Screen
      </div>
      <div className="poc-board">
        {STORYBOARD_FRAMES.slice(3, 4).map((f, i) => renderFrame(f, 3 + i, active, onSelectFrame))}
      </div>
    </div>
  );
}

function QuranRow({ active = 0, onSelectFrame }) {
  return (
    <div>
      <div className="poc-row-label">
        <span className="material-symbols-rounded">menu_book</span> 04 · Quran Tab — Surah Listing · 1 Screen
      </div>
      <div className="poc-board">
        {STORYBOARD_FRAMES.slice(4, 5).map((f, i) => renderFrame(f, 4 + i, active, onSelectFrame))}
      </div>
    </div>
  );
}

function SalaahRow({ active = 0, onSelectFrame }) {
  return (
    <div>
      <div className="poc-row-label">
        <span className="material-symbols-rounded">mosque</span> 05 · Salaah Tab — Bilal Timings · 1 Screen
      </div>
      <div className="poc-board">
        {STORYBOARD_FRAMES.slice(5, 6).map((f, i) => renderFrame(f, 5 + i, active, onSelectFrame))}
      </div>
    </div>
  );
}

function ProfileRow({ active = 0, onSelectFrame }) {
  return (
    <div>
      <div className="poc-row-label">
        <span className="material-symbols-rounded">person</span> 06 · Profile Tab — User Settings · 1 Screen
      </div>
      <div className="poc-board">
        {STORYBOARD_FRAMES.slice(6, 7).map((f, i) => renderFrame(f, 6 + i, active, onSelectFrame))}
      </div>
    </div>
  );
}

function HomePrayerRow({ active = 0, onSelectFrame }) {
  return (
    <div>
      <div className="poc-row-label">
        <span className="material-symbols-rounded">schedule</span> 01 · Home Tab — Prayer Variations · 5 Screens
      </div>
      <div className="poc-board">
        {PRAYER_FRAMES.map((f, i) => renderFrame(f, 7 + i, active, onSelectFrame))}
      </div>
    </div>
  );
}

Object.assign(window, { HomeRow, QaumRow, QuranRow, SalaahRow, ProfileRow, HomePrayerRow });
