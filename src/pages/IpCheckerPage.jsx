import { useCallback, useEffect, useState } from 'react';
import { trackEvent } from '../lib/analytics';
import { useLanguage } from '../lib/language';

const IP_API_URL = 'https://api.ipify.org?format=json';

const COPY = {
  ko: {
    kicker: 'IP CHECKER',
    title: '내 IP 확인',
    description: '현재 인터넷에서 보이는 공인 IP 주소를 빠르게 확인할 수 있습니다.',
    ipTitle: '공인 IP 주소',
    loading: '조회 중...',
    fetch: 'IP 조회',
    refetch: '다시 조회',
    copy: '복사',
    copied: '복사됨',
    note: 'IP 조회는 외부 API 호출로 동작합니다.',
    errorPrefix: '조회 실패',
    fallbackError: 'IP 주소를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.'
  },
  en: {
    kicker: 'IP CHECKER',
    title: 'IP Checker',
    description: 'Quickly check your current public IP address.',
    ipTitle: 'Public IP Address',
    loading: 'Loading...',
    fetch: 'Check IP',
    refetch: 'Refresh',
    copy: 'Copy',
    copied: 'Copied',
    note: 'This tool uses an external API request to detect your IP.',
    errorPrefix: 'Failed to fetch',
    fallbackError: 'Could not load your IP address. Please try again.'
  }
};

async function fetchPublicIp() {
  const response = await fetch(IP_API_URL);
  if (!response.ok) {
    throw new Error(`HTTP_${response.status}`);
  }
  const data = await response.json();
  if (!data?.ip || typeof data.ip !== 'string') {
    throw new Error('INVALID_RESPONSE');
  }
  return data.ip;
}

function IpCheckerPage() {
  const { language } = useLanguage();
  const copy = COPY[language];
  const [ip, setIp] = useState('');
  const [errorText, setErrorText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const loadIp = useCallback(
    async (isInitialLoad = false) => {
      setIsLoading(true);
      setErrorText('');
      setCopied(false);

      try {
        const nextIp = await fetchPublicIp();
        setIp(nextIp);
        trackEvent('tool_generate', {
          tool_name: 'ip-checker',
          action: isInitialLoad ? 'initial_load' : 'manual_refresh'
        });
      } catch (_error) {
        setErrorText(`${copy.errorPrefix}: ${copy.fallbackError}`);
      } finally {
        setIsLoading(false);
      }
    },
    [copy.errorPrefix, copy.fallbackError]
  );

  useEffect(() => {
    loadIp(true);
  }, [loadIp]);

  async function onCopy() {
    if (!ip || !navigator?.clipboard?.writeText) {
      return;
    }
    try {
      await navigator.clipboard.writeText(ip);
      setCopied(true);
      trackEvent('tool_copy', { tool_name: 'ip-checker' });
      window.setTimeout(() => setCopied(false), 1500);
    } catch (_error) {
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

        <section className="card ip-checker-card" aria-live="polite">
          <p className="ip-checker-label">{copy.ipTitle}</p>
          <p className="ip-checker-value">{isLoading ? copy.loading : ip || '-'}</p>
          {errorText ? <p className="converter-error">{errorText}</p> : null}
          <p className="ip-checker-note">{copy.note}</p>
          <div className="actions">
            <button type="button" className="button primary" onClick={() => loadIp(false)} disabled={isLoading}>
              {ip ? copy.refetch : copy.fetch}
            </button>
            <button type="button" className="button ghost" onClick={onCopy} disabled={!ip || isLoading}>
              {copied ? copy.copied : copy.copy}
            </button>
          </div>
        </section>
      </div>
    </section>
  );
}

export default IpCheckerPage;
