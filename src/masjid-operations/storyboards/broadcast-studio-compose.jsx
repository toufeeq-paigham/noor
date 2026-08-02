// Compose a paigham — the guided send flow, built in the Masjid-registration wizard idiom
// (../masjid-register/storyboards/screens.jsx): one decision per screen, a segmented step
// bar, a docked primary action, full-screen capture stages, and a real review before commit.
//
// Product logic is unchanged from CreatePostScreen.kt / CreatePostStore:
//   · a paigham needs a message (≤1024) OR an uploaded audio recording — never both
//   · up to 4 images, each picked → cropped → uploaded before it counts
//   · one target: MASJID | MASJID_MASLAK | MASJID_PINCODE
//   · the send is confirmed before it happens, and cannot be edited afterwards
// The review STEP is that confirmation (it shows exactly what musalleen receive), which
// replaces the modal "Confirm Post Details" dialog — Compose parity change, flagged.

const CMP_FONT_B = 'var(--font-body)';
const CMP_FONT_T = 'var(--font-title)';

const CMP_STEPS = ['message', 'photos', 'audience', 'review'];

const CMP_AUDIENCE = [
  {
    value: 'MASJID', icon: 'mosque', label: 'My Masjid',
    reach: (m) => `${(m.stats.followers).toLocaleString('en-IN')} musalleen of ${m.name}`,
    note: 'Everyone who follows this masjid for timings and updates.',
  },
  {
    value: 'MASJID_MASLAK', icon: 'groups', label: 'My Maslak',
    reach: (m) => `Musalleen of masjids sharing ${m.maslak.replace(/\s*\(.*\)$/, '')}`,
    note: 'A wider circle — use it for programmes open to everyone.',
  },
  {
    value: 'MASJID_PINCODE', icon: 'location_on', label: 'My Pincode Area',
    reach: (m) => `Musalleen of masjids in ${(m.address.match(/\d{6}/) || [''])[0]}`,
    note: 'Neighbourhood reach — useful for local announcements.',
  },
];

// Sample library for the picker; the crop stage and thumbnails reuse the chosen one.
const CMP_LIBRARY = [
  { id: 'lib1', src: '../../images/masjid-camera-preview.png' },
  { id: 'lib2', src: '../../images/isha_masjid.webp' },
  { id: 'lib3', src: '../../images/maghrib_masjid.webp' },
  { id: 'lib4', src: '../../images/zohar_masjid.webp' },
  { id: 'lib5', src: '../../images/asr_masjid.webp' },
  { id: 'lib6', src: '../../images/follow_masjids.webp' },
];

// Static bar heights — a representative waveform, not a real extraction.
const CMP_WAVE = [34, 58, 42, 76, 94, 68, 50, 82, 64, 38, 56, 86, 70, 44, 60, 32, 52, 74, 88, 46, 36, 66, 78, 40, 62, 84, 48, 54];

const cmpMessageState = (post) => {
  const message = post.message || '';
  const trimmed = message.trim();
  const tooLong = message.length > (window.MAX_POST_MESSAGE || 1024);
  const audioReady = !!post.audio && !post.audio.uploading && !post.audio.failed;
  return { message, trimmed, tooLong, audioReady, hasContent: (trimmed.length > 0 && !tooLong) || audioReady };
};

// ── Wizard chrome ─────────────────────────────────────────────────────
function CmpStepBar({ index, onBack }) {
  return (
    <div className="cmp-appbar app-bar">
      <div className="cmp-appbar-row">
        <button className="ib ib-tonal" onClick={onBack} aria-label="Back">
          <span className="mi" data-i="arrow_back"></span>
        </button>
        <span className="screen-title cmp-appbar-title">Send a paigham</span>
        <span className="cmp-step-count">Step {index + 1} of {CMP_STEPS.length}</span>
      </div>
      <div className="stepbar" role="progressbar" aria-valuemin={1} aria-valuemax={CMP_STEPS.length} aria-valuenow={index + 1}>
        {CMP_STEPS.map((s, i) => <span key={s} className={i <= index ? 'on' : ''}></span>)}
      </div>
    </div>
  );
}

function CmpHead({ title, sub }) {
  return (
    <div className="cmp-head">
      <div className="cmp-title">{title}</div>
      {sub ? <div className="cmp-sub">{sub}</div> : null}
    </div>
  );
}

