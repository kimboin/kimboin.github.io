import { useState } from 'react';
import { trackEvent } from '../lib/analytics';
import { useLanguage } from '../lib/language';

const COPY = {
  ko: {
    kicker: '계산 · 변환',
    title: 'Timestamp 변환기',
    description: 'Unix Timestamp(초/밀리초)와 날짜/시간을 서로 변환할 수 있습니다.',
    tsToDateTitle: 'Timestamp → 날짜',
    dateToTsTitle: '날짜 → Timestamp',
    tsInput: 'Timestamp 입력',
    tsHint: '10자리는 초, 13자리는 밀리초로 처리합니다.',
    dateInput: '날짜/시간 입력 (한국시간 기준)',
    convert: '변환',
    now: '현재 한국시간 입력',
    reset: '리셋',
    resultKst: '한국시간 (KST, UTC+9)',
    resultUtc: 'UTC 시간',
    resultSec: 'Unix 초',
    resultMs: 'Unix 밀리초',
    resultTitle: '변환 결과',
    timestampGuideTitle: 'Timestamp란?',
    timestampGuideBody:
      'Unix Timestamp는 1970-01-01 00:00:00 UTC(유닉스 에폭)부터 지난 시간을 숫자로 표현한 값입니다.',
    timestampGuideSeconds: 'Unix 초(10자리): 초 단위',
    timestampGuideMilliseconds: 'Unix 밀리초(13자리): 밀리초 단위',
    timezoneNote: '이 도구의 날짜 입력/표시는 한국시간(KST, UTC+9) 기준입니다.',
    copy: '복사',
    copied: '복사됨',
    invalid: '유효하지 않은 값입니다.'
  },
  en: {
    kicker: 'CALCULATE · CONVERT',
    title: 'Timestamp Converter',
    description: 'Convert Unix timestamps (seconds/milliseconds) and date-time values in both directions.',
    tsToDateTitle: 'Timestamp → Date',
    dateToTsTitle: 'Date → Timestamp',
    tsInput: 'Timestamp Input',
    tsHint: '10 digits are treated as seconds, 13 digits as milliseconds.',
    dateInput: 'Date-Time Input (KST based)',
    convert: 'Convert',
    now: 'Use current KST time',
    reset: 'Reset',
    resultKst: 'Korea Standard Time (KST, UTC+9)',
    resultUtc: 'UTC Time',
    resultSec: 'Unix Seconds',
    resultMs: 'Unix Milliseconds',
    resultTitle: 'Conversion Results',
    timestampGuideTitle: 'What is a timestamp?',
    timestampGuideBody:
      'Unix Timestamp represents elapsed time from 1970-01-01 00:00:00 UTC (Unix epoch) as a number.',
    timestampGuideSeconds: 'Unix Seconds (10 digits): second precision',
    timestampGuideMilliseconds: 'Unix Milliseconds (13 digits): millisecond precision',
    timezoneNote: 'Date input/output in this tool is based on KST (UTC+9).',
    copy: 'Copy',
    copied: 'Copied',
    invalid: 'Invalid value.'
  }
};

function formatKstString(date, language) {
  const locale = language === 'ko' ? 'ko-KR' : 'en-CA';
  const formatter = new Intl.DateTimeFormat(locale, {
    timeZone: 'Asia/Seoul',
    hour12: false,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });

  const parts = formatter.formatToParts(date);
  const map = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return `${map.year}-${map.month}-${map.day} ${map.hour}:${map.minute}:${map.second}`;
}

function toKstDatetimeLocalValue(date) {
  const kstDate = new Date(date.getTime() + 9 * 60 * 60 * 1000);
  const pad = (n) => String(n).padStart(2, '0');
  return `${kstDate.getUTCFullYear()}-${pad(kstDate.getUTCMonth() + 1)}-${pad(kstDate.getUTCDate())}T${pad(
    kstDate.getUTCHours()
  )}:${pad(kstDate.getUTCMinutes())}`;
}

function parseKstDatetimeLocalToDate(value) {
  const match = value.match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})$/);
  if (!match) {
    return null;
  }
  const [, y, m, d, hh, mm] = match;
  const ms = Date.UTC(Number(y), Number(m) - 1, Number(d), Number(hh) - 9, Number(mm), 0, 0);
  const date = new Date(ms);
  if (Number.isNaN(date.getTime())) {
    return null;
  }
  return date;
}

