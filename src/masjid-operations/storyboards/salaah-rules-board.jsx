// Salaah timing rules — storyboard rows.
//
// Every frame is rendered by the SAME screen component and the SAME `buildSrData` assembly the
// live device uses (see ./salaah-rules-state.js), so a static frame cannot drift from the
// prototype. Tapping a frame hands its state to the device.

function SrlFrame({ frame, index, active, onSelectFrame }) {
  const Screen = window.SalaahRulesScreen;
  const data = window.buildSrData ? window.buildSrData(window.srFrameState(frame), {}) : {};
  return (
    <div className="poc-board-item" onClick={() => onSelectFrame && onSelectFrame(index)}>
      <div className={`noor-frame ${active === index ? 'is-active' : ''}`} style={{ '--s': '0.46', cursor: 'pointer' }}>
        <div className="noor-frame-inner">
          <div className="noor-screen">
            <div className="noor-island"></div>
            {Screen ? <Screen data={data} /> : null}
            <div className="noor-home"></div>
          </div>
        </div>
      </div>
      <div className="poc-frame-caption">{index + 1} · {frame.name}</div>
    </div>
  );
}

function SalaahRulesBoard({ active = -1, onSelectFrame }) {
  const frames = window.SR_FRAMES || [];
  const groups = window.SR_GROUPS || [];
  return (
    <div>
      {groups.map((group) => {
        const rows = frames
          .map((frame, index) => ({ frame, index }))
          .filter((item) => item.frame.group === group.id);
        if (!rows.length) return null;
        return (
          <div key={group.id}>
            <div className="poc-row-label">
              <span className="mi" data-i={group.icon}></span>
              {group.num} · {group.title} · {rows.length} states
            </div>
            <div className="poc-board">
              {rows.map((item) => (
                <SrlFrame
                  key={item.index}
                  frame={item.frame}
                  index={item.index}
                  active={active}
                  onSelectFrame={onSelectFrame}
                />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

Object.assign(window, { SalaahRulesBoard });
