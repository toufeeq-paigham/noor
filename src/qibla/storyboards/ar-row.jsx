// Qibla AR finder — static storyboard row (camera view states).
// Board imports it via:
//   <x-import component="ARRow" from="./storyboards/ar-row.jsx" active="{{ arActive }}" on-select-frame="{{ selectArFrame }}">
// `active` = index of the frame the live device currently shows (-1 = none).

const AR_FRAMES = [
  { name: 'Searching — turn to Qibla', stage: 'searching' },
  { name: 'Hold phone upright', stage: 'horizontal' },
  { name: 'Qibla in view', stage: 'inview' },
];

function ARRow({ active = -1, onSelectFrame }) {
  const { SmartQiblaScreen } = window;
  return (
    <div>
      <div className="poc-row-label"><span className="mi" data-i="explore"></span> 02 · AR finder — searching · hold upright · in view · {AR_FRAMES.length} states</div>
      <div className="poc-board">
        {AR_FRAMES.map((f, i) => {
          const isActive = active === i;
          return (
            <div key={i} className="poc-board-item" onClick={() => onSelectFrame && onSelectFrame(i)}>
              <div className={`noor-frame ${isActive ? 'is-active' : ''}`} style={{ '--s': '0.46', cursor: onSelectFrame ? 'pointer' : 'default' }}>
                <div className="noor-frame-inner">
                  <div className="noor-screen">
                    <div className="noor-island"></div>
                    {SmartQiblaScreen && <SmartQiblaScreen stage={f.stage} />}
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

Object.assign(window, { ARRow });
