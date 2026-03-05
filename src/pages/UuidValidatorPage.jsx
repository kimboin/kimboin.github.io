import { useMemo, useState } from 'react';
import { trackEvent } from '../lib/analytics';
import { useLanguage } from '../lib/language';

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-([1-8])[0-9a-f]{3}-([89ab])[0-9a-f]{3}-[0-9a-f]{12}$/i;

const COPY = {
  ko: {
    kicker: '텍스트 도구',
    title: 'UUID 검사기',
    description: 'UUID 문자열이 유효한 형식인지 확인하고 버전/variant 정보를 표시합니다.',
    inputLabel: 'UUID 입력',
    inputPlaceholder: '예) 550e8400-e29b-41d4-a716-446655440000',
    validate: '검사하기',
    reset: '리셋',
    resultTitle: '검사 결과',
    valid: '유효한 UUID입니다.',
    invalid: '유효하지 않은 UUID입니다.',
    version: '버전',
    variant: 'Variant',
    normalized: '정규화 값',
    copy: '복사',
    copied: '복사됨',
    variantRfc: 'RFC 4122/9562'
  },
  en: {
    kicker: 'TEXT TOOL',
    title: 'UUID Validator',
    description: 'Validate UUID format and show version/variant information.',
    inputLabel: 'UUID Input',
    inputPlaceholder: 'e.g. 550e8400-e29b-41d4-a716-446655440000',
    validate: 'Validate',
    reset: 'Reset',
    resultTitle: 'Validation Result',
    valid: 'Valid UUID.',
    invalid: 'Invalid UUID.',
    version: 'Version',
    variant: 'Variant',
    normalized: 'Normalized',
    copy: 'Copy',
    copied: 'Copied',
    variantRfc: 'RFC 4122/9562'
  }
};

function validateUuid(input) {
  const normalized = input.trim().toLowerCase();
  const match = normalized.match(UUID_REGEX);
  if (!match) {
    return { valid: false, normalized: '' };
  }

  return {
    valid: true,
    normalized,
    version: match[1],
    variant: match[2]
  };
}

function UuidValidatorPage() {
  const { language } = useLanguage();
  const copy = COPY[language];

  const [input, setInput] = useState('');
  const [validated, setValidated] = useState(false);
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => validateUuid(input), [input]);

  function onValidate() {
    setValidated(true);
    setCopied(false);
    trackEvent('tool_generate', { tool_name: 'uuid-validator', valid: result.valid });
  }

  function onReset() {
    setInput('');
    setValidated(false);
    setCopied(false);
    trackEvent('tool_reset', { tool_name: 'uuid-validator' });
  }

  async function onCopy() {
    if (!result.valid || !result.normalized || !navigator?.clipboard?.writeText) {
      return;
    }
    try {
      await navigator.clipboard.writeText(result.normalized);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
      trackEvent('tool_copy', { tool_name: 'uuid-validator' });
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
          <label className="custom-field">
            <span>{copy.inputLabel}</span>
            <input
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder={copy.inputPlaceholder}
            />
          </label>

          <div className="actions">
            <button type="button" className="button primary" onClick={onValidate}>
              {copy.validate}
            </button>
            <button type="button" className="button ghost" onClick={onReset}>
              {copy.reset}
            </button>
          </div>
        </section>

        {validated ? (
          <section className="card converter-card" aria-live="polite">
            <h2>{copy.resultTitle}</h2>
            <p className={result.valid ? 'converter-hint' : 'converter-error'}>{result.valid ? copy.valid : copy.invalid}</p>

            {result.valid ? (
              <>
                <p className="converter-meta">
                  {copy.version}: <strong>v{result.version}</strong>
                </p>
                <p className="converter-meta">
                  {copy.variant}: <strong>{copy.variantRfc}</strong>
                </p>
                <p className="converter-meta">
                  {copy.normalized}: <strong>{result.normalized}</strong>
                </p>
                <div className="actions">
                  <button type="button" className="button ghost" onClick={onCopy}>
                    {copied ? copy.copied : copy.copy}
                  </button>
                </div>
              </>
            ) : null}
          </section>
        ) : null}
      </div>
    </section>
  );
}

export default UuidValidatorPage;
