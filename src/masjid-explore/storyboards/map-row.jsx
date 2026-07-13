// Masjid Explore — map view · static storyboard row (one frame per visible state).
// Board imports it via:
//   <x-import component="MapRow" from="./storyboards/map-row.jsx" active="{{ mapActive }}">
// `active` = index of the frame the live device currently shows (-1 = none).

// Each frame is a snapshot of the map view: which masjid is selected, and whether it's followed.
const FRAMES = [
  { name: 'Nearby — first result', selectedIdx: 0, followed: {} },
  { name: 'Following a masjid', selectedIdx: 0, followed: { 0: true } },
  { name: 'Another result selected', selectedIdx: 1, followed: { 0: true } },
];

function MapRow({ active = -1 }) {
  const { ExploreMapScreen } = window;
  return (
    <div>
      <div className="poc-row-label">
        <span className="mi" data-i="location_on"></span>
        01 · Explore Masjids — map view · {FRAMES.length} states
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
                    <ExploreMapScreen selectedIdx={f.selectedIdx} followed={f.followed} />
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

Object.assign(window, { MapRow });
