import { useMemo, useState } from 'react';
import { trackEvent } from '../lib/analytics';
import { useLanguage } from '../lib/language';

const COPY = {
  ko: {
    kicker: '계산 · 변환',
    title: '색상 코드 변환기',
    description: 'HEX, RGB, HSL 색상 코드를 서로 변환하고 미리보기를 확인할 수 있습니다.',
    hexInput: 'HEX 입력',
    rgbInput: 'RGB 입력 (예: 255, 99, 71)',
    hslInput: 'HSL 입력 (예: 9, 100%, 64%)',
    convert: '변환하기',
    reset: '리셋',
    result: '변환 결과',
    preview: '색상 미리보기',
    hex: 'HEX',
    rgb: 'RGB',
    hsl: 'HSL',
    copy: '복사',
    copied: '복사됨',
    invalid: '유효한 색상 값을 입력해 주세요.'
  },
  en: {
    kicker: 'CALCULATE · CONVERT',
    title: 'Color Code Converter',
    description: 'Convert HEX, RGB, and HSL color codes and preview the color instantly.',
    hexInput: 'HEX Input',
    rgbInput: 'RGB Input (e.g. 255, 99, 71)',
    hslInput: 'HSL Input (e.g. 9, 100%, 64%)',
    convert: 'Convert',
    reset: 'Reset',
    result: 'Converted Result',
    preview: 'Color Preview',
    hex: 'HEX',
    rgb: 'RGB',
    hsl: 'HSL',
    copy: 'Copy',
    copied: 'Copied',
    invalid: 'Please enter a valid color value.'
  }
};

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function normalizeHex(input) {
  const raw = input.trim().replace('#', '');
  if (/^[0-9a-fA-F]{3}$/.test(raw)) {
    return `#${raw
      .split('')
      .map((c) => c + c)
      .join('')
      .toUpperCase()}`;
  }
  if (/^[0-9a-fA-F]{6}$/.test(raw)) {
    return `#${raw.toUpperCase()}`;
  }
  return null;
}

function parseRgb(input) {
  const m = input.match(/(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})/);
  if (!m) return null;
  const r = Number(m[1]);
  const g = Number(m[2]);
  const b = Number(m[3]);
  if ([r, g, b].some((v) => Number.isNaN(v) || v < 0 || v > 255)) return null;
  return { r, g, b };
}

function parseHsl(input) {
  const m = input.match(/(-?\d+(?:\.\d+)?)\s*,\s*(\d+(?:\.\d+)?)%?\s*,\s*(\d+(?:\.\d+)?)%?/);
  if (!m) return null;
  const h = Number(m[1]);
  const s = Number(m[2]);
  const l = Number(m[3]);
  if ([h, s, l].some((v) => Number.isNaN(v))) return null;
  return { h, s: clamp(s, 0, 100), l: clamp(l, 0, 100) };
}

function hexToRgb(hex) {
  const h = normalizeHex(hex);
  if (!h) return null;
  const value = h.slice(1);
  return {
    r: parseInt(value.slice(0, 2), 16),
    g: parseInt(value.slice(2, 4), 16),
    b: parseInt(value.slice(4, 6), 16)
  };
}

