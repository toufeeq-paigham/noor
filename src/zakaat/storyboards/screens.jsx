// Reusable screen components for the Zakaat Section Board flow.
// Exposed on window scope.

const GOLD_RATE = 14133.0;
const SILVER_RATE = 25.0;

// ── Numeric Keypad ───────────────────────────────────────────────────────────
function ZakaatKeypad({ onPress }) {
  const keys = [
    '1', '2', '3',
    '4', '5', '6',
    '7', '8', '9',
    '.', '0', 'backspace'
  ];

  return (
    <div style={{
      background: 'var(--color-surface-secondary)',
      borderTop: '1px solid var(--color-neutral-border)',
      padding: '16px 20px 24px',
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: 12,
      zIndex: 100,
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0
    }}>
      {keys.map((k, idx) => {
        if (k === 'backspace') {
          return (
            <button
              key={idx}
              onClick={() => onPress && onPress('backspace')}
              style={{
                height: 52, borderRadius: 14, border: 'none',
                background: 'var(--color-input-background)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer'
              }}
            >
              <span className="mi" style={{ fontSize: 24, color: 'var(--color-info-primary)' }} data-i="backspace"></span>
            </button>
          );
        }

        return (
          <button
            key={idx}
            onClick={() => onPress && onPress(k)}
            style={{
              height: 52, borderRadius: 14, border: 'none',
              background: 'var(--color-input-background)',
              fontFamily: '"Nunito", sans-serif', fontSize: 22, fontWeight: 700, color: 'var(--color-info-primary)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer'
            }}
          >
            {k}
          </button>
        );
      })}
    </div>
  );
}

