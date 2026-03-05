import { useState } from 'react';
import { trackEvent } from '../lib/analytics';
import { useLanguage } from '../lib/language';

const COPY = {
  ko: {
    kicker: '텍스트 도구',
    title: 'UUID 생성기',
    description: 'UUID v4를 한 번에 여러 개 생성하고 복사할 수 있습니다.',
    count: '생성 개수',
    generate: '생성',
    clear: '리셋',
    copyAll: '전체 복사',
    copied: '복사됨',
    result: '생성 결과'
  },
  en: {
    kicker: 'TEXT TOOL',
    title: 'UUID Generator',
    description: 'Generate multiple UUID v4 values at once and copy them quickly.',
    count: 'Count',
    generate: 'Generate',
    clear: 'Reset',
    copyAll: 'Copy all',
    copied: 'Copied',
    result: 'Generated UUIDs'
  }
};

function fallbackUuidV4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (char) => {
    const random = Math.floor(Math.random() * 16);
    const value = char === 'x' ? random : (random & 0x3) | 0x8;
    return value.toString(16);
  });
}

function generateUuidV4() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return fallbackUuidV4();
}

function UuidGeneratorPage() {
  const { language } = useLanguage();
  const copy = COPY[language];

  const [count, setCount] = useState(5);
  const [results, setResults] = useState([]);
  const [copied, setCopied] = useState(false);

  function onGenerate() {
    const safeCount = Math.max(1, Math.min(100, Number(count) || 1));
    const nextResults = Array.from({ length: safeCount }, () => generateUuidV4());
    setResults(nextResults);
    setCopied(false);

    trackEvent('tool_generate', {
      tool_name: 'uuid-generator',
      count: safeCount
    });
  }

  function onReset() {
    setCount(5);
    setResults([]);
    setCopied(false);
    trackEvent('tool_reset', { tool_name: 'uuid-generator' });
  }

  async function onCopyAll() {
    if (!results.length || !navigator?.clipboard?.writeText) {
      return;
    }

    try {
      await navigator.clipboard.writeText(results.join('\n'));
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
      trackEvent('tool_copy', { tool_name: 'uuid-generator' });
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
          <div className="actions">
            <label className="custom-field" htmlFor="uuid-count">
              <span>{copy.count}</span>
              <input
                id="uuid-count"
                type="number"
                min="1"
                max="100"
                value={count}
                onChange={(event) => setCount(Number(event.target.value || 1))}
              />
            </label>
          </div>
          <div className="actions">
            <button type="button" className="button primary" onClick={onGenerate}>
              {copy.generate}
            </button>
            <button type="button" className="button ghost" onClick={onReset}>
              {copy.clear}
            </button>
            <button type="button" className="button ghost" onClick={onCopyAll} disabled={!results.length}>
              {copied ? copy.copied : copy.copyAll}
            </button>
          </div>
        </section>

        <section className="card converter-card" aria-live="polite">
          <h2>{copy.result}</h2>
          <textarea className="text-counter-input" readOnly value={results.join('\n')} />
        </section>
      </div>
    </section>
  );
}

export default UuidGeneratorPage;
