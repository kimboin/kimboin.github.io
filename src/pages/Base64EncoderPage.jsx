import { useState } from 'react';
import { trackEvent } from '../lib/analytics';
import { useLanguage } from '../lib/language';

const COPY = {
  ko: {
    kicker: '텍스트 도구',
    title: 'Base64 Encode / Decode',
    description: '일반 텍스트를 Base64로 인코딩하거나 Base64 문자열을 텍스트로 디코딩할 수 있습니다.',
    encodeTitle: 'Text → Base64',
    decodeTitle: 'Base64 → Text',
    inputText: '원본 텍스트',
    encodedText: '인코딩 결과',
    inputBase64: 'Base64 입력',
    decodedText: '디코딩 결과',
    placeholderText: '여기에 텍스트를 입력하세요',
    placeholderBase64: '여기에 Base64 문자열을 입력하세요',
    encode: '인코딩',
    decode: '디코딩',
    copy: '복사',
    copied: '복사됨',
    reset: '리셋',
    invalid: '유효하지 않은 Base64 문자열입니다.'
  },
  en: {
    kicker: 'TEXT TOOL',
    title: 'Base64 Encode / Decode',
    description: 'Encode plain text to Base64 or decode Base64 strings back to text.',
    encodeTitle: 'Text → Base64',
    decodeTitle: 'Base64 → Text',
    inputText: 'Input Text',
    encodedText: 'Encoded Output',
    inputBase64: 'Base64 Input',
    decodedText: 'Decoded Output',
    placeholderText: 'Type text here',
    placeholderBase64: 'Paste Base64 string here',
    encode: 'Encode',
    decode: 'Decode',
    copy: 'Copy',
    copied: 'Copied',
    reset: 'Reset',
    invalid: 'Invalid Base64 string.'
  }
};

function encodeUtf8ToBase64(text) {
  const bytes = new TextEncoder().encode(text);
  let binary = '';
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });
  return btoa(binary);
}

function decodeBase64ToUtf8(base64) {
  const clean = base64.replace(/\s+/g, '');
  const binary = atob(clean);
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

function Base64EncoderPage() {
  const { language } = useLanguage();
  const copy = COPY[language];

  const [plainText, setPlainText] = useState('');
  const [encodedText, setEncodedText] = useState('');
  const [base64Input, setBase64Input] = useState('');
  const [decodedText, setDecodedText] = useState('');
  const [errorText, setErrorText] = useState('');
  const [copiedTarget, setCopiedTarget] = useState('');

  function onEncode() {
    const output = encodeUtf8ToBase64(plainText);
    setEncodedText(output);
    setErrorText('');
    trackEvent('tool_generate', { tool_name: 'base64-encoder', action: 'encode' });
  }

  function onDecode() {
    try {
      const output = decodeBase64ToUtf8(base64Input);
      setDecodedText(output);
      setErrorText('');
      trackEvent('tool_generate', { tool_name: 'base64-encoder', action: 'decode' });
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
    setBase64Input('');
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
      trackEvent('tool_copy', { tool_name: 'base64-encoder', target });
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
              <span>{copy.inputBase64}</span>
              <textarea
                className="text-counter-input"
                value={base64Input}
                onChange={(event) => setBase64Input(event.target.value)}
                placeholder={copy.placeholderBase64}
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

export default Base64EncoderPage;
