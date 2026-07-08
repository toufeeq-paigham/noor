// OTP verification flow — static storyboard row (4 states)
// Rendered on the Onboarding board via:
//   <x-import component="OtpRow" from="./_poc/storyboards/otp-row.jsx" active="{{ otpActive }}">
// `active` = index 0-3 of the state the live device is currently in (-1 = none).

const OTP_STATES = [
  { otp: "", otpError: false, verifying: false, success: false, resendIn: 30, smsVisible: true, name: "OTP — SMS arrived" },
  { otp: "3533", otpError: false, verifying: false, success: false, resendIn: 30, smsVisible: false, name: "OTP — typing" },
  { otp: "111111", otpError: true, verifying: false, success: false, resendIn: 30, smsVisible: false, name: "OTP — incorrect" },
  { otp: "353357", otpError: false, verifying: false, success: true, resendIn: 0, smsVisible: false, name: "OTP — verified" }
];

function OtpRow({ active = -1 }) {
  const { OtpScreen } = window;
  return (
    <div>
      <div className="poc-row-label"><span className="mi" data-i="password"></span> 03 · OTP VERIFICATION · 4 STATES</div>
      <div className="poc-board">
        {OTP_STATES.map((s, i) => {
          const isActive = active === i;
          const ringClass = isActive ? 'is-active' : '';
          return (
            <div key={i} className="poc-board-item">
              <div className={`noor-frame ${ringClass}`} style={{ '--s': '0.46' }}>
                <div className="noor-frame-inner">
                  <div className="noor-screen">
                    <div className="noor-island"></div>
                    <OtpScreen
                      phoneFmt="81234 03269"
                      otp={s.otp}
                      otpError={s.otpError}
                      verifying={s.verifying}
                      success={s.success}
                      resendIn={s.resendIn}
                      smsVisible={s.smsVisible}
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

Object.assign(window, { OtpRow });
