// Masjid Explore — pincode search · static storyboard row (one frame per visible state).
// Board imports it via:
//   <x-import component="PincodeRow" from="./storyboards/pincode-row.jsx" active="{{ pincodeActive }}">
// `active` = index of the frame the live device currently shows (-1 = none).

const FRAMES = [
  { name: 'Empty state', query: '', focused: false },
  { name: 'Typing — suggestions', query: '5600', focused: true },
  { name: 'Results', query: '560064', focused: true },
];

function PincodeRow({ active = -1 }) {
  const { PincodeScreen } = window;
  return (
    <div>
      <div className="poc-row-label">
        <span className="mi" data-i="search"></span>
        04 · Explore Masjids — pincode search · {FRAMES.length} states
      </div>
      <div className="poc-board">
        {FRAMES.map((f, i) => {
          const isActive = active === i;
          return (
            <div key={i} className="poc-board-item">
              <div className={`noor-frame ${isActive ? 'is-active' : ''}`} style={{ '--s': '0.46' }}>
                <div className="noor-frame-inner">
                  <div className="noor-screen">
                    <div className="noor-island"></div>
                    <PincodeScreen query={f.query} focused={f.focused} />
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

Object.assign(window, { PincodeRow });
