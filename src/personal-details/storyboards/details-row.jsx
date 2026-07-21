// Personal-details flow - static storyboard row (6 states)
// Rendered on the Personal Details board via:
//   <x-import component="DetailsRow" from="./storyboards/details-row.jsx" active="{{ detailsActive }}">
// `active` is the selected state index (-1 = none).

const DETAILS_STATES = [
  { kind: 'form', name: '', gender: null, name_: 'Details — empty' },
  { kind: 'form', name: '', gender: null, nameError: true, genderError: true, name_: 'Details — validation error' },
  { kind: 'form', name: 'Toufeeq Ahamed', gender: 'male', name_: 'Details — filled' },
  { kind: 'form', name: 'Toufeeq Ahamed', gender: 'male', loading: true, name_: 'Details — saving' },
  { kind: 'form', name: 'Toufeeq Ahamed', gender: 'male', serviceError: true, name_: 'Details — service failure' },
  { kind: 'success', name_: 'Welcome (success)' }
];

function DetailsRow({ active = -1, onSelectFrame }) {
  const { PersonalDetailsScreen, SuccessScreen } = window;
  return (
    <div>
      <div className="poc-row-label"><span className="mi" data-i="person"></span> 01 · PERSONAL DETAILS · 6 STATES</div>
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
                      : (PersonalDetailsScreen && <PersonalDetailsScreen name={s.name} gender={s.gender} nameError={!!s.nameError} genderError={!!s.genderError} loading={!!s.loading} serviceError={!!s.serviceError} />)}
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
