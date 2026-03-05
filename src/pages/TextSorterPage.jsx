import { useMemo, useState } from 'react';
import { trackEvent } from '../lib/analytics';
import { useLanguage } from '../lib/language';

const COPY = {
  ko: {
    kicker: '텍스트 도구',
    title: '텍스트 정렬기',
    description: '여러 줄 텍스트를 정렬하고 중복을 제거해 결과를 빠르게 정리할 수 있습니다.',
    inputTitle: '입력 텍스트',
    outputTitle: '정렬 결과',
    inputPlaceholder: '한 줄에 하나씩 입력하세요',
    sortOrder: '정렬 방향',
    ascending: '오름차순',
    descending: '내림차순',
    ignoreCase: '대소문자 무시',
    removeDuplicates: '중복 제거',
    removeEmptyLines: '빈 줄 제거',
    sort: '정렬하기',
    reset: '리셋',
    copy: '복사',
    copied: '복사됨',
    lineCount: '줄 수'
  },
  en: {
    kicker: 'TEXT TOOL',
    title: 'Text Sorter',
    description: 'Sort multiline text and remove duplicates to clean up results quickly.',
    inputTitle: 'Input Text',
    outputTitle: 'Sorted Output',
    inputPlaceholder: 'Enter one item per line',
    sortOrder: 'Sort Order',
    ascending: 'Ascending',
    descending: 'Descending',
    ignoreCase: 'Ignore case',
    removeDuplicates: 'Remove duplicates',
    removeEmptyLines: 'Remove empty lines',
    sort: 'Sort',
    reset: 'Reset',
    copy: 'Copy',
    copied: 'Copied',
    lineCount: 'Line count'
  }
};

function TextSorterPage() {
  const { language } = useLanguage();
  const copy = COPY[language];

  const [inputText, setInputText] = useState('');
  const [order, setOrder] = useState('asc');
  const [ignoreCase, setIgnoreCase] = useState(true);
  const [removeDuplicates, setRemoveDuplicates] = useState(false);
  const [removeEmptyLines, setRemoveEmptyLines] = useState(true);
  const [outputText, setOutputText] = useState('');
  const [copied, setCopied] = useState(false);

  const inputLineCount = useMemo(() => (inputText ? inputText.split(/\r\n|\r|\n/).length : 0), [inputText]);
  const outputLineCount = useMemo(() => (outputText ? outputText.split(/\r\n|\r|\n/).length : 0), [outputText]);

  function onSort() {
    const lines = inputText.split(/\r\n|\r|\n/);

    let nextLines = removeEmptyLines ? lines.filter((line) => line.trim() !== '') : lines;

    if (removeDuplicates) {
      const seen = new Set();
      nextLines = nextLines.filter((line) => {
        const key = ignoreCase ? line.toLowerCase() : line;
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      });
    }

    const sorted = [...nextLines].sort((a, b) => {
      const aa = ignoreCase ? a.toLowerCase() : a;
      const bb = ignoreCase ? b.toLowerCase() : b;
      if (aa < bb) return order === 'asc' ? -1 : 1;
      if (aa > bb) return order === 'asc' ? 1 : -1;
      return 0;
    });

    setOutputText(sorted.join('\n'));
    setCopied(false);

    trackEvent('tool_generate', {
      tool_name: 'text-sorter',
      order,
      ignore_case: ignoreCase,
      remove_duplicates: removeDuplicates,
      remove_empty_lines: removeEmptyLines
    });
  }

  function onReset() {
    setInputText('');
    setOrder('asc');
    setIgnoreCase(true);
    setRemoveDuplicates(false);
    setRemoveEmptyLines(true);
    setOutputText('');
    setCopied(false);
    trackEvent('tool_reset', { tool_name: 'text-sorter' });
  }

  async function onCopy() {
    if (!outputText || !navigator?.clipboard?.writeText) return;
    try {
      await navigator.clipboard.writeText(outputText);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
      trackEvent('tool_copy', { tool_name: 'text-sorter' });
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
          <h2>{copy.inputTitle}</h2>
          <textarea
            className="text-counter-input"
            value={inputText}
            onChange={(event) => setInputText(event.target.value)}
            placeholder={copy.inputPlaceholder}
          />
          <p className="converter-meta">
            {copy.lineCount}: {inputLineCount}
          </p>

          <div className="grid two">
            <label className="custom-field">
              <span>{copy.sortOrder}</span>
              <select value={order} onChange={(event) => setOrder(event.target.value)}>
                <option value="asc">{copy.ascending}</option>
                <option value="desc">{copy.descending}</option>
              </select>
            </label>
          </div>

          <div className="grid two">
            <label className="checkbox-field">
              <input type="checkbox" checked={ignoreCase} onChange={(event) => setIgnoreCase(event.target.checked)} />
              <span>{copy.ignoreCase}</span>
            </label>
            <label className="checkbox-field">
              <input
                type="checkbox"
                checked={removeDuplicates}
                onChange={(event) => setRemoveDuplicates(event.target.checked)}
              />
              <span>{copy.removeDuplicates}</span>
            </label>
            <label className="checkbox-field">
              <input
                type="checkbox"
                checked={removeEmptyLines}
                onChange={(event) => setRemoveEmptyLines(event.target.checked)}
              />
              <span>{copy.removeEmptyLines}</span>
            </label>
          </div>

          <div className="actions">
            <button type="button" className="button primary" onClick={onSort}>
              {copy.sort}
            </button>
            <button type="button" className="button ghost" onClick={onReset}>
              {copy.reset}
            </button>
          </div>
        </section>

        <section className="card converter-card" aria-live="polite">
          <h2>{copy.outputTitle}</h2>
          <textarea className="text-counter-input" readOnly value={outputText} />
          <p className="converter-meta">
            {copy.lineCount}: {outputLineCount}
          </p>
          <div className="actions">
            <button type="button" className="button ghost" onClick={onCopy} disabled={!outputText}>
              {copied ? copy.copied : copy.copy}
            </button>
          </div>
        </section>
      </div>
    </section>
  );
}

export default TextSorterPage;
