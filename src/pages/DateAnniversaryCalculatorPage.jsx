import { useMemo, useState } from 'react';
import { trackEvent } from '../lib/analytics';
import { useLanguage } from '../lib/language';

const DAY_MILESTONES = [100, 200, 300, 400, 500, 600, 700, 800, 900, 1000];

const COPY = {
  ko: {
    kicker: 'DATE CALCULATOR',
    title: '기념일 날짜 계산기',
    description: '기준 날짜를 입력하면 100일/200일 같은 일수 기념일과 1주년/2주년 같은 연차 기념일을 한 번에 계산합니다.',
    inputTitle: '기준 날짜 입력',
    inputLabel: '날짜',
    inputAria: '기념일 계산 기준 날짜',
    today: '오늘',
    clear: '초기화',
    dayResultTitle: '일수 기념일',
    empty: '날짜를 선택하면 결과가 표시됩니다.',
    basePrefix: '기준일',
    dayLabel: (value) => `${value}일`,
  },
  en: {
    kicker: 'DATE CALCULATOR',
    title: 'Date Anniversary Calculator',
    description: 'Pick a base date to calculate day milestones (100/200/300...) and yearly anniversaries (1st, 2nd...).',
    inputTitle: 'Base Date',
    inputLabel: 'Date',
    inputAria: 'Base date for anniversary calculator',
    today: 'Today',
    clear: 'Clear',
    dayResultTitle: 'Day Milestones',
    empty: 'Select a date to see anniversary milestones.',
    basePrefix: 'Base date',
    dayLabel: (value) => `Day ${value}`,
  }
};

function formatDateInput(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function parseDateInput(value) {
  if (!value) {
    return null;
  }
  const match = value.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) {
    return null;
  }

  const year = Number(match[1]);
  const monthIndex = Number(match[2]) - 1;
  const day = Number(match[3]);
  const utcDate = new Date(Date.UTC(year, monthIndex, day));

  if (
    utcDate.getUTCFullYear() !== year ||
    utcDate.getUTCMonth() !== monthIndex ||
    utcDate.getUTCDate() !== day
  ) {
    return null;
  }

  return utcDate;
}

function addUtcDays(date, days) {
  const result = new Date(date.getTime());
  result.setUTCDate(result.getUTCDate() + days);
  return result;
}

function formatDisplayDate(date, language) {
  const locale = language === 'ko' ? 'ko-KR' : 'en-US';
  const parts = new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'short',
    timeZone: 'UTC'
  }).formatToParts(date);

  const weekday = parts.find((part) => part.type === 'weekday')?.value || '';
  const dateText = parts
    .filter((part) => part.type !== 'weekday')
    .map((part) => part.value)
    .join('')
    .trim();

  return weekday ? `${dateText} (${weekday})` : dateText;
}

function DateAnniversaryCalculatorPage() {
  const { language } = useLanguage();
  const copy = COPY[language] || COPY.ko;
  const [dateInput, setDateInput] = useState('');

  const baseDate = useMemo(() => parseDateInput(dateInput), [dateInput]);

  const dayMilestones = useMemo(() => {
    if (!baseDate) {
      return [];
    }
    return DAY_MILESTONES.map((days) => ({
      label: copy.dayLabel(days),
      date: addUtcDays(baseDate, days)
    }));
  }, [baseDate, copy]);

  function onPickToday() {
    const today = new Date();
    const formatted = formatDateInput(today);
    setDateInput(formatted);
    trackEvent('tool_generate', {
      tool_name: 'date-anniversary-calculator',
      action: 'pick-today'
    });
  }

  function onClear() {
    if (!dateInput) {
      return;
    }
    setDateInput('');
    trackEvent('tool_reset', { tool_name: 'date-anniversary-calculator' });
  }

  function onChangeDate(nextValue) {
    setDateInput(nextValue);
    if (nextValue) {
      trackEvent('tool_generate', {
        tool_name: 'date-anniversary-calculator',
        action: 'input-date'
      });
    }
  }

  return (
    <section className="section">
      <div className="container tool-layout">
        <header className="hero tool-hero">
          <p className="kicker">{copy.kicker}</p>
          <h1>{copy.title}</h1>
          <p>{copy.description}</p>
        </header>

        <section className="card anniversary-input-card">
          <h2>{copy.inputTitle}</h2>
          <div className="anniversary-input-row">
            <label htmlFor="anniversary-date">{copy.inputLabel}</label>
            <input
              id="anniversary-date"
              type="date"
              value={dateInput}
              onChange={(event) => onChangeDate(event.target.value)}
              aria-label={copy.inputAria}
            />
          </div>
          <div className="actions">
            <button type="button" className="button primary" onClick={onPickToday}>
              {copy.today}
            </button>
            <button type="button" className="button ghost" onClick={onClear}>
              {copy.clear}
            </button>
          </div>
          <p className="anniversary-base-text">
            {copy.basePrefix}: {baseDate ? formatDisplayDate(baseDate, language) : '-'}
          </p>
        </section>

        <section className="card">
          <h2>{copy.dayResultTitle}</h2>
          {baseDate ? (
            <div className="anniversary-grid" aria-live="polite">
              {dayMilestones.map((item) => (
                <article className="anniversary-item" key={item.label}>
                  <p>{item.label}</p>
                  <strong>{formatDisplayDate(item.date, language)}</strong>
                </article>
              ))}
            </div>
          ) : (
            <p>{copy.empty}</p>
          )}
        </section>
      </div>
    </section>
  );
}

export default DateAnniversaryCalculatorPage;
