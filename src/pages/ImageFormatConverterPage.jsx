import { useEffect, useMemo, useState } from 'react';
import { trackEvent } from '../lib/analytics';
import { useLanguage } from '../lib/language';

const OUTPUT_FORMATS = [
  { value: 'image/png', extension: 'png' },
  { value: 'image/jpeg', extension: 'jpg' },
  { value: 'image/webp', extension: 'webp' }
];
const HEIC_EXT_PATTERN = /\.(heic|heif)$/i;
const HEIC_CDN_SRC = 'https://cdn.jsdelivr.net/npm/heic2any@0.0.4/dist/heic2any.min.js';

const COPY = {
  ko: {
    kicker: '이미지 변환 도구',
    title: '이미지 확장자 변환기',
    description: '이미지 파일을 업로드한 뒤 PNG, JPG, WEBP로 변환해 바로 다운로드할 수 있습니다.',
    sourceTitle: '원본 파일',
    sourceHint: '지원 포맷: PNG, JPG, WEBP, GIF 등 일반 이미지. HEIC/HEIF는 브라우저 지원 시 변환됩니다.',
    sourceName: '파일명',
    sourceSize: '크기',
    previewAlt: '업로드한 원본 미리보기',
    settingsTitle: '변환 설정',
    outputFormat: '출력 포맷',
    quality: '품질 (JPG/WEBP)',
    convert: '변환하기',
    converting: '변환 중...',
    resultTitle: '변환 결과',
    download: '다운로드',
    fileSelectAria: '변환할 이미지 파일 선택',
    convertFailedPrefix: '변환 실패',
    heicNotice: 'HEIC 파일은 브라우저가 HEIC 디코딩을 지원할 때만 변환됩니다.',
    heicLibraryNotice: 'HEIC 디코더를 불러오지 못했습니다. 네트워크를 확인해 주세요.',
    imageReadFailed: '이미지를 읽을 수 없습니다.',
    canvasUnavailable: '브라우저 캔버스를 사용할 수 없습니다.',
    exportFailed: '이미지 변환에 실패했습니다.'
  },
  en: {
    kicker: 'IMAGE CONVERTER',
    title: 'Image Format Converter',
    description: 'Upload an image and convert it to PNG, JPG, or WEBP, then download it immediately.',
    sourceTitle: 'Source File',
    sourceHint: 'Supported formats: PNG, JPG, WEBP, GIF, and common image files. HEIC/HEIF works only if your browser supports decoding.',
    sourceName: 'File',
    sourceSize: 'Size',
    previewAlt: 'Source image preview',
    settingsTitle: 'Conversion Settings',
    outputFormat: 'Output Format',
    quality: 'Quality (JPG/WEBP)',
    convert: 'Convert',
    converting: 'Converting...',
    resultTitle: 'Result',
    download: 'Download',
    fileSelectAria: 'Select an image file to convert',
    convertFailedPrefix: 'Conversion failed',
    heicNotice: 'HEIC files can be converted only when the browser supports HEIC decoding.',
    heicLibraryNotice: 'Could not load the HEIC decoder. Please check your network connection.',
    imageReadFailed: 'Unable to read this image file.',
    canvasUnavailable: 'Canvas is not available in this browser.',
    exportFailed: 'Failed to export the converted image.'
  }
};

function isHeicFile(file) {
  if (!file) {
    return false;
  }
  const type = (file.type || '').toLowerCase();
  if (type.includes('heic') || type.includes('heif')) {
    return true;
  }
  return HEIC_EXT_PATTERN.test(file.name || '');
}

function loadHeic2Any() {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined') {
      reject(new Error('HEIC_LIB_LOAD_FAILED'));
      return;
    }

    if (typeof window.heic2any === 'function') {
      resolve(window.heic2any);
      return;
    }

    const existing = document.querySelector('script[data-heic2any="true"]');
    if (existing) {
      existing.addEventListener('load', () => {
        if (typeof window.heic2any === 'function') {
          resolve(window.heic2any);
          return;
        }
        reject(new Error('HEIC_LIB_LOAD_FAILED'));
      });
      existing.addEventListener('error', () => reject(new Error('HEIC_LIB_LOAD_FAILED')));
      return;
    }

    const script = document.createElement('script');
    script.src = HEIC_CDN_SRC;
    script.async = true;
    script.dataset.heic2any = 'true';
    script.onload = () => {
      if (typeof window.heic2any === 'function') {
        resolve(window.heic2any);
        return;
      }
      reject(new Error('HEIC_LIB_LOAD_FAILED'));
    };
    script.onerror = () => reject(new Error('HEIC_LIB_LOAD_FAILED'));
    document.head.appendChild(script);
  });
}

function formatSizeKB(sizeInBytes, language) {
  const size = (sizeInBytes / 1024).toFixed(1);
  return language === 'ko' ? `${size}KB` : `${size} KB`;
}

function getFormatLabel(mimeType, language) {
  if (mimeType === 'image/png') {
    return language === 'ko' ? 'PNG (.png)' : 'PNG (.png)';
  }
  if (mimeType === 'image/jpeg') {
    return language === 'ko' ? 'JPG (.jpg)' : 'JPG (.jpg)';
  }
  return language === 'ko' ? 'WEBP (.webp)' : 'WEBP (.webp)';
}

function blobToImage(blob) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(blob);
    const image = new Image();

    image.onload = () => {
      URL.revokeObjectURL(url);
      resolve(image);
    };

    image.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('IMAGE_READ_FAILED'));
    };

    image.src = url;
  });
}

function canvasToBlob(canvas, mimeType, quality) {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error('CANVAS_EXPORT_FAILED'));
          return;
        }
        resolve(blob);
      },
      mimeType,
      quality
    );
  });
}

