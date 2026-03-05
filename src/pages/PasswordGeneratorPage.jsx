import { useMemo, useState } from 'react';
import { trackEvent } from '../lib/analytics';
import { useLanguage } from '../lib/language';

const COPY = {
  ko: {
    kicker: '텍스트 도구',
    title: '비밀번호 생성기',
    description: '길이와 문자 옵션을 선택해 강력한 비밀번호를 생성할 수 있습니다.',
    length: '비밀번호 길이',
    includeUpper: '대문자 포함 (A-Z)',
    includeLower: '소문자 포함 (a-z)',
    includeNumber: '숫자 포함 (0-9)',
    includeSymbol: '특수문자 포함 (!@#...)',
    excludeSimilar: '유사 문자 제외 (O/0, l/1 등)',
    generate: '생성하기',
    reset: '리셋',
    result: '생성 결과',
    copy: '복사',
    copied: '복사됨',
    invalidOption: '최소 한 개의 문자셋을 선택해 주세요.',
    strength: '강도',
    weak: '약함',
    medium: '보통',
    strong: '강함',
    veryStrong: '매우 강함'
  },
  en: {
    kicker: 'TEXT TOOL',
    title: 'Password Generator',
    description: 'Generate strong passwords with configurable length and character options.',
    length: 'Password Length',
    includeUpper: 'Include uppercase (A-Z)',
    includeLower: 'Include lowercase (a-z)',
    includeNumber: 'Include numbers (0-9)',
    includeSymbol: 'Include symbols (!@#...)',
    excludeSimilar: 'Exclude similar chars (O/0, l/1, etc.)',
    generate: 'Generate',
    reset: 'Reset',
    result: 'Generated Password',
    copy: 'Copy',
    copied: 'Copied',
    invalidOption: 'Select at least one character set.',
    strength: 'Strength',
    weak: 'Weak',
    medium: 'Medium',
    strong: 'Strong',
    veryStrong: 'Very Strong'
  }
};

const CHARSETS = {
  upper: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  lower: 'abcdefghijklmnopqrstuvwxyz',
  number: '0123456789',
  symbol: '!@#$%^&*()_+-=[]{}|;:,.<>?'
};

const SIMILAR_CHARS = /[O0Il1|]/g;

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

function evaluateStrength(password, optionsEnabled) {
  let score = 0;
  if (password.length >= 8) score += 1;
  if (password.length >= 12) score += 1;
  if (password.length >= 16) score += 1;
  score += Math.min(optionsEnabled, 4);

  if (score <= 3) return 'weak';
  if (score <= 5) return 'medium';
  if (score <= 6) return 'strong';
  return 'veryStrong';
}

function PasswordGeneratorPage() {
  const { language } = useLanguage();
  const copy = COPY[language];

  const [length, setLength] = useState(16);
  const [includeUpper, setIncludeUpper] = useState(true);
  const [includeLower, setIncludeLower] = useState(true);
  const [includeNumber, setIncludeNumber] = useState(true);
  const [includeSymbol, setIncludeSymbol] = useState(true);
  const [excludeSimilar, setExcludeSimilar] = useState(true);
  const [result, setResult] = useState('');
  const [errorText, setErrorText] = useState('');
  const [copied, setCopied] = useState(false);

  const strength = useMemo(() => {
    if (!result) return '';
    const optionCount = [includeUpper, includeLower, includeNumber, includeSymbol].filter(Boolean).length;
    return evaluateStrength(result, optionCount);
  }, [result, includeUpper, includeLower, includeNumber, includeSymbol]);

  function onGenerate() {
    let charset = '';
    if (includeUpper) charset += CHARSETS.upper;
    if (includeLower) charset += CHARSETS.lower;
    if (includeNumber) charset += CHARSETS.number;
    if (includeSymbol) charset += CHARSETS.symbol;

    if (excludeSimilar) {
      charset = charset.replace(SIMILAR_CHARS, '');
    }

    if (!charset) {
      setErrorText(copy.invalidOption);
      setResult('');
      return;
    }

    const safeLength = Math.max(4, Math.min(256, Number(length) || 4));
    const generated = buildRandomString(safeLength, charset);
    setResult(generated);
    setErrorText('');
    setCopied(false);

    trackEvent('tool_generate', {
      tool_name: 'password-generator',
      length: safeLength
    });
  }

  function onReset() {
    setLength(16);
    setIncludeUpper(true);
    setIncludeLower(true);
    setIncludeNumber(true);
    setIncludeSymbol(true);
    setExcludeSimilar(true);
    setResult('');
    setErrorText('');
    setCopied(false);
    trackEvent('tool_reset', { tool_name: 'password-generator' });
  }

  async function onCopy() {
    if (!result || !navigator?.clipboard?.writeText) return;
    try {
      await navigator.clipboard.writeText(result);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
      trackEvent('tool_copy', { tool_name: 'password-generator' });
    } catch {
      setCopied(false);
    }
  }

  function getStrengthText() {
    if (strength === 'weak') return copy.weak;
    if (strength === 'medium') return copy.medium;
    if (strength === 'strong') return copy.strong;
    if (strength === 'veryStrong') return copy.veryStrong;
    return '-';
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
          <label className="custom-field" htmlFor="password-length">
            <span>{copy.length}</span>
            <input
              id="password-length"
              type="number"
              min="4"
              max="256"
              value={length}
              onChange={(event) => setLength(Number(event.target.value || 4))}
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
            <label className="checkbox-field">
              <input
                type="checkbox"
                checked={excludeSimilar}
                onChange={(event) => setExcludeSimilar(event.target.checked)}
              />
              <span>{copy.excludeSimilar}</span>
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
          <p className="converter-meta">
            {copy.strength}: <strong>{getStrengthText()}</strong>
          </p>
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

export default PasswordGeneratorPage;
