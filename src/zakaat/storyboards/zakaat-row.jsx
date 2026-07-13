// Storyboard rows for Zakaat flow.
// Rendered on the Zakaat board.

const ZAKAAT_STEPS_FRAMES = [
  { name: 'Home tab — Zakaat tool link', isHome: true },
  { name: 'Zakaat — empty list', stage: 'empty' },
  { name: 'Zakaat — calculated list', stage: 'list', records: [{ id: 1, name: 'Zakaat 1', due: 0, date: 'Jul 10th, 2026', values: {} }] },
  { name: 'Loading rates...', stage: 'loading' },
  { name: 'Step 1/6 — Gold & Silver', stage: 'step', stepNum: 1 },
  { name: 'Step 2/6 — Cash & Bank (keypad active)', stage: 'step', stepNum: 2, activeField: 'bank', values: { cash: '100', bank: '15' } },
  { name: 'Step 3/6 — Investments', stage: 'step', stepNum: 3 },
  { name: 'Step 4/6 — Business And Farming', stage: 'step', stepNum: 4 },
  { name: 'Step 5/6 — Miscellaneous', stage: 'step', stepNum: 5 },
  { name: 'Step 6/6 — Deductibles', stage: 'step', stepNum: 6 }
];

const ZAKAAT_SUMMARY_FRAMES = [
  { name: 'Summary — breakdown table (empty assets)', stage: 'summary', values: {} },
  { name: 'Summary — breakdown table (sample assets)', stage: 'summary', values: { gold: '10', silver: '500', cash: '25000', bank: '45000', stocks: '15000', debts: '5000' } }
];

function ZakaatRow({ active = -1, onSelectFrame, section = 'steps' }) {
  const frames = section === 'summary' ? ZAKAAT_SUMMARY_FRAMES : ZAKAAT_STEPS_FRAMES;
  const label = section === 'summary'
    ? '02 · Zakaat Summary — breakdown table · 2 states'
    : '01 · Setup & Calculation Steps — 6-step entry · 10 states';
  const icon = section === 'summary' ? 'receipt_long' : 'calculate';

  return (
    <div>
      <div className="poc-row-label">
        <span className="mi" data-i={icon}></span>
        {label}
      </div>
      <div className="poc-board">
        {frames.map((f, i) => {
          const globalIdx = section === 'summary' ? i + 10 : i;
          const isActive = active === globalIdx;
          const ringClass = isActive ? 'is-active' : '';

          const { ZakaatEmptyScreen, ZakaatListScreen, ZakaatLoadingScreen, ZakaatStepScreen, ZakaatSummaryScreen, HomeScreen, BottomNav } = window;
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
          } else if (f.stage === 'empty') {
            screenContent = ZakaatEmptyScreen ? <ZakaatEmptyScreen /> : <div>Loading...</div>;
          } else if (f.stage === 'list') {
            screenContent = ZakaatListScreen ? <ZakaatListScreen records={f.records} /> : <div>Loading...</div>;
          } else if (f.stage === 'loading') {
            screenContent = ZakaatLoadingScreen ? <ZakaatLoadingScreen /> : <div>Loading...</div>;
          } else if (f.stage === 'step') {
            screenContent = ZakaatStepScreen ? (
              <ZakaatStepScreen 
                step={f.stepNum} 
                values={f.values || {}} 
                activeField={f.activeField || null}
              />
            ) : <div>Loading...</div>;
          } else if (f.stage === 'summary') {
            screenContent = ZakaatSummaryScreen ? <ZakaatSummaryScreen values={f.values} /> : <div>Loading...</div>;
          }

          return (
            <div key={i} className="poc-board-item" onClick={() => onSelectFrame && onSelectFrame(globalIdx)}>
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

Object.assign(window, { ZakaatRow, ZAKAAT_STEPS_FRAMES, ZAKAAT_SUMMARY_FRAMES });
