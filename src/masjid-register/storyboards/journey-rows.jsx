// Register masjid journey storyboard.
// Each product screen owns one horizontal row containing its meaningful states.

const noop = () => {};
const ROLES = ['Imam', 'Chairman', 'Secretary', 'Trustee', 'Volunteer'];
const MASLAKS = ['Hanafi', 'Shafi\u2019i', 'Maliki', 'Hanbali', 'Ahle Hadith'];
const STATES = window.MASJID_STATE_LIST || [];

function baseData(overrides = {}) {
  return {
    step: 'pincode',
    progressIndex: 1,
    ctaLabel: 'Continue',
    ctaDisabled: false,
    ctaBusy: false,
    ctaFeedback: '',
    errors: {},
    pincode: '',
    claimResults: [],
    masjidName: 'Masjid-e-Noor',
    address: 'Kabutar Khana',
    city: 'Mumbai',
    stateVal: 'Maharashtra',
    pinDropped: true,
    locationExpanded: false,
    locationResolved: true,
    locationLookupFailed: false,
    contactName: 'Salim Shaikh',
    roleDisplay: 'Select your role',
    roleFilled: false,
    maslakDisplay: 'Select maslak',
    maslakFilled: false,
    stateSheetOpen: false,
    stateOptions: STATES.map((name) => ({ name, selected: name === 'Maharashtra', onSelect: noop })),
    roleOptions: ROLES.map((name) => ({ name, selected: false, onSelect: noop })),
    maslakOptions: MASLAKS.map((name) => ({ name, selected: false, onSelect: noop })),
    photoTaken: false,
    selfieTaken: false,
    photoSrc: null,
    selfieSrc: null,
    photoLocationAttached: false,
    captureLocationStatus: 'ready',
    capturePlace: 'Kabutar Khana, Mumbai',
    captureCoordinates: '19.0206, 72.8406',
    captureAccuracy: '±8 m',
    cameraMode: null,
    cameraStage: 'rationale',
    cameraPermission: 'unknown',
    masjidLocked: false,
    masjidSummaryName: 'Masjid-e-Noor',
    masjidSummaryAddr: 'Kabutar Khana, Mumbai, Maharashtra · 400016',
    role: 'Chairman',
    maslak: 'Ahle Hadith',
    onBack: noop,
    ctaOnClick: noop,
    onPincodeChange: noop,
    onRegisterManually: noop,
    onMasjidNameChange: noop,
    onAddressChange: noop,
    onCityChange: noop,
    onOpenStateSheet: noop,
    onTogglePin: noop,
    onToggleLocationExpanded: noop,
    onRecenterLocation: noop,
    onContactNameChange: noop,
    onOpenRoleSheet: noop,
    onOpenMaslakSheet: noop,
    onCloseSheets: noop,
    onTakePhoto: noop,
    onRetakePhoto: noop,
    onRemovePhoto: noop,
    onTakeSelfie: noop,
    onRetakeSelfie: noop,
    onAllowCamera: noop,
    onOpenCameraSettings: noop,
    onCloseCamera: noop,
    onCapture: noop,
    onRetakeCamera: noop,
    onUseCapture: noop,
    onRetryCaptureLocation: noop,
    onFlipCamera: noop,
    onToggleFlash: noop,
    onEditRegister: noop,
    onEditContact: noop,
    onEditRole: noop,
    onEditMaslak: noop,
    onEditPhoto: noop,
    onEditSelfie: noop,
    ...overrides,
  };
}

function claimResults(selectedId) {
  return (window.MASJID_CLAIM_DATA || []).map((masjid) => ({
    ...masjid,
    selected: masjid.id === selectedId,
    onSelect: noop,
  }));
}

function selectedOptions(items, selected) {
  return items.map((name) => ({ name, selected: name === selected, onSelect: noop }));
}

