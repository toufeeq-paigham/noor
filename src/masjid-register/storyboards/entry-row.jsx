// Row 01 — Entry points. The 3 tabs that open the My Masjids sheet (tap the masjid name/header):
//   0 · Home tab   1 · Salaah tab   2 · Profile tab
// Reuses the REAL shared tab screens from ../home/storyboards/screens.jsx. A no-op handler is
// passed so the tap affordance renders in the static frame.

const NAV = { home: 0, salaah: 3, profile: 4 };
const noop = () => {};

const ENTRY_FRAMES = [
  { name: 'Home tab', component: 'HomeScreen', nav: NAV.home, props: { prayer: 'Asr', masjidName: 'Masjid E Bilal', onMasjidTap: noop } },
  { name: 'Salaah tab', component: 'SalaahScreen', nav: NAV.salaah, props: { masjidName: 'Masjid E Bilal', onMasjidSheetToggle: noop } },
  { name: 'Profile tab', component: 'ProfileScreen', nav: NAV.profile, props: { userName: 'Salim Shaikh', masjidName: 'Dargha Masjid 3', onMyMasjids: noop } }
];

function frame(f, i, active, onSelectFrame) {
  const Screen = window[f.component];
  const { BottomNav } = window;
  const ring = active === i ? 'is-active' : '';
  return (
    <div key={i} className="poc-board-item" onClick={() => onSelectFrame && onSelectFrame(i)}>
      <div className={`noor-frame ${ring}`} style={{ '--s': '0.46', cursor: 'pointer' }}>
        <div className="noor-frame-inner">
          <div className="noor-screen">
            <div className="noor-island"></div>
            {Screen && <Screen {...f.props} />}
            {BottomNav && <BottomNav activeIndex={f.nav} />}
            <div className="noor-home"></div>
          </div>
        </div>
      </div>
      <div className="poc-frame-caption">{i + 1} · {f.name}</div>
    </div>
  );
}

function EntryRow({ active = -1, onSelectFrame }) {
  return (
    <div>
      <div className="poc-row-label"><span className="mi" data-i="splitscreen"></span> 01 · Entry points — tap the masjid name · {ENTRY_FRAMES.length} tabs</div>
      <div className="poc-board">
        {ENTRY_FRAMES.map((f, i) => frame(f, i, active, onSelectFrame))}
      </div>
    </div>
  );
}

Object.assign(window, { EntryRow });
