import { useEffect, useRef, useState } from 'react';
import { trackEvent } from '../lib/analytics';
import { useLanguage } from '../lib/language';

const COPY = {
  ko: {
    kicker: '이미지 도구',
    title: '이미지 ↔ Base64 변환기',
    description: '이미지를 Base64 문자열로 변환하거나 Base64 문자열을 이미지로 복원할 수 있습니다.',
    imageToBase64Title: '이미지 → Base64',
    imageToBase64Desc: '파일을 업로드하면 Base64(Data URL) 문자열을 생성합니다.',
    base64ToImageTitle: 'Base64 → 이미지',
    base64ToImageDesc: 'Base64(Data URL 또는 순수 Base64)를 붙여넣으면 이미지로 변환합니다.',
    selectFile: '이미지 파일 선택',
    sourceName: '파일명',
    sourceSize: '크기',
    outputBase64: '변환 결과(Base64)',
    placeholder: '여기에 Base64 문자열을 붙여넣으세요',
    convertToImage: '이미지로 변환',
    resetFile: '파일 리셋',
    resetText: '텍스트 리셋',
    copy: '복사',
    copied: '복사됨',
    download: '다운로드',
    convertFailed: '변환에 실패했습니다.',
    invalidBase64: '유효한 Base64 문자열이 아닙니다.',
    previewAlt: '변환된 이미지 미리보기',
    tipsTitle: '사용 팁',
    tips: [
      'Data URL 형식(data:image/png;base64,...)과 순수 Base64 문자열 모두 지원합니다.',
      '문자열이 너무 길면 브라우저가 느려질 수 있으니 필요한 크기로만 사용하세요.',
      '이미지 용량이 클수록 Base64 문자열 길이는 더 크게 증가합니다.'
    ]
  },
  en: {
    kicker: 'IMAGE TOOL',
    title: 'Image ↔ Base64 Converter',
    description: 'Convert images to Base64 strings and restore Base64 strings back to images.',
    imageToBase64Title: 'Image → Base64',
    imageToBase64Desc: 'Upload an image file to generate a Base64(Data URL) string.',
    base64ToImageTitle: 'Base64 → Image',
    base64ToImageDesc: 'Paste a Base64 string (Data URL or raw Base64) and convert it to an image.',
    selectFile: 'Select image file',
    sourceName: 'File',
    sourceSize: 'Size',
    outputBase64: 'Converted Base64',
    placeholder: 'Paste Base64 string here',
    convertToImage: 'Convert to image',
    resetFile: 'Reset file',
    resetText: 'Reset text',
    copy: 'Copy',
    copied: 'Copied',
    download: 'Download',
    convertFailed: 'Conversion failed.',
    invalidBase64: 'Invalid Base64 string.',
    previewAlt: 'Converted image preview',
    tipsTitle: 'Tips',
    tips: [
      'Both Data URLs (data:image/png;base64,...) and raw Base64 are supported.',
      'Very long strings can slow down the browser.',
      'Larger images result in significantly longer Base64 strings.'
    ]
  }
};

function formatSizeKB(sizeInBytes, language) {
  const size = (sizeInBytes / 1024).toFixed(1);
  return language === 'ko' ? `${size}KB` : `${size} KB`;
}

function toDataUrl(base64Input) {
  const trimmed = base64Input.trim();
  if (!trimmed) {
    throw new Error('INVALID_BASE64');
  }

  if (trimmed.startsWith('data:image/')) {
    return trimmed;
  }

  const sanitized = trimmed.replace(/\s+/g, '');
  if (!/^[A-Za-z0-9+/=]+$/.test(sanitized)) {
    throw new Error('INVALID_BASE64');
  }

  return `data:image/png;base64,${sanitized}`;
}

function dataUrlToBlob(dataUrl) {
  const [header, body] = dataUrl.split(',');
  if (!header || !body || !header.includes('base64')) {
    throw new Error('INVALID_BASE64');
  }

  const mimeMatch = header.match(/data:(.*?);base64/);
  const mimeType = mimeMatch?.[1] || 'image/png';
  const binary = atob(body);
  const len = binary.length;
  const bytes = new Uint8Array(len);

  for (let i = 0; i < len; i += 1) {
    bytes[i] = binary.charCodeAt(i);
  }

  return new Blob([bytes], { type: mimeType });
}

function extensionFromMime(mimeType) {
  if (mimeType === 'image/jpeg') {
    return 'jpg';
  }
  if (mimeType === 'image/webp') {
    return 'webp';
  }
  if (mimeType === 'image/gif') {
    return 'gif';
  }
  return 'png';
}

