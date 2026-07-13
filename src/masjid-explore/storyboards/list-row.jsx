// Masjid Explore — list view · static storyboard row (one frame per visible state).
// Board imports it via:
//   <x-import component="ListRow" from="./storyboards/list-row.jsx" active="{{ listActive }}">
// `active` = index of the frame the live device currently shows (-1 = none).

const FRAMES = [
  { name: 'Nearby list', followed: {} },
  { name: 'Following a masjid', followed: { 1: true } },
];

function ListRow({ active = -1 }) {
  const { ExploreListScreen } = window;
  return (
    <div>
      <div className="poc-row-label">
        <span className="mi" data-i="format_list_bulleted"></span>
        02 · Explore Masjids — list view · {FRAMES.length} states
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
                    <ExploreListScreen followed={f.followed} />
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

Object.assign(window, { ListRow });
