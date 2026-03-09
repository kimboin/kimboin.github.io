import { useState } from 'react';
import { trackEvent } from '../lib/analytics';
import { useLanguage } from '../lib/language';

const COPY = {
  ko: {
    kicker: '텍스트 도구',
    title: 'URL Encode / Decode',
    description: '문자열을 URL 인코딩하거나 인코딩된 URL 문자열을 디코딩할 수 있습니다.',
    encodeTitle: 'Text → URL Encode',
    decodeTitle: 'URL Decode → Text',
    inputText: '원본 텍스트',
    encodedText: '인코딩 결과',
    inputEncoded: '인코딩 문자열 입력',
    decodedText: '디코딩 결과',
    placeholderText: '여기에 텍스트를 입력하세요',
    placeholderEncoded: '여기에 URL 인코딩 문자열을 입력하세요',
    encode: '인코딩',
    decode: '디코딩',
    reset: '리셋',
    copy: '복사',
    copied: '복사됨',
    invalid: '유효하지 않은 인코딩 문자열입니다.'
  },
  en: {
    kicker: 'TEXT TOOL',
    title: 'URL Encode / Decode',
    description: 'Encode text for URLs or decode encoded URL strings back to plain text.',
    encodeTitle: 'Text → URL Encode',
    decodeTitle: 'URL Decode → Text',
    inputText: 'Input Text',
    encodedText: 'Encoded Output',
    inputEncoded: 'Encoded Input',
    decodedText: 'Decoded Output',
    placeholderText: 'Type text here',
    placeholderEncoded: 'Paste URL-encoded text here',
    encode: 'Encode',
    decode: 'Decode',
    reset: 'Reset',
    copy: 'Copy',
    copied: 'Copied',
    invalid: 'Invalid encoded string.'
  }
};

function UrlEncoderDecoderPage() {
  const { language } = useLanguage();
  const copy = COPY[language];

  const [plainText, setPlainText] = useState('');
  const [encodedText, setEncodedText] = useState('');
  const [encodedInput, setEncodedInput] = useState('');
  const [decodedText, setDecodedText] = useState('');
  const [errorText, setErrorText] = useState('');
  const [copiedTarget, setCopiedTarget] = useState('');

  function onEncode() {
    const output = encodeURIComponent(plainText);
    setEncodedText(output);
    setErrorText('');
    trackEvent('tool_generate', { tool_name: 'url-encoder-decoder', action: 'encode' });
  }

  function onDecode() {
    try {
      const output = decodeURIComponent(encodedInput);
      setDecodedText(output);
      setErrorText('');
      trackEvent('tool_generate', { tool_name: 'url-encoder-decoder', action: 'decode' });
    } catch {
      setDecodedText('');
      setErrorText(copy.invalid);
    }
  }

  function onResetEncode() {
    setPlainText('');
    setEncodedText('');
    setCopiedTarget('');
    setErrorText('');
  }

  function onResetDecode() {
    setEncodedInput('');
    setDecodedText('');
    setCopiedTarget('');
    setErrorText('');
  }

  async function onCopy(target) {
    if (!navigator?.clipboard?.writeText) {
      return;
    }
    const value = target === 'encode' ? encodedText : decodedText;
    if (!value) {
      return;
    }

    try {
      await navigator.clipboard.writeText(value);
      setCopiedTarget(target);
      setTimeout(() => setCopiedTarget(''), 1200);
      trackEvent('tool_copy', { tool_name: 'url-encoder-decoder', target });
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

        <div className="grid two">
          <section className="card converter-card">
            <h2>{copy.encodeTitle}</h2>
            <label className="custom-field">
              <span>{copy.inputText}</span>
              <textarea
                className="text-counter-input"
                value={plainText}
                onChange={(event) => setPlainText(event.target.value)}
                placeholder={copy.placeholderText}
              />
            </label>
            <div className="actions">
              <button type="button" className="button primary" onClick={onEncode}>
                {copy.encode}
              </button>
              <button type="button" className="button ghost" onClick={onResetEncode}>
                {copy.reset}
              </button>
            </div>
            <label className="custom-field">
              <span>{copy.encodedText}</span>
              <textarea className="text-counter-input" value={encodedText} readOnly />
            </label>
            <div className="actions">
              <button type="button" className="button ghost" onClick={() => onCopy('encode')} disabled={!encodedText}>
                {copiedTarget === 'encode' ? copy.copied : copy.copy}
              </button>
            </div>
          </section>

          <section className="card converter-card">
            <h2>{copy.decodeTitle}</h2>
            <label className="custom-field">
              <span>{copy.inputEncoded}</span>
              <textarea
                className="text-counter-input"
                value={encodedInput}
                onChange={(event) => setEncodedInput(event.target.value)}
                placeholder={copy.placeholderEncoded}
              />
            </label>
            <div className="actions">
              <button type="button" className="button primary" onClick={onDecode}>
                {copy.decode}
              </button>
              <button type="button" className="button ghost" onClick={onResetDecode}>
                {copy.reset}
              </button>
            </div>
            <label className="custom-field">
              <span>{copy.decodedText}</span>
              <textarea className="text-counter-input" value={decodedText} readOnly />
            </label>
            <div className="actions">
              <button type="button" className="button ghost" onClick={() => onCopy('decode')} disabled={!decodedText}>
                {copiedTarget === 'decode' ? copy.copied : copy.copy}
              </button>
            </div>
          </section>
        </div>

        {errorText ? <p className="converter-error">{errorText}</p> : null}
      </div>
    </section>
  );
}

export default UrlEncoderDecoderPage;
