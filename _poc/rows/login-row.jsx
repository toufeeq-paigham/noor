// Login flow — static storyboard row (7 states)
// Rendered on the Onboarding board via:
//   <x-import component="LoginRow" from="./_poc/rows/login-row.jsx" active="{{ loginActive }}">
// `active` = index 0-6 of the state the live device is currently in (-1 = none).
// Frames are baked static snapshots — the live prototype is the device on the right.

function LoginRow({ active = -1 }) {
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
<div class="poc-board-item">
        <div class="noor-frame ${a(3)}" style="--s:0.46">
          <div class="noor-frame-inner">
            <div class="noor-screen">
              <div class="noor-island"></div>
              <div style="width:100%;height:100%;background:var(--color-surface-primary);display:flex;flex-direction:column;padding:62px 24px 0;box-sizing:border-box;position:relative;overflow:hidden">

                <!-- SMS notification banner (static) -->
                <div style="position:absolute;top:16px;left:12px;right:12px;z-index:100;background:var(--color-surface-overlay);border:1px solid var(--color-neutral-border);border-radius:16px;padding:12px 14px;backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);box-shadow:var(--sheet-shadow);display:flex;gap:12px;align-items:flex-start">
                  <div style="width:42px;height:42px;border-radius:10px;background:linear-gradient(135deg,#5E6AD2,#8B9DDF);display:flex;align-items:center;justify-content:center;flex-shrink:0;position:relative">
                    <span class="material-symbols-rounded" style="font-size:22px;color:#fff;font-variation-settings:'FILL' 1">corporate_fare</span>
                    <div style="position:absolute;bottom:-3px;right:-3px;width:16px;height:16px;background:#30D158;border-radius:50%;border:2px solid var(--color-surface-overlay);display:flex;align-items:center;justify-content:center">
                      <span class="material-symbols-rounded" style="font-size:9px;color:#fff;font-variation-settings:'FILL' 1">chat_bubble</span>
                    </div>
                  </div>
                  <div style="flex:1;min-width:0">
                    <div style="display:flex;justify-content:space-between;align-items:baseline;margin-bottom:2px">
                      <span style="font-family:-apple-system,system-ui;font-size:14px;font-weight:600;color:var(--color-info-primary)">PAIGHM-S</span>
                      <span style="font-family:-apple-system,system-ui;font-size:13px;color:var(--color-info-secondary)">now</span>
                    </div>
                    <div style="font-family:-apple-system,system-ui;font-size:13px;color:var(--color-info-secondary);line-height:1.4;overflow:hidden;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical">353357&nbsp; is your OTP for Paigham App login. OTP is valid for 10 minutes. Do not...</div>
                  </div>
                </div>

                <!-- back button -->
                <div style="margin-top:8px">
                  <div style="width:40px;height:40px;border-radius:50%;background:var(--color-action-background);display:flex;align-items:center;justify-content:center">
                    <span class="material-symbols-rounded" style="font-size:20px;color:var(--color-info-primary)">arrow_back</span>
                  </div>
                </div>

                <div style="display:flex;flex-direction:column;flex:1;min-height:0">
                  <div style="margin-top:32px">
                    <div style="font-family:'DM Serif Display',Georgia,serif;font-size:38px;line-height:1.15;color:var(--color-info-primary);letter-spacing:-0.5px;margin-bottom:12px">Enter OTP</div>
                    <div style="font-family:'Nunito',sans-serif;font-size:16px;line-height:1.55;color:var(--color-info-secondary);font-weight:400">Please enter the OTP sent to your phone number<br><span style="font-weight:700;color:var(--color-info-primary)">+91 81234 03269</span> <span style="font-weight:700;color:var(--color-action-primary);font-size:14px">· Edit</span></div>
                  </div>

                  <!-- 6-cell OTP input (static: empty) -->
                  <div style="margin-top:28px">
                    <div style="position:relative;background:var(--color-input-background);border-radius:16px;padding:2px;display:flex;box-sizing:border-box;border:1px solid transparent">
                      <div style="display:flex;flex:1;border-radius:14px;border:1px solid var(--color-input-border-disabled);overflow:hidden">
                        <div style="flex:1;height:46px;display:flex;align-items:center;justify-content:center;border-left:none"><span style="font-family:'Nunito',sans-serif;font-size:18px;font-weight:500;color:var(--color-input-text)"></span></div><div style="flex:1;height:46px;display:flex;align-items:center;justify-content:center;border-left:1px solid var(--color-input-border-disabled)"><span style="font-family:'Nunito',sans-serif;font-size:18px;font-weight:500;color:var(--color-input-text)"></span></div><div style="flex:1;height:46px;display:flex;align-items:center;justify-content:center;border-left:1px solid var(--color-input-border-disabled)"><span style="font-family:'Nunito',sans-serif;font-size:18px;font-weight:500;color:var(--color-input-text)"></span></div><div style="flex:1;height:46px;display:flex;align-items:center;justify-content:center;border-left:1px solid var(--color-input-border-disabled)"><span style="font-family:'Nunito',sans-serif;font-size:18px;font-weight:500;color:var(--color-input-text)"></span></div><div style="flex:1;height:46px;display:flex;align-items:center;justify-content:center;border-left:1px solid var(--color-input-border-disabled)"><span style="font-family:'Nunito',sans-serif;font-size:18px;font-weight:500;color:var(--color-input-text)"></span></div><div style="flex:1;height:46px;display:flex;align-items:center;justify-content:center;border-left:1px solid var(--color-input-border-disabled)"><span style="font-family:'Nunito',sans-serif;font-size:18px;font-weight:500;color:var(--color-input-text)"></span></div>
                      </div>
                    </div>
                  </div>

                  <!-- status line (static empty) -->
                  <div style="height:22px;margin-top:16px"></div>

                  <!-- resend -->
                  <div style="margin-top:8px;text-align:center;font-family:'Nunito',sans-serif;font-size:15px;color:var(--color-info-secondary)">
                    <span>Resend OTP in <span style="font-weight:700;color:var(--color-info-primary)">30s</span></span>
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
        <div class="poc-frame-caption">4 · OTP — SMS arrived</div>
      </div>
<div class="poc-board-item">
        <div class="noor-frame ${a(4)}" style="--s:0.46">
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
                  <div style="margin-top:32px">
                    <div style="font-family:'DM Serif Display',Georgia,serif;font-size:38px;line-height:1.15;color:var(--color-info-primary);letter-spacing:-0.5px;margin-bottom:12px">Enter OTP</div>
                    <div style="font-family:'Nunito',sans-serif;font-size:16px;line-height:1.55;color:var(--color-info-secondary);font-weight:400">Please enter the OTP sent to your phone number<br><span style="font-weight:700;color:var(--color-info-primary)">+91 81234 03269</span> <span style="font-weight:700;color:var(--color-action-primary);font-size:14px">· Edit</span></div>
                  </div>

                  <!-- 6-cell OTP input (static: 353 typed, halo on cell 4) -->
                  <div style="margin-top:28px">
                    <div style="position:relative;background:var(--color-input-background);border-radius:16px;padding:2px;display:flex;box-sizing:border-box;border:1px solid transparent">
                      <div style="display:flex;flex:1;border-radius:14px;border:1px solid var(--color-input-border-disabled);overflow:hidden">
                        <div style="flex:1;height:46px;display:flex;align-items:center;justify-content:center;border-left:none"><span style="font-family:'Nunito',sans-serif;font-size:18px;font-weight:500;color:var(--color-input-text)">3</span></div><div style="flex:1;height:46px;display:flex;align-items:center;justify-content:center;border-left:1px solid var(--color-input-border-disabled)"><span style="font-family:'Nunito',sans-serif;font-size:18px;font-weight:500;color:var(--color-input-text)">5</span></div><div style="flex:1;height:46px;display:flex;align-items:center;justify-content:center;border-left:1px solid var(--color-input-border-disabled)"><span style="font-family:'Nunito',sans-serif;font-size:18px;font-weight:500;color:var(--color-input-text)">3</span></div><div style="flex:1;height:46px;display:flex;align-items:center;justify-content:center;border-left:1px solid var(--color-input-border-disabled)"><span style="font-family:'Nunito',sans-serif;font-size:18px;font-weight:500;color:var(--color-input-text)"></span></div><div style="flex:1;height:46px;display:flex;align-items:center;justify-content:center;border-left:1px solid var(--color-input-border-disabled)"><span style="font-family:'Nunito',sans-serif;font-size:18px;font-weight:500;color:var(--color-input-text)"></span></div><div style="flex:1;height:46px;display:flex;align-items:center;justify-content:center;border-left:1px solid var(--color-input-border-disabled)"><span style="font-family:'Nunito',sans-serif;font-size:18px;font-weight:500;color:var(--color-input-text)"></span></div>
                      </div>
                      <div style="position:absolute;top:0;bottom:0;left:calc(2px + 3 * (100% - 4px) / 6);width:calc((100% - 4px)/6);border-radius:0;border:1px solid color-mix(in oklab, var(--color-input-border-focused) 50%, transparent);pointer-events:none"></div>
                    </div>
                  </div>

                  <!-- status line (static empty) -->
                  <div style="height:22px;margin-top:16px"></div>

                  <!-- resend -->
                  <div style="margin-top:8px;text-align:center;font-family:'Nunito',sans-serif;font-size:15px;color:var(--color-info-secondary)">
                    <span>Resend OTP in <span style="font-weight:700;color:var(--color-info-primary)">30s</span></span>
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
        <div class="poc-frame-caption">5 · OTP — typing</div>
      </div>
<div class="poc-board-item">
        <div class="noor-frame ${a(5)}" style="--s:0.46">
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
                  <div style="margin-top:32px">
                    <div style="font-family:'DM Serif Display',Georgia,serif;font-size:38px;line-height:1.15;color:var(--color-info-primary);letter-spacing:-0.5px;margin-bottom:12px">Enter OTP</div>
                    <div style="font-family:'Nunito',sans-serif;font-size:16px;line-height:1.55;color:var(--color-info-secondary);font-weight:400">Please enter the OTP sent to your phone number<br><span style="font-weight:700;color:var(--color-info-primary)">+91 81234 03269</span> <span style="font-weight:700;color:var(--color-action-primary);font-size:14px">· Edit</span></div>
                  </div>

                  <!-- 6-cell OTP input (static: wrong code 111111, error border) -->
                  <div style="margin-top:28px">
                    <div style="position:relative;background:var(--color-input-background);border-radius:16px;padding:2px;display:flex;box-sizing:border-box;border:1px solid color-mix(in oklab, var(--color-input-border-error) 50%, transparent)">
                      <div style="display:flex;flex:1;border-radius:14px;border:1px solid var(--color-input-border-disabled);overflow:hidden">
                        <div style="flex:1;height:46px;display:flex;align-items:center;justify-content:center;border-left:none"><span style="font-family:'Nunito',sans-serif;font-size:18px;font-weight:500;color:var(--color-status-error)">1</span></div><div style="flex:1;height:46px;display:flex;align-items:center;justify-content:center;border-left:1px solid var(--color-input-border-disabled)"><span style="font-family:'Nunito',sans-serif;font-size:18px;font-weight:500;color:var(--color-status-error)">1</span></div><div style="flex:1;height:46px;display:flex;align-items:center;justify-content:center;border-left:1px solid var(--color-input-border-disabled)"><span style="font-family:'Nunito',sans-serif;font-size:18px;font-weight:500;color:var(--color-status-error)">1</span></div><div style="flex:1;height:46px;display:flex;align-items:center;justify-content:center;border-left:1px solid var(--color-input-border-disabled)"><span style="font-family:'Nunito',sans-serif;font-size:18px;font-weight:500;color:var(--color-status-error)">1</span></div><div style="flex:1;height:46px;display:flex;align-items:center;justify-content:center;border-left:1px solid var(--color-input-border-disabled)"><span style="font-family:'Nunito',sans-serif;font-size:18px;font-weight:500;color:var(--color-status-error)">1</span></div><div style="flex:1;height:46px;display:flex;align-items:center;justify-content:center;border-left:1px solid var(--color-input-border-disabled)"><span style="font-family:'Nunito',sans-serif;font-size:18px;font-weight:500;color:var(--color-status-error)">1</span></div>
                      </div>
                    </div>
                  </div>

                  <!-- status line (static error) -->
                  <div style="height:22px;margin-top:16px;display:flex;align-items:center;justify-content:center">
                    <span style="font-family:'Nunito',sans-serif;font-size:13px;font-weight:700;color:var(--color-status-error)">Incorrect OTP — use the code from the SMS above</span>
                  </div>

                  <!-- resend -->
                  <div style="margin-top:8px;text-align:center;font-family:'Nunito',sans-serif;font-size:15px;color:var(--color-info-secondary)">
                    <span>Resend OTP in <span style="font-weight:700;color:var(--color-info-primary)">30s</span></span>
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
        <div class="poc-frame-caption">6 · OTP — incorrect</div>
      </div>
<div class="poc-board-item">
        <div class="noor-frame ${a(6)}" style="--s:0.46">
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
                  <div style="margin-top:32px">
                    <div style="font-family:'DM Serif Display',Georgia,serif;font-size:38px;line-height:1.15;color:var(--color-info-primary);letter-spacing:-0.5px;margin-bottom:12px">Enter OTP</div>
                    <div style="font-family:'Nunito',sans-serif;font-size:16px;line-height:1.55;color:var(--color-info-secondary);font-weight:400">Please enter the OTP sent to your phone number<br><span style="font-weight:700;color:var(--color-info-primary)">+91 81234 03269</span> <span style="font-weight:700;color:var(--color-action-primary);font-size:14px">· Edit</span></div>
                  </div>

                  <!-- 6-cell OTP input (static: 353357 verified, success border) -->
                  <div style="margin-top:28px">
                    <div style="position:relative;background:var(--color-input-background);border-radius:16px;padding:2px;display:flex;box-sizing:border-box;border:1px solid color-mix(in oklab, var(--color-action-primary) 50%, transparent)">
                      <div style="display:flex;flex:1;border-radius:14px;border:1px solid var(--color-input-border-disabled);overflow:hidden">
                        <div style="flex:1;height:46px;display:flex;align-items:center;justify-content:center;border-left:none"><span style="font-family:'Nunito',sans-serif;font-size:18px;font-weight:500;color:var(--color-action-primary)">3</span></div><div style="flex:1;height:46px;display:flex;align-items:center;justify-content:center;border-left:1px solid var(--color-input-border-disabled)"><span style="font-family:'Nunito',sans-serif;font-size:18px;font-weight:500;color:var(--color-action-primary)">5</span></div><div style="flex:1;height:46px;display:flex;align-items:center;justify-content:center;border-left:1px solid var(--color-input-border-disabled)"><span style="font-family:'Nunito',sans-serif;font-size:18px;font-weight:500;color:var(--color-action-primary)">3</span></div><div style="flex:1;height:46px;display:flex;align-items:center;justify-content:center;border-left:1px solid var(--color-input-border-disabled)"><span style="font-family:'Nunito',sans-serif;font-size:18px;font-weight:500;color:var(--color-action-primary)">3</span></div><div style="flex:1;height:46px;display:flex;align-items:center;justify-content:center;border-left:1px solid var(--color-input-border-disabled)"><span style="font-family:'Nunito',sans-serif;font-size:18px;font-weight:500;color:var(--color-action-primary)">5</span></div><div style="flex:1;height:46px;display:flex;align-items:center;justify-content:center;border-left:1px solid var(--color-input-border-disabled)"><span style="font-family:'Nunito',sans-serif;font-size:18px;font-weight:500;color:var(--color-action-primary)">7</span></div>
                      </div>
                    </div>
                  </div>

                  <!-- status line (static success) -->
                  <div style="height:22px;margin-top:16px;display:flex;align-items:center;justify-content:center;gap:6px">
                    <span class="material-symbols-rounded" style="font-size:18px;color:var(--color-action-primary);font-variation-settings:'FILL' 1">check_circle</span>
                    <span style="font-family:'Nunito',sans-serif;font-size:13px;font-weight:700;color:var(--color-action-primary)">Verified — taking you home</span>
                  </div>

                  <!-- resend (hidden on success) -->
                  <div style="margin-top:8px"></div>
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
        <div class="poc-frame-caption">7 · OTP — verified</div>
      </div>
`;
  return (
    <div style={{ marginTop: 56 }}>
      <div className="poc-row-label"><span className="material-symbols-rounded">login</span> 02 · Login — phone &amp; OTP · 7 states</div>
      <div className="poc-board" dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  );
}

Object.assign(window, { LoginRow });
