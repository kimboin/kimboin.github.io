import { useState } from 'react';
import { trackEvent } from '../lib/analytics';
import { useLanguage } from '../lib/language';

const COPY = {
  ko: {
    kicker: '계산 · 변환',
    title: 'RGB → HEX 변환',
    description: 'RGB 색상 값을 HEX 코드로 변환하고 색상 미리보기를 확인할 수 있습니다.',
    rgbInput: 'RGB 입력 (예: 255, 99, 71)',
    convert: '변환하기',
    reset: '리셋',
    result: '변환 결과',
    preview: '색상 미리보기',
    hex: 'HEX',
    copy: '복사',
    copied: '복사됨',
    invalid: '유효한 RGB 값을 입력해 주세요. (0~255, 3개)'
  },
  en: {
    kicker: 'CALCULATE · CONVERT',
    title: 'RGB to HEX Converter',
    description: 'Convert RGB values to HEX and preview the resulting color.',
    rgbInput: 'RGB Input (e.g. 255, 99, 71)',
    convert: 'Convert',
    reset: 'Reset',
    result: 'Result',
    preview: 'Color Preview',
    hex: 'HEX',
    copy: 'Copy',
    copied: 'Copied',
    invalid: 'Please enter a valid RGB value. (three numbers from 0 to 255)'
  }
};

function parseRgb(input) {
  const m = input.match(/(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})/);
  if (!m) return null;
  const values = [Number(m[1]), Number(m[2]), Number(m[3])];
  if (values.some((v) => Number.isNaN(v) || v < 0 || v > 255)) return null;
  return { r: values[0], g: values[1], b: values[2] };
}

function rgbToHex({ r, g, b }) {
  const toHex = (v) => v.toString(16).padStart(2, '0').toUpperCase();
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

function RgbToHexPage() {
  const { language } = useLanguage();
  const copy = COPY[language];

  const [rgbInput, setRgbInput] = useState('');
  const [hexResult, setHexResult] = useState('');
  const [errorText, setErrorText] = useState('');
  const [copied, setCopied] = useState(false);

  function onConvert() {
    const rgb = parseRgb(rgbInput);
    if (!rgb) {
      setHexResult('');
      setErrorText(copy.invalid);
      return;
    }

    setHexResult(rgbToHex(rgb));
    setErrorText('');
    setCopied(false);

    trackEvent('tool_generate', { tool_name: 'rgb-to-hex' });
  }

  function onReset() {
    setRgbInput('');
    setHexResult('');
    setErrorText('');
    setCopied(false);
    trackEvent('tool_reset', { tool_name: 'rgb-to-hex' });
  }

  async function onCopy() {
    if (!hexResult || !navigator?.clipboard?.writeText) return;
    try {
      await navigator.clipboard.writeText(hexResult);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
      trackEvent('tool_copy', { tool_name: 'rgb-to-hex' });
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
        </header>

        <section className="card converter-card">
          <label className="custom-field">
            <span>{copy.rgbInput}</span>
            <input value={rgbInput} onChange={(event) => setRgbInput(event.target.value)} placeholder="255, 99, 71" />
          </label>
          <div className="actions">
            <button type="button" className="button primary" onClick={onConvert}>
              {copy.convert}
            </button>
            <button type="button" className="button ghost" onClick={onReset}>
              {copy.reset}
            </button>
          </div>
          {errorText ? <p className="converter-error">{errorText}</p> : null}
        </section>

        <section className="card converter-card" aria-live="polite">
          <h2>{copy.result}</h2>
          <div className="color-preview" style={{ backgroundColor: hexResult || '#FFFFFF' }} aria-label={copy.preview} />
          <div className="actions">
            <p className="converter-meta">
              {copy.hex}: <strong>{hexResult || '-'}</strong>
            </p>
            <button type="button" className="button ghost" onClick={onCopy} disabled={!hexResult}>
              {copied ? copy.copied : copy.copy}
            </button>
          </div>
        </section>
      </div>
    </section>
  );
}

export default RgbToHexPage;
