import { useMemo, useState } from 'react';
import { trackEvent } from '../lib/analytics';
import { useLanguage } from '../lib/language';

const COPY = {
  ko: {
    kicker: '계산 · 변환',
    title: 'D-Day 계산기',
    description: '기준일과 목표일을 입력해 D-Day(D-, D+, D-Day)를 계산합니다.',
    baseDate: '기준일',
    targetDate: '목표일',
    useToday: '기준일을 오늘로 설정',
    calculate: '계산하기',
    reset: '리셋',
    resultTitle: '계산 결과',
    dday: 'D-Day 표기',
    dayDiff: '일수 차이',
    invalid: '기준일과 목표일을 모두 입력해 주세요.'
  },
  en: {
    kicker: 'CALCULATE · CONVERT',
    title: 'D-Day Calculator',
    description: 'Calculate D-Day (D-, D+, D-Day) from a base date and target date.',
    baseDate: 'Base Date',
    targetDate: 'Target Date',
    useToday: 'Use today as base date',
    calculate: 'Calculate',
    reset: 'Reset',
    resultTitle: 'Result',
    dday: 'D-Day',
    dayDiff: 'Day Difference',
    invalid: 'Please enter both base date and target date.'
  }
};

function toDateOnly(value) {
  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) {
    return null;
  }
  return date;
}

function formatTodayDate() {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

function DDayCalculatorPage() {
  const { language } = useLanguage();
  const copy = COPY[language];

  const [baseDate, setBaseDate] = useState(formatTodayDate());
  const [targetDate, setTargetDate] = useState('');
  const [calculated, setCalculated] = useState(false);
  const [errorText, setErrorText] = useState('');

  const result = useMemo(() => {
    if (!baseDate || !targetDate) {
      return null;
    }

    const base = toDateOnly(baseDate);
    const target = toDateOnly(targetDate);
    if (!base || !target) {
      return null;
    }

    const diffMs = target.getTime() - base.getTime();
    const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

    let label = 'D-Day';
    if (diffDays > 0) {
      label = `D-${diffDays}`;
    } else if (diffDays < 0) {
      label = `D+${Math.abs(diffDays)}`;
    }

    return {
      label,
      diffDays
    };
  }, [baseDate, targetDate]);

  function onCalculate() {
    if (!baseDate || !targetDate || !result) {
      setCalculated(false);
      setErrorText(copy.invalid);
      return;
    }

    setCalculated(true);
    setErrorText('');
    trackEvent('tool_generate', { tool_name: 'd-day-calculator' });
  }

  function onReset() {
    setBaseDate(formatTodayDate());
    setTargetDate('');
    setCalculated(false);
    setErrorText('');
    trackEvent('tool_reset', { tool_name: 'd-day-calculator' });
  }

  return (
    <section className="section">
      <div className="container tool-layout">
        <header className="hero tool-hero">
          <p className="kicker">{copy.kicker}</p>
          <h1>{copy.title}</h1>
          <p>{copy.description}</p>
        </header>

        <section className="card converter-card">
          <label className="custom-field">
            <span>{copy.baseDate}</span>
            <input type="date" value={baseDate} onChange={(event) => setBaseDate(event.target.value)} />
          </label>

          <label className="custom-field">
            <span>{copy.targetDate}</span>
            <input type="date" value={targetDate} onChange={(event) => setTargetDate(event.target.value)} />
          </label>

          <div className="actions">
            <button type="button" className="button ghost" onClick={() => setBaseDate(formatTodayDate())}>
              {copy.useToday}
            </button>
          </div>

          <div className="actions">
            <button type="button" className="button primary" onClick={onCalculate}>
              {copy.calculate}
            </button>
            <button type="button" className="button ghost" onClick={onReset}>
              {copy.reset}
            </button>
          </div>

          {errorText ? <p className="converter-error">{errorText}</p> : null}
        </section>

        {calculated && result ? (
          <section className="card converter-card" aria-live="polite">
            <h2>{copy.resultTitle}</h2>
            <div className="counter-stats">
              <article className="counter-stat">
                <p>{copy.dday}</p>
                <strong>{result.label}</strong>
              </article>
              <article className="counter-stat">
                <p>{copy.dayDiff}</p>
                <strong>{result.diffDays > 0 ? `+${result.diffDays}` : result.diffDays}</strong>
              </article>
            </div>
          </section>
        ) : null}
      </div>
    </section>
  );
}

export default DDayCalculatorPage;
