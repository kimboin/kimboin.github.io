import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { trackEvent } from '../lib/analytics';
import { useLanguage } from '../lib/language';

const COPY = {
  ko: {
    kicker: '텍스트 도구',
    title: 'QR 코드 해석기',
    description: '이미지 파일에서 QR 코드를 읽어 텍스트/URL 값을 추출합니다.',
    fileLabel: 'QR 이미지 선택',
    decode: '해석하기',
    reset: '리셋',
    resultTitle: '해석 결과',
    previewAlt: '업로드한 QR 이미지 미리보기',
    copy: '복사',
    copied: '복사됨',
    notSupported: '현재 브라우저는 QR 해석 기능(BarcodeDetector)을 지원하지 않습니다.',
    notFound: 'QR 코드를 찾지 못했습니다. 이미지가 선명한지 확인해 주세요.',
    failed: 'QR 해석에 실패했습니다.',
    empty: '먼저 QR 이미지 파일을 선택해 주세요.',
    goToGenerator: 'QR 생성기로 이동'
  },
  en: {
    kicker: 'TEXT TOOL',
    title: 'QR Code Decoder',
    description: 'Extract text/URL values by decoding QR codes from image files.',
    fileLabel: 'Select QR image',
    decode: 'Decode',
    reset: 'Reset',
    resultTitle: 'Decoded Result',
    previewAlt: 'Uploaded QR image preview',
    copy: 'Copy',
    copied: 'Copied',
    notSupported: 'This browser does not support QR decoding (BarcodeDetector).',
    notFound: 'No QR code was found. Please try a clearer image.',
    failed: 'Failed to decode QR code.',
    empty: 'Please select a QR image file first.',
    goToGenerator: 'Go to QR Generator'
  }
};

async function decodeQrFromFile(file) {
  if (typeof window === 'undefined' || typeof window.BarcodeDetector === 'undefined') {
    throw new Error('NOT_SUPPORTED');
  }

  let detector;
  try {
    detector = new window.BarcodeDetector({ formats: ['qr_code'] });
  } catch {
    detector = new window.BarcodeDetector();
  }

  const bitmap = await createImageBitmap(file);
  try {
    const results = await detector.detect(bitmap);
    if (!results || results.length === 0 || !results[0].rawValue) {
      throw new Error('NOT_FOUND');
    }
    return results[0].rawValue;
  } finally {
    if (typeof bitmap.close === 'function') {
      bitmap.close();
    }
  }
}

function QrCodeDecoderPage() {
  const { language } = useLanguage();
  const copy = COPY[language];

  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [decodedText, setDecodedText] = useState('');
  const [errorText, setErrorText] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  function onFileChange(event) {
    const nextFile = event.target.files?.[0];
    if (!nextFile) {
      return;
    }

    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    setFile(nextFile);
    setPreviewUrl(URL.createObjectURL(nextFile));
    setDecodedText('');
    setErrorText('');
    setCopied(false);
  }

  async function onDecode() {
    if (!file) {
      setErrorText(copy.empty);
      return;
    }

    try {
      const value = await decodeQrFromFile(file);
      setDecodedText(value);
      setErrorText('');
      setCopied(false);
      trackEvent('tool_generate', { tool_name: 'qr-code-decoder' });
    } catch (error) {
      setDecodedText('');
      if (error.message === 'NOT_SUPPORTED') {
        setErrorText(copy.notSupported);
      } else if (error.message === 'NOT_FOUND') {
        setErrorText(copy.notFound);
      } else {
        setErrorText(copy.failed);
      }
    }
  }

  function onReset() {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setFile(null);
    setPreviewUrl('');
    setDecodedText('');
    setErrorText('');
    setCopied(false);
    trackEvent('tool_reset', { tool_name: 'qr-code-decoder' });
  }

  async function onCopy() {
    if (!decodedText || !navigator?.clipboard?.writeText) {
      return;
    }

    try {
      await navigator.clipboard.writeText(decodedText);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
      trackEvent('tool_copy', { tool_name: 'qr-code-decoder' });
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
          <div className="actions">
            <Link className="button ghost" to="/qr-code-generator">
              {copy.goToGenerator}
            </Link>
          </div>
        </header>

        <section className="card converter-card">
          <label className="custom-field">
            <span>{copy.fileLabel}</span>
            <input className="converter-file-input" type="file" accept="image/*" onChange={onFileChange} />
          </label>

          <div className="actions">
            <button type="button" className="button primary" onClick={onDecode}>
              {copy.decode}
            </button>
            <button type="button" className="button ghost" onClick={onReset}>
              {copy.reset}
            </button>
          </div>

          {previewUrl ? (
            <div className="converter-preview-wrap">
              <img className="converter-preview" src={previewUrl} alt={copy.previewAlt} />
            </div>
          ) : null}

          {errorText ? <p className="converter-error">{errorText}</p> : null}
        </section>

        <section className="card converter-card" aria-live="polite">
          <h2>{copy.resultTitle}</h2>
          <textarea className="text-counter-input" readOnly value={decodedText} />
          <div className="actions">
            <button type="button" className="button ghost" onClick={onCopy} disabled={!decodedText}>
              {copied ? copy.copied : copy.copy}
            </button>
          </div>
        </section>
      </div>
    </section>
  );
}

export default QrCodeDecoderPage;
