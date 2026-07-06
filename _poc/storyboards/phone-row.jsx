// Phone login flow — static storyboard row (3 states)
// Rendered on the Onboarding board via:
//   <x-import component="PhoneRow" from="./_poc/storyboards/phone-row.jsx" active="{{ phoneActive }}">
// `active` = index 0-2 of the state the live device is currently in (-1 = none).

function PhoneRow({ active = -1 }) {
  const a = (i) => (active === i ? 'is-active' : '');
  const html = `
<div class="poc-board-item">
        <div class="noor-frame ${a(0)}" style="--s:0.46">
          <div class="noor-frame-inner">
            <div class="noor-screen">
              <div class="noor-island"></div>
              <div style="width:100%;height:100%;background:var(--color-surface-primary);display:flex;flex-direction:column;padding:62px 24px 0;box-sizing:border-box;position:relative;overflow:hidden">

                <!-- back button -->
                <div style="margin-top:8px">
                  <div style="width:40px;height:40px;border-radius:50%;background:var(--color-action-background);display:flex;align-items:center;justify-content:center">
                    <span class="material-symbols-rounded" style="font-size:20px;color:var(--color-info-primary)">arrow_back</span>
                  </div>
                </div>

                <div style="display:flex;flex-direction:column;flex:1;min-height:0">
                  <div style="margin-top:38px">
                    <div style="font-family:'DM Serif Display',Georgia,serif;font-size:38px;line-height:1.15;color:var(--color-info-primary);letter-spacing:-0.5px;margin-bottom:12px">Let's get started</div>
                    <div style="font-family:'Nunito',sans-serif;font-size:16px;line-height:1.55;color:var(--color-info-secondary);font-weight:400">Enter your phone number to receive a verification code.</div>
                  </div>

                  <!-- phone input (static: empty, masked placeholder) -->
                  <div style="margin-top:28px">
                    <div style="position:relative;background:var(--color-input-background);border-radius:16px;padding:2px;min-height:46px;box-sizing:border-box">
                      <div style="display:flex;align-items:center;border-radius:14px;border:1px solid var(--color-input-border-disabled);box-sizing:border-box">
                        <div style="display:flex;align-items:center;gap:7px;padding:0 12px 0 14px;white-space:nowrap;flex-shrink:0">
                          <span style="font-size:18px;line-height:1">🇮🇳</span>
                          <span style="color:var(--color-input-text);font-family:'Nunito',sans-serif;font-size:16px;font-weight:600">+91</span>
                        </div>
                        <div style="width:1px;align-self:stretch;margin:11px 0;background:var(--color-input-border-disabled);flex-shrink:0"></div>
                        <div style="flex:1;padding:11px 14px;font-family:'Nunito',sans-serif;font-size:17px;letter-spacing:.5px;color:var(--color-input-text);min-width:0">
                          <span style="color:var(--color-input-placeholder)">00000 00000</span>
                        </div>
                      </div>
                      <div style="position:absolute;top:1px;bottom:1px;right:1px;left:88px;border-radius:0 16px 16px 0;border:1px solid transparent;pointer-events:none"></div>
                    </div>
                    <div style="height:20px;margin-top:6px"></div>
                  </div>

                  <!-- CTA (disabled look) -->
                  <div style="margin-top:20px;opacity:.5">
                    <div style="height:52px;border-radius:16px;background:var(--color-action-primary);display:flex;align-items:center;justify-content:center;box-shadow:none">
                      <span style="font-family:'Nunito',sans-serif;font-size:16px;font-weight:700;color:var(--color-action-primary-inverse)">Continue</span>
                    </div>
                  </div>
                  <div style="flex:1"></div>
                </div>

                <!-- Paigham wordmark -->
                <div style="text-align:center;padding-bottom:18px">
                  <span style="font-family:'Noto Nastaliq Urdu','AlQuran IndoPak',serif;font-size:30px;color:var(--color-info-primary);opacity:.85;direction:rtl">پیغام</span>
                </div>

                <!-- keypad (static) -->
                <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;padding-bottom:30px">
                  <div style="height:52px;border-radius:12px;background:var(--color-action-background);display:flex;flex-direction:column;align-items:center;justify-content:center;user-select:none"><span style="display:flex;flex-direction:column;align-items:center;line-height:1"><span style="font-family:'Nunito',sans-serif;font-size:22px;font-weight:600;color:var(--color-info-primary)">1</span><span style="font-family:'Nunito',sans-serif;font-size:9px;font-weight:700;letter-spacing:.12em;color:var(--color-info-secondary);height:10px;margin-top:2px"></span></span></div><div style="height:52px;border-radius:12px;background:var(--color-action-background);display:flex;flex-direction:column;align-items:center;justify-content:center;user-select:none"><span style="display:flex;flex-direction:column;align-items:center;line-height:1"><span style="font-family:'Nunito',sans-serif;font-size:22px;font-weight:600;color:var(--color-info-primary)">2</span><span style="font-family:'Nunito',sans-serif;font-size:9px;font-weight:700;letter-spacing:.12em;color:var(--color-info-secondary);height:10px;margin-top:2px">ABC</span></span></div><div style="height:52px;border-radius:12px;background:var(--color-action-background);display:flex;flex-direction:column;align-items:center;justify-content:center;user-select:none"><span style="display:flex;flex-direction:column;align-items:center;line-height:1"><span style="font-family:'Nunito',sans-serif;font-size:22px;font-weight:600;color:var(--color-info-primary)">3</span><span style="font-family:'Nunito',sans-serif;font-size:9px;font-weight:700;letter-spacing:.12em;color:var(--color-info-secondary);height:10px;margin-top:2px">DEF</span></span></div><div style="height:52px;border-radius:12px;background:var(--color-action-background);display:flex;flex-direction:column;align-items:center;justify-content:center;user-select:none"><span style="display:flex;flex-direction:column;align-items:center;line-height:1"><span style="font-family:'Nunito',sans-serif;font-size:22px;font-weight:600;color:var(--color-info-primary)">4</span><span style="font-family:'Nunito',sans-serif;font-size:9px;font-weight:700;letter-spacing:.12em;color:var(--color-info-secondary);height:10px;margin-top:2px">GHI</span></span></div><div style="height:52px;border-radius:12px;background:var(--color-action-background);display:flex;flex-direction:column;align-items:center;justify-content:center;user-select:none"><span style="display:flex;flex-direction:column;align-items:center;line-height:1"><span style="font-family:'Nunito',sans-serif;font-size:22px;font-weight:600;color:var(--color-info-primary)">5</span><span style="font-family:'Nunito',sans-serif;font-size:9px;font-weight:700;letter-spacing:.12em;color:var(--color-info-secondary);height:10px;margin-top:2px">JKL</span></span></div><div style="height:52px;border-radius:12px;background:var(--color-action-background);display:flex;flex-direction:column;align-items:center;justify-content:center;user-select:none"><span style="display:flex;flex-direction:column;align-items:center;line-height:1"><span style="font-family:'Nunito',sans-serif;font-size:22px;font-weight:600;color:var(--color-info-primary)">6</span><span style="font-family:'Nunito',sans-serif;font-size:9px;font-weight:700;letter-spacing:.12em;color:var(--color-info-secondary);height:10px;margin-top:2px">MNO</span></span></div><div style="height:52px;border-radius:12px;background:var(--color-action-background);display:flex;flex-direction:column;align-items:center;justify-content:center;user-select:none"><span style="display:flex;flex-direction:column;align-items:center;line-height:1"><span style="font-family:'Nunito',sans-serif;font-size:22px;font-weight:600;color:var(--color-info-primary)">7</span><span style="font-family:'Nunito',sans-serif;font-size:9px;font-weight:700;letter-spacing:.12em;color:var(--color-info-secondary);height:10px;margin-top:2px">PQRS</span></span></div><div style="height:52px;border-radius:12px;background:var(--color-action-background);display:flex;flex-direction:column;align-items:center;justify-content:center;user-select:none"><span style="display:flex;flex-direction:column;align-items:center;line-height:1"><span style="font-family:'Nunito',sans-serif;font-size:22px;font-weight:600;color:var(--color-info-primary)">8</span><span style="font-family:'Nunito',sans-serif;font-size:9px;font-weight:700;letter-spacing:.12em;color:var(--color-info-secondary);height:10px;margin-top:2px">TUV</span></span></div><div style="height:52px;border-radius:12px;background:var(--color-action-background);display:flex;flex-direction:column;align-items:center;justify-content:center;user-select:none"><span style="display:flex;flex-direction:column;align-items:center;line-height:1"><span style="font-family:'Nunito',sans-serif;font-size:22px;font-weight:600;color:var(--color-info-primary)">9</span><span style="font-family:'Nunito',sans-serif;font-size:9px;font-weight:700;letter-spacing:.12em;color:var(--color-info-secondary);height:10px;margin-top:2px">WXYZ</span></span></div><div style="height:52px;border-radius:12px;background:transparent"></div><div style="height:52px;border-radius:12px;background:var(--color-action-background);display:flex;flex-direction:column;align-items:center;justify-content:center;user-select:none"><span style="display:flex;flex-direction:column;align-items:center;line-height:1"><span style="font-family:'Nunito',sans-serif;font-size:22px;font-weight:600;color:var(--color-info-primary)">0</span><span style="font-family:'Nunito',sans-serif;font-size:9px;font-weight:700;letter-spacing:.12em;color:var(--color-info-secondary);height:10px;margin-top:2px"></span></span></div><div style="height:52px;border-radius:12px;background:transparent;display:flex;align-items:center;justify-content:center"><span class="material-symbols-rounded" style="font-size:22px;color:var(--color-info-primary)">backspace</span></div>
                </div>

              </div>
              <div class="noor-home"></div>
            </div>
          </div>
        </div>
        <div class="poc-frame-caption">1 · Phone — empty</div>
      </div>
<div class="poc-board-item">
        <div class="noor-frame ${a(1)}" style="--s:0.46">
          <div class="noor-frame-inner">
            <div class="noor-screen">
              <div class="noor-island"></div>
              <div style="width:100%;height:100%;background:var(--color-surface-primary);display:flex;flex-direction:column;padding:62px 24px 0;box-sizing:border-box;position:relative;overflow:hidden">

                <!-- back button -->
                <div style="margin-top:8px">
                  <div style="width:40px;height:40px;border-radius:50%;background:var(--color-action-background);display:flex;align-items:center;justify-content:center">
                    <span class="material-symbols-rounded" style="font-size:20px;color:var(--color-info-primary)">arrow_back</span>
                  </div>
                </div>

                <div style="display:flex;flex-direction:column;flex:1;min-height:0">
                  <div style="margin-top:38px">
                    <div style="font-family:'DM Serif Display',Georgia,serif;font-size:38px;line-height:1.15;color:var(--color-info-primary);letter-spacing:-0.5px;margin-bottom:12px">Let's get started</div>
                    <div style="font-family:'Nunito',sans-serif;font-size:16px;line-height:1.55;color:var(--color-info-secondary);font-weight:400">Enter your phone number to receive a verification code.</div>
                  </div>

                  <!-- phone input (static: sample number filled) -->
                  <div style="margin-top:28px">
                    <div style="position:relative;background:var(--color-input-background);border-radius:16px;padding:2px;min-height:46px;box-sizing:border-box">
                      <div style="display:flex;align-items:center;border-radius:14px;border:1px solid var(--color-input-border-disabled);box-sizing:border-box">
                        <div style="display:flex;align-items:center;gap:7px;padding:0 12px 0 14px;white-space:nowrap;flex-shrink:0">
                          <span style="font-size:18px;line-height:1">🇮🇳</span>
                          <span style="color:var(--color-input-text);font-family:'Nunito',sans-serif;font-size:16px;font-weight:600">+91</span>
                        </div>
                        <div style="width:1px;align-self:stretch;margin:11px 0;background:var(--color-input-border-disabled);flex-shrink:0"></div>
                        <div style="flex:1;padding:11px 14px;font-family:'Nunito',sans-serif;font-size:17px;letter-spacing:.5px;color:var(--color-input-text);min-width:0">
                          <span>81234 03269</span>
                        </div>
                      </div>
                      <div style="position:absolute;top:1px;bottom:1px;right:1px;left:88px;border-radius:0 16px 16px 0;border:1px solid transparent;pointer-events:none"></div>
                    </div>
                    <div style="height:20px;margin-top:6px"></div>
                  </div>

                  <!-- CTA -->
                  <div style="margin-top:20px;opacity:1">
                    <div style="height:52px;border-radius:16px;background:var(--color-action-primary);display:flex;align-items:center;justify-content:center;box-shadow:var(--shadow-button)">
                      <span style="font-family:'Nunito',sans-serif;font-size:16px;font-weight:700;color:var(--color-action-primary-inverse)">Continue</span>
                    </div>
                  </div>
                  <div style="flex:1"></div>
                </div>

                <!-- Paigham wordmark -->
                <div style="text-align:center;padding-bottom:18px">
                  <span style="font-family:'Noto Nastaliq Urdu','AlQuran IndoPak',serif;font-size:30px;color:var(--color-info-primary);opacity:.85;direction:rtl">پیغام</span>
                </div>

                <!-- keypad (static) -->
                <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;padding-bottom:30px">
                  <div style="height:52px;border-radius:12px;background:var(--color-action-background);display:flex;flex-direction:column;align-items:center;justify-content:center;user-select:none"><span style="display:flex;flex-direction:column;align-items:center;line-height:1"><span style="font-family:'Nunito',sans-serif;font-size:22px;font-weight:600;color:var(--color-info-primary)">1</span><span style="font-family:'Nunito',sans-serif;font-size:9px;font-weight:700;letter-spacing:.12em;color:var(--color-info-secondary);height:10px;margin-top:2px"></span></span></div><div style="height:52px;border-radius:12px;background:var(--color-action-background);display:flex;flex-direction:column;align-items:center;justify-content:center;user-select:none"><span style="display:flex;flex-direction:column;align-items:center;line-height:1"><span style="font-family:'Nunito',sans-serif;font-size:22px;font-weight:600;color:var(--color-info-primary)">2</span><span style="font-family:'Nunito',sans-serif;font-size:9px;font-weight:700;letter-spacing:.12em;color:var(--color-info-secondary);height:10px;margin-top:2px">ABC</span></span></div><div style="height:52px;border-radius:12px;background:var(--color-action-background);display:flex;flex-direction:column;align-items:center;justify-content:center;user-select:none"><span style="display:flex;flex-direction:column;align-items:center;line-height:1"><span style="font-family:'Nunito',sans-serif;font-size:22px;font-weight:600;color:var(--color-info-primary)">3</span><span style="font-family:'Nunito',sans-serif;font-size:9px;font-weight:700;letter-spacing:.12em;color:var(--color-info-secondary);height:10px;margin-top:2px">DEF</span></span></div><div style="height:52px;border-radius:12px;background:var(--color-action-background);display:flex;flex-direction:column;align-items:center;justify-content:center;user-select:none"><span style="display:flex;flex-direction:column;align-items:center;line-height:1"><span style="font-family:'Nunito',sans-serif;font-size:22px;font-weight:600;color:var(--color-info-primary)">4</span><span style="font-family:'Nunito',sans-serif;font-size:9px;font-weight:700;letter-spacing:.12em;color:var(--color-info-secondary);height:10px;margin-top:2px">GHI</span></span></div><div style="height:52px;border-radius:12px;background:var(--color-action-background);display:flex;flex-direction:column;align-items:center;justify-content:center;user-select:none"><span style="display:flex;flex-direction:column;align-items:center;line-height:1"><span style="font-family:'Nunito',sans-serif;font-size:22px;font-weight:600;color:var(--color-info-primary)">5</span><span style="font-family:'Nunito',sans-serif;font-size:9px;font-weight:700;letter-spacing:.12em;color:var(--color-info-secondary);height:10px;margin-top:2px">JKL</span></span></div><div style="height:52px;border-radius:12px;background:var(--color-action-background);display:flex;flex-direction:column;align-items:center;justify-content:center;user-select:none"><span style="display:flex;flex-direction:column;align-items:center;line-height:1"><span style="font-family:'Nunito',sans-serif;font-size:22px;font-weight:600;color:var(--color-info-primary)">6</span><span style="font-family:'Nunito',sans-serif;font-size:9px;font-weight:700;letter-spacing:.12em;color:var(--color-info-secondary);height:10px;margin-top:2px">MNO</span></span></div><div style="height:52px;border-radius:12px;background:var(--color-action-background);display:flex;flex-direction:column;align-items:center;justify-content:center;user-select:none"><span style="display:flex;flex-direction:column;align-items:center;line-height:1"><span style="font-family:'Nunito',sans-serif;font-size:22px;font-weight:600;color:var(--color-info-primary)">7</span><span style="font-family:'Nunito',sans-serif;font-size:9px;font-weight:700;letter-spacing:.12em;color:var(--color-info-secondary);height:10px;margin-top:2px">PQRS</span></span></div><div style="height:52px;border-radius:12px;background:var(--color-action-background);display:flex;flex-direction:column;align-items:center;justify-content:center;user-select:none"><span style="display:flex;flex-direction:column;align-items:center;line-height:1"><span style="font-family:'Nunito',sans-serif;font-size:22px;font-weight:600;color:var(--color-info-primary)">8</span><span style="font-family:'Nunito',sans-serif;font-size:9px;font-weight:700;letter-spacing:.12em;color:var(--color-info-secondary);height:10px;margin-top:2px">TUV</span></span></div><div style="height:52px;border-radius:12px;background:var(--color-action-background);display:flex;flex-direction:column;align-items:center;justify-content:center;user-select:none"><span style="display:flex;flex-direction:column;align-items:center;line-height:1"><span style="font-family:'Nunito',sans-serif;font-size:22px;font-weight:600;color:var(--color-info-primary)">9</span><span style="font-family:'Nunito',sans-serif;font-size:9px;font-weight:700;letter-spacing:.12em;color:var(--color-info-secondary);height:10px;margin-top:2px">WXYZ</span></span></div><div style="height:52px;border-radius:12px;background:transparent"></div><div style="height:52px;border-radius:12px;background:var(--color-action-background);display:flex;flex-direction:column;align-items:center;justify-content:center;user-select:none"><span style="display:flex;flex-direction:column;align-items:center;line-height:1"><span style="font-family:'Nunito',sans-serif;font-size:22px;font-weight:600;color:var(--color-info-primary)">0</span><span style="font-family:'Nunito',sans-serif;font-size:9px;font-weight:700;letter-spacing:.12em;color:var(--color-info-secondary);height:10px;margin-top:2px"></span></span></div><div style="height:52px;border-radius:12px;background:transparent;display:flex;align-items:center;justify-content:center"><span class="material-symbols-rounded" style="font-size:22px;color:var(--color-info-primary)">backspace</span></div>
                </div>

              </div>
              <div class="noor-home"></div>
            </div>
          </div>
        </div>
        <div class="poc-frame-caption">2 · Phone — filled</div>
      </div>
<div class="poc-board-item">
        <div class="noor-frame ${a(2)}" style="--s:0.46">
          <div class="noor-frame-inner">
            <div class="noor-screen">
              <div class="noor-island"></div>
              <div style="width:100%;height:100%;background:var(--color-surface-primary);display:flex;flex-direction:column;padding:62px 24px 0;box-sizing:border-box;position:relative;overflow:hidden">

                <!-- back button -->
                <div style="margin-top:8px">
                  <div style="width:40px;height:40px;border-radius:50%;background:var(--color-action-background);display:flex;align-items:center;justify-content:center">
                    <span class="material-symbols-rounded" style="font-size:20px;color:var(--color-info-primary)">arrow_back</span>
                  </div>
                </div>

                <div style="display:flex;flex-direction:column;flex:1;min-height:0">
                  <div style="margin-top:38px">
                    <div style="font-family:'DM Serif Display',Georgia,serif;font-size:38px;line-height:1.15;color:var(--color-info-primary);letter-spacing:-0.5px;margin-bottom:12px">Let's get started</div>
                    <div style="font-family:'Nunito',sans-serif;font-size:16px;line-height:1.55;color:var(--color-info-secondary);font-weight:400">Enter your phone number to receive a verification code.</div>
                  </div>

                  <!-- phone input (static: partial number, error border) -->
                  <div style="margin-top:28px">
                    <div style="position:relative;background:var(--color-input-background);border-radius:16px;padding:2px;min-height:46px;box-sizing:border-box">
                      <div style="display:flex;align-items:center;border-radius:14px;border:1px solid color-mix(in oklab, var(--color-input-border-error) 50%, transparent);box-sizing:border-box">
                        <div style="display:flex;align-items:center;gap:7px;padding:0 12px 0 14px;white-space:nowrap;flex-shrink:0">
                          <span style="font-size:18px;line-height:1">🇮🇳</span>
                          <span style="color:var(--color-input-text);font-family:'Nunito',sans-serif;font-size:16px;font-weight:600">+91</span>
                        </div>
                        <div style="width:1px;align-self:stretch;margin:11px 0;background:var(--color-input-border-disabled);flex-shrink:0"></div>
                        <div style="flex:1;padding:11px 14px;font-family:'Nunito',sans-serif;font-size:17px;letter-spacing:.5px;color:var(--color-input-text);min-width:0">
                          <span>81234</span><span style="color:var(--color-input-placeholder)"> 00000</span>
                        </div>
                      </div>
                      <div style="position:absolute;top:1px;bottom:1px;right:1px;left:88px;border-radius:0 16px 16px 0;border:1px solid transparent;pointer-events:none"></div>
                    </div>
                    <div style="height:20px;margin-top:6px">
                      <span style="font-family:'Nunito',sans-serif;font-size:13px;color:var(--color-input-text-error);font-weight:600">Please enter a valid 10-digit number</span>
                    </div>
                  </div>

                  <!-- CTA (disabled look) -->
                  <div style="margin-top:20px;opacity:.5">
                    <div style="height:52px;border-radius:16px;background:var(--color-action-primary);display:flex;align-items:center;justify-content:center;box-shadow:none">
                      <span style="font-family:'Nunito',sans-serif;font-size:16px;font-weight:700;color:var(--color-action-primary-inverse)">Continue</span>
                    </div>
                  </div>
                  <div style="flex:1"></div>
                </div>

                <!-- Paigham wordmark -->
                <div style="text-align:center;padding-bottom:18px">
                  <span style="font-family:'Noto Nastaliq Urdu','AlQuran IndoPak',serif;font-size:30px;color:var(--color-info-primary);opacity:.85;direction:rtl">پیغام</span>
                </div>

                <!-- keypad (static) -->
                <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;padding-bottom:30px">
                  <div style="height:52px;border-radius:12px;background:var(--color-action-background);display:flex;flex-direction:column;align-items:center;justify-content:center;user-select:none"><span style="display:flex;flex-direction:column;align-items:center;line-height:1"><span style="font-family:'Nunito',sans-serif;font-size:22px;font-weight:600;color:var(--color-info-primary)">1</span><span style="font-family:'Nunito',sans-serif;font-size:9px;font-weight:700;letter-spacing:.12em;color:var(--color-info-secondary);height:10px;margin-top:2px"></span></span></div><div style="height:52px;border-radius:12px;background:var(--color-action-background);display:flex;flex-direction:column;align-items:center;justify-content:center;user-select:none"><span style="display:flex;flex-direction:column;align-items:center;line-height:1"><span style="font-family:'Nunito',sans-serif;font-size:22px;font-weight:600;color:var(--color-info-primary)">2</span><span style="font-family:'Nunito',sans-serif;font-size:9px;font-weight:700;letter-spacing:.12em;color:var(--color-info-secondary);height:10px;margin-top:2px">ABC</span></span></div><div style="height:52px;border-radius:12px;background:var(--color-action-background);display:flex;flex-direction:column;align-items:center;justify-content:center;user-select:none"><span style="display:flex;flex-direction:column;align-items:center;line-height:1"><span style="font-family:'Nunito',sans-serif;font-size:22px;font-weight:600;color:var(--color-info-primary)">3</span><span style="font-family:'Nunito',sans-serif;font-size:9px;font-weight:700;letter-spacing:.12em;color:var(--color-info-secondary);height:10px;margin-top:2px">DEF</span></span></div><div style="height:52px;border-radius:12px;background:var(--color-action-background);display:flex;flex-direction:column;align-items:center;justify-content:center;user-select:none"><span style="display:flex;flex-direction:column;align-items:center;line-height:1"><span style="font-family:'Nunito',sans-serif;font-size:22px;font-weight:600;color:var(--color-info-primary)">4</span><span style="font-family:'Nunito',sans-serif;font-size:9px;font-weight:700;letter-spacing:.12em;color:var(--color-info-secondary);height:10px;margin-top:2px">GHI</span></span></div><div style="height:52px;border-radius:12px;background:var(--color-action-background);display:flex;flex-direction:column;align-items:center;justify-content:center;user-select:none"><span style="display:flex;flex-direction:column;align-items:center;line-height:1"><span style="font-family:'Nunito',sans-serif;font-size:22px;font-weight:600;color:var(--color-info-primary)">5</span><span style="font-family:'Nunito',sans-serif;font-size:9px;font-weight:700;letter-spacing:.12em;color:var(--color-info-secondary);height:10px;margin-top:2px">JKL</span></span></div><div style="height:52px;border-radius:12px;background:var(--color-action-background);display:flex;flex-direction:column;align-items:center;justify-content:center;user-select:none"><span style="display:flex;flex-direction:column;align-items:center;line-height:1"><span style="font-family:'Nunito',sans-serif;font-size:22px;font-weight:600;color:var(--color-info-primary)">6</span><span style="font-family:'Nunito',sans-serif;font-size:9px;font-weight:700;letter-spacing:.12em;color:var(--color-info-secondary);height:10px;margin-top:2px">MNO</span></span></div><div style="height:52px;border-radius:12px;background:var(--color-action-background);display:flex;flex-direction:column;align-items:center;justify-content:center;user-select:none"><span style="display:flex;flex-direction:column;align-items:center;line-height:1"><span style="font-family:'Nunito',sans-serif;font-size:22px;font-weight:600;color:var(--color-info-primary)">7</span><span style="font-family:'Nunito',sans-serif;font-size:9px;font-weight:700;letter-spacing:.12em;color:var(--color-info-secondary);height:10px;margin-top:2px">PQRS</span></span></div><div style="height:52px;border-radius:12px;background:var(--color-action-background);display:flex;flex-direction:column;align-items:center;justify-content:center;user-select:none"><span style="display:flex;flex-direction:column;align-items:center;line-height:1"><span style="font-family:'Nunito',sans-serif;font-size:22px;font-weight:600;color:var(--color-info-primary)">8</span><span style="font-family:'Nunito',sans-serif;font-size:9px;font-weight:700;letter-spacing:.12em;color:var(--color-info-secondary);height:10px;margin-top:2px">TUV</span></span></div><div style="height:52px;border-radius:12px;background:var(--color-action-background);display:flex;flex-direction:column;align-items:center;justify-content:center;user-select:none"><span style="display:flex;flex-direction:column;align-items:center;line-height:1"><span style="font-family:'Nunito',sans-serif;font-size:22px;font-weight:600;color:var(--color-info-primary)">9</span><span style="font-family:'Nunito',sans-serif;font-size:9px;font-weight:700;letter-spacing:.12em;color:var(--color-info-secondary);height:10px;margin-top:2px">WXYZ</span></span></div><div style="height:52px;border-radius:12px;background:transparent"></div><div style="height:52px;border-radius:12px;background:var(--color-action-background);display:flex;flex-direction:column;align-items:center;justify-content:center;user-select:none"><span style="display:flex;flex-direction:column;align-items:center;line-height:1"><span style="font-family:'Nunito',sans-serif;font-size:22px;font-weight:600;color:var(--color-info-primary)">0</span><span style="font-family:'Nunito',sans-serif;font-size:9px;font-weight:700;letter-spacing:.12em;color:var(--color-info-secondary);height:10px;margin-top:2px"></span></span></div><div style="height:52px;border-radius:12px;background:transparent;display:flex;align-items:center;justify-content:center"><span class="material-symbols-rounded" style="font-size:22px;color:var(--color-info-primary)">backspace</span></div>
                </div>

              </div>
              <div class="noor-home"></div>
            </div>
          </div>
        </div>
        <div class="poc-frame-caption">3 · Phone — invalid</div>
      </div>
`;
  return (
    <div style={{ marginTop: 56 }}>
      <div className="poc-row-label"><span className="material-symbols-rounded">phone_iphone</span> 02 · Phone Login · 3 states</div>
      <div className="poc-board" dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  );
}

Object.assign(window, { PhoneRow });
