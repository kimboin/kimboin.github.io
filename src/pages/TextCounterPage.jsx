import { useEffect, useMemo, useState } from 'react';
import { trackEvent } from '../lib/analytics';
import { useLanguage } from '../lib/language';

function TextCounterPage() {
  const { language } = useLanguage();
  const copy =
    language === 'ko'
      ? {
          title: '글자수 세기',
          description: '텍스트를 입력하면 글자수, 바이트 수, 공백 제외 글자수, 단어 수, 줄 수를 바로 확인할 수 있습니다.',
          inputTitle: '텍스트 입력',
          placeholder: '여기에 텍스트를 입력하세요.',
          ariaLabel: '글자수 계산 텍스트 입력',
          clear: '지우기',
          resultTitle: '결과',
          characters: '글자수',
          bytes: '바이트 (UTF-8)',
          noSpaces: '공백 제외',
          words: '단어 수',
          lines: '줄 수'
        }
      : {
          title: 'Text Counter',
          description: 'Type text to instantly check characters, bytes, characters without spaces, words, and lines.',
          inputTitle: 'Text Input',
          placeholder: 'Type your text here.',
          ariaLabel: 'Text input for counter',
          clear: 'Clear',
          resultTitle: 'Result',
          characters: 'Characters',
          bytes: 'Bytes (UTF-8)',
          noSpaces: 'No Spaces',
          words: 'Words',
          lines: 'Lines'
        };

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
          <h1>{copy.title}</h1>
          <p>{copy.description}</p>
        </header>

        <section className="card">
          <h2>{copy.inputTitle}</h2>
          <textarea
            className="text-counter-input"
            placeholder={copy.placeholder}
            value={text}
            onChange={(event) => setText(event.target.value)}
            aria-label={copy.ariaLabel}
          />
          <div className="actions">
            <button type="button" className="button ghost" onClick={onClear}>
              {copy.clear}
            </button>
          </div>
        </section>

        <section className="card" aria-live="polite">
          <h2>{copy.resultTitle}</h2>
          <div className="counter-stats">
            <article className="counter-stat">
              <p className="counter-label">{copy.characters}</p>
              <strong>{stats.characters.toLocaleString()}</strong>
            </article>
            <article className="counter-stat">
              <p className="counter-label">{copy.bytes}</p>
              <strong>{stats.bytes.toLocaleString()}</strong>
            </article>
            <article className="counter-stat">
              <p className="counter-label">{copy.noSpaces}</p>
              <strong>{stats.charactersNoSpaces.toLocaleString()}</strong>
            </article>
            <article className="counter-stat">
              <p className="counter-label">{copy.words}</p>
              <strong>{stats.words.toLocaleString()}</strong>
            </article>
            <article className="counter-stat">
              <p className="counter-label">{copy.lines}</p>
              <strong>{stats.lines.toLocaleString()}</strong>
            </article>
          </div>
        </section>
      </div>
    </section>
  );
}

export default TextCounterPage;
