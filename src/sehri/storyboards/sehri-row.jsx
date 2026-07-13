// Find Sehri — static storyboard row (one frame per visible state of the flow).
// Board imports it via:
//   <x-import component="SehriRow" from="./storyboards/sehri-row.jsx" active="{{ sehriActive }}" on-select-frame="{{ selectFrame }}">
// `active` = index of the frame the live device currently shows (-1 = none).

// Each frame is a snapshot of the flow, starting from the Home tab entry point.
const FRAMES = [
  { name: 'Home tab — Sehri card', isHome: true },
  { name: 'Location permission', permission: true, selectedIdx: 0 },
  { name: 'Map — nearby locations', selectedIdx: 0 },
  { name: 'Map — another location', selectedIdx: 1 },
  { name: 'List view', isList: true },
];

function SehriRow({ active = -1, onSelectFrame }) {
  const { SehriMapScreen, SehriListScreen, HomeScreen, BottomNav } = window;
  return (
    <div>
      <div className="poc-row-label">
        <span className="mi" data-i="restaurant"></span>
        01 · Find Sehri — Home → permission → map · list · {FRAMES.length} states
      </div>
      <div className="poc-board">
        {FRAMES.map((f, i) => {
          const isActive = active === i;

          let screenContent = null;
          if (f.isHome) {
            screenContent = (
              <div style={{ display: 'flex', flexDirection: 'column', height: '100%', position: 'relative' }}>
                <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
                  {HomeScreen ? <HomeScreen /> : <div style={{ padding: 20, color: 'var(--color-info-secondary)' }}>Loading Home...</div>}
                </div>
                {BottomNav ? <BottomNav activeIndex={0} /> : null}
              </div>
            );
          } else if (f.isList) {
            screenContent = SehriListScreen ? <SehriListScreen /> : null;
          } else {
            screenContent = SehriMapScreen ? <SehriMapScreen selectedIdx={f.selectedIdx} permission={!!f.permission} /> : null;
          }

          return (
            <div key={i} className="poc-board-item" onClick={() => onSelectFrame && onSelectFrame(i)}>
              <div className={`noor-frame ${isActive ? 'is-active' : ''}`} style={{ '--s': '0.46', cursor: onSelectFrame ? 'pointer' : 'default' }}>
                <div className="noor-frame-inner">
                  <div className="noor-screen">
                    <div className="noor-island"></div>
                    {screenContent}
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

Object.assign(window, { SehriRow });
