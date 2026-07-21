// Dua & Dikhr — deterministic journey and recovery states.
// Rendered on the board via:
//   <x-import component="DuaRow" from="./storyboards/dua-row.jsx" active="{{ duaActive }}">
// `active` = index of the frame the live device currently shows (-1 = none).

const STORYBOARD_FRAMES = [
  { name: 'Home tab — Dua & Dikhr card', isHome: true },
  { name: 'Categories — loading', kind: 'categories', state: 'loading' },
  { name: 'Categories — content', kind: 'categories' },
  { name: 'Categories — empty', kind: 'categories', state: 'empty' },
  { name: 'Categories — error + retry', kind: 'categories', state: 'error' },
  { name: 'Favourites — empty', kind: 'categories', tab: 'fav' },
  { name: 'Favourites — saved duas', kind: 'categories', tab: 'fav', populated: true },
  { name: 'Chapters — loading', kind: 'list', state: 'loading' },
  { name: 'Chapters — content', kind: 'list' },
  { name: 'Chapters — empty', kind: 'list', state: 'empty' },
  { name: 'Chapters — error + retry', kind: 'list', state: 'error' },
  { name: 'Reader — loading', kind: 'detail', state: 'loading' },
  { name: 'Reader — deep-link target', kind: 'detail' },
  { name: 'Reader — audio loading', kind: 'detail', audioIdx: 0, audioLoading: true },
  { name: 'Reader — audio playing', kind: 'detail', audioIdx: 0 },
  { name: 'Reader — audio error + recovery', kind: 'detail', audioError: 'Audio could not be loaded. Check your connection and retry.' }
];

function DuaRow({ active = -1, onSelectFrame }) {
  return (
    <div>
      <div className="poc-row-label">
        <span className="mi" data-i="volunteer_activism"></span>
        01 · Dua &amp; Dikhr — Hisnul Muslim → chapters → reader · {STORYBOARD_FRAMES.length} states
      </div>
      <div className="poc-board">
        {STORYBOARD_FRAMES.map((f, i) => {
          const isActive = active === i;
          const ringClass = isActive ? 'is-active' : '';

          let screenContent = null;
          if (f.isHome) {
            const { HomeScreen, BottomNav } = window;
            screenContent = (
              <div style={{ display: 'flex', flexDirection: 'column', height: '100%', position: 'relative' }}>
                <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
                  {HomeScreen ? <HomeScreen /> : <div style={{ padding: 20, color: 'var(--color-info-secondary)' }}>Loading Home...</div>}
                </div>
                {BottomNav ? <BottomNav activeIndex={0} /> : null}
              </div>
            );
          } else if (f.kind === 'categories') {
            const { CategoriesScreen } = window;
            screenContent = CategoriesScreen && <CategoriesScreen activeTab={f.tab || 'dua'} state={f.state || 'content'} favourites={f.populated ? window.FAVOURITE_ITEMS : []} />;
          } else if (f.kind === 'list') {
            const { DuaListScreen } = window;
            screenContent = DuaListScreen && <DuaListScreen categoryName="All" state={f.state || 'content'} />;
          } else {
            const { DuaDetailScreen } = window;
            const playing = f.audioIdx != null;
            screenContent = DuaDetailScreen && (
              <DuaDetailScreen
                title="When waking up"
                favorites={{}}
                audioIdx={playing ? f.audioIdx : -1}
                audioPlaying={playing}
                audioProgress={playing ? 7 : 0}
                audioLoading={!!f.audioLoading}
                state={f.state || 'content'}
                audioError={f.audioError}
              />
            );
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

Object.assign(window, { DuaRow, DUA_STORYBOARD_FRAMES: STORYBOARD_FRAMES });
