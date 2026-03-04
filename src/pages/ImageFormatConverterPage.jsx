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
    actionZoneTitle: '이미지 변환 작업',
    actionZoneDescription: '파일 선택부터 변환 결과 다운로드까지 이 영역에서 진행하세요.',
    infoZoneTitle: '포맷 안내',
    infoZoneDescription: '이미지 변환이 필요한 상황과 확장자별 특징을 확인할 수 있습니다.',
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
    exportFailed: '이미지 변환에 실패했습니다.',
    needTitle: '이미지 변환이 필요한 순간',
    needItems: [
      {
        title: '업로드가 안 될 때',
        description: '서비스가 HEIC/HEIF를 지원하지 않으면 JPG나 PNG로 바꿔야 업로드할 수 있습니다.'
      },
      {
        title: '용량을 줄이고 싶을 때',
        description: '웹 페이지 속도 개선이 필요하면 JPG/WEBP로 변환해 전송 용량을 줄일 수 있습니다.'
      },
      {
        title: '투명 배경이 필요할 때',
        description: '로고나 아이콘처럼 배경이 비어 있어야 하는 이미지는 PNG 변환이 유리합니다.'
      },
      {
        title: '호환성 확보가 필요할 때',
        description: '구형 앱이나 기기에서는 범용 포맷인 JPG가 가장 안정적으로 열립니다.'
      }
    ],
    whyTitle: '왜 이미지 변환이 중요할까?',
    whyItems: [
      '목적에 맞는 포맷을 선택하면 품질과 용량을 더 균형 있게 관리할 수 있습니다.',
      '페이지 로딩 속도 개선과 저장 공간 절감에 직접적인 영향을 줍니다.',
      '웹, 메신저, 문서, 인쇄 등 사용 환경에 맞춘 파일을 빠르게 준비할 수 있습니다.'
    ],
    formatTitle: '확장자별 개념과 특징',
    formatItems: [
      {
        name: 'PNG',
        summary: '무손실 압축 포맷이며 투명 배경(알파 채널)을 지원합니다.',
        bestFor: '로고, 아이콘, 텍스트가 선명해야 하는 그래픽'
      },
      {
        name: 'JPG/JPEG',
        summary: '손실 압축 기반의 범용 사진 포맷으로 파일 용량 효율이 좋습니다.',
        bestFor: '일반 사진, 블로그 이미지, 제품 사진'
      },
      {
        name: 'WEBP',
        summary: '웹 최적화 포맷으로 손실/무손실과 투명도를 지원합니다.',
        bestFor: '웹 성능을 중요하게 보는 본문 이미지와 썸네일'
      },
      {
        name: 'GIF',
        summary: '256색 기반 포맷이며 간단한 애니메이션을 표현할 수 있습니다.',
        bestFor: '짧은 반복 애니메이션, 밈, 안내용 움직이는 이미지'
      },
      {
        name: 'HEIC/HEIF',
        summary: '고효율 압축 포맷으로 화질 대비 용량이 작아 모바일 원본 저장에 유리합니다.',
        bestFor: '아이폰 원본 보관, 공유 전 JPG/WEBP 변환 작업'
      }
    ]
  },
  en: {
    kicker: 'IMAGE CONVERTER',
    title: 'Image Format Converter',
    description: 'Upload an image and convert it to PNG, JPG, or WEBP, then download it immediately.',
    actionZoneTitle: 'Conversion Workspace',
    actionZoneDescription: 'Use this area to upload, configure, convert, and download the output.',
    infoZoneTitle: 'Format Guide',
    infoZoneDescription: 'Learn when conversion is needed and what each extension is best for.',
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
    exportFailed: 'Failed to export the converted image.',
    needTitle: 'When do you need image conversion?',
    needItems: [
      {
        title: 'When upload fails',
        description: 'If a service does not support HEIC/HEIF, converting to JPG or PNG solves compatibility issues.'
      },
      {
        title: 'When you need smaller files',
        description: 'Converting to JPG/WEBP can reduce transfer size and improve page loading speed.'
      },
      {
        title: 'When transparency is required',
        description: 'For logos and icons, PNG is usually better because it supports transparent backgrounds.'
      },
      {
        title: 'When broad compatibility matters',
        description: 'Older apps and devices open JPG most reliably.'
      }
    ],
    whyTitle: 'Why does image conversion matter?',
    whyItems: [
      'Choosing the right format helps balance visual quality and file size.',
      'It directly affects loading performance and storage cost.',
      'You can prepare assets faster for web, chat apps, docs, and print workflows.'
    ],
    formatTitle: 'Format concepts and characteristics',
    formatItems: [
      {
        name: 'PNG',
        summary: 'A lossless format that supports transparency (alpha channel).',
        bestFor: 'Logos, icons, and graphics with crisp text'
      },
      {
        name: 'JPG/JPEG',
        summary: 'A lossy and universal photo format with strong size efficiency.',
        bestFor: 'General photos, blog images, and product photos'
      },
      {
        name: 'WEBP',
        summary: 'A web-optimized format that supports lossy/lossless compression and transparency.',
        bestFor: 'Main website images and thumbnails with performance focus'
      },
      {
        name: 'GIF',
        summary: 'A 256-color format that can represent simple animations.',
        bestFor: 'Short looping animations, memes, and quick visual guides'
      },
      {
        name: 'HEIC/HEIF',
        summary: 'A high-efficiency format with strong quality-to-size ratio, common on mobile originals.',
        bestFor: 'iPhone originals and pre-share conversion to JPG/WEBP'
      }
    ]
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

        <section className="converter-zone converter-zone-action">
          <header className="converter-zone-head">
            <h2>{copy.actionZoneTitle}</h2>
            <p>{copy.actionZoneDescription}</p>
          </header>

          <section className="card converter-card">
            <h3>{copy.sourceTitle}</h3>
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

            <div className="converter-divider" />

            <h3>{copy.settingsTitle}</h3>
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

            {result ? (
              <section className="converter-result-box" aria-live="polite">
                <h3>{copy.resultTitle}</h3>
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
          </section>
        </section>

        <section className="converter-zone converter-zone-info">
          <header className="converter-zone-head">
            <h2>{copy.infoZoneTitle}</h2>
            <p>{copy.infoZoneDescription}</p>
          </header>

          <section className="card converter-guide-card">
            <h3>{copy.needTitle}</h3>
            <ul className="converter-guide-list">
              {copy.needItems.map((item) => (
                <li key={item.title}>
                  <strong>{item.title}</strong>
                  <p>{item.description}</p>
                </li>
              ))}
            </ul>
            <h3>{copy.whyTitle}</h3>
            <ul className="converter-guide-list bullet">
              {copy.whyItems.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>

          <section className="card converter-guide-card">
            <h3>{copy.formatTitle}</h3>
            <ul className="converter-guide-list">
              {copy.formatItems.map((item) => (
                <li key={item.name}>
                  <strong>{item.name}</strong>
                  <p>{item.summary}</p>
                  <p>
                    <span>{language === 'ko' ? '추천 용도' : 'Best for'}</span>: {item.bestFor}
                  </p>
                </li>
              ))}
            </ul>
          </section>
        </section>
      </div>
    </section>
  );
}

export default ImageFormatConverterPage;
