import { useMemo, useState } from 'react';
import { trackEvent } from '../lib/analytics';
import { useLanguage } from '../lib/language';

const COPY = {
  ko: {
    kicker: '계산 · 변환',
    title: '나이 계산기',
    description: '생년월일과 기준일을 입력해 만 나이와 관련 정보를 계산합니다.',
    birthDate: '생년월일',
    baseDate: '기준일',
    useToday: '기준일을 오늘로 설정',
    calculate: '계산하기',
    reset: '리셋',
    resultTitle: '계산 결과',
    ageYears: '만 나이',
    ageDetail: '나이 상세',
    daysSinceBirth: '출생 후 경과일',
    daysUntilBirthday: '다음 생일까지',
    invalid: '생년월일과 기준일을 모두 올바르게 입력해 주세요.',
    years: '세',
    months: '개월',
    days: '일',
    daysUnit: '일'
  },
  en: {
    kicker: 'CALCULATE · CONVERT',
    title: 'Age Calculator',
    description: 'Calculate age details from birth date and a reference date.',
    birthDate: 'Birth Date',
    baseDate: 'Reference Date',
    useToday: 'Use today as reference date',
    calculate: 'Calculate',
    reset: 'Reset',
    resultTitle: 'Result',
    ageYears: 'Full Age',
    ageDetail: 'Age Detail',
    daysSinceBirth: 'Days Since Birth',
    daysUntilBirthday: 'Days Until Next Birthday',
    invalid: 'Please enter valid birth and reference dates.',
    years: 'years',
    months: 'months',
    days: 'days',
    daysUnit: 'days'
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

function diffYmd(fromDate, toDate) {
  let years = toDate.getFullYear() - fromDate.getFullYear();
  let months = toDate.getMonth() - fromDate.getMonth();
  let days = toDate.getDate() - fromDate.getDate();

  if (days < 0) {
    const prevMonthDate = new Date(toDate.getFullYear(), toDate.getMonth(), 0);
    days += prevMonthDate.getDate();
    months -= 1;
  }

  if (months < 0) {
    months += 12;
    years -= 1;
  }

  return { years, months, days };
}

function getDaysUntilNextBirthday(birthDate, baseDate) {
  const month = birthDate.getMonth();
  const day = birthDate.getDate();
  let next = new Date(baseDate.getFullYear(), month, day);

  if (next < baseDate) {
    next = new Date(baseDate.getFullYear() + 1, month, day);
  }

  const ms = next.getTime() - baseDate.getTime();
  return Math.round(ms / (1000 * 60 * 60 * 24));
}

function AgeCalculatorPage() {
  const { language } = useLanguage();
  const copy = COPY[language];

  const [birthDate, setBirthDate] = useState('');
  const [baseDate, setBaseDate] = useState(formatTodayDate());
  const [calculated, setCalculated] = useState(false);
  const [errorText, setErrorText] = useState('');

  const result = useMemo(() => {
    if (!birthDate || !baseDate) {
      return null;
    }

    const birth = toDateOnly(birthDate);
    const base = toDateOnly(baseDate);
    if (!birth || !base || birth > base) {
      return null;
    }

    const detail = diffYmd(birth, base);
    const ageYears = detail.years;
    const daysSinceBirth = Math.round((base.getTime() - birth.getTime()) / (1000 * 60 * 60 * 24));
    const daysUntilBirthday = getDaysUntilNextBirthday(birth, base);

    return {
      ageYears,
      detail,
      daysSinceBirth,
      daysUntilBirthday
    };
  }, [birthDate, baseDate]);

  function onCalculate() {
    if (!result) {
      setCalculated(false);
      setErrorText(copy.invalid);
      return;
    }

    setCalculated(true);
    setErrorText('');
    trackEvent('tool_generate', { tool_name: 'age-calculator' });
  }

  function onReset() {
    setBirthDate('');
    setBaseDate(formatTodayDate());
    setCalculated(false);
    setErrorText('');
    trackEvent('tool_reset', { tool_name: 'age-calculator' });
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
            <span>{copy.birthDate}</span>
            <input type="date" value={birthDate} onChange={(event) => setBirthDate(event.target.value)} />
          </label>

          <label className="custom-field">
            <span>{copy.baseDate}</span>
            <input type="date" value={baseDate} onChange={(event) => setBaseDate(event.target.value)} />
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
                <p>{copy.ageYears}</p>
                <strong>
                  {result.ageYears} {copy.years}
                </strong>
              </article>
              <article className="counter-stat">
                <p>{copy.ageDetail}</p>
                <strong>
                  {result.detail.years} {copy.years} {result.detail.months} {copy.months} {result.detail.days} {copy.days}
                </strong>
              </article>
              <article className="counter-stat">
                <p>{copy.daysSinceBirth}</p>
                <strong>
                  {result.daysSinceBirth.toLocaleString()} {copy.daysUnit}
                </strong>
              </article>
              <article className="counter-stat">
                <p>{copy.daysUntilBirthday}</p>
                <strong>
                  {result.daysUntilBirthday.toLocaleString()} {copy.daysUnit}
                </strong>
              </article>
            </div>
          </section>
        ) : null}
      </div>
    </section>
  );
}

export default AgeCalculatorPage;
