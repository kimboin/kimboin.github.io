import { useEffect, useMemo, useState } from 'react';
import { trackEvent } from '../lib/analytics';
import { useLanguage } from '../lib/language';

const OUTPUT_FORMATS = [
  { value: 'image/png', extension: 'png' },
  { value: 'image/jpeg', extension: 'jpg' },
  { value: 'image/webp', extension: 'webp' }
];

const COPY = {
  ko: {
    kicker: '이미지 도구',
    title: '이미지 크기 변경',
    description: '이미지를 업로드한 뒤 원하는 가로/세로 크기로 변경해 바로 다운로드할 수 있습니다.',
    actionZoneTitle: '크기 변경 작업',
    actionZoneDescription: '파일 선택, 크기 설정, 결과 다운로드를 이 영역에서 진행하세요.',
    sourceTitle: '원본 파일',
    sourceHint: '지원 포맷: PNG, JPG, WEBP 등 일반 이미지 파일',
    sourceName: '파일명',
    sourceSize: '크기',
    sourceDimension: '원본 해상도',
    previewAlt: '업로드한 원본 이미지 미리보기',
    settingsTitle: '리사이즈 설정',
    outputFormat: '출력 포맷',
    keepRatio: '비율 유지',
    width: '가로(px)',
    height: '세로(px)',
    quality: '품질 (JPG/WEBP)',
    resize: '크기 변경하기',
    resizing: '처리 중...',
    resultTitle: '변경 결과',
    resultDimension: '결과 해상도',
    download: '다운로드',
    fileSelectAria: '크기를 변경할 이미지 파일 선택',
    failedPrefix: '처리 실패',
    imageReadFailed: '이미지를 읽을 수 없습니다.',
    canvasUnavailable: '브라우저 캔버스를 사용할 수 없습니다.',
    exportFailed: '이미지 변환에 실패했습니다.',
    infoZoneTitle: '사용 팁',
    infoZoneDescription: '비율을 유지하면 이미지가 찌그러지지 않습니다.',
    tips: [
      '썸네일이 필요하면 가로 기준으로 줄이고 비율 유지를 켠 상태로 저장하세요.',
      '배너처럼 정확한 크기가 필요하면 비율 유지를 끈 뒤 가로/세로를 직접 입력하세요.',
      'JPG/WEBP를 선택하면 파일 용량도 함께 줄일 수 있습니다.'
    ]
  },
  en: {
    kicker: 'IMAGE TOOL',
    title: 'Image Resizer',
    description: 'Upload an image, set target width/height, and download the resized result instantly.',
    actionZoneTitle: 'Resize Workspace',
    actionZoneDescription: 'Select file, set dimensions, resize, and download in this section.',
    sourceTitle: 'Source File',
    sourceHint: 'Supported formats: PNG, JPG, WEBP, and common image files',
    sourceName: 'File',
    sourceSize: 'Size',
    sourceDimension: 'Source Resolution',
    previewAlt: 'Source image preview',
    settingsTitle: 'Resize Settings',
    outputFormat: 'Output Format',
    keepRatio: 'Keep aspect ratio',
    width: 'Width (px)',
    height: 'Height (px)',
    quality: 'Quality (JPG/WEBP)',
    resize: 'Resize',
    resizing: 'Processing...',
    resultTitle: 'Result',
    resultDimension: 'Output Resolution',
    download: 'Download',
    fileSelectAria: 'Select an image file to resize',
    failedPrefix: 'Processing failed',
    imageReadFailed: 'Unable to read this image file.',
    canvasUnavailable: 'Canvas is not available in this browser.',
    exportFailed: 'Failed to export resized image.',
    infoZoneTitle: 'Usage Tips',
    infoZoneDescription: 'Keep aspect ratio to avoid stretching.',
    tips: [
      'For thumbnails, reduce width and keep ratio enabled.',
      'For fixed banner sizes, disable ratio lock and input exact width/height.',
      'Using JPG/WEBP can also reduce file size.'
    ]
  }
};

