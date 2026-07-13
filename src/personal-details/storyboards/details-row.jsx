// Personal-details flow — static storyboard row (3 states)
// Rendered on the Personal Details board via:
//   <x-import component="DetailsRow" from="./storyboards/details-row.jsx" active="{{ detailsActive }}">
// `active` = index 0-2 of the state the live device is currently in (-1 = none).
// Frames: 0 empty form · 1 filled form · 2 success celebration.

const DETAILS_STATES = [
  { kind: 'form', name: '', gender: null, name_: 'Details — empty' },
  { kind: 'form', name: '', gender: null, nameError: true, genderError: true, name_: 'Details — validation error' },
  { kind: 'form', name: 'Toufeeq Ahamed', gender: 'male', name_: 'Details — filled' },
  { kind: 'success', name_: 'Welcome (success)' }
];

function DetailsRow({ active = -1, onSelectFrame }) {
  const { PersonalDetailsScreen, SuccessScreen } = window;
  return (
    <div>
      <div className="poc-row-label"><span className="mi" data-i="person"></span> 01 · PERSONAL DETAILS · 4 STATES</div>
      <div className="poc-board">
        {DETAILS_STATES.map((s, i) => {
          const isActive = active === i;
          const ringClass = isActive ? 'is-active' : '';
          return (
            <div key={i} className="poc-board-item" onClick={() => onSelectFrame && onSelectFrame(i)}>
              <div className={`noor-frame ${ringClass}`} style={{ '--s': '0.46', cursor: onSelectFrame ? 'pointer' : 'default' }}>
                <div className="noor-frame-inner">
                  <div className="noor-screen">
                    <div className="noor-island"></div>
                    {s.kind === 'success'
                      ? (SuccessScreen && <SuccessScreen />)
                      : (PersonalDetailsScreen && <PersonalDetailsScreen name={s.name} gender={s.gender} nameError={!!s.nameError} genderError={!!s.genderError} />)}
                    <div className="noor-home"></div>
                  </div>
                </div>
              </div>
              <div className="poc-frame-caption">{i + 1} · {s.name_}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

Object.assign(window, { DetailsRow });