function journeyGroups() {
  return [
    {
      icon: 'location_on',
      label: '03 · Pincode lookup',
      frames: [
        { name: 'Empty', data: baseData() },
        { name: 'Validation feedback', data: baseData({ errors: { pincode: 'Enter a valid 6-digit pincode.' }, ctaFeedback: 'Check the highlighted field and try again.' }) },
        { name: 'Searching', data: baseData({ step: 'searching', pincode: '400001', ctaLabel: 'Searching nearby', ctaDisabled: true, ctaBusy: true }) },
      ],
    },
    {
      icon: 'travel_explore',
      label: '04 · Existing masjid search',
      frames: [
        { name: 'Choose masjid', data: baseData({ step: 'claimList', progressIndex: 2, pincode: '400001', claimResults: claimResults(null), errors: { claim: 'Choose your masjid, or add it manually.' }, ctaFeedback: 'Choose a masjid to continue.' }) },
        { name: 'Masjid selected', data: baseData({ step: 'claimList', progressIndex: 2, pincode: '400001', claimResults: claimResults(1) }) },
        { name: 'No result', data: baseData({ step: 'claimEmpty', progressIndex: 2, pincode: '560001', ctaLabel: 'Register manually' }) },
      ],
    },
    {
      icon: 'mosque',
      label: '05 · Masjid details and location',
      frames: [
        { name: 'Pincode auto-filled', data: baseData({ step: 'register', progressIndex: 2, pincode: '400016' }) },
        { name: 'Validation feedback', data: baseData({ step: 'register', progressIndex: 2, pincode: '400016', masjidName: '', address: '', city: '', stateVal: '', pinDropped: false, locationResolved: false, errors: { masjidName: 'Enter the masjid name.', address: 'Enter an address or nearby landmark.', city: 'Enter the city.', stateVal: 'Enter the state.', pinDropped: 'Pin the masjid entrance on the map.' }, ctaFeedback: 'Check the highlighted fields and try again.' }) },
        { name: 'Manual city fallback', data: baseData({ step: 'register', progressIndex: 2, pincode: '400016', city: '', stateVal: '', locationResolved: false, locationLookupFailed: true }) },
        { name: 'Expanded location', data: baseData({ step: 'register', progressIndex: 2, pincode: '400016', locationExpanded: true }) },
        { name: 'State selection sheet', data: baseData({ step: 'register', progressIndex: 2, pincode: '400016', stateSheetOpen: true }) },
      ],
    },
    {
      icon: 'person',
      label: '06 · Contact',
      frames: [
        { name: 'Filled', data: baseData({ step: 'contact', progressIndex: 3 }) },
        { name: 'Validation feedback', data: baseData({ step: 'contact', progressIndex: 3, contactName: '', errors: { contactName: 'Enter the name of the person we should contact.' }, ctaFeedback: 'Check the highlighted field and try again.' }) },
      ],
    },
    {
      icon: 'person',
      label: '07 · Role',
      frames: [
        { name: 'Unselected', data: baseData({ step: 'role', progressIndex: 4 }) },
        { name: 'Validation feedback', data: baseData({ step: 'role', progressIndex: 4, errors: { role: 'Select your role at this masjid.' }, ctaFeedback: 'Select a role to continue.' }) },
        { name: 'Frosted selection sheet', data: baseData({ step: 'role', progressIndex: 4, roleSheetOpen: true, roleOptions: selectedOptions(ROLES, 'Chairman') }) },
      ],
    },
    {
      icon: 'groups',
      label: '08 · Maslak',
      frames: [
        { name: 'Unselected', data: baseData({ step: 'maslak', progressIndex: 5 }) },
        { name: 'Validation feedback', data: baseData({ step: 'maslak', progressIndex: 5, errors: { maslak: 'Select the maslak followed by this masjid.' }, ctaFeedback: 'Select a maslak to continue.' }) },
        { name: 'Frosted selection sheet', data: baseData({ step: 'maslak', progressIndex: 5, maslakSheetOpen: true, maslakOptions: selectedOptions(MASLAKS, 'Ahle Hadith') }) },
      ],
    },
    {
      icon: 'photo_camera',
      label: '09 · Masjid photo',
      frames: [
        { name: 'Live capture', data: baseData({ step: 'photo', progressIndex: 6, ctaLabel: 'Continue' }) },
        { name: 'Permission rationale', data: baseData({ step: 'photo', progressIndex: 6, cameraMode: 'masjid', cameraPermission: 'unknown' }) },
        { name: 'Camera viewport', data: baseData({ step: 'photo', progressIndex: 6, cameraMode: 'masjid', cameraPermission: 'granted', cameraStage: 'ready' }) },
        { name: 'Exact capture review', data: baseData({ step: 'photo', progressIndex: 6, cameraMode: 'masjid', cameraPermission: 'granted', cameraStage: 'captured' }) },
        { name: 'Permission denied', data: baseData({ step: 'photo', progressIndex: 6, cameraMode: 'masjid', cameraPermission: 'denied' }) },
        { name: 'Photo and location added', data: baseData({ step: 'photo', progressIndex: 6, photoTaken: true, photoLocationAttached: true, photoSrc: '../images/masjid-camera-preview.png' }) },
        { name: 'Location unavailable', data: baseData({ step: 'photo', progressIndex: 6, cameraMode: 'masjid', cameraPermission: 'granted', cameraStage: 'ready', captureLocationStatus: 'unavailable' }) },
      ],
    },
    {
      icon: 'person',
      label: '10 · Identity photo',
      frames: [
        { name: 'Required photo', data: baseData({ step: 'selfie', progressIndex: 7, errors: { selfie: 'Add an identity photo to continue.' } }) },
        { name: 'Permission rationale', data: baseData({ step: 'selfie', progressIndex: 7, cameraMode: 'selfie', cameraPermission: 'unknown' }) },
        { name: 'Camera viewport', data: baseData({ step: 'selfie', progressIndex: 7, cameraMode: 'selfie', cameraPermission: 'granted', cameraStage: 'ready' }) },
        { name: 'Exact capture review', data: baseData({ step: 'selfie', progressIndex: 7, cameraMode: 'selfie', cameraPermission: 'granted', cameraStage: 'captured' }) },
        { name: 'Permission denied', data: baseData({ step: 'selfie', progressIndex: 7, cameraMode: 'selfie', cameraPermission: 'denied' }) },
        { name: 'Photo added', data: baseData({ step: 'selfie', progressIndex: 7, selfieTaken: true, selfieSrc: '../images/identity-camera-preview.png' }) },
      ],
    },
    {
      icon: 'receipt_long',
      label: '11 · Review and submit',
      frames: [
        { name: 'Complete submission', data: baseData({ step: 'review', progressIndex: 8, ctaLabel: 'Submit for verification', photoTaken: true, photoLocationAttached: true, selfieTaken: true, photoSrc: '../images/masjid-camera-preview.png', selfieSrc: '../images/identity-camera-preview.png' }) },
        { name: 'Optional photo skipped', data: baseData({ step: 'review', progressIndex: 8, ctaLabel: 'Submit for verification', photoTaken: false, selfieTaken: true, selfieSrc: '../images/identity-camera-preview.png' }) },
      ],
    },
  ];
}