function formatSizeKB(sizeInBytes, language) {
  const size = (sizeInBytes / 1024).toFixed(1);
  return language === 'ko' ? `${size}KB` : `${size} KB`;
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

function clampDimension(value) {
  const next = Number(value);
  if (!Number.isFinite(next)) {
    return 1;
  }
  return Math.max(1, Math.min(8000, Math.floor(next)));
}

function ImageResizerPage() {
  const { language } = useLanguage();
  const copy = COPY[language];

  const [sourceFile, setSourceFile] = useState(null);
  const [sourcePreviewUrl, setSourcePreviewUrl] = useState('');
  const [sourceInfo, setSourceInfo] = useState(null);
  const [targetMime, setTargetMime] = useState(OUTPUT_FORMATS[0].value);
  const [quality, setQuality] = useState(0.9);
  const [keepRatio, setKeepRatio] = useState(true);
  const [targetWidth, setTargetWidth] = useState('');
  const [targetHeight, setTargetHeight] = useState('');
  const [isResizing, setIsResizing] = useState(false);
  const [result, setResult] = useState(null);
  const [errorText, setErrorText] = useState('');

  const targetFormat = useMemo(
    () => OUTPUT_FORMATS.find((item) => item.value === targetMime) ?? OUTPUT_FORMATS[0],
    [targetMime]
  );

  useEffect(() => () => {
    if (sourcePreviewUrl) {
      URL.revokeObjectURL(sourcePreviewUrl);
    }
    if (result?.downloadUrl) {
      URL.revokeObjectURL(result.downloadUrl);
    }
  }, [sourcePreviewUrl, result]);

  async function onFileChange(event) {
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

    try {
      const image = await blobToImage(file.slice(0, file.size, file.type || 'application/octet-stream'));
      const width = image.naturalWidth || image.width;
      const height = image.naturalHeight || image.height;
      setSourceInfo({ width, height });
      setTargetWidth(String(width));
      setTargetHeight(String(height));
    } catch {
      setSourceInfo(null);
      setTargetWidth('');
      setTargetHeight('');
    }
  }

  function onWidthChange(value) {
    setTargetWidth(value);
    if (!keepRatio || !sourceInfo) {
      return;
    }

    const width = clampDimension(value || sourceInfo.width);
    const nextHeight = Math.max(1, Math.round((sourceInfo.height * width) / sourceInfo.width));
    setTargetHeight(String(nextHeight));
  }

  function onHeightChange(value) {
    setTargetHeight(value);
    if (!keepRatio || !sourceInfo) {
      return;
    }

    const height = clampDimension(value || sourceInfo.height);
    const nextWidth = Math.max(1, Math.round((sourceInfo.width * height) / sourceInfo.height));
    setTargetWidth(String(nextWidth));
  }

  async function onResize() {
    if (!sourceFile || isResizing || !targetWidth || !targetHeight) {
      return;
    }

    setIsResizing(true);
    setErrorText('');

    try {
      const image = await blobToImage(sourceFile.slice(0, sourceFile.size, sourceFile.type || 'application/octet-stream'));
      const outputWidth = clampDimension(targetWidth);
      const outputHeight = clampDimension(targetHeight);

      const canvas = document.createElement('canvas');
      canvas.width = outputWidth;
      canvas.height = outputHeight;

      const context = canvas.getContext('2d');
      if (!context) {
        throw new Error('CANVAS_UNAVAILABLE');
      }

      context.drawImage(image, 0, 0, outputWidth, outputHeight);
      const outputBlob = await canvasToBlob(
        canvas,
        targetMime,
        targetMime === 'image/png' ? undefined : quality
      );

      const baseName = sourceFile.name.replace(/\.[^.]+$/, '') || 'resized-image';
      const outputName = `${baseName}-${outputWidth}x${outputHeight}.${targetFormat.extension}`;
      const downloadUrl = URL.createObjectURL(outputBlob);

      if (result?.downloadUrl) {
        URL.revokeObjectURL(result.downloadUrl);
      }

      setResult({
        outputName,
        outputWidth,
        outputHeight,
        outputSize: outputBlob.size,
        downloadUrl
      });

      trackEvent('tool_generate', {
        tool_name: 'image-resizer',
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
      setErrorText(`${copy.failedPrefix}: ${message}`);
    } finally {
      setIsResizing(false);
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
              accept="image/*"
              onChange={onFileChange}
              aria-label={copy.fileSelectAria}
            />
            <p className="converter-hint">{copy.sourceHint}</p>

            {sourceFile ? (
              <>
                <p className="converter-meta">
                  {copy.sourceName}: <strong>{sourceFile.name}</strong> | {copy.sourceSize}:{' '}
                  {formatSizeKB(sourceFile.size, language)}
                </p>
                {sourceInfo ? (
                  <p className="converter-meta">
                    {copy.sourceDimension}: {sourceInfo.width} x {sourceInfo.height}
                  </p>
                ) : null}
              </>
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
                      {item.extension.toUpperCase()}
                    </option>
                  ))}
                </select>
              </label>

              <label className="custom-field checkbox-field">
                <input
                  type="checkbox"
                  checked={keepRatio}
                  onChange={(event) => setKeepRatio(event.target.checked)}
                />
                <span>{copy.keepRatio}</span>
              </label>

              <label className="custom-field">
                <span>{copy.width}</span>
                <input
                  type="number"
                  min="1"
                  max="8000"
                  value={targetWidth}
                  onChange={(event) => onWidthChange(event.target.value)}
                />
              </label>

              <label className="custom-field">
                <span>{copy.height}</span>
                <input
                  type="number"
                  min="1"
                  max="8000"
                  value={targetHeight}
                  onChange={(event) => onHeightChange(event.target.value)}
                />
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
              <button
                type="button"
                className="button primary"
                onClick={onResize}
                disabled={!sourceFile || !targetWidth || !targetHeight || isResizing}
              >
                {isResizing ? copy.resizing : copy.resize}
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
                <p className="converter-meta">
                  {copy.resultDimension}: {result.outputWidth} x {result.outputHeight}
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
            <ul className="converter-guide-list bullet">
              {copy.tips.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>
        </section>
      </div>
    </section>
  );
}

export default ImageResizerPage;
