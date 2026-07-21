// Qibla setup — static storyboard row (compass + permissions).
// Board imports it via:
//   <x-import component="SetupRow" from="./storyboards/setup-row.jsx" active="{{ setupActive }}" on-select-frame="{{ selectSetupFrame }}">
// `active` = index of the frame the live device currently shows (-1 = none).

const SETUP_FRAMES = [
  { name: 'Permissions', permissionState: 'request', qiblaRel: 300 },
  { name: 'Permission denied', permissionState: 'denied', qiblaRel: 300 },
  { name: 'Location services off', permissionState: 'services', qiblaRel: 300 },
  { name: 'Acquiring location', permissionState: 'locating', qiblaRel: 300 },
];

function SetupRow({ active = -1, onSelectFrame }) {
  const { InitialQiblaScreen } = window;
  return (
    <div>
      <div className="poc-row-label"><span className="mi" data-i="security"></span> 01 · Setup — request · recovery · locating · {SETUP_FRAMES.length} states</div>
      <div className="poc-board">
        {SETUP_FRAMES.map((f, i) => {
          const isActive = active === i;
          return (
            <div key={i} className="poc-board-item" onClick={() => onSelectFrame && onSelectFrame(i)}>
              <div className={`noor-frame ${isActive ? 'is-active' : ''}`} style={{ '--s': '0.46', cursor: onSelectFrame ? 'pointer' : 'default' }}>
                <div className="noor-frame-inner">
                  <div className="noor-screen">
                    <div className="noor-island"></div>
                    {InitialQiblaScreen && <InitialQiblaScreen permissionState={f.permissionState} qiblaRel={f.qiblaRel} />}
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

Object.assign(window, { SetupRow });
