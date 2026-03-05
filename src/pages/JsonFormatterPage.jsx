import { useMemo, useState } from 'react';
import { trackEvent } from '../lib/analytics';
import { useLanguage } from '../lib/language';

const COPY = {
  ko: {
    kicker: '텍스트 도구',
    title: 'JSON Formatter',
    description: 'JSON 문자열을 보기 좋게 정렬(Pretty)하거나 한 줄로 압축(Minify)할 수 있습니다.',
    inputTitle: '입력 JSON',
    inputPlaceholder: '{\n  "name": "kimboin"\n}',
    prettyTitle: '정렬 결과 (Pretty)',
    minifyTitle: '압축 결과 (Minify)',
    format: '정렬',
    minify: '압축',
    clear: '리셋',
    copy: '복사',
    copied: '복사됨',
    invalid: '유효하지 않은 JSON입니다.',
    valid: '유효한 JSON입니다.',
    statusTitle: '검증 상태'
  },
  en: {
    kicker: 'TEXT TOOL',
    title: 'JSON Formatter',
    description: 'Format JSON into pretty output or minify it into a compact one-line string.',
    inputTitle: 'Input JSON',
    inputPlaceholder: '{\n  "name": "kimboin"\n}',
    prettyTitle: 'Pretty Output',
    minifyTitle: 'Minified Output',
    format: 'Format',
    minify: 'Minify',
    clear: 'Reset',
    copy: 'Copy',
    copied: 'Copied',
    invalid: 'Invalid JSON.',
    valid: 'Valid JSON.',
    statusTitle: 'Validation Status'
  }
};

function parseJsonSafe(input) {
  if (!input.trim()) {
    return { ok: false, error: 'EMPTY' };
  }

  try {
    return { ok: true, value: JSON.parse(input) };
  } catch (error) {
    return { ok: false, error: error.message || 'INVALID_JSON' };
  }
}

function JsonFormatterPage() {
  const { language } = useLanguage();
  const copy = COPY[language];

  const [inputText, setInputText] = useState('');
  const [prettyText, setPrettyText] = useState('');
  const [minifyText, setMinifyText] = useState('');
  const [statusText, setStatusText] = useState('');
  const [copiedTarget, setCopiedTarget] = useState('');

  const parsed = useMemo(() => parseJsonSafe(inputText), [inputText]);

  function onFormat() {
    if (!parsed.ok) {
      setStatusText(copy.invalid);
      setPrettyText('');
      setMinifyText('');
      return;
    }

    const pretty = JSON.stringify(parsed.value, null, 2);
    const minified = JSON.stringify(parsed.value);

    setPrettyText(pretty);
    setMinifyText(minified);
    setStatusText(copy.valid);

    trackEvent('tool_generate', {
      tool_name: 'json-formatter',
      action: 'format'
    });
  }

  function onMinifyOnly() {
    if (!parsed.ok) {
      setStatusText(copy.invalid);
      setMinifyText('');
      return;
    }

    const minified = JSON.stringify(parsed.value);
    setMinifyText(minified);
    setStatusText(copy.valid);

    trackEvent('tool_generate', {
      tool_name: 'json-formatter',
      action: 'minify'
    });
  }

  function onReset() {
    setInputText('');
    setPrettyText('');
    setMinifyText('');
    setStatusText('');
    setCopiedTarget('');

    trackEvent('tool_reset', {
      tool_name: 'json-formatter'
    });
  }

  async function onCopy(target) {
    if (!navigator?.clipboard?.writeText) {
      return;
    }

    const text = target === 'pretty' ? prettyText : minifyText;
    if (!text) {
      return;
    }

    try {
      await navigator.clipboard.writeText(text);
      setCopiedTarget(target);
      window.setTimeout(() => setCopiedTarget(''), 1200);
      trackEvent('tool_copy', {
        tool_name: 'json-formatter',
        target
      });
    } catch {
      setCopiedTarget('');
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
          <h2>{copy.inputTitle}</h2>
          <textarea
            className="text-counter-input"
            value={inputText}
            onChange={(event) => setInputText(event.target.value)}
            placeholder={copy.inputPlaceholder}
            aria-label={copy.inputTitle}
          />
          <div className="actions">
            <button type="button" className="button primary" onClick={onFormat}>
              {copy.format}
            </button>
            <button type="button" className="button ghost" onClick={onMinifyOnly}>
              {copy.minify}
            </button>
            <button type="button" className="button ghost" onClick={onReset}>
              {copy.clear}
            </button>
          </div>
          <p className={statusText === copy.invalid ? 'converter-error' : 'converter-hint'}>
            {copy.statusTitle}: {statusText || '-'}
          </p>
        </section>

        <div className="grid two">
          <section className="card converter-card">
            <h2>{copy.prettyTitle}</h2>
            <textarea className="text-counter-input" value={prettyText} readOnly aria-label={copy.prettyTitle} />
            <div className="actions">
              <button type="button" className="button ghost" onClick={() => onCopy('pretty')} disabled={!prettyText}>
                {copiedTarget === 'pretty' ? copy.copied : copy.copy}
              </button>
            </div>
          </section>

          <section className="card converter-card">
            <h2>{copy.minifyTitle}</h2>
            <textarea className="text-counter-input" value={minifyText} readOnly aria-label={copy.minifyTitle} />
            <div className="actions">
              <button type="button" className="button ghost" onClick={() => onCopy('minify')} disabled={!minifyText}>
                {copiedTarget === 'minify' ? copy.copied : copy.copy}
              </button>
            </div>
          </section>
        </div>
      </div>
    </section>
  );
}

export default JsonFormatterPage;
