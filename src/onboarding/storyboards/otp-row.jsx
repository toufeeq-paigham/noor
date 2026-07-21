// OTP verification flow — static storyboard row (7 states)
// Rendered on the Onboarding board via:
//   <x-import component="OtpRow" from="./_poc/storyboards/otp-row.jsx" active="{{ otpActive }}">
// `active` = index 0-6 of the state the live device is currently in (-1 = none).

const OTP_STATES = [
  { otp: "", otpError: false, verifying: false, success: false, resendIn: 30, resendStatus: "idle", smsVisible: true, name: "OTP — SMS arrived" },
  { otp: "3533", otpError: false, verifying: false, success: false, resendIn: 30, resendStatus: "idle", smsVisible: false, name: "OTP — typing" },
  { otp: "111111", otpError: true, verifying: false, success: false, resendIn: 30, resendStatus: "idle", smsVisible: false, name: "OTP — incorrect" },
  { otp: "", otpError: false, verifying: false, success: false, resendIn: 0, resendStatus: "sending", smsVisible: false, name: "OTP — resend sending" },
  { otp: "", otpError: false, verifying: false, success: false, resendIn: 30, resendStatus: "sent", smsVisible: false, name: "OTP — resend sent" },
  { otp: "", otpError: false, verifying: false, success: false, resendIn: 0, resendStatus: "error", smsVisible: false, name: "OTP — resend failed" },
  { otp: "353357", otpError: false, verifying: false, success: true, resendIn: 0, resendStatus: "idle", smsVisible: false, name: "OTP — verified" }
];

function OtpRow({ active = -1, onSelectFrame }) {
  const { OtpScreen } = window;
  return (
    <div>
      <div className="poc-row-label"><span className="mi" data-i="password"></span> 03 · OTP VERIFICATION · 7 STATES</div>
      <div className="poc-board">
        {OTP_STATES.map((s, i) => {
          const isActive = active === i;
          const ringClass = isActive ? 'is-active' : '';
          return (
            <div key={i} className="poc-board-item" onClick={() => onSelectFrame && onSelectFrame(i)}>
              <div className={`noor-frame ${ringClass}`} style={{ '--s': '0.46', cursor: onSelectFrame ? 'pointer' : 'default' }}>
                <div className="noor-frame-inner">
                  <div className="noor-screen">
                    <div className="noor-island"></div>
                    {OtpScreen && <OtpScreen
                      phoneFmt="81234 03269"
                      otp={s.otp}
                      otpError={s.otpError}
                      verifying={s.verifying}
                      success={s.success}
                      resendIn={s.resendIn}
                      resendStatus={s.resendStatus}
                      smsVisible={s.smsVisible}
                    />}
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
