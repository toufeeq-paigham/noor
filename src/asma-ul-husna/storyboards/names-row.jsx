// Asma ul Husna — deterministic storyboard states for the complete journey.

const STORYBOARD_FRAMES = [
  { name: 'Loading — final grid shape', stage: 'grid', mode: 'loading' },
  { name: 'All 99 names', stage: 'grid', mode: 'loaded' },
  { name: 'Collection unavailable', stage: 'grid', mode: 'empty' },
  { name: 'Load failed — retry', stage: 'grid', mode: 'error' },
  { name: 'Overlay — first name', stage: 'grid', mode: 'loaded', selectedIdx: 0 },
  { name: 'Overlay — Al-Muhaymin (#7)', stage: 'grid', mode: 'loaded', selectedIdx: 6 },
  { name: 'Overlay — last name', stage: 'grid', mode: 'loaded', selectedIdx: 98 },
];

function NamesRow({ active = -1, onSelectFrame }) {
  return (
    <div>
      <div className="poc-row-label">
        <span className="mi" data-i="auto_awesome"></span>
        01 · Asma ul Husna — complete 99-name collection · {STORYBOARD_FRAMES.length} states
      </div>
      <div className="poc-board">
        {STORYBOARD_FRAMES.map((frame, index) => {
          const ringClass = active === index ? 'is-active' : '';
          const { GridScreen } = window;
          const screenContent = GridScreen
            ? <GridScreen mode={frame.mode} selectedIdx={frame.selectedIdx} />
            : null;

          return (
            <div key={frame.name} className="poc-board-item" onClick={() => onSelectFrame && onSelectFrame(index)}>
              <div className={`noor-frame ${ringClass}`} style={{ '--s': '0.46', cursor: onSelectFrame ? 'pointer' : 'default' }}>
                <div className="noor-frame-inner">
                  <div className="noor-screen">
                    <div className="noor-island"></div>
                    {screenContent}
                    <div className="noor-home"></div>
                  </div>
                </div>
              </div>
              <div className="poc-frame-caption">{index + 1} · {frame.name}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

Object.assign(window, { NamesRow, ASMA_STORYBOARD_FRAMES: STORYBOARD_FRAMES });
