import { useMemo, useState } from 'react';
import { trackEvent } from '../lib/analytics';
import { useLanguage } from '../lib/language';

const COPY = {
  ko: {
    kicker: '계산 · 변환',
    title: '날짜 차이 계산기',
    description: '두 날짜 사이의 차이를 일/주/월 기준으로 계산합니다.',
    startDate: '시작일',
    endDate: '종료일',
    swap: '날짜 바꾸기',
    calculate: '계산하기',
    reset: '리셋',
    resultTitle: '계산 결과',
    totalDays: '총 차이 (일)',
    weeksDays: '주 + 일',
    monthsDays: '월 + 일',
    direction: '방향',
    forward: '미래 방향 (시작일 → 종료일)',
    backward: '과거 방향 (종료일이 더 이전)',
    invalid: '시작일과 종료일을 모두 입력해 주세요.',
    dayUnit: '일',
    weekUnit: '주',
    monthUnit: '개월'
  },
  en: {
    kicker: 'CALCULATE · CONVERT',
    title: 'Date Difference Calculator',
    description: 'Calculate date differences in days, weeks, and months.',
    startDate: 'Start Date',
    endDate: 'End Date',
    swap: 'Swap dates',
    calculate: 'Calculate',
    reset: 'Reset',
    resultTitle: 'Result',
    totalDays: 'Total Difference (days)',
    weeksDays: 'Weeks + Days',
    monthsDays: 'Months + Days',
    direction: 'Direction',
    forward: 'Forward (start → end)',
    backward: 'Backward (end is earlier)',
    invalid: 'Please enter both start and end dates.',
    dayUnit: 'days',
    weekUnit: 'weeks',
    monthUnit: 'months'
  }
};

function toDateOnly(value) {
  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) {
    return null;
  }
  return date;
}

function diffMonthsDays(start, end) {
  const sign = end >= start ? 1 : -1;
  const a = sign === 1 ? start : end;
  const b = sign === 1 ? end : start;

  let months = (b.getFullYear() - a.getFullYear()) * 12 + (b.getMonth() - a.getMonth());
  let anchor = new Date(a.getFullYear(), a.getMonth() + months, a.getDate());

  if (anchor > b) {
    months -= 1;
    anchor = new Date(a.getFullYear(), a.getMonth() + months, a.getDate());
  }

  const days = Math.round((b.getTime() - anchor.getTime()) / (1000 * 60 * 60 * 24));
  return { months: months * sign, days: days * sign };
}

function DateDifferencePage() {
  const { language } = useLanguage();
  const copy = COPY[language];

  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [calculated, setCalculated] = useState(false);
  const [errorText, setErrorText] = useState('');

  const result = useMemo(() => {
    if (!startDate || !endDate) {
      return null;
    }

    const start = toDateOnly(startDate);
    const end = toDateOnly(endDate);
    if (!start || !end) {
      return null;
    }

    const diffDays = Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    const absDays = Math.abs(diffDays);
    const weeks = Math.floor(absDays / 7);
    const daysRemainder = absDays % 7;
    const monthDay = diffMonthsDays(start, end);

    return {
      diffDays,
      weeks,
      daysRemainder,
      monthDay,
      isForward: diffDays >= 0
    };
  }, [startDate, endDate]);

  function onCalculate() {
    if (!result) {
      setCalculated(false);
      setErrorText(copy.invalid);
      return;
    }

    setCalculated(true);
    setErrorText('');
    trackEvent('tool_generate', { tool_name: 'date-difference' });
  }

  function onSwap() {
    const prevStart = startDate;
    setStartDate(endDate);
    setEndDate(prevStart);
  }

  function onReset() {
    setStartDate('');
    setEndDate('');
    setCalculated(false);
    setErrorText('');
    trackEvent('tool_reset', { tool_name: 'date-difference' });
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
            <span>{copy.startDate}</span>
            <input type="date" value={startDate} onChange={(event) => setStartDate(event.target.value)} />
          </label>

          <label className="custom-field">
            <span>{copy.endDate}</span>
            <input type="date" value={endDate} onChange={(event) => setEndDate(event.target.value)} />
          </label>

          <div className="actions">
            <button type="button" className="button ghost" onClick={onSwap}>
              {copy.swap}
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
                <p>{copy.totalDays}</p>
                <strong>
                  {result.diffDays > 0 ? `+${result.diffDays}` : result.diffDays} {copy.dayUnit}
                </strong>
              </article>
              <article className="counter-stat">
                <p>{copy.weeksDays}</p>
                <strong>
                  {result.weeks} {copy.weekUnit} {result.daysRemainder} {copy.dayUnit}
                </strong>
              </article>
              <article className="counter-stat">
                <p>{copy.monthsDays}</p>
                <strong>
                  {Math.abs(result.monthDay.months)} {copy.monthUnit} {Math.abs(result.monthDay.days)} {copy.dayUnit}
                </strong>
              </article>
              <article className="counter-stat">
                <p>{copy.direction}</p>
                <strong>{result.isForward ? copy.forward : copy.backward}</strong>
              </article>
            </div>
          </section>
        ) : null}
      </div>
    </section>
  );
}

export default DateDifferencePage;