function CmpGuidance({ rows }) {
  return (
    <div className="photo-guidance-list">
      {rows.map((r) => (
        <div className="photo-guidance-row" key={r.title}>
          <span className="mi" data-i={r.icon}></span>
          <span><strong>{r.title}</strong><small>{r.copy}</small></span>
        </div>
      ))}
    </div>
  );
}

// ── Step 1 · message or voice ─────────────────────────────────────────
function CmpAudioCard({ audio, onToggle, onRemove, onRetry }) {
  return (
    <div className="cmp-audio-card">
      <div className="aplayer">
        <button className="ap-toggle" onClick={onToggle} aria-label={audio.playing ? 'Pause recording' : 'Play recording'}>
          <span className="mi fill" data-i={audio.playing ? 'pause' : 'play_arrow'}></span>
        </button>
        <span className="ap-time">{audio.duration}</span>
        <div className="ap-wave" aria-hidden="true">
          {CMP_WAVE.map((h, i) => (
            <i key={i} className={i / CMP_WAVE.length <= (audio.progress || 0) ? 'on' : ''} style={{ '--h': `${h}%` }}></i>
          ))}
          <span className="ap-head" style={{ left: `${(audio.progress || 0) * 100}%` }}></span>
        </div>
      </div>
      {audio.uploading ? (
        <div className="inline-loading-status" role="status"><span className="btn-spinner" aria-hidden="true"></span>Uploading your recording…</div>
      ) : null}
      {audio.failed ? (
        <div className="cmp-audio-failed" role="alert">
          <span className="mi" data-i="error"></span>
          <span>Upload failed — your recording is safe on this device.</span>
          <button className="btn btn-tonal" onClick={onRetry}>Retry upload</button>
        </div>
      ) : null}
      {!audio.uploading && !audio.failed ? (
        <div className="cmp-audio-ready">
          <span className="mi" data-i="check_circle"></span>
          <span>Voice paigham ready. It replaces the written message.</span>
        </div>
      ) : null}
      <button className="btn btn-link cmp-audio-remove" onClick={onRemove}>Remove recording and type instead</button>
    </div>
  );
}

function CmpMessageStep({ data }) {
  const post = data.post || {};
  const { message, tooLong } = cmpMessageState(post);
  const max = window.MAX_POST_MESSAGE || 1024;
  const hasAudio = !!post.audio;
  const photos = post.photos || [];

  return (
    <div>
      <CmpHead
        title="What's the paigham?"
        sub="Write it in your own words, or record your voice. Musalleen receive one or the other — whichever is easier for you."
      />

      {hasAudio ? (
        <CmpAudioCard
          audio={post.audio}
          onToggle={data.onToggleAudio}
          onRemove={data.onRemoveAudio}
          onRetry={data.onRetryAudio}
        />
      ) : (
        <>
          <div className={`input cmp-textarea ${tooLong ? 'error' : ''}`}>
            <div className="inner">
              <textarea
                className="val"
                value={message}
                rows={6}
                placeholder="Jumah bayan begins at 1:00 PM this week…"
                aria-label="Paigham message"
                onInput={(e) => data.onMessage && data.onMessage(e.target.value)}
              />
            </div>
          </div>
          <div className="cmp-counter-row">
            {tooLong
              ? <span className="helper err" role="alert">Too long by {message.length - max} characters.</span>
              : <span className="helper">Short and specific reads best on a phone.</span>}
            <span className={`cmp-counter ${tooLong ? 'over' : ''}`}>{message.length}/{max}</span>
          </div>

          <div className="cmp-or"><span className="eyebrow faint">or</span></div>

          <button className="btn btn-tonal lg cmp-record-cta" onClick={data.onOpenRecorder}>
            <span className="mi" data-i="mic"></span>
            Record a voice paigham
          </button>
          {post.micBlocked ? (
            <div className="cmp-mic-blocked" role="alert">
              <span className="mi" data-i="error"></span>
              <span>Microphone access is blocked. Enable it for Paigham in your phone's settings, then try again.</span>
            </div>
          ) : (
            <div className="cmp-record-note">Useful when the announcement is long, or easier said than typed.</div>
          )}
        </>
      )}

      {/* Entering through "Add photos" attaches them before the message is written, and the
          thumbnails only appear on step 2 — so step 1 has to say the photos are safely on
          the draft, or the author has no reason to believe the picker did anything. */}
      {photos.length ? (
        <div className="cmp-photos-attached">
          <span className="mi" data-i="photo_camera" aria-hidden="true"></span>
          <span>{photos.length === 1
            ? '1 photo attached — you can review it on the next step.'
            : `${photos.length} photos attached — you can review them on the next step.`}</span>
        </div>
      ) : null}
    </div>
  );
}