function ImageFormatConverterPage() {
  const { language } = useLanguage();
  const [sourceFile, setSourceFile] = useState(null);
  const [sourcePreviewUrl, setSourcePreviewUrl] = useState('');
  const [targetMime, setTargetMime] = useState(OUTPUT_FORMATS[0].value);
  const [quality, setQuality] = useState(0.92);
  const [isConverting, setIsConverting] = useState(false);
  const [result, setResult] = useState(null);
  const [errorText, setErrorText] = useState('');

  useEffect(() => {
    trackEvent('tool_open', { tool_name: 'image-format-converter' });
  }, []);

  const copy = COPY[language];

  useEffect(() => () => {
    if (sourcePreviewUrl) {
      URL.revokeObjectURL(sourcePreviewUrl);
    }
    if (result?.downloadUrl) {
      URL.revokeObjectURL(result.downloadUrl);
    }
  }, [sourcePreviewUrl, result]);

  const targetFormat = useMemo(
    () => OUTPUT_FORMATS.find((item) => item.value === targetMime) ?? OUTPUT_FORMATS[0],
    [targetMime]
  );

  function onFileChange(event) {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    if (sourcePreviewUrl) {
      URL.revokeObjectURL(sourcePreviewUrl);
    }
    if (result?.downloadUrl) {
      URL.revokeObjectURL(result.downloadUrl);
    }

    const previewUrl = URL.createObjectURL(file);
    setSourceFile(file);
    setSourcePreviewUrl(previewUrl);
    setResult(null);
    setErrorText('');
  }

  async function onConvert() {
    if (!sourceFile || isConverting) {
      return;
    }

    setIsConverting(true);
    setErrorText('');

    try {
      const sourceBlob = sourceFile.slice(0, sourceFile.size, sourceFile.type || 'application/octet-stream');
      const image = await blobToImage(sourceBlob);
      const canvas = document.createElement('canvas');
      canvas.width = image.naturalWidth || image.width;
      canvas.height = image.naturalHeight || image.height;

      const context = canvas.getContext('2d');
      if (!context) {
        throw new Error('CANVAS_UNAVAILABLE');
      }

      context.drawImage(image, 0, 0, canvas.width, canvas.height);
      const outputBlob = await canvasToBlob(
        canvas,
        targetMime,
        targetMime === 'image/png' ? undefined : quality
      );

      const baseName = sourceFile.name.replace(/\.[^.]+$/, '') || 'converted-image';
      const outputName = `${baseName}.${targetFormat.extension}`;
      const downloadUrl = URL.createObjectURL(outputBlob);

      setResult({
        outputName,
        outputSize: outputBlob.size,
        downloadUrl
      });

      trackEvent('tool_generate', {
        tool_name: 'image-format-converter',
        input_type: sourceFile.type || 'unknown',
        output_type: targetMime
      });
    } catch (error) {
      let message = error.message;
      if (error.message === 'IMAGE_READ_FAILED') {
        message = copy.imageReadFailed;
      } else if (error.message === 'CANVAS_EXPORT_FAILED') {
        message = copy.exportFailed;
      } else if (error.message === 'CANVAS_UNAVAILABLE') {
        message = copy.canvasUnavailable;
      }

      setErrorText(`${copy.convertFailedPrefix}: ${message} ${copy.heicNotice}`);
    } finally {
      setIsConverting(false);
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
          <h2>{copy.sourceTitle}</h2>
          <input
            className="converter-file-input"
            type="file"
            accept="image/*,.heic,.heif"
            onChange={onFileChange}
            aria-label={copy.fileSelectAria}
          />
          <p className="converter-hint">{copy.sourceHint}</p>
          {sourceFile ? (
            <p className="converter-meta">
              {copy.sourceName}: <strong>{sourceFile.name}</strong> | {copy.sourceSize}:{' '}
              {formatSizeKB(sourceFile.size, language)}
            </p>
          ) : null}
          {sourcePreviewUrl ? (
            <div className="converter-preview-wrap">
              <img className="converter-preview" src={sourcePreviewUrl} alt={copy.previewAlt} />
            </div>
          ) : null}
        </section>

        <section className="card converter-card">
          <h2>{copy.settingsTitle}</h2>
          <div className="converter-controls">
            <label className="custom-field">
              <span>{copy.outputFormat}</span>
              <select value={targetMime} onChange={(event) => setTargetMime(event.target.value)}>
                {OUTPUT_FORMATS.map((item) => (
                  <option key={item.value} value={item.value}>
                    {getFormatLabel(item.value, language)}
                  </option>
                ))}
              </select>
            </label>

            <label className="custom-field">
              <span>{copy.quality}</span>
              <input
                type="range"
                min="0.5"
                max="1"
                step="0.01"
                value={quality}
                onChange={(event) => setQuality(Number(event.target.value))}
                disabled={targetMime === 'image/png'}
              />
            </label>
          </div>
          <div className="actions">
            <button type="button" className="button primary" onClick={onConvert} disabled={!sourceFile || isConverting}>
              {isConverting ? copy.converting : copy.convert}
            </button>
          </div>
          {errorText ? <p className="converter-error">{errorText}</p> : null}
        </section>

        {result ? (
          <section className="card converter-card" aria-live="polite">
            <h2>{copy.resultTitle}</h2>
            <p className="converter-meta">
              {copy.sourceName}: <strong>{result.outputName}</strong> | {copy.sourceSize}:{' '}
              {formatSizeKB(result.outputSize, language)}
            </p>
            <div className="actions">
              <a className="button primary" href={result.downloadUrl} download={result.outputName}>
                {copy.download}
              </a>
            </div>
          </section>
        ) : null}
      </div>
    </section>
  );
}

export default ImageFormatConverterPage;