// ── Zakaat Empty Screen ──────────────────────────────────────────────────────
function ZakaatEmptyScreen({ onCalculate, onBack }) {
  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', background: 'var(--color-surface-primary)' }}>
      {/* AppBar */}
      <div style={{ flexShrink: 0, display: 'flex', alignItems: 'center', gap: 14, padding: '62px 16px 10px' }}>
        <button className="ib ib-tonal md" onClick={onBack} aria-label="Back">
          <span className="mi" data-i="arrow_back"></span>
        </button>
        <span className="ab-title">Zakaat</span>
      </div>

      {/* Empty State Content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '32px 24px', textAlign: 'center' }}>
        <span className="mi" style={{ fontSize: 72, color: 'var(--color-info-tertiary)', opacity: 0.35, marginBottom: 20 }} data-i="savings"></span>
        <div style={{ fontFamily: '"DM Serif Display", Georgia, serif', fontSize: 28, color: 'var(--color-info-primary)', lineHeight: 1.2, marginBottom: 12 }}>
          No Zakaats found
        </div>
        <div style={{ fontFamily: '"Nunito", sans-serif', fontSize: 15, color: 'var(--color-info-secondary)', maxWidth: 280, margin: '0 auto 40px', lineHeight: 1.5 }}>
          Try calculating Zakaat to find it here
        </div>
        <button className="btn btn-filled lg" onClick={onCalculate} style={{ width: '100%' }}>
          Calculate Zakaat
        </button>
      </div>
    </div>
  );
}

// ── Zakaat List Screen ────────────────────────────────────────────────────────
function ZakaatListScreen({ records = [], onCalculate, onEdit, onDelete, onBack }) {
  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', background: 'var(--color-surface-primary)', overflow: 'hidden', position: 'relative' }}>
      {/* AppBar */}
      <div style={{ flexShrink: 0, display: 'flex', alignItems: 'center', gap: 14, padding: '62px 16px 10px' }}>
        <button className="ib ib-tonal md" onClick={onBack} aria-label="Back">
          <span className="mi" data-i="arrow_back"></span>
        </button>
        <span className="ab-title">Zakaat</span>
      </div>

      {/* List content (scrolling) */}
      <div style={{ flex: 1, overflowY: 'auto', WebkitOverflowScrolling: 'touch', padding: '16px 16px 100px' }}>
        {records.map((r, idx) => {
          const isFirst = idx === 0;
          return (
            <div key={r.id} style={{ position: 'relative', marginBottom: 12 }}>
              {/* Red Delete Background Layer */}
              <div
                onClick={() => onDelete && onDelete(r.id)}
                style={{
                  position: 'absolute',
                  inset: 0,
                  borderRadius: 20,
                  background: 'var(--color-action-destructive)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'flex-end',
                  paddingRight: 24,
                  cursor: 'pointer',
                  zIndex: 1
                }}
              >
                <span className="mi" style={{ color: '#fff', fontSize: 24 }} data-i="delete"></span>
              </div>

              {/* Sliding Card Content Layer */}
              <div
                className={isFirst ? "zakaat-swipe-hint" : ""}
                style={{
                  position: 'relative',
                  zIndex: 2,
                  background: 'var(--color-surface-secondary)',
                  borderRadius: 20,
                  padding: '18px 20px',
                  border: '1px solid var(--color-neutral-border)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  transition: 'transform 0.3s ease'
                }}
              >
                <div>
                  <div style={{ fontFamily: '"Nunito", sans-serif', fontSize: 17, fontWeight: 700, color: 'var(--color-info-primary)', marginBottom: 4 }}>
                    {r.name} - ₹{r.due.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                  <div style={{ fontFamily: '"Nunito", sans-serif', fontSize: 13, color: 'var(--color-info-secondary)' }}>
                    Last calculated on: {r.date}
                  </div>
                </div>
                {onEdit && (
                  <button
                    onClick={() => onEdit(r)}
                    className="ib ib-tonal sm"
                    style={{
                      width: 36,
                      height: 36,
                      color: 'var(--color-action-primary)',
                      borderColor: 'color-mix(in oklab, var(--color-action-primary) 35%, transparent)'
                    }}
                    aria-label="Edit Zakaat"
                  >
                    <span className="mi" style={{ fontSize: 18 }} data-i="edit"></span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Button */}
      <div style={{ position: 'absolute', bottom: 20, left: 16, right: 16, zIndex: 10 }}>
        <button className="btn btn-filled lg" onClick={onCalculate} style={{ width: '100%' }}>
          Calculate more Zakaat
        </button>
      </div>

      <style>{`
        @keyframes zakaatSwipe {
          0% { transform: translateX(0); }
          15% { transform: translateX(-68px); }
          45% { transform: translateX(-68px); }
          60% { transform: translateX(0); }
          100% { transform: translateX(0); }
        }
        .zakaat-swipe-hint {
          animation: zakaatSwipe 3s ease-in-out 0.5s 1;
        }
      `}</style>
    </div>
  );
}

// ── Zakaat Loading Screen ────────────────────────────────────────────────────
function ZakaatLoadingScreen() {
  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', background: 'var(--color-surface-primary)' }}>
      {/* AppBar */}
      <div style={{ flexShrink: 0, display: 'flex', alignItems: 'center', gap: 14, padding: '62px 16px 10px' }}>
        <button className="ib ib-tonal md" style={{ opacity: 0.3 }} disabled>
          <span className="mi" data-i="arrow_back"></span>
        </button>
        <span className="ab-title">Calculate Zakaat</span>
      </div>

      {/* Loading state spinner */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 20 }}>
        <div style={{
          width: 48, height: 48, borderRadius: '50%',
          border: '4px solid rgba(0, 201, 80, 0.1)',
          borderTopColor: 'var(--color-action-primary)',
          animation: 'spin 1s linear infinite'
        }} />
        <div style={{ fontFamily: '"Nunito", sans-serif', fontSize: 16, color: 'var(--color-info-primary)', fontWeight: 600 }}>
          Loading gold and silver rates...
        </div>
      </div>
      <style>{`
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}

// ── Zakaat Step Screen (Steps 1 to 6) ─────────────────────────────────────────
function ZakaatStepScreen({
  step = 1,
  values = {},
  activeField = null,
  onFieldFocus,
  onKeyPress,
  onNext,
  onPrev,
  onBack,
  onCloseKeypad
}) {
  const stepsMeta = {
    1: {
      title: 'Gold & Silver',
      subtitle: 'Enter the weight of gold and silver you own',
      fields: [
        { key: 'gold', label: 'Gold', suffix: 'grams', subText: `₹${GOLD_RATE}/gm`, type: 'weight' },
        { key: 'silver', label: 'Silver', suffix: 'grams', subText: `₹${SILVER_RATE}/gm`, type: 'weight' }
      ]
    },
    2: {
      title: 'Cash & Bank Balance',
      subtitle: 'List your cash, savings, or account balances for a complete financial snapshot.',
      fields: [
        { key: 'cash', label: 'Cash', prefix: '₹', subText: '* Cash in hand' },
        { key: 'bank', label: 'Bank Balance', prefix: '₹', subText: '* Amount in Savings Account' }
      ]
    },
    3: {
      title: 'Investments',
      subtitle: 'Value of your stocks, bonds, or other assets',
      fields: [
        { key: 'stocks', label: 'Stocks', prefix: '₹', subText: '* If purchased for trade, full value. If for dividends, Zakaat on dividends only' },
        { key: 'mutualFunds', label: 'Mutual Funds & Bonds', prefix: '₹', subText: '* If non-interest-based' },
        { key: 'crypto', label: 'Cryptocurrency', prefix: '₹', subText: '* If held as an investment' }
      ]
    },
    4: {
      title: 'Business And Farming',
      subtitle: 'Input the value of goods, livestock, or harvests',
      fields: [
        { key: 'businessAssets', label: 'Business Assets', prefix: '₹', subText: '* Stock-in-trade, raw materials, goods meant for sale' },
        { key: 'liveStock', label: 'Live Stock', prefix: '₹', subText: '* Cattle, Sheep and more' },
        { key: 'agri', label: 'Agricultural Produce', prefix: '₹', subText: '* Produce from farming' }
      ]
    },
    5: {
      title: 'Miscellaneous',
      subtitle: 'Include any extra assets or sources of wealth',
      fields: [
        { key: 'receivables', label: 'Receivables', prefix: '₹', subText: '* Money owed to you that you expect to receive' },
        { key: 'otherAssets', label: 'Others', prefix: '₹', subText: '* Rent and more' }
      ]
    },
    6: {
      title: 'Deductibles',
      subtitle: 'Record your liabilities, such as loans or unpaid bills',
      fields: [
        { key: 'debts', label: 'Personal Debts', prefix: '₹' },
        { key: 'taxes', label: 'Taxes', prefix: '₹' },
        { key: 'liabilities', label: 'Business Liabilities', prefix: '₹' }
      ]
    }
  };

  const currentMeta = stepsMeta[step] || stepsMeta[1];

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative', background: 'var(--color-surface-primary)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      
      {/* AppBar */}
      <div className="app-bar" style={{ padding: '62px 16px 10px', height: 110 }}>
        <button className="ib ib-tonal md" onClick={onBack} aria-label="Back">
          <span className="mi" data-i="arrow_back"></span>
        </button>
        <span className="ab-title">Calculate Zakaat</span>
      </div>

      {/* Main scrolling form content */}
      <div style={{
        position: 'absolute', inset: '0 0 88px 0', overflowY: 'auto', WebkitOverflowScrolling: 'touch',
        padding: activeField ? '120px 16px 360px' : '120px 16px 32px'
      }}>
        
        {/* Step Card Container */}
        <div style={{ background: 'var(--color-surface-secondary)', borderRadius: 20, padding: 22, border: '1px solid var(--color-neutral-border)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
            <div style={{ fontFamily: '"DM Serif Display", Georgia, serif', fontSize: 26, color: 'var(--color-info-primary)', lineHeight: 1.15, flex: 1 }}>
              {currentMeta.title}
            </div>
            <span style={{ fontFamily: '"Nunito", sans-serif', fontSize: 13, color: 'var(--color-info-secondary)', marginTop: 6, flexShrink: 0 }}>
              {step} / 6
            </span>
          </div>
          <div style={{ fontFamily: '"Nunito", sans-serif', fontSize: 14, color: 'var(--color-info-secondary)', marginBottom: 22, lineHeight: 1.45 }}>
            {currentMeta.subtitle}
          </div>

          {/* Fields list */}
          {currentMeta.fields.map((f) => {
            const val = values[f.key] || '';
            const isFocused = activeField === f.key;
            
            // Calculate dynamic rates/totals for step 1
            let rightLabel = null;
            if (step === 1) {
              const numVal = parseFloat(val) || 0;
              const rate = f.key === 'gold' ? GOLD_RATE : SILVER_RATE;
              rightLabel = `Total: ₹${(numVal * rate).toLocaleString()}`;
            }

            return (
              <div
                key={f.key}
                style={{
                  background: 'var(--color-surface-primary)', borderRadius: 14, padding: 16, marginBottom: 12,
                  border: isFocused ? '1px solid var(--color-action-primary)' : '1px solid var(--color-neutral-border)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontFamily: '"Nunito", sans-serif', fontSize: 16, fontWeight: 700, color: 'var(--color-info-primary)' }}>{f.label}</span>
                    {f.key === 'gold' && (
                      <div style={{ background: 'rgba(0,201,80,0.12)', borderRadius: 8, padding: '3px 10px' }}>
                        <span style={{ fontFamily: '"Nunito", sans-serif', fontSize: 11, fontWeight: 600, color: 'var(--color-action-primary)' }}>24k Gold (995) ▾</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Input box */}
                <div
                  onClick={() => onFieldFocus && onFieldFocus(f.key)}
                  style={{
                    background: 'var(--color-input-background)', borderRadius: 12, padding: '14px 16px',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    cursor: 'pointer', border: isFocused ? '1.5px solid var(--color-action-primary)' : '1px solid transparent'
                  }}
                >
                  {f.prefix && <span style={{ fontFamily: '"Nunito", sans-serif', fontSize: 16, color: 'var(--color-info-primary)', marginRight: 4 }}>{f.prefix}</span>}
                  <div style={{ flex: 1, textAlign: 'right', display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                    <span style={{ fontFamily: '"Nunito", sans-serif', fontSize: 18, fontWeight: 600, color: val ? 'var(--color-info-primary)' : 'var(--color-status-disabled-alt)' }}>
                      {val || '0'}
                    </span>
                    {isFocused && <span style={{ width: 2, height: 20, background: 'var(--color-action-primary)', marginLeft: 3, display: 'inline-block', animation: 'blink 1s step-end infinite' }} />}
                  </div>
                  {f.suffix && <span style={{ fontFamily: '"Nunito", sans-serif', fontSize: 15, color: 'var(--color-status-disabled-alt)', marginLeft: 8 }}>{f.suffix}</span>}
                </div>

                {/* Subtext label */}
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8, fontFamily: '"Nunito", sans-serif', fontSize: 12, color: 'var(--color-info-secondary)' }}>
                  <span>{f.subText}</span>
                  {rightLabel && <span>{rightLabel}</span>}
                </div>
              </div>
            );
          })}

          {step === 1 && (
            <button className="btn btn-tonal md" style={{ width: '100%', color: 'var(--color-action-primary)', borderColor: 'color-mix(in oklab, var(--color-action-primary) 25%, transparent)' }}>
              + Add More Gold Variants
            </button>
          )}

          {step === 1 && (
            <div style={{ marginTop: 12, fontFamily: '"Nunito", sans-serif', fontSize: 11, color: 'var(--color-info-secondary)' }}>
              * Gold and Silver rates are updated regularly
            </div>
          )}
        </div>

        {/* Step indicators */}
        <div style={{ display: 'flex', gap: 6, justifyContent: 'center', marginTop: 24 }}>
          {Array.from({ length: 6 }).map((_, idx) => {
            const active = idx + 1 === step;
            return (
              <div
                key={idx}
                style={{
                  width: active ? 24 : 8, height: 4, borderRadius: 2,
                  background: active ? 'var(--color-action-primary)' : 'var(--color-neutral-border)',
                  transition: 'width 200ms'
                }}
              />
            );
          })}
        </div>

      </div>

      {/* Floating Action Button (FAB) Area at Bottom */}
      <div style={{
        position: 'absolute', bottom: activeField ? 340 : 20, left: 20, right: 20,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        pointerEvents: 'none', zIndex: 10
      }}>
        {/* Left Back Arrow (only steps > 1) */}
        {step > 1 ? (
          <button
            onClick={onPrev}
            className="ib ib-filled"
            style={{
              width: 56, height: 56, cursor: 'pointer', pointerEvents: 'auto',
              boxShadow: '0 4px 16px color-mix(in oklab, var(--color-action-primary) 30%, transparent)'
            }}
          >
            <span className="mi" style={{ fontSize: 24 }} data-i="arrow_back"></span>
          </button>
        ) : <div />}

        {/* Right Arrow / Calculate */}
        {step < 6 ? (
          <button
            onClick={onNext}
            className="ib ib-filled"
            style={{
              width: 56, height: 56, cursor: 'pointer', pointerEvents: 'auto',
              boxShadow: '0 4px 16px color-mix(in oklab, var(--color-action-primary) 30%, transparent)'
            }}
          >
            <span className="mi" style={{ fontSize: 24 }} data-i="arrow_forward"></span>
          </button>
        ) : (
          <button
            onClick={onNext}
            className="btn btn-filled lg"
            style={{ pointerEvents: 'auto', width: 140, boxShadow: '0 4px 16px color-mix(in oklab, var(--color-action-primary) 30%, transparent)' }}
          >
            Calculate
          </button>
        )}
      </div>

      {/* Conditionally render numeric keypad */}
      {activeField && <ZakaatKeypad onPress={onKeyPress} />}

      <style>{`
        @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
      `}</style>
    </div>
  );
}

// ── Zakaat Summary Screen ────────────────────────────────────────────────────
function ZakaatSummaryScreen({ values = {}, onBack, onSave }) {
  // Parsing inputs
  const parseVal = (v) => parseFloat(v || 0);

  const goldGrams = parseVal(values.gold);
  const silverGrams = parseVal(values.silver);
  const cash = parseVal(values.cash);
  const bank = parseVal(values.bank);
  const stocks = parseVal(values.stocks);
  const mutualFunds = parseVal(values.mutualFunds);
  const crypto = parseVal(values.crypto);
  const businessAssets = parseVal(values.businessAssets);
  const liveStock = parseVal(values.liveStock);
  const agri = parseVal(values.agri);
  const receivables = parseVal(values.receivables);
  const otherAssets = parseVal(values.otherAssets);

  const debts = parseVal(values.debts);
  const taxes = parseVal(values.taxes);
  const liabilities = parseVal(values.liabilities);

  // Computations
  const goldVal = goldGrams * GOLD_RATE;
  const silverVal = silverGrams * SILVER_RATE;
  const goldSilverTotal = goldVal + silverVal;
  const cashBankTotal = cash + bank;
  const investmentsTotal = stocks + mutualFunds + crypto;
  const businessTotal = businessAssets + liveStock + agri;
  const miscTotal = receivables + otherAssets;
  const deductiblesTotal = debts + taxes + liabilities;

  const totalAssets = goldSilverTotal + cashBankTotal + investmentsTotal + businessTotal + miscTotal;
  const netWealth = Math.max(0, totalAssets - deductiblesTotal);
  const zakaatDue = netWealth * 0.025;

  const row = (lbl, val, indent = false, isDeductible = false) => (
    <div style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      padding: '10px 16px', borderBottom: '1px solid var(--color-neutral-border)',
      paddingLeft: indent ? 28 : 16
    }}>
      <span style={{
        fontFamily: '"Nunito", sans-serif', fontSize: indent ? 13 : 14,
        color: indent ? 'var(--color-info-secondary)' : 'var(--color-info-primary)',
        fontWeight: indent ? 500 : 600
      }}>
        {lbl}
      </span>
      <span style={{
        fontFamily: '"Nunito", sans-serif', fontSize: indent ? 13 : 14,
        color: indent ? 'var(--color-info-secondary)' : 'var(--color-info-primary)',
        fontWeight: indent ? 500 : 700
      }}>
        {isDeductible && val > 0 ? '-' : ''}₹{val.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 })}
      </span>
    </div>
  );

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative', background: 'var(--color-surface-primary)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      
      {/* AppBar */}
      <div className="app-bar" style={{ padding: '62px 16px 10px', height: 110 }}>
        <button className="ib ib-tonal md" onClick={onBack} aria-label="Back">
          <span className="mi" data-i="arrow_back"></span>
        </button>
        <span className="ab-title">Zakaat Summary</span>
      </div>

      {/* Main scrolling breakdown */}
      <div style={{ position: 'absolute', inset: '110px 0 0 0', overflowY: 'auto', WebkitOverflowScrolling: 'touch', padding: '16px 16px 40px' }}>
        
        {/* Due amount header */}
        <div style={{ textAlign: 'center', padding: '20px 0 24px' }}>
          <div style={{ fontFamily: '"Nunito", sans-serif', fontSize: 14, color: 'var(--color-info-secondary)', marginBottom: 6 }}>
            Zakaat Due
          </div>
          <div style={{ fontFamily: '"Nunito", sans-serif', fontSize: 44, fontWeight: 800, color: 'var(--color-action-primary)', lineHeight: 1 }}>
            ₹{zakaatDue.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 })}
          </div>
        </div>

        {/* Breakdown Card */}
        <div style={{ background: 'var(--color-surface-secondary)', borderRadius: 20, overflow: 'hidden', border: '1px solid var(--color-neutral-border)', marginBottom: 20 }}>
          
          {/* Header Row */}
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: 16, background: 'color-mix(in oklab, var(--color-info-primary) 5%, var(--color-surface-secondary))', borderBottom: '1px solid var(--color-neutral-border)' }}>
            <span style={{ fontFamily: '"Nunito", sans-serif', fontSize: 15, fontWeight: 700, color: 'var(--color-info-primary)' }}>Total Assets</span>
            <span style={{ fontFamily: '"Nunito", sans-serif', fontSize: 15, fontWeight: 700, color: 'var(--color-info-primary)' }}>
              ₹{totalAssets.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 })}
            </span>
          </div>

          {/* Gold & Silver */}
          {row('Gold & Silver', goldSilverTotal)}
          {goldGrams > 0 && row('Gold', goldVal, true)}
          {silverGrams > 0 && row('Silver', silverVal, true)}

          {/* Cash & Bank */}
          {row('Cash & Bank Balance', cashBankTotal)}
          {cash > 0 && row('Cash', cash, true)}
          {bank > 0 && row('Bank Balance', bank, true)}

          {/* Investments */}
          {row('Investments', investmentsTotal)}
          {stocks > 0 && row('Stocks', stocks, true)}
          {mutualFunds > 0 && row('Mutual Funds & Bonds', mutualFunds, true)}
          {crypto > 0 && row('Cryptocurrency', crypto, true)}

          {/* Business & Farming */}
          {row('Business And Farming', businessTotal)}
          {businessAssets > 0 && row('Business Assets', businessAssets, true)}
          {liveStock > 0 && row('Live Stock', liveStock, true)}
          {agri > 0 && row('Agricultural Produce', agri, true)}

          {/* Miscellaneous */}
          {row('Miscellaneous', miscTotal)}
          {receivables > 0 && row('Receivables', receivables, true)}
          {otherAssets > 0 && row('Others', otherAssets, true)}

          {/* Deductibles */}
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: 16, background: 'color-mix(in oklab, var(--color-action-destructive) 5%, var(--color-surface-secondary))', borderTop: '1px solid var(--color-neutral-border)', borderBottom: '1px solid var(--color-neutral-border)' }}>
            <span style={{ fontFamily: '"Nunito", sans-serif', fontSize: 14, fontWeight: 700, color: 'var(--color-info-primary)' }}>Deductibles</span>
            <span style={{ fontFamily: '"Nunito", sans-serif', fontSize: 14, fontWeight: 700, color: 'var(--color-info-primary)' }}>
              ₹{deductiblesTotal.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 })}
            </span>
          </div>
          {debts > 0 && row('Personal Debts', debts, true, true)}
          {taxes > 0 && row('Taxes', taxes, true, true)}
          {liabilities > 0 && row('Business Liabilities', liabilities, true, true)}

        </div>

        {/* Disclaimer / Nisab info */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, padding: '0 8px' }}>
          <div style={{ fontFamily: '"Nunito", sans-serif', fontSize: 13, color: 'var(--color-info-secondary)', lineHeight: 1.6 }}>
            • Zakaat is due when your wealth reaches the nisab threshold and has been in your possession for one lunar year.
          </div>
          <div style={{ fontFamily: '"Nunito", sans-serif', fontSize: 13, color: 'var(--color-info-secondary)', lineHeight: 1.6 }}>
            • The nisab is approximately the value of 87.48 grams of gold or 612.36 grams of silver.
          </div>
          <div style={{ fontFamily: '"Nunito", sans-serif', fontSize: 13, color: 'var(--color-info-secondary)', lineHeight: 1.6 }}>
            • This calculation is based on the information you provided. For specific rulings, please consult with a qualified scholar.
          </div>
        </div>

        {/* Save/Action Button */}
        {onSave && (
          <button className="btn btn-filled lg" onClick={onSave} style={{ width: '100%', marginTop: 24 }}>
            Save Zakaat Record
          </button>
        )}

      </div>
    </div>
  );
}

Object.assign(window, { ZakaatEmptyScreen, ZakaatListScreen, ZakaatLoadingScreen, ZakaatStepScreen, ZakaatSummaryScreen });