function rgbToHex({ r, g, b }) {
  const toHex = (v) => v.toString(16).padStart(2, '0').toUpperCase();
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

function rgbToHsl({ r, g, b }) {
  const rn = r / 255;
  const gn = g / 255;
  const bn = b / 255;
  const max = Math.max(rn, gn, bn);
  const min = Math.min(rn, gn, bn);
  const d = max - min;
  let h = 0;
  const l = (max + min) / 2;
  let s = 0;

  if (d !== 0) {
    s = d / (1 - Math.abs(2 * l - 1));
    switch (max) {
      case rn:
        h = 60 * (((gn - bn) / d) % 6);
        break;
      case gn:
        h = 60 * ((bn - rn) / d + 2);
        break;
      default:
        h = 60 * ((rn - gn) / d + 4);
    }
  }

  if (h < 0) h += 360;
  return { h: Math.round(h), s: Math.round(s * 100), l: Math.round(l * 100) };
}

function hslToRgb({ h, s, l }) {
  const hh = ((h % 360) + 360) % 360;
  const sn = s / 100;
  const ln = l / 100;
  const c = (1 - Math.abs(2 * ln - 1)) * sn;
  const x = c * (1 - Math.abs(((hh / 60) % 2) - 1));
  const m = ln - c / 2;

  let rn = 0;
  let gn = 0;
  let bn = 0;

  if (hh < 60) {
    rn = c;
    gn = x;
  } else if (hh < 120) {
    rn = x;
    gn = c;
  } else if (hh < 180) {
    gn = c;
    bn = x;
  } else if (hh < 240) {
    gn = x;
    bn = c;
  } else if (hh < 300) {
    rn = x;
    bn = c;
  } else {
    rn = c;
    bn = x;
  }

  return {
    r: Math.round((rn + m) * 255),
    g: Math.round((gn + m) * 255),
    b: Math.round((bn + m) * 255)
  };
}

function ColorCodeConverterPage() {
  const { language } = useLanguage();
  const copy = COPY[language];

  const [hexInput, setHexInput] = useState('');
  const [rgbInput, setRgbInput] = useState('');
  const [hslInput, setHslInput] = useState('');
  const [result, setResult] = useState({ hex: '', rgb: '', hsl: '' });
  const [errorText, setErrorText] = useState('');
  const [copied, setCopied] = useState('');

  const previewColor = useMemo(() => result.hex || '#FFFFFF', [result.hex]);

  function applyRgb(rgb) {
    const hex = rgbToHex(rgb);
    const hsl = rgbToHsl(rgb);
    setResult({
      hex,
      rgb: `${rgb.r}, ${rgb.g}, ${rgb.b}`,
      hsl: `${hsl.h}, ${hsl.s}%, ${hsl.l}%`
    });
    setErrorText('');
    setCopied('');
  }

  function onConvert() {
    const byHex = hexToRgb(hexInput);
    if (byHex) {
      applyRgb(byHex);
      trackEvent('tool_generate', { tool_name: 'color-code-converter', input_type: 'hex' });
      return;
    }

    const byRgb = parseRgb(rgbInput);
    if (byRgb) {
      applyRgb(byRgb);
      trackEvent('tool_generate', { tool_name: 'color-code-converter', input_type: 'rgb' });
      return;
    }

    const byHsl = parseHsl(hslInput);
    if (byHsl) {
      applyRgb(hslToRgb(byHsl));
      trackEvent('tool_generate', { tool_name: 'color-code-converter', input_type: 'hsl' });
      return;
    }

    setResult({ hex: '', rgb: '', hsl: '' });
    setErrorText(copy.invalid);
  }

  function onReset() {
    setHexInput('');
    setRgbInput('');
    setHslInput('');
    setResult({ hex: '', rgb: '', hsl: '' });
    setErrorText('');
    setCopied('');
    trackEvent('tool_reset', { tool_name: 'color-code-converter' });
  }

  async function onCopy(key, value) {
    if (!value || !navigator?.clipboard?.writeText) return;
    try {
      await navigator.clipboard.writeText(value);
      setCopied(key);
      setTimeout(() => setCopied(''), 1200);
      trackEvent('tool_copy', { tool_name: 'color-code-converter', target: key });
    } catch {
      setCopied('');
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
            <span>{copy.hexInput}</span>
            <input value={hexInput} onChange={(event) => setHexInput(event.target.value)} placeholder="#FF5733" />
          </label>

          <label className="custom-field">
            <span>{copy.rgbInput}</span>
            <input value={rgbInput} onChange={(event) => setRgbInput(event.target.value)} placeholder="255, 99, 71" />
          </label>

          <label className="custom-field">
            <span>{copy.hslInput}</span>
            <input value={hslInput} onChange={(event) => setHslInput(event.target.value)} placeholder="9, 100%, 64%" />
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
          <div className="color-preview" style={{ backgroundColor: previewColor }} aria-label={copy.preview} />

          <div className="actions">
            <p className="converter-meta">
              {copy.hex}: <strong>{result.hex || '-'}</strong>
            </p>
            <button type="button" className="button ghost" onClick={() => onCopy('hex', result.hex)} disabled={!result.hex}>
              {copied === 'hex' ? copy.copied : copy.copy}
            </button>
          </div>

          <div className="actions">
            <p className="converter-meta">
              {copy.rgb}: <strong>{result.rgb || '-'}</strong>
            </p>
            <button type="button" className="button ghost" onClick={() => onCopy('rgb', result.rgb)} disabled={!result.rgb}>
              {copied === 'rgb' ? copy.copied : copy.copy}
            </button>
          </div>

          <div className="actions">
            <p className="converter-meta">
              {copy.hsl}: <strong>{result.hsl || '-'}</strong>
            </p>
            <button type="button" className="button ghost" onClick={() => onCopy('hsl', result.hsl)} disabled={!result.hsl}>
              {copied === 'hsl' ? copy.copied : copy.copy}
            </button>
          </div>
        </section>
      </div>
    </section>
  );
}

export default ColorCodeConverterPage;
