import { useEffect, useMemo, useState } from 'react';
import {
  getBallColor,
  lotteries,
  pickLottoNumbers,
  sanitizeCustomConfig,
  uiTexts
} from '../features/lotto/logic';
import { trackEvent } from '../lib/analytics';

function LottoRandomGeneratorPage() {
  const [activeLottoId, setActiveLottoId] = useState(lotteries[0].id);
  const [lastFixedLocale, setLastFixedLocale] = useState(lotteries[0].locale);
  const [setCount, setSetCount] = useState(1);
  const [customStart, setCustomStart] = useState(1);
  const [customEnd, setCustomEnd] = useState(45);
  const [customPick, setCustomPick] = useState(6);
  const [results, setResults] = useState(() => buildResults(lotteries[0], 1, { minNumber: 1, maxNumber: 45, pickCount: 6 }));

  const activeLotto = useMemo(
    () => lotteries.find((lotto) => lotto.id === activeLottoId) || lotteries[0],
    [activeLottoId]
  );

  const locale = activeLotto.locale === 'inherit' ? lastFixedLocale : activeLotto.locale;
  const ui = uiTexts[locale] || uiTexts.ko;
  const customRule = sanitizeCustomConfig(customStart, customEnd, customPick);
  const activeRule = activeLotto.isCustom
    ? customRule
    : {
        minNumber: activeLotto.minNumber,
        maxNumber: activeLotto.maxNumber,
        pickCount: activeLotto.pickCount
      };

  useEffect(() => {
    trackEvent('tool_open', { tool_name: 'lotto-random-generator' });
  }, []);

  function getTabText(lotto) {
    if (lotto.isCustom) {
      return `${lotto.countryFlag} ${ui.customTabName}`;
    }

    return `${lotto.countryFlag} ${lotto.name}`;
  }

  function onSelectLotto(nextLotto) {
    setActiveLottoId(nextLotto.id);
    trackEvent('tool_tab_switch', {
      tool_name: 'lotto-random-generator',
      lottery_id: nextLotto.id
    });
    if (nextLotto.locale !== 'inherit') {
      setLastFixedLocale(nextLotto.locale);
    }
  }

  function onGenerate() {
    const safeSetCount = Math.max(1, Math.min(10, Number(setCount) || 1));
    setSetCount(safeSetCount);
    setResults(buildResults(activeLotto, safeSetCount, customRule));
    trackEvent('tool_generate', {
      tool_name: 'lotto-random-generator',
      lottery_id: activeLotto.id,
      set_count: safeSetCount,
      min_number: activeRule.minNumber,
      max_number: activeRule.maxNumber,
      pick_count: activeRule.pickCount
    });
  }

  function onChangeSetCount(value) {
    const safe = Math.max(1, Math.min(10, Math.floor(Number(value) || 1)));
    setSetCount(safe);
  }

  function onCustomChange(field, value) {
    const safe = Math.max(1, Math.floor(Number(value) || 1));
    if (field === 'start') setCustomStart(safe);
    if (field === 'end') setCustomEnd(safe);
    if (field === 'pick') setCustomPick(safe);
    trackEvent('tool_custom_rule_change', {
      tool_name: 'lotto-random-generator',
      field
    });
  }

  return (
    <section className="section">
      <div className="container tool-layout">
        <header className="hero tool-hero">
          <p className="kicker">LOTTO</p>
          <h1>{activeLotto.isCustom ? ui.customTitle : activeLotto.title}</h1>
          <p>{activeLotto.isCustom ? ui.customDescription : activeLotto.description}</p>
        </header>

        <section className="card lotto-tabs-wrap" aria-label={ui.tabsAriaLabel}>
          <div className="lotto-tabs" role="tablist" aria-label={ui.tabsAriaLabel}>
            {lotteries.map((lotto) => (
              <button
                key={lotto.id}
                type="button"
                className={`lotto-tab ${lotto.id === activeLotto.id ? 'is-active' : ''}`}
                role="tab"
                aria-selected={lotto.id === activeLotto.id}
                onClick={() => onSelectLotto(lotto)}
              >
                {getTabText(lotto)}
              </button>
            ))}
          </div>
          <p className="lotto-rule-text">{ui.ruleText(activeRule.minNumber, activeRule.maxNumber, activeRule.pickCount)}</p>
        </section>

        <section className="card controls" aria-label={ui.controlsAriaLabel}>
          <label htmlFor="setCount">{ui.setCountLabel}</label>
          <input
            id="setCount"
            type="number"
            min="1"
            max="10"
            value={setCount}
            onChange={(event) => onChangeSetCount(event.target.value)}
          />
          <button type="button" className="button primary" onClick={onGenerate}>
            {ui.generateButton}
          </button>
        </section>

        {activeLotto.isCustom ? (
          <section className="card custom-controls" aria-label={ui.customControlsAriaLabel}>
            <div className="custom-field">
              <label htmlFor="customStart">{ui.customStartLabel}</label>
              <input
                id="customStart"
                type="number"
                min="1"
                value={customStart}
                onChange={(event) => onCustomChange('start', event.target.value)}
              />
            </div>
            <div className="custom-field">
              <label htmlFor="customEnd">{ui.customEndLabel}</label>
              <input
                id="customEnd"
                type="number"
                min="1"
                value={customEnd}
                onChange={(event) => onCustomChange('end', event.target.value)}
              />
            </div>
            <div className="custom-field">
              <label htmlFor="customPick">{ui.customPickLabel}</label>
              <input
                id="customPick"
                type="number"
                min="1"
                value={customPick}
                onChange={(event) => onCustomChange('pick', event.target.value)}
              />
            </div>
          </section>
        ) : null}

        <section className="card">
          <h2>{ui.resultTitle}</h2>
          <ul className="result-list" aria-live="polite">
            {results.map((numbers, index) => (
              <li key={`${activeLotto.id}-${index}`} className="result-item">
                <span className="badge">{ui.setLabel(index + 1)}</span>
                <div className="numbers">
                  {numbers.map((number) => (
                    <span key={`${index}-${number}`} className="ball" style={{ backgroundColor: getBallColor(number) }}>
                      {number}
                    </span>
                  ))}
                </div>
              </li>
            ))}
          </ul>
          <p className="sr-only">{ui.srGuide(activeRule.minNumber, activeRule.maxNumber, activeRule.pickCount)}</p>
        </section>
      </div>
    </section>
  );
}

function buildResults(activeLotto, setCount, customRule) {
  const rule = activeLotto.isCustom
    ? customRule
    : {
        minNumber: activeLotto.minNumber,
        maxNumber: activeLotto.maxNumber,
        pickCount: activeLotto.pickCount
      };

  return Array.from({ length: setCount }, () =>
    pickLottoNumbers(rule.minNumber, rule.maxNumber, rule.pickCount)
  );
}

export default LottoRandomGeneratorPage;
