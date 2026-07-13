// Masjid Explore — QR scan · static storyboard row (one frame per visible state).
// Board imports it via:
//   <x-import component="QrRow" from="./storyboards/qr-row.jsx" active="{{ qrActive }}">
// `active` = index of the frame the live device currently shows (-1 = none).

const FRAMES = [
  { name: 'Scanning', scanning: true },
  { name: 'Masjid found', scanning: false },
];

function QrRow({ active = -1 }) {
  const { QRScreen } = window;
  return (
    <div>
      <div className="poc-row-label">
        <span className="mi" data-i="qr_code_scanner"></span>
        03 · Explore Masjids — QR scan · {FRAMES.length} states
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
                    <QRScreen scanning={f.scanning} />
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

Object.assign(window, { QrRow });