function ImageBase64ConverterPage() {
  const { language } = useLanguage();
  const copy = COPY[language];
  const fileInputRef = useRef(null);

  const [sourceFile, setSourceFile] = useState(null);
  const [base64Text, setBase64Text] = useState('');
  const [base64Input, setBase64Input] = useState('');
  const [decodedImageUrl, setDecodedImageUrl] = useState('');
  const [decodedFileName, setDecodedFileName] = useState('converted-image.png');
  const [errorText, setErrorText] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => () => {
    if (decodedImageUrl) {
      URL.revokeObjectURL(decodedImageUrl);
    }
  }, [decodedImageUrl]);

  function onImageFileChange(event) {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    setSourceFile(file);
    setErrorText('');
    setCopied(false);

    const reader = new FileReader();
    reader.onload = () => {
      const result = typeof reader.result === 'string' ? reader.result : '';
      setBase64Text(result);
      trackEvent('tool_generate', {
        tool_name: 'image-base64-converter',
        direction: 'image_to_base64',
        input_type: file.type || 'unknown'
      });
    };
    reader.onerror = () => setErrorText(copy.convertFailed);
    reader.readAsDataURL(file);
  }

  function resetImageToBase64() {
    setSourceFile(null);
    setBase64Text('');
    setErrorText('');
    setCopied(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }

  function resetBase64ToImage() {
    if (decodedImageUrl) {
      URL.revokeObjectURL(decodedImageUrl);
    }
    setBase64Input('');
    setDecodedImageUrl('');
    setDecodedFileName('converted-image.png');
    setErrorText('');
  }

  async function onCopy() {
    if (!base64Text) {
      return;
    }

    try {
      await navigator.clipboard.writeText(base64Text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setErrorText(copy.convertFailed);
    }
  }

  function onConvertBase64ToImage() {
    try {
      const dataUrl = toDataUrl(base64Input);
      const blob = dataUrlToBlob(dataUrl);
      const nextUrl = URL.createObjectURL(blob);
      const ext = extensionFromMime(blob.type);

      if (decodedImageUrl) {
        URL.revokeObjectURL(decodedImageUrl);
      }

      setDecodedImageUrl(nextUrl);
      setDecodedFileName(`base64-image.${ext}`);
      setErrorText('');

      trackEvent('tool_generate', {
        tool_name: 'image-base64-converter',
        direction: 'base64_to_image',
        output_type: blob.type || 'image/png'
      });
    } catch {
      setErrorText(copy.invalidBase64);
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
            <h2>{copy.imageToBase64Title}</h2>
            <p className="converter-hint">{copy.imageToBase64Desc}</p>
            <div className="actions">
              <input
                ref={fileInputRef}
                className="converter-file-input"
                type="file"
                accept="image/*"
                onChange={onImageFileChange}
              />
              <button type="button" className="button ghost" onClick={resetImageToBase64} disabled={!sourceFile && !base64Text}>
                {copy.resetFile}
              </button>
            </div>

            {sourceFile ? (
              <p className="converter-meta">
                {copy.sourceName}: <strong>{sourceFile.name}</strong> | {copy.sourceSize}: {formatSizeKB(sourceFile.size, language)}
              </p>
            ) : null}

            <label className="custom-field">
              <span>{copy.outputBase64}</span>
              <textarea
                className="text-counter-input"
                value={base64Text}
                readOnly
                placeholder={copy.outputBase64}
              />
            </label>

            <div className="actions">
              <button type="button" className="button primary" onClick={onCopy} disabled={!base64Text}>
                {copied ? copy.copied : copy.copy}
              </button>
            </div>
          </section>

          <section className="card converter-card">
            <h2>{copy.base64ToImageTitle}</h2>
            <p className="converter-hint">{copy.base64ToImageDesc}</p>

            <label className="custom-field">
              <span>Base64</span>
              <textarea
                className="text-counter-input"
                value={base64Input}
                onChange={(event) => setBase64Input(event.target.value)}
                placeholder={copy.placeholder}
              />
            </label>

            <div className="actions">
              <button type="button" className="button primary" onClick={onConvertBase64ToImage} disabled={!base64Input.trim()}>
                {copy.convertToImage}
              </button>
              <button
                type="button"
                className="button ghost"
                onClick={resetBase64ToImage}
                disabled={!base64Input && !decodedImageUrl}
              >
                {copy.resetText}
              </button>
              {decodedImageUrl ? (
                <a className="button ghost" href={decodedImageUrl} download={decodedFileName}>
                  {copy.download}
                </a>
              ) : null}
            </div>

            {decodedImageUrl ? (
              <div className="converter-preview-wrap">
                <img className="converter-preview" src={decodedImageUrl} alt={copy.previewAlt} />
              </div>
            ) : null}
          </section>
        </div>

        {errorText ? <p className="converter-error">{errorText}</p> : null}

        <section className="card converter-guide-card">
          <h3>{copy.tipsTitle}</h3>
          <ul className="converter-guide-list bullet">
            {copy.tips.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
      </div>
    </section>
  );
}

export default ImageBase64ConverterPage;
