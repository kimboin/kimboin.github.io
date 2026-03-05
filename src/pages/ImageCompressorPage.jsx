import { useEffect, useMemo, useState } from 'react';
import { trackEvent } from '../lib/analytics';
import { useLanguage } from '../lib/language';

const OUTPUT_FORMATS = [
  { value: 'image/jpeg', extension: 'jpg' },
  { value: 'image/webp', extension: 'webp' }
];

const COPY = {
  ko: {
    kicker: '이미지 도구',
    title: '이미지 용량 줄이기',
    description: '이미지를 업로드하고 품질/가로 크기를 조정해 용량을 줄인 파일을 바로 다운로드할 수 있습니다.',
    actionZoneTitle: '압축 작업',
    actionZoneDescription: '파일 선택, 옵션 조정, 결과 다운로드까지 이 영역에서 진행하세요.',
    sourceTitle: '원본 파일',
    sourceHint: '지원 포맷: PNG, JPG, WEBP 등 일반 이미지 파일',
    sourceName: '파일명',
    sourceSize: '크기',
    sourceDimension: '해상도',
    previewAlt: '업로드한 원본 미리보기',
    settingsTitle: '압축 설정',
    outputFormat: '출력 포맷',
    quality: '품질',
    maxWidth: '최대 가로(px)',
    maxWidthHint: '원본보다 큰 값을 입력해도 확대하지 않습니다.',
    compress: '용량 줄이기',
    compressing: '처리 중...',
    resultTitle: '압축 결과',
    download: '다운로드',
    reduced: '절감률',
    fileSelectAria: '압축할 이미지 파일 선택',
    failedPrefix: '처리 실패',
    imageReadFailed: '이미지를 읽을 수 없습니다.',
    canvasUnavailable: '브라우저 캔버스를 사용할 수 없습니다.',
    exportFailed: '이미지 압축에 실패했습니다.',
    infoZoneTitle: '사용 팁',
    infoZoneDescription: '품질과 해상도 설정을 함께 조정하면 용량 절감 효과가 더 커집니다.',
    tips: [
      '사진은 JPG 또는 WEBP로 변환하고 품질을 0.7~0.85 사이로 맞추면 품질 대비 용량이 많이 줄어듭니다.',
      '본문용 이미지는 최대 가로를 1280px 정도로 제한하면 체감 품질을 유지하면서 용량을 줄일 수 있습니다.',
      'PNG 캡처 이미지는 WEBP로 저장하면 배경/텍스트가 있는 이미지도 용량을 크게 줄일 수 있습니다.'
    ]
  },
  en: {
    kicker: 'IMAGE TOOL',
    title: 'Image Compressor',
    description: 'Upload an image, adjust quality/width, and download a smaller file instantly.',
    actionZoneTitle: 'Compression Workspace',
    actionZoneDescription: 'Upload, tune options, compress, and download in this section.',
    sourceTitle: 'Source File',
    sourceHint: 'Supported formats: PNG, JPG, WEBP, and common image files',
    sourceName: 'File',
    sourceSize: 'Size',
    sourceDimension: 'Resolution',
    previewAlt: 'Source image preview',
    settingsTitle: 'Compression Settings',
    outputFormat: 'Output Format',
    quality: 'Quality',
    maxWidth: 'Max Width (px)',
    maxWidthHint: 'The image will never be upscaled beyond original width.',
    compress: 'Compress',
    compressing: 'Processing...',
    resultTitle: 'Result',
    download: 'Download',
    reduced: 'Reduction',
    fileSelectAria: 'Select an image file to compress',
    failedPrefix: 'Processing failed',
    imageReadFailed: 'Unable to read this image file.',
    canvasUnavailable: 'Canvas is not available in this browser.',
    exportFailed: 'Failed to compress the image.',
    infoZoneTitle: 'Usage Tips',
    infoZoneDescription: 'Adjust both quality and resolution to maximize size reduction.',
    tips: [
      'For photos, use JPG or WEBP with quality around 0.7 to 0.85 for a strong quality-size balance.',
      'For article images, setting max width to around 1280px often keeps visual quality while reducing file size.',
      'For screenshot-like PNG files, exporting to WEBP can significantly reduce file size.'
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

function ImageCompressorPage() {
  const { language } = useLanguage();
  const copy = COPY[language];

  const [sourceFile, setSourceFile] = useState(null);
  const [sourcePreviewUrl, setSourcePreviewUrl] = useState('');
  const [sourceInfo, setSourceInfo] = useState(null);
  const [targetMime, setTargetMime] = useState(OUTPUT_FORMATS[0].value);
  const [quality, setQuality] = useState(0.8);
  const [maxWidth, setMaxWidth] = useState(1280);
  const [isCompressing, setIsCompressing] = useState(false);
  const [result, setResult] = useState(null);
  const [errorText, setErrorText] = useState('');

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
      setSourceInfo({
        width: image.naturalWidth || image.width,
        height: image.naturalHeight || image.height
      });
    } catch {
      setSourceInfo(null);
    }
  }

  async function onCompress() {
    if (!sourceFile || isCompressing) {
      return;
    }

    setIsCompressing(true);
    setErrorText('');

    try {
      const image = await blobToImage(sourceFile.slice(0, sourceFile.size, sourceFile.type || 'application/octet-stream'));

      const originWidth = image.naturalWidth || image.width;
      const originHeight = image.naturalHeight || image.height;
      const safeMaxWidth = Number.isFinite(maxWidth) ? Math.max(320, Math.floor(maxWidth)) : originWidth;
      const outputWidth = Math.min(originWidth, safeMaxWidth);
      const outputHeight = Math.round((originHeight * outputWidth) / originWidth);

      const canvas = document.createElement('canvas');
      canvas.width = outputWidth;
      canvas.height = outputHeight;

      const context = canvas.getContext('2d');
      if (!context) {
        throw new Error('CANVAS_UNAVAILABLE');
      }

      context.drawImage(image, 0, 0, outputWidth, outputHeight);

      const outputBlob = await canvasToBlob(canvas, targetMime, quality);

      const baseName = sourceFile.name.replace(/\.[^.]+$/, '') || 'compressed-image';
      const outputName = `${baseName}-compressed.${targetFormat.extension}`;
      const downloadUrl = URL.createObjectURL(outputBlob);
      const reducedRatio = Math.max(0, 1 - outputBlob.size / sourceFile.size);

      if (result?.downloadUrl) {
        URL.revokeObjectURL(result.downloadUrl);
      }

      setResult({
        outputName,
        outputSize: outputBlob.size,
        outputWidth,
        outputHeight,
        reducedRatio,
        downloadUrl
      });

      trackEvent('tool_generate', {
        tool_name: 'image-compressor',
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
      setIsCompressing(false);
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
                  {copy.sourceName}: <strong>{sourceFile.name}</strong> | {copy.sourceSize}: {formatSizeKB(sourceFile.size, language)}
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

              <label className="custom-field">
                <span>{copy.quality}</span>
                <input
                  type="range"
                  min="0.4"
                  max="0.95"
                  step="0.01"
                  value={quality}
                  onChange={(event) => setQuality(Number(event.target.value))}
                />
              </label>

              <label className="custom-field">
                <span>{copy.maxWidth}</span>
                <input
                  type="number"
                  min="320"
                  max="6000"
                  step="10"
                  value={maxWidth}
                  onChange={(event) => setMaxWidth(Number(event.target.value || 0))}
                />
                <small className="converter-hint">{copy.maxWidthHint}</small>
              </label>
            </div>

            <div className="actions">
              <button
                type="button"
                className="button primary"
                onClick={onCompress}
                disabled={!sourceFile || isCompressing}
              >
                {isCompressing ? copy.compressing : copy.compress}
              </button>
            </div>

            {errorText ? <p className="converter-error">{errorText}</p> : null}

            {result ? (
              <section className="converter-result-box" aria-live="polite">
                <h3>{copy.resultTitle}</h3>
                <p className="converter-meta">
                  {copy.sourceName}: <strong>{result.outputName}</strong> | {copy.sourceSize}: {formatSizeKB(result.outputSize, language)}
                </p>
                <p className="converter-meta">
                  {copy.sourceDimension}: {result.outputWidth} x {result.outputHeight} | {copy.reduced}:{' '}
                  <strong>{(result.reducedRatio * 100).toFixed(1)}%</strong>
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

export default ImageCompressorPage;