function JourneyFrame({ frame, globalIndex, active, onSelectFrame }) {
  const { WizardScreen } = window;
  const ring = active === globalIndex ? 'is-active' : '';
  return (
    <div className="poc-board-item" onClick={() => onSelectFrame && onSelectFrame(globalIndex)}>
      <div className={`noor-frame ${ring}`} style={{ '--s': '0.46', cursor: 'pointer' }}>
        <div className="noor-frame-inner">
          <div className="noor-screen">
            <div className="noor-island"></div>
            {WizardScreen ? <WizardScreen data={frame.data} /> : null}
            <div className="noor-home"></div>
          </div>
        </div>
      </div>
      <div className="poc-frame-caption">{globalIndex + 1} · {frame.name}</div>
    </div>
  );
}

function JourneyRows({ active = -1, onSelectFrame, offset = 5 }) {
  let index = offset;
  return (
    <div>
      {journeyGroups().map((group) => {
        const start = index;
        index += group.frames.length;
        return (
          <div key={group.label}>
            <div className="poc-row-label"><span className="mi" data-i={group.icon}></span> {group.label} · {group.frames.length} states</div>
            <div className="poc-board">
              {group.frames.map((frame, frameIndex) => (
                <JourneyFrame key={frame.name} frame={frame} globalIndex={start + frameIndex} active={active} onSelectFrame={onSelectFrame} />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

Object.assign(window, { JourneyRows });
