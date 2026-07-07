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

function TabsRow({ active = 0, onSelectFrame }) {
  const { HomeScreen, QaumScreen, QuranScreen, SalaahScreen, ProfileScreen } = window;
  
  const tabDefs = [
    { label: 'Home', icon: 'home', index: 0 },
    { label: 'Qaum', icon: 'group', index: 1 },
    { label: 'Quran', icon: 'menu_book', index: 2 },
    { label: 'Salaah', icon: 'mosque', index: 3 },
    { label: 'Profile', icon: 'person', index: 4 }
  ];

  return (
    <div>
      <div className="poc-row-label">
        <span className="material-symbols-rounded">grid_view</span> 01 · Home Flow — Tab Views &amp; Variations · 7 Static Screens
      </div>
      <div className="poc-board">
        {STORYBOARD_FRAMES.map((f, i) => {
          const isActive = active === i;
          const ringClass = isActive ? 'is-active' : '';
          const glowLeft = f.tab * 20 + '%';

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

                    {/* Bottom Nav Bar (Shared/Anchored bottom nav preview in storyboard) */}
                    <div className="nb-bar" style={{ position: 'absolute', bottom: 0, left: 0, right: 0, paddingBottom: 24, zIndex: 50 }}>
                      <div className="nb-glow" style={{ left: glowLeft }}></div>
                      <div className="nb-nav">
                        {tabDefs.map((t) => {
                          const tabActive = f.tab === t.index;
                          const activeCls = tabActive ? 'active' : '';
                          return (
                            <div key={t.index} className={`nb-item ${activeCls}`}>
                              <span className="material-symbols-rounded">{t.icon}</span>
                              <span>{t.label}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <div className="noor-home"></div>
                  </div>
                </div>
              </div>
              <div className="poc-frame-caption">{i + 1} · {f.name}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

Object.assign(window, { TabsRow });
