import { useMemo, useState } from 'react';
import { trackEvent } from '../lib/analytics';
import { useLanguage } from '../lib/language';

const COPY = {
  ko: {
    kicker: '텍스트 도구',
    title: '텍스트 비교 (Diff)',
    description: '두 텍스트를 줄 단위로 비교해 변경된 부분을 빠르게 확인할 수 있습니다.',
    leftTitle: '원본 텍스트',
    rightTitle: '비교 텍스트',
    leftPlaceholder: '원본 텍스트를 입력하세요',
    rightPlaceholder: '비교할 텍스트를 입력하세요',
    compare: '비교하기',
    reset: '리셋',
    summary: '비교 요약',
    same: '같음',
    changed: '변경',
    added: '추가',
    removed: '삭제',
    resultTitle: '줄 단위 비교 결과',
    line: '줄',
    left: '원본',
    right: '비교',
    empty: '(빈 줄)',
    statusSame: '같음',
    statusChanged: '변경',
    statusAdded: '추가',
    statusRemoved: '삭제'
  },
  en: {
    kicker: 'TEXT TOOL',
    title: 'Text Diff Checker',
    description: 'Compare two texts line by line and quickly find what changed.',
    leftTitle: 'Original Text',
    rightTitle: 'Compared Text',
    leftPlaceholder: 'Enter original text',
    rightPlaceholder: 'Enter compared text',
    compare: 'Compare',
    reset: 'Reset',
    summary: 'Summary',
    same: 'Same',
    changed: 'Changed',
    added: 'Added',
    removed: 'Removed',
    resultTitle: 'Line-by-line Result',
    line: 'Line',
    left: 'Original',
    right: 'Compared',
    empty: '(empty line)',
    statusSame: 'Same',
    statusChanged: 'Changed',
    statusAdded: 'Added',
    statusRemoved: 'Removed'
  }
};

function buildDiffRows(leftText, rightText) {
  const leftLines = leftText.split(/\r\n|\r|\n/);
  const rightLines = rightText.split(/\r\n|\r|\n/);
  const maxLength = Math.max(leftLines.length, rightLines.length);

  const rows = [];
  for (let i = 0; i < maxLength; i += 1) {
    const left = leftLines[i];
    const right = rightLines[i];

    let type = 'same';
    if (left === undefined && right !== undefined) {
      type = 'added';
    } else if (left !== undefined && right === undefined) {
      type = 'removed';
    } else if (left !== right) {
      type = 'changed';
    }

    rows.push({
      line: i + 1,
      left: left ?? '',
      right: right ?? '',
      type
    });
  }

  return rows;
}

function TextDiffCheckerPage() {
  const { language } = useLanguage();
  const copy = COPY[language];

  const [leftText, setLeftText] = useState('');
  const [rightText, setRightText] = useState('');
  const [compared, setCompared] = useState(false);

  const rows = useMemo(() => buildDiffRows(leftText, rightText), [leftText, rightText]);

  const summary = useMemo(() => {
    return rows.reduce(
      (acc, row) => {
        acc[row.type] += 1;
        return acc;
      },
      { same: 0, changed: 0, added: 0, removed: 0 }
    );
  }, [rows]);

  function onCompare() {
    setCompared(true);
    trackEvent('tool_generate', { tool_name: 'text-diff-checker' });
  }

  function onReset() {
    setLeftText('');
    setRightText('');
    setCompared(false);
    trackEvent('tool_reset', { tool_name: 'text-diff-checker' });
  }

  function statusLabel(type) {
    if (type === 'changed') {
      return copy.statusChanged;
    }
    if (type === 'added') {
      return copy.statusAdded;
    }
    if (type === 'removed') {
      return copy.statusRemoved;
    }
    return copy.statusSame;
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
            <h2>{copy.leftTitle}</h2>
            <textarea
              className="text-counter-input"
              value={leftText}
              onChange={(event) => setLeftText(event.target.value)}
              placeholder={copy.leftPlaceholder}
            />
          </section>

          <section className="card converter-card">
            <h2>{copy.rightTitle}</h2>
            <textarea
              className="text-counter-input"
              value={rightText}
              onChange={(event) => setRightText(event.target.value)}
              placeholder={copy.rightPlaceholder}
            />
          </section>
        </div>

        <section className="card converter-card">
          <div className="actions">
            <button type="button" className="button primary" onClick={onCompare}>
              {copy.compare}
            </button>
            <button type="button" className="button ghost" onClick={onReset}>
              {copy.reset}
            </button>
          </div>
        </section>

        {compared ? (
          <>
            <section className="card converter-card" aria-live="polite">
              <h2>{copy.summary}</h2>
              <div className="counter-stats">
                <article className="counter-stat">
                  <p>{copy.same}</p>
                  <strong>{summary.same}</strong>
                </article>
                <article className="counter-stat">
                  <p>{copy.changed}</p>
                  <strong>{summary.changed}</strong>
                </article>
                <article className="counter-stat">
                  <p>{copy.added}</p>
                  <strong>{summary.added}</strong>
                </article>
                <article className="counter-stat">
                  <p>{copy.removed}</p>
                  <strong>{summary.removed}</strong>
                </article>
              </div>
            </section>

            <section className="card converter-card" aria-live="polite">
              <h2>{copy.resultTitle}</h2>
              <ul className="diff-list">
                {rows.map((row) => (
                  <li key={`${row.line}-${row.type}`} className={`diff-item diff-${row.type}`}>
                    <p className="diff-head">
                      {copy.line} {row.line} · {statusLabel(row.type)}
                    </p>
                    <p className="diff-line">
                      <strong>{copy.left}:</strong> {row.left || copy.empty}
                    </p>
                    <p className="diff-line">
                      <strong>{copy.right}:</strong> {row.right || copy.empty}
                    </p>
                  </li>
                ))}
              </ul>
            </section>
          </>
        ) : null}
      </div>
    </section>
  );
}

export default TextDiffCheckerPage;
