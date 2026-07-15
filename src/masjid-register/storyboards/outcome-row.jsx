// Row 03 — Outcome. Static frames for the post-submit states:
//   0 · Submitting  1 · Pending (under review)  2 · Rejected
// Renders the shared OutcomeScreen from ./screens.jsx.

const OUTCOME_FRAMES = [
  { name: 'Submitting', data: { variant: 'submitting' } },
  { name: 'Under review', data: { variant: 'pending', contactName: 'Salim Shaikh', masjidSummaryName: 'Masjid-e-Noor', role: 'Chairman', submittedDate: '5 Jul 2026' } },
  { name: 'Rejected', data: { variant: 'rejected', contactName: 'Salim Shaikh' } }
];

function frame(f, globalIdx, active, onSelectFrame) {
  const { OutcomeScreen } = window;
  const ring = active === globalIdx ? 'is-active' : '';
  return (
    <div key={globalIdx} className="poc-board-item" onClick={() => onSelectFrame && onSelectFrame(globalIdx)}>
      <div className={`noor-frame ${ring}`} style={{ '--s': '0.46', cursor: 'pointer' }}>
        <div className="noor-frame-inner">
          <div className="noor-screen">
            <div className="noor-island"></div>
            {OutcomeScreen && <OutcomeScreen data={f.data} />}
            <div className="noor-home"></div>
          </div>
        </div>
      </div>
      <div className="poc-frame-caption">{globalIdx + 1} · {f.name}</div>
    </div>
  );
}

function OutcomeRow({ active = -1, onSelectFrame, offset = 16 }) {
  return (
    <div>
      <div className="poc-row-label"><span className="mi" data-i="verified"></span> 04 · Outcome · {OUTCOME_FRAMES.length} states</div>
      <div className="poc-board">
        {OUTCOME_FRAMES.map((f, k) => frame(f, offset + k, active, onSelectFrame))}
      </div>
    </div>
  );
}

Object.assign(window, { OutcomeRow });
