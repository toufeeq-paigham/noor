// Phone login flow — static storyboard row (3 states)
// Rendered on the Onboarding board via:
//   <x-import component="PhoneRow" from="./_poc/storyboards/phone-row.jsx" active="{{ phoneActive }}">
// `active` = index 0-2 of the state the live device is currently in (-1 = none).

const PHONE_STATES = [
  { phoneDisplay: "", phoneMask: "00000 00000", phoneError: false, name: "Phone — empty" },
  { phoneDisplay: "81234 03269", phoneMask: "", phoneError: false, name: "Phone — filled" },
  { phoneDisplay: "81234 00000", phoneMask: "", phoneError: true, name: "Phone — invalid" }
];

function PhoneRow({ active = -1 }) {
  const { PhoneScreen } = window;
  return (
    <div>
      <div className="poc-row-label"><span className="material-symbols-rounded">phone_iphone</span> 02 · PHONE LOGIN · 3 STATES</div>
      <div className="poc-board">
        {PHONE_STATES.map((s, i) => {
          const isActive = active === i;
          const ringClass = isActive ? 'is-active' : '';
          return (
            <div key={i} className="poc-board-item">
              <div className={`noor-frame ${ringClass}`} style={{ '--s': '0.46' }}>
                <div className="noor-frame-inner">
                  <div className="noor-screen">
                    <div className="noor-island"></div>
                    <PhoneScreen
                      phoneDisplay={s.phoneDisplay}
                      phoneMask={s.phoneMask}
                      phoneError={s.phoneError}
                      phoneFocused={false}
                    />
                    <div className="noor-home"></div>
                  </div>
                </div>
              </div>
              <div className="poc-frame-caption">{i + 1} · {s.name}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

Object.assign(window, { PhoneRow });
