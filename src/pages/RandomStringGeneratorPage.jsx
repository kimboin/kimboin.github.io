import { useState } from 'react';
import { trackEvent } from '../lib/analytics';
import { useLanguage } from '../lib/language';

const COPY = {
  ko: {
    kicker: '텍스트 도구',
    title: '랜덤 문자열 생성기',
    description: '길이와 문자셋 옵션을 선택해 랜덤 문자열을 생성할 수 있습니다.',
    length: '문자열 길이',
    includeUpper: '대문자 포함 (A-Z)',
    includeLower: '소문자 포함 (a-z)',
    includeNumber: '숫자 포함 (0-9)',
    includeSymbol: '특수문자 포함 (!@#...)',
    generate: '생성하기',
    reset: '리셋',
    result: '생성 결과',
    copy: '복사',
    copied: '복사됨',
    invalidOption: '최소 한 개의 문자셋을 선택해 주세요.'
  },
  en: {
    kicker: 'TEXT TOOL',
    title: 'Random String Generator',
    description: 'Generate random strings with configurable length and character sets.',
    length: 'Length',
    includeUpper: 'Include uppercase (A-Z)',
    includeLower: 'Include lowercase (a-z)',
    includeNumber: 'Include numbers (0-9)',
    includeSymbol: 'Include symbols (!@#...)',
    generate: 'Generate',
    reset: 'Reset',
    result: 'Generated Result',
    copy: 'Copy',
    copied: 'Copied',
    invalidOption: 'Select at least one character set.'
  }
};

const CHARSETS = {
  upper: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  lower: 'abcdefghijklmnopqrstuvwxyz',
  number: '0123456789',
  symbol: '!@#$%^&*()_+-=[]{}|;:,.<>?'
};

function buildRandomString(length, charset) {
  const cryptoObj = typeof crypto !== 'undefined' && crypto.getRandomValues ? crypto : null;
  let result = '';

  if (cryptoObj) {
    const values = new Uint32Array(length);
    cryptoObj.getRandomValues(values);
    for (let i = 0; i < length; i += 1) {
      result += charset[values[i] % charset.length];
    }
    return result;
  }

  for (let i = 0; i < length; i += 1) {
    result += charset[Math.floor(Math.random() * charset.length)];
  }
  return result;
}

function RandomStringGeneratorPage() {
  const { language } = useLanguage();
  const copy = COPY[language];

  const [length, setLength] = useState(16);
  const [includeUpper, setIncludeUpper] = useState(true);
  const [includeLower, setIncludeLower] = useState(true);
  const [includeNumber, setIncludeNumber] = useState(true);
  const [includeSymbol, setIncludeSymbol] = useState(false);
  const [result, setResult] = useState('');
  const [errorText, setErrorText] = useState('');
  const [copied, setCopied] = useState(false);

  function onGenerate() {
    let charset = '';
    if (includeUpper) charset += CHARSETS.upper;
    if (includeLower) charset += CHARSETS.lower;
    if (includeNumber) charset += CHARSETS.number;
    if (includeSymbol) charset += CHARSETS.symbol;

    if (!charset) {
      setErrorText(copy.invalidOption);
      setResult('');
      return;
    }

    const safeLength = Math.max(1, Math.min(256, Number(length) || 1));
    const generated = buildRandomString(safeLength, charset);
    setResult(generated);
    setErrorText('');
    setCopied(false);

    trackEvent('tool_generate', {
      tool_name: 'random-string-generator',
      length: safeLength
    });
  }

  function onReset() {
    setLength(16);
    setIncludeUpper(true);
    setIncludeLower(true);
    setIncludeNumber(true);
    setIncludeSymbol(false);
    setResult('');
    setErrorText('');
    setCopied(false);
    trackEvent('tool_reset', { tool_name: 'random-string-generator' });
  }

  async function onCopy() {
    if (!result || !navigator?.clipboard?.writeText) return;
    try {
      await navigator.clipboard.writeText(result);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
      trackEvent('tool_copy', { tool_name: 'random-string-generator' });
    } catch {
      setCopied(false);
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

        <section className="card converter-card">
          <label className="custom-field" htmlFor="random-string-length">
            <span>{copy.length}</span>
            <input
              id="random-string-length"
              type="number"
              min="1"
              max="256"
              value={length}
              onChange={(event) => setLength(Number(event.target.value || 1))}
            />
          </label>

          <div className="grid two">
            <label className="checkbox-field">
              <input type="checkbox" checked={includeUpper} onChange={(event) => setIncludeUpper(event.target.checked)} />
              <span>{copy.includeUpper}</span>
            </label>
            <label className="checkbox-field">
              <input type="checkbox" checked={includeLower} onChange={(event) => setIncludeLower(event.target.checked)} />
              <span>{copy.includeLower}</span>
            </label>
            <label className="checkbox-field">
              <input type="checkbox" checked={includeNumber} onChange={(event) => setIncludeNumber(event.target.checked)} />
              <span>{copy.includeNumber}</span>
            </label>
            <label className="checkbox-field">
              <input type="checkbox" checked={includeSymbol} onChange={(event) => setIncludeSymbol(event.target.checked)} />
              <span>{copy.includeSymbol}</span>
            </label>
          </div>

          <div className="actions">
            <button type="button" className="button primary" onClick={onGenerate}>
              {copy.generate}
            </button>
            <button type="button" className="button ghost" onClick={onReset}>
              {copy.reset}
            </button>
          </div>

          {errorText ? <p className="converter-error">{errorText}</p> : null}
        </section>

        <section className="card converter-card" aria-live="polite">
          <h2>{copy.result}</h2>
          <textarea className="text-counter-input" readOnly value={result} />
          <div className="actions">
            <button type="button" className="button ghost" onClick={onCopy} disabled={!result}>
              {copied ? copy.copied : copy.copy}
            </button>
          </div>
        </section>
      </div>
    </section>
  );
}

export default RandomStringGeneratorPage;
