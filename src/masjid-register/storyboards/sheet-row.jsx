// Row 02 — My Masjids sheet. The bottom sheet the entry points open, over the Profile tab:
//   0 · Manage tab   1 · Follow tab
// Renders the real ProfileScreen + the MyMasjidsSheet overlay from ./screens.jsx.

const noop = () => {};

function buildManageTiles(primaryId) {
  return (window.MASJID_MANAGE_DATA || []).map((m) => ({ ...m, isPrimary: m.id === primaryId }));
}
function buildFollowRows(checkedId) {
  const data = window.MASJID_FOLLOW_DATA || [];
  return data.map((f) => ({ ...f, checked: f.id === checkedId }));
}

function sheetFrames() {
  return [
    { name: 'Sheet · Manage + pending', tab: 'manage', primary: 'dargha', registration: true },
    { name: 'Sheet · Follow', tab: 'follow', primary: 'subhania' }
  ];
}

function frame(f, globalIdx, active, onSelectFrame) {
  const { ProfileScreen, MyMasjidsSheet, BottomNav } = window;
  const ring = active === globalIdx ? 'is-active' : '';
  const registration = f.registration ? { ...(window.MASJID_REGISTRATION_DATA || {}), onOpen: noop } : null;
  const data = { isOpen: true, tab: f.tab, manageTiles: buildManageTiles(f.primary), followRows: buildFollowRows(f.primary), registration, onClose: noop, onRegister: noop, onFind: noop };
  return (
    <div key={globalIdx} className="poc-board-item" onClick={() => onSelectFrame && onSelectFrame(globalIdx)}>
      <div className={`noor-frame ${ring}`} style={{ '--s': '0.46', cursor: 'pointer' }}>
        <div className="noor-frame-inner">
          <div className="noor-screen">
            <div className="noor-island"></div>
            {ProfileScreen && <ProfileScreen userName="Salim Shaikh" masjidName="Dargha Masjid 3" onMyMasjids={noop} />}
            {BottomNav && <BottomNav activeIndex={4} />}
            {MyMasjidsSheet && <MyMasjidsSheet data={data} />}
            <div className="noor-home"></div>
          </div>
        </div>
      </div>
      <div className="poc-frame-caption">{globalIdx + 1} · {f.name}</div>
    </div>
  );
}

function SheetRow({ active = -1, onSelectFrame, offset = 3 }) {
  const frames = sheetFrames();
  return (
    <div>
      <div className="poc-row-label"><span className="mi" data-i="mosque"></span> 02 · My Masjids sheet · {frames.length} states</div>
      <div className="poc-board">
        {frames.map((f, k) => frame(f, offset + k, active, onSelectFrame))}
      </div>
    </div>
  );
}

Object.assign(window, { SheetRow });
