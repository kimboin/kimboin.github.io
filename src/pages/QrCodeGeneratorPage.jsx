import { Link } from 'react-router-dom';
import { useState } from 'react';
import { trackEvent } from '../lib/analytics';
import { useLanguage } from '../lib/language';

const QR_API_BASE = 'https://api.qrserver.com/v1/create-qr-code/';

const COPY = {
  ko: {
    kicker: '텍스트 도구',
    title: 'QR 코드 생성기',
    description: '텍스트, URL, 연락처 정보 등을 입력해 QR 코드를 생성하고 저장할 수 있습니다.',
    inputLabel: 'QR 내용 입력',
    inputPlaceholder: '예) https://kimboin.github.io',
    sizeLabel: '크기',
    generate: '생성하기',
    reset: '리셋',
    download: 'PNG 다운로드',
    previewTitle: '생성 결과',
    previewAlt: '생성된 QR 코드 미리보기',
    hint: 'URL, 텍스트, 와이파이 정보 등 다양한 문자열을 넣을 수 있습니다.',
    emptyError: 'QR 코드로 만들 내용을 입력해 주세요.',
    goToDecoder: 'QR 해석기로 이동'
  },
  en: {
    kicker: 'TEXT TOOL',
    title: 'QR Code Generator',
    description: 'Generate a QR code from text, URL, contact info, and download it as PNG.',
    inputLabel: 'QR Content',
    inputPlaceholder: 'e.g. https://kimboin.github.io',
    sizeLabel: 'Size',
    generate: 'Generate',
    reset: 'Reset',
    download: 'Download PNG',
    previewTitle: 'Result',
    previewAlt: 'Generated QR code preview',
    hint: 'You can use URLs, plain text, Wi-Fi payloads, and other strings.',
    emptyError: 'Please enter content to generate a QR code.',
    goToDecoder: 'Go to QR Decoder'
  }
};

const SIZE_OPTIONS = [200, 300, 400, 600];

function buildQrUrl(text, size) {
  const params = new URLSearchParams({
    size: `${size}x${size}`,
    format: 'png',
    margin: '10',
    data: text
  });
  return `${QR_API_BASE}?${params.toString()}`;
}

function QrCodeGeneratorPage() {
  const { language } = useLanguage();
  const copy = COPY[language];

  const [inputText, setInputText] = useState('');
  const [size, setSize] = useState(300);
  const [qrUrl, setQrUrl] = useState('');
  const [errorText, setErrorText] = useState('');

  function onGenerate() {
    const value = inputText.trim();
    if (!value) {
      setErrorText(copy.emptyError);
      setQrUrl('');
      return;
    }

    const nextUrl = buildQrUrl(value, size);
    setQrUrl(nextUrl);
    setErrorText('');

    trackEvent('tool_generate', {
      tool_name: 'qr-code-generator',
      size
    });
  }

  function onReset() {
    setInputText('');
    setSize(300);
    setQrUrl('');
    setErrorText('');
    trackEvent('tool_reset', { tool_name: 'qr-code-generator' });
  }

  return (
    <section className="section">
      <div className="container tool-layout">
        <header className="hero tool-hero">
          <p className="kicker">{copy.kicker}</p>
          <h1>{copy.title}</h1>
          <p>{copy.description}</p>
          <div className="actions">
            <Link className="button ghost" to="/qr-code-decoder">
              {copy.goToDecoder}
            </Link>
          </div>
        </header>

        <section className="card converter-card">
          <label className="custom-field">
            <span>{copy.inputLabel}</span>
            <textarea
              className="text-counter-input"
              value={inputText}
              onChange={(event) => setInputText(event.target.value)}
              placeholder={copy.inputPlaceholder}
            />
          </label>

          <label className="custom-field">
            <span>{copy.sizeLabel}</span>
            <select value={size} onChange={(event) => setSize(Number(event.target.value))}>
              {SIZE_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option} x {option}
                </option>
              ))}
            </select>
          </label>

          <p className="converter-hint">{copy.hint}</p>

          <div className="actions">
            <button type="button" className="button primary" onClick={onGenerate}>
              {copy.generate}
            </button>
            <button type="button" className="button ghost" onClick={onReset}>
              {copy.reset}
            </button>
            {qrUrl ? (
              <a className="button ghost" href={qrUrl} download="qr-code.png" target="_blank" rel="noopener noreferrer">
                {copy.download}
              </a>
            ) : null}
          </div>

          {errorText ? <p className="converter-error">{errorText}</p> : null}
        </section>

        {qrUrl ? (
          <section className="card converter-card" aria-live="polite">
            <h2>{copy.previewTitle}</h2>
            <div className="converter-preview-wrap">
              <img className="converter-preview" src={qrUrl} alt={copy.previewAlt} />
            </div>
          </section>
        ) : null}
      </div>
    </section>
  );
}

export default QrCodeGeneratorPage;