function TimestampConverterPage() {
  const { language } = useLanguage();
  const copy = COPY[language];

  const [timestampInput, setTimestampInput] = useState('');
  const [dateInput, setDateInput] = useState('');
  const [kstText, setKstText] = useState('');
  const [utcText, setUtcText] = useState('');
  const [secondsText, setSecondsText] = useState('');
  const [millisecondsText, setMillisecondsText] = useState('');
  const [errorText, setErrorText] = useState('');
  const [copiedKey, setCopiedKey] = useState('');

  function clearResults() {
    setKstText('');
    setUtcText('');
    setSecondsText('');
    setMillisecondsText('');
  }

  function onConvertTimestamp() {
    const raw = timestampInput.trim();
    if (!/^-?\d+$/.test(raw)) {
      clearResults();
      setErrorText(copy.invalid);
      return;
    }

    const numeric = Number(raw);
    const isMs = raw.length >= 13;
    const ms = isMs ? numeric : numeric * 1000;
    const date = new Date(ms);

    if (Number.isNaN(date.getTime())) {
      clearResults();
      setErrorText(copy.invalid);
      return;
    }

    setKstText(formatKstString(date, language));
    setUtcText(date.toISOString());
    setSecondsText(String(Math.floor(ms / 1000)));
    setMillisecondsText(String(ms));
    setErrorText('');

    trackEvent('tool_generate', { tool_name: 'timestamp-converter', direction: 'timestamp_to_date' });
  }

  function onConvertDate() {
    if (!dateInput) {
      clearResults();
      setErrorText(copy.invalid);
      return;
    }

    const date = parseKstDatetimeLocalToDate(dateInput);
    if (!date) {
      clearResults();
      setErrorText(copy.invalid);
      return;
    }
    const ms = date.getTime();

    setKstText(formatKstString(date, language));
    setUtcText(date.toISOString());
    setSecondsText(String(Math.floor(ms / 1000)));
    setMillisecondsText(String(ms));
    setErrorText('');

    trackEvent('tool_generate', { tool_name: 'timestamp-converter', direction: 'date_to_timestamp' });
  }

  function onNow() {
    const now = new Date();
    setDateInput(toKstDatetimeLocalValue(now));
  }

  function onReset() {
    setTimestampInput('');
    setDateInput('');
    clearResults();
    setErrorText('');
    setCopiedKey('');
    trackEvent('tool_reset', { tool_name: 'timestamp-converter' });
  }

  async function onCopy(key, value) {
    if (!value || !navigator?.clipboard?.writeText) {
      return;
    }

    try {
      await navigator.clipboard.writeText(value);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(''), 1200);
      trackEvent('tool_copy', { tool_name: 'timestamp-converter', target: key });
    } catch {
      setCopiedKey('');
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

        <div className="grid two">
          <section className="card converter-card">
            <h2>{copy.tsToDateTitle}</h2>
            <label className="custom-field">
              <span>{copy.tsInput}</span>
              <input type="text" value={timestampInput} onChange={(event) => setTimestampInput(event.target.value)} />
              <small className="converter-hint">{copy.tsHint}</small>
            </label>
            <div className="actions">
              <button type="button" className="button primary" onClick={onConvertTimestamp}>
                {copy.convert}
              </button>
              <button type="button" className="button ghost" onClick={onReset}>
                {copy.reset}
              </button>
            </div>
          </section>

          <section className="card converter-card">
            <h2>{copy.dateToTsTitle}</h2>
            <label className="custom-field">
              <span>{copy.dateInput}</span>
              <input type="datetime-local" value={dateInput} onChange={(event) => setDateInput(event.target.value)} />
            </label>
            <div className="actions">
              <button type="button" className="button primary" onClick={onConvertDate}>
                {copy.convert}
              </button>
              <button type="button" className="button ghost" onClick={onNow}>
                {copy.now}
              </button>
            </div>
          </section>
        </div>

        {errorText ? <p className="converter-error">{errorText}</p> : null}

        <section className="card converter-card" aria-live="polite">
          <h2>{copy.resultTitle}</h2>
          <p className="converter-hint">{copy.timezoneNote}</p>

          <div className="timestamp-result-grid">
            <article className="timestamp-result-item">
              <p className="converter-meta">
                {copy.resultKst}: <strong>{kstText || '-'}</strong>
              </p>
              <button type="button" className="button ghost" onClick={() => onCopy('kst', kstText)} disabled={!kstText}>
                {copiedKey === 'kst' ? copy.copied : copy.copy}
              </button>
            </article>

            <article className="timestamp-result-item">
              <p className="converter-meta">
                {copy.resultUtc}: <strong>{utcText || '-'}</strong>
              </p>
              <button type="button" className="button ghost" onClick={() => onCopy('utc', utcText)} disabled={!utcText}>
                {copiedKey === 'utc' ? copy.copied : copy.copy}
              </button>
            </article>

            <article className="timestamp-result-item">
              <p className="converter-meta">
                {copy.resultSec}: <strong>{secondsText || '-'}</strong>
              </p>
              <button
                type="button"
                className="button ghost"
                onClick={() => onCopy('seconds', secondsText)}
                disabled={!secondsText}
              >
                {copiedKey === 'seconds' ? copy.copied : copy.copy}
              </button>
            </article>

            <article className="timestamp-result-item">
              <p className="converter-meta">
                {copy.resultMs}: <strong>{millisecondsText || '-'}</strong>
              </p>
              <button
                type="button"
                className="button ghost"
                onClick={() => onCopy('milliseconds', millisecondsText)}
                disabled={!millisecondsText}
              >
                {copiedKey === 'milliseconds' ? copy.copied : copy.copy}
              </button>
            </article>
          </div>
        </section>

        <section className="card converter-guide-card">
          <h3>{copy.timestampGuideTitle}</h3>
          <p>{copy.timestampGuideBody}</p>
          <ul className="list">
            <li>{copy.timestampGuideSeconds}</li>
            <li>{copy.timestampGuideMilliseconds}</li>
          </ul>
        </section>
      </div>
    </section>
  );
}

export default TimestampConverterPage;
