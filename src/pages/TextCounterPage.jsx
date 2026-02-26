import { useEffect, useMemo, useState } from 'react';
import { trackEvent } from '../lib/analytics';

function TextCounterPage() {
  const [text, setText] = useState('');

  const stats = useMemo(() => {
    const characters = text.length;
    const charactersNoSpaces = text.replace(/\s/g, '').length;
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    const lines = text ? text.split(/\r\n|\r|\n/).length : 0;
    const bytes = new TextEncoder().encode(text).length;

    return { characters, charactersNoSpaces, words, lines, bytes };
  }, [text]);

  useEffect(() => {
    trackEvent('tool_open', { tool_name: 'text-counter' });
  }, []);

  function onClear() {
    if (!text) {
      return;
    }
    setText('');
    trackEvent('tool_reset', { tool_name: 'text-counter' });
  }

  return (
    <section className="section">
      <div className="container tool-layout">
        <header className="hero tool-hero">
          <p className="kicker">TEXT COUNTER</p>
          <h1>글자수 세기</h1>
          <p>텍스트를 입력하면 글자수, 바이트 수, 공백 제외 글자수, 단어 수, 줄 수를 바로 확인할 수 있습니다.</p>
        </header>

        <section className="card">
          <h2>텍스트 입력</h2>
          <textarea
            className="text-counter-input"
            placeholder="여기에 텍스트를 입력하세요."
            value={text}
            onChange={(event) => setText(event.target.value)}
            aria-label="글자수 계산 텍스트 입력"
          />
          <div className="actions">
            <button type="button" className="button ghost" onClick={onClear}>
              지우기
            </button>
          </div>
        </section>

        <section className="card" aria-live="polite">
          <h2>결과</h2>
          <div className="counter-stats">
            <article className="counter-stat">
              <p className="counter-label">글자수</p>
              <strong>{stats.characters.toLocaleString()}</strong>
            </article>
            <article className="counter-stat">
              <p className="counter-label">바이트 (UTF-8)</p>
              <strong>{stats.bytes.toLocaleString()}</strong>
            </article>
            <article className="counter-stat">
              <p className="counter-label">공백 제외</p>
              <strong>{stats.charactersNoSpaces.toLocaleString()}</strong>
            </article>
            <article className="counter-stat">
              <p className="counter-label">단어 수</p>
              <strong>{stats.words.toLocaleString()}</strong>
            </article>
            <article className="counter-stat">
              <p className="counter-label">줄 수</p>
              <strong>{stats.lines.toLocaleString()}</strong>
            </article>
          </div>
        </section>
      </div>
    </section>
  );
}

export default TextCounterPage;
