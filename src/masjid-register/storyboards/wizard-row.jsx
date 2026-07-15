// Row 02 — Register wizard. One static frame per step (11):
//   pincode · searching · claim-list · claim-empty · register · contact · role · maslak · photo · selfie · review
// Renders the shared WizardScreen from ./screens.jsx with representative per-step data.

function buildClaimResults(selectedId) {
  return (window.MASJID_CLAIM_DATA || []).map((m) => ({ ...m, selected: m.id === selectedId }));
}

// Built per-render (not at module load) so window.MASJID_CLAIM_DATA from screens.jsx is populated.
function wizardFrames() {
  return [
  { name: 'Pincode', data: { step: 'pincode', progressIndex: 1, ctaLabel: 'Continue', ctaDisabled: true, pincode: '' } },
  { name: 'Searching', data: { step: 'searching', progressIndex: 1, ctaLabel: 'Continue', ctaDisabled: true, pincode: '400001' } },
  { name: 'Claim list', data: { step: 'claimList', progressIndex: 2, ctaLabel: 'Continue', ctaDisabled: false, pincode: '400001', claimResults: buildClaimResults(1) } },
  { name: 'No results', data: { step: 'claimEmpty', progressIndex: 2, ctaLabel: 'Register manually', ctaDisabled: false, pincode: '560001' } },
  { name: 'Register details', data: { step: 'register', progressIndex: 2, ctaLabel: 'Continue', ctaDisabled: false, masjidName: 'Masjid-e-Noor', address: 'Kabutar Khana', city: 'Mumbai', stateVal: 'Maharashtra', pincode: '400016', pinDropped: true } },
  { name: 'Contact name', data: { step: 'contact', progressIndex: 3, ctaLabel: 'Continue', ctaDisabled: false, contactName: 'Salim Shaikh' } },
  { name: 'Role', data: { step: 'role', progressIndex: 4, ctaLabel: 'Continue', ctaDisabled: false, roleDisplay: 'Chairman', roleFilled: true } },
  { name: 'Maslak', data: { step: 'maslak', progressIndex: 5, ctaLabel: 'Continue', ctaDisabled: false, maslakDisplay: 'Ahle Hadith', maslakFilled: true } },
  { name: 'Masjid photo', data: { step: 'photo', progressIndex: 6, ctaLabel: 'Skip for now', ctaDisabled: false, showSkipLink: false, photoTaken: false } },
  { name: 'Identity selfie', data: { step: 'selfie', progressIndex: 7, ctaLabel: 'Continue', ctaDisabled: false, selfieTaken: true, cameraDenied: false } },
  { name: 'Review & submit', data: { step: 'review', progressIndex: 8, ctaLabel: 'Submit for verification', ctaDisabled: false, masjidLocked: false, masjidSummaryName: 'Masjid-e-Noor', masjidSummaryAddr: 'Kabutar Khana, Mumbai, Maharashtra', contactName: 'Salim Shaikh', role: 'Chairman', maslak: 'Ahle Hadith', photoTaken: true } }
  ];
}

function frame(f, globalIdx, active, onSelectFrame) {
  const { WizardScreen } = window;
  const ring = active === globalIdx ? 'is-active' : '';
  return (
    <div key={globalIdx} className="poc-board-item" onClick={() => onSelectFrame && onSelectFrame(globalIdx)}>
      <div className={`noor-frame ${ring}`} style={{ '--s': '0.46', cursor: 'pointer' }}>
        <div className="noor-frame-inner">
          <div className="noor-screen">
            <div className="noor-island"></div>
            {WizardScreen && <WizardScreen data={f.data} />}
            <div className="noor-home"></div>
          </div>
        </div>
      </div>
      <div className="poc-frame-caption">{globalIdx + 1} · {f.name}</div>
    </div>
  );
}

function WizardRow({ active = -1, onSelectFrame, offset = 5 }) {
  const frames = wizardFrames();
  return (
    <div>
      <div className="poc-row-label"><span className="mi" data-i="add_home_work"></span> 03 · Register wizard · {frames.length} states</div>
      <div className="poc-board">
        {frames.map((f, k) => frame(f, offset + k, active, onSelectFrame))}
      </div>
    </div>
  );
}

Object.assign(window, { WizardRow });
