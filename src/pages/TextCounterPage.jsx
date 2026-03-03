import { useMemo, useState } from 'react';
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
          lines: '줄 수',
          guideTitle: '항목 설명',
          guideItems: [
            '글자수: 공백/줄바꿈 포함 전체 문자 수',
            '바이트(UTF-8): 실제 저장/전송 기준 용량',
            '공백 제외: 공백/줄바꿈을 제외한 문자 수',
            '단어 수: 공백 기준으로 분리한 단어 개수',
            '줄 수: 줄바꿈 기준 라인 개수'
          ],
          useTitle: '이럴 때 유용합니다',
          useItems: [
            '자소서/제출문서 글자 수 제한 확인',
            'SNS/메타 설명문 길이 점검',
            'DB 컬럼 또는 API payload 바이트 제한 확인'
          ]
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
          lines: 'Lines',
          guideTitle: 'Metric Guide',
          guideItems: [
            'Characters: total characters including spaces and line breaks',
            'Bytes (UTF-8): storage/transfer size in bytes',
            'No Spaces: characters excluding spaces and line breaks',
            'Words: tokens split by whitespace',
            'Lines: number of lines by line break'
          ],
          useTitle: 'Useful when',
          useItems: [
            'Checking text limits for forms and submissions',
            'Validating copy length for social and metadata',
            'Estimating byte limits for DB fields or APIs'
          ]
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

        <section className="card">
          <h2>{copy.guideTitle}</h2>
          <ul className="list">
            {copy.guideItems.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <h3>{copy.useTitle}</h3>
          <ul className="list">
            {copy.useItems.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
      </div>
    </section>
  );
}

export default TextCounterPage;