// ── Step 2 · photos ──────────────────────────────────────────────────
function CmpPhotoTile({ photo, index, onRemove, onRetry }) {
  return (
    <div className="cmp-photo">
      <img src={photo.src} alt={`Attached photo ${index + 1}`} />
      {photo.uploading ? (
        <span className="cmp-photo-veil"><span className="loader sm"></span></span>
      ) : null}
      {photo.failed ? (
        <button className="cmp-photo-veil failed" onClick={onRetry} aria-label={`Retry upload of photo ${index + 1}`}>
          <span className="mi" data-i="replay"></span>
          <small>Retry</small>
        </button>
      ) : null}
      {!photo.uploading && !photo.failed ? (
        <button className="cmp-photo-remove" onClick={onRemove} aria-label={`Remove photo ${index + 1}`}>
          <span className="mi" data-i="close"></span>
        </button>
      ) : null}
    </div>
  );
}

function CmpPhotosStep({ data }) {
  const post = data.post || {};
  const photos = post.photos || [];
  const max = window.MAX_POST_IMAGES || 4;

  return (
    <div>
      <CmpHead
        title="Add photos?"
        sub={`A notice, a poster, a photo of the programme. Up to ${max} — or skip this step.`}
      />

      {!photos.length ? (
        <div className="photo-guided-panel">
          <div className="photo-guided-preview">
            <img src={CMP_LIBRARY[0].src} alt="Example of a readable masjid notice photo" />
            <div className="photo-guided-frame" aria-hidden="true">
              <span className="photo-guide-corner top-left"></span>
              <span className="photo-guide-corner top-right"></span>
              <span className="photo-guide-corner bottom-left"></span>
              <span className="photo-guide-corner bottom-right"></span>
            </div>
          </div>
          <CmpGuidance rows={[
            { icon: 'filter_center_focus', title: 'Fill the frame', copy: 'Crop out the wall around a notice' },
            { icon: 'wb_sunny', title: 'Keep text readable', copy: 'Even light, no glare on the paper' },
          ]} />
          <button className="btn btn-tonal lg cmp-add-photo" onClick={data.onOpenPicker}>
            <span className="mi" data-i="add"></span>Choose photos
          </button>
        </div>
      ) : (
        <div>
          <div className="cmp-photo-grid">
            {photos.map((photo, i) => (
              <CmpPhotoTile
                key={photo.id}
                photo={photo}
                index={i}
                onRemove={() => data.onRemovePhoto && data.onRemovePhoto(i)}
                onRetry={() => data.onRetryPhoto && data.onRetryPhoto(i)}
              />
            ))}
            {photos.length < max ? (
              <button className="cmp-photo-add" onClick={data.onOpenPicker} aria-label="Add another photo">
                <span className="mi" data-i="add"></span>
                <small>Add</small>
              </button>
            ) : null}
          </div>
          <div className="cmp-photo-meta">
            <span className="badge sm teal">{photos.length} of {max} added</span>
            {photos.length >= max ? <span className="helper">That's the maximum for one paigham.</span> : null}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Step 3 · audience ────────────────────────────────────────────────
function CmpAudienceStep({ data }) {
  const post = data.post || {};
  const masjid = data.masjid || window.OPS_MASJID;
  const selected = post.audience || 'MASJID';
  return (
    <div>
      <CmpHead
        title="Who should see this?"
        sub="Start with your own musalleen. Widen it only when the paigham is for everyone."
      />
      <div className="choice-group cmp-audience-group" role="radiogroup" aria-label="Audience">
        {CMP_AUDIENCE.map((option) => {
          const on = option.value === selected;
          return (
            <button
              key={option.value}
              role="radio"
              aria-checked={on}
              className={`choice-card rich ${on ? 'selected' : ''}`}
              onClick={() => data.onAudience && data.onAudience(option.value)}
            >
              <span className="icon-tile" style={{ '--tile': '40px' }}><span className="mi" data-i={option.icon}></span></span>
              <span className="choice-card-copy">
                <strong>{option.label}</strong>
                <span>{option.reach(masjid)}</span>
                <small>{option.note}</small>
              </span>
              <span className="mi choice-card-mark" data-i={on ? 'radio_button_checked' : 'radio_button_unchecked'}></span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ── Step 4 · review — exactly what a musalli receives ────────────────
function CmpPostPreview({ data }) {
  const post = data.post || {};
  const masjid = data.masjid || window.OPS_MASJID;
  const photos = (post.photos || []).filter((p) => !p.uploading && !p.failed);
  const { trimmed, audioReady } = cmpMessageState(post);
  return (
    <div className="post-preview" aria-label="Preview of your paigham">
      <div className="post-preview-head">
        <span className="icon-tile accent" style={{ '--tile': '38px', borderRadius: 'var(--radius-circle)' }}>
          <span className="mi fill" data-i="mosque"></span>
        </span>
        <span className="post-preview-id">
          <strong>{masjid.name}</strong>
          <small>Just now · {(CMP_AUDIENCE.find((a) => a.value === (post.audience || 'MASJID')) || {}).label}</small>
        </span>
        <span className="badge sm jade">Live</span>
      </div>

      {audioReady ? (
        <div className="aplayer">
          <button className="ap-toggle" onClick={data.onToggleAudio} aria-label="Play recording">
            <span className="mi fill" data-i={post.audio.playing ? 'pause' : 'play_arrow'}></span>
          </button>
          <span className="ap-time">{post.audio.duration}</span>
          <div className="ap-wave" aria-hidden="true">
            {CMP_WAVE.map((h, i) => <i key={i} className={i / CMP_WAVE.length <= (post.audio.progress || 0) ? 'on' : ''} style={{ '--h': `${h}%` }}></i>)}
          </div>
        </div>
      ) : (
        <div className="post-preview-body">{trimmed}</div>
      )}

      {photos.length ? (
        <div className={`post-preview-photos count-${Math.min(photos.length, 4)}`}>
          {photos.map((p, i) => <img key={p.id} src={p.src} alt={`Photo ${i + 1}`} />)}
        </div>
      ) : null}

      <div className="post-preview-foot">
        <span className="rx-empty"><span className="mi" data-i="favorite"></span></span>
        <span>Musalleen can react as soon as it arrives.</span>
      </div>
    </div>
  );
}

// `onEdit` omitted → the row is a statement, not a control (one managed masjid has nothing
// to switch to), so no dead "Edit" affordance is rendered.
function CmpReviewRow({ label, value, onEdit, editLabel = 'Edit', last }) {
  return (
    <div className="cmp-review-row" style={last ? { borderBottom: 'none' } : undefined}>
      <span className="cmp-review-copy">
        <small>{label}</small>
        <strong>{value}</strong>
      </span>
      {onEdit ? <button className="btn btn-link" onClick={onEdit}>{editLabel}</button> : null}
    </div>
  );
}

function CmpReviewStep({ data }) {
  const post = data.post || {};
  const { trimmed, audioReady } = cmpMessageState(post);
  const photos = (post.photos || []).filter((p) => !p.uploading && !p.failed);
  const audience = CMP_AUDIENCE.find((a) => a.value === (post.audience || 'MASJID')) || CMP_AUDIENCE[0];
  return (
    <div>
      <CmpHead
        title="Ready to send?"
        sub="This is exactly what your musalleen receive, the moment you send it. A paigham cannot be edited afterwards — only deleted."
      />
      <CmpPostPreview data={data} />
      <div className="cmp-review-list">
        {/* Which masjid is speaking. Always stated — compose can be reached from the Qaum
            tab, where there is no console header naming the masjid — and changeable here
            rather than behind a picker before the wizard starts. */}
        <CmpReviewRow
          label="Sending from"
          value={(data.masjid || {}).name || 'This masjid'}
          editLabel="Change"
          onEdit={(data.managed || []).length > 1
            ? () => data.onOpenSwitcher && data.onOpenSwitcher()
            : null}
        />
        <CmpReviewRow
          label={audioReady ? 'Voice paigham' : 'Message'}
          value={audioReady ? `Recording · ${post.audio.duration}` : `${trimmed.length} characters`}
          onEdit={() => data.onGoToStep && data.onGoToStep('message')}
        />
        <CmpReviewRow
          label="Photos"
          value={photos.length ? `${photos.length} attached` : 'None'}
          onEdit={() => data.onGoToStep && data.onGoToStep('photos')}
        />
        <CmpReviewRow
          label="Audience"
          value={audience.label}
          onEdit={() => data.onGoToStep && data.onGoToStep('audience')}
          last
        />
      </div>
    </div>
  );
}

// ── Full-screen recorder stage (the CameraStage of audio) ─────────────
function CmpRecorderStage({ data }) {
  const post = data.post || {};
  const rec = post.recorder;
  if (!rec) return null;
  const reviewing = rec.stage === 'review';
  const blocked = rec.stage === 'blocked';

  return (
    <div className="camera-stage rec-stage">
      <div className="camera-topbar">
        <button className="ib ib-tonal camera-control rec-control" onClick={data.onCloseRecorder} aria-label="Close recorder">
          <span className="mi" data-i="close"></span>
        </button>
        <div className="camera-title">
          {blocked ? 'Microphone needed' : (reviewing ? 'Listen back' : 'Recording')}
          <small>
            {blocked
              ? 'Paigham needs the microphone to record'
              : (reviewing ? 'Keep it, or record it again' : 'Hold the phone close and speak clearly')}
          </small>
        </div>
        <div className="rec-control-spacer"></div>
      </div>

      {blocked ? (
        <div className="fullscreen-notice">
          <span className="mi" data-i="mic"></span>
          <strong>Microphone access is off</strong>
          <span>Enable the microphone for Paigham in your phone's settings, then come back — nothing you have written is lost.</span>
          <button className="btn btn-filled lg" onClick={data.onRetryMic}>Try again</button>
          <button className="btn btn-link" onClick={data.onCloseRecorder}>Type the paigham instead</button>
        </div>
      ) : (
        <>
          <div className="rec-stagearea">
            <div className={`rec-wave ${reviewing ? 'static' : 'live'}`} aria-hidden="true">
              {CMP_WAVE.map((h, i) => (
                <i key={i} style={{ '--h': `${h}%`, animationDelay: `${(i % 7) * 90}ms` }}></i>
              ))}
            </div>
            <div className="rec-time" role="status">{rec.elapsed || '0:00'}</div>
            {!reviewing ? (
              <div className="rec-live-label"><span className="ops-rec-dot"></span>Recording</div>
            ) : (
              <div className="rec-live-label calm"><span className="mi" data-i="check_circle"></span>Recorded</div>
            )}
          </div>

          {reviewing ? (
            <div className="rec-actions">
              <button className="btn btn-filled lg" onClick={data.onUseRecording}>
                <span className="mi" data-i="check"></span>Use this recording
              </button>
              <button className="btn btn-link" onClick={data.onStartRecording}>Record again</button>
            </div>
          ) : (
            <div className="rec-controls">
              <button className="rec-stop" onClick={data.onStopRecording} aria-label="Stop recording"></button>
              <div className="rec-hint">Tap to stop</div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

// ── Library picker + crop stage ──────────────────────────────────────
function CmpPickerSheet({ data }) {
  const post = data.post || {};
  if (!post.picker) return null;
  const remaining = (window.MAX_POST_IMAGES || 4) - (post.photos || []).length;
  return (
    <div className="dlg-scrim sheet" onClick={data.onClosePicker}>
      <div className="dlg cmp-picker" onClick={(e) => e.stopPropagation()}>
        <div className="dlg-handle"></div>
        <div className="cmp-picker-head">
          <span className="dlg-title">Recent photos</span>
          <button className="ib ib-tonal" onClick={data.onClosePicker} aria-label="Close photo library">
            <span className="mi" data-i="close"></span>
          </button>
        </div>
        <div className="dlg-desc">{remaining} more can be attached to this paigham.</div>
        <div className="cmp-picker-grid">
          {CMP_LIBRARY.map((item) => (
            <button key={item.id} className="cmp-picker-item" onClick={() => data.onPickPhoto && data.onPickPhoto(item.src)}>
              <img src={item.src} alt="" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function CmpCropStage({ data }) {
  const post = data.post || {};
  const crop = post.crop;
  if (!crop) return null;
  return (
    <div className="camera-stage cmp-crop">
      <div className="camera-topbar">
        <button className="ib ib-tonal camera-control" onClick={data.onCancelCrop} aria-label="Cancel crop">
          <span className="mi" data-i="close"></span>
        </button>
        <div className="camera-title">Crop photo<small>Keep the notice inside the frame</small></div>
        <button className="ib ib-tonal camera-control" onClick={data.onRotateCrop} aria-label="Rotate photo">
          <span className="mi" data-i="replay"></span>
        </button>
      </div>
      <div className="camera-viewport">
        <img src={crop.src} alt="" style={{ transform: `rotate(${crop.rotation || 0}deg)` }} />
        <div className="cmp-crop-frame" aria-hidden="true">
          <span></span><span></span><span></span><span></span>
        </div>
      </div>
      <div className="camera-capture-actions">
        <button className="btn btn-filled lg camera-use-photo" onClick={data.onUseCrop}>
          <span className="mi" data-i="check"></span>Use this photo
        </button>
        <button className="btn btn-link camera-retake-photo" onClick={data.onCancelCrop}>Choose a different photo</button>
      </div>
    </div>
  );
}

// Reuses the console's confirmation dialog (exported by ./screens.jsx) so the discard
// prompt is the same component the rest of the section uses.
function OpsConfirm(props) {
  const Impl = window.OpsConfirmDialog;
  return Impl ? <Impl {...props} /> : null;
}

// ── The screen ───────────────────────────────────────────────────────
function ComposePostScreen({ data = {} }) {
  const post = data.post || {};
  const step = post.step || 'message';
  const index = Math.max(0, CMP_STEPS.indexOf(step));
  const { hasContent, tooLong, trimmed, audioReady } = cmpMessageState(post);
  const photos = post.photos || [];
  const uploading = photos.some((p) => p.uploading) || (post.audio && post.audio.uploading);
  const failedAttachment = photos.some((p) => p.failed) || (post.audio && post.audio.failed);

  let ctaLabel = 'Continue';
  let ctaDisabled = false;
  let helper = null;

  if (step === 'message') {
    ctaDisabled = !hasContent || uploading;
    if (!hasContent && !tooLong) helper = 'Write a message or record your voice to continue.';
    if (tooLong) helper = 'Shorten the message to continue.';
    if (post.audio && post.audio.uploading) helper = 'Waiting for the recording to finish uploading…';
    if (post.audio && post.audio.failed) { ctaDisabled = true; helper = 'Retry the upload to continue.'; }
  } else if (step === 'photos') {
    ctaLabel = photos.length ? 'Continue' : 'Continue without photos';
    ctaDisabled = uploading || failedAttachment;
    if (uploading) helper = 'Waiting for the upload to finish…';
    if (failedAttachment) helper = 'Retry or remove the failed photo to continue.';
  } else if (step === 'audience') {
    ctaLabel = 'Review paigham';
  } else {
    ctaLabel = 'Send paigham';
    helper = 'It reaches every musalli straight away. You can delete it later if needed.';
  }

  return (
    <div className="cmp-screen bcs-compose-screen">
      <CmpStepBar index={index} onBack={data.onBack} />

      <div className="cmp-body">
        {step === 'message' ? <CmpMessageStep data={data} /> : null}
        {step === 'photos' ? <CmpPhotosStep data={data} /> : null}
        {step === 'audience' ? <CmpAudienceStep data={data} /> : null}
        {step === 'review' ? <CmpReviewStep data={data} /> : null}
      </div>

      <div className="docked-action">
        {post.submitting ? (
          <div className="inline-loading-status" role="status">
            <span className="btn-spinner" aria-hidden="true"></span>Sending your paigham…
          </div>
        ) : helper ? (
          <div className="docked-action-note">{helper}</div>
        ) : null}
        <button
          className="btn btn-filled lg"
          disabled={ctaDisabled || post.submitting}
          onClick={data.onNextStep}
        >
          {ctaLabel}
        </button>
      </div>

      <CmpRecorderStage data={data} />
      <CmpPickerSheet data={data} />
      <CmpCropStage data={data} />
      {/* Same switcher the console uses, so "Change" on the review step cannot drift from
          the way a masjid is picked anywhere else. */}
      {window.MasjidSwitcherSheet ? (
        <window.MasjidSwitcherSheet
          open={!!data.switcherOpen}
          managed={data.managed}
          currentId={(data.masjid || {}).id}
          onPick={data.onPickMasjid}
          onClose={data.onCloseSwitcher}
        />
      ) : null}
      <OpsConfirm confirm={data.confirm} onCancel={data.onCancelConfirm} />
    </div>
  );
}

Object.assign(window, {
  ComposePostScreen,
  CMP_STEPS,
  CMP_AUDIENCE,
  CMP_LIBRARY,
  cmpMessageState,
});
