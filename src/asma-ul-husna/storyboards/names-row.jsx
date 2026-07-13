// Asma ul Husna — static storyboard row (3 states: grid top, grid scrolled, detail).
// Rendered on the board via:
//   <x-import component="NamesRow" from="./storyboards/names-row.jsx" active="{{ namesActive }}">
// `active` = index of the frame the live device currently shows (-1 = none).

const STORYBOARD_FRAMES = [
  { name: 'Grid — top of list', stage: 'grid' },
  { name: 'Grid — scrolled', stage: 'grid' },
  { name: 'Detail — Al-Muhaymin (#7)', stage: 'detail', selectedIdx: 6 }
];

function NamesRow({ active = -1, onSelectFrame }) {
  return (
    <div>
      <div className="poc-row-label">
        <span className="mi" data-i="auto_awesome"></span>
        01 · Asma ul Husna — 99 Names grid &amp; detail · {STORYBOARD_FRAMES.length} states
      </div>
      <div className="poc-board">
        {STORYBOARD_FRAMES.map((f, i) => {
          const isActive = active === i;
          const ringClass = isActive ? 'is-active' : '';

          const { GridScreen, DetailScreen } = window;
          let screenContent = null;

          if (f.stage === 'grid') {
            screenContent = GridScreen ? <GridScreen /> : <div style={{ padding: 20, color: 'var(--color-info-secondary)' }}>Loading...</div>;
          } else if (f.stage === 'detail') {
            screenContent = DetailScreen ? <DetailScreen selectedIdx={f.selectedIdx} /> : <div style={{ padding: 20, color: 'var(--color-info-secondary)' }}>Loading...</div>;
          }

          return (
            <div key={i} className="poc-board-item" onClick={() => onSelectFrame && onSelectFrame(i)}>
              <div className={`noor-frame ${ringClass}`} style={{ '--s': '0.46', cursor: onSelectFrame ? 'pointer' : 'default' }}>
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

Object.assign(window, { NamesRow, ASMA_STORYBOARD_FRAMES: STORYBOARD_FRAMES });
