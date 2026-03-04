import { useCallback, useEffect, useState } from 'react';
import { trackEvent } from '../lib/analytics';
import { useLanguage } from '../lib/language';

const IP_API_URL = 'https://api.ipify.org?format=json';

const COPY = {
  ko: {
    kicker: 'IP CHECKER',
    title: '내 IP 확인',
    description: '현재 인터넷에서 보이는 공인 IP 주소를 빠르게 확인할 수 있습니다.',
    actionZoneTitle: 'IP 조회 작업',
    actionZoneDescription: '아래에서 IP를 조회하고 복사할 수 있습니다.',
    infoZoneTitle: '설명 가이드',
    infoZoneDescription: 'IP 주소 개념과 조회가 필요한 상황을 확인할 수 있습니다.',
    ipTitle: '공인 IP 주소',
    loading: '조회 중...',
    fetch: 'IP 조회',
    refetch: '다시 조회',
    copy: '복사',
    copied: '복사됨',
    note: 'IP 조회는 외부 API 호출로 동작합니다.',
    guideTitle: '내 IP 확인이 필요한 이유',
    whatIsIpTitle: 'IP 주소란?',
    whatIsIpBody:
      'IP 주소는 인터넷에서 내 기기(또는 공유기)가 식별되는 주소입니다. 이 페이지에서 보여주는 값은 외부에서 보이는 공인 IP 주소입니다.',
    whenToUseTitle: '이럴 때 사용합니다',
    whenToUseItems: [
      '회사/학교/서버에서 내 공인 IP를 등록해야 접속이 허용될 때',
      '원격 접속, VPN, 방화벽 설정 전에 현재 공인 IP를 확인할 때',
      '인터넷 장애 대응이나 네트워크 문의 시 현재 연결 정보를 전달해야 할 때'
    ],
    cautionTitle: '알아두면 좋은 점',
    cautionBody:
      '공인 IP는 통신사 환경에 따라 바뀔 수 있습니다. 접속 문제 해결이나 설정 등록 직전에 다시 확인하는 것이 안전합니다.',
    errorPrefix: '조회 실패',
    fallbackError: 'IP 주소를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.'
  },
  en: {
    kicker: 'IP CHECKER',
    title: 'IP Checker',
    description: 'Quickly check your current public IP address.',
    actionZoneTitle: 'IP Action Area',
    actionZoneDescription: 'Check and copy your IP from this section.',
    infoZoneTitle: 'IP Guide',
    infoZoneDescription: 'Read what an IP address is and when to check it.',
    ipTitle: 'Public IP Address',
    loading: 'Loading...',
    fetch: 'Check IP',
    refetch: 'Refresh',
    copy: 'Copy',
    copied: 'Copied',
    note: 'This tool uses an external API request to detect your IP.',
    guideTitle: 'Why check my IP?',
    whatIsIpTitle: 'What is an IP address?',
    whatIsIpBody:
      'An IP address identifies your device (or router) on the internet. This page shows your public IP address visible from outside.',
    whenToUseTitle: 'When this is useful',
    whenToUseItems: [
      'When a company, school, or server requires your public IP to allow access',
      'Before remote access, VPN, or firewall configuration',
      'When reporting network issues and sharing current connection details'
    ],
    cautionTitle: 'Good to know',
    cautionBody:
      'A public IP can change depending on your network environment. It is best to re-check right before registration or troubleshooting.',
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

        <section className="ip-zone ip-zone-action">
          <header className="ip-zone-head">
            <h2>{copy.actionZoneTitle}</h2>
            <p>{copy.actionZoneDescription}</p>
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
        </section>

        <section className="ip-zone ip-zone-info">
          <header className="ip-zone-head">
            <h2>{copy.infoZoneTitle}</h2>
            <p>{copy.infoZoneDescription}</p>
          </header>
          <section className="card ip-guide-card">
            <h3>{copy.guideTitle}</h3>
            <h3>{copy.whatIsIpTitle}</h3>
            <p>{copy.whatIsIpBody}</p>
            <h3>{copy.whenToUseTitle}</h3>
            <ul className="list">
              {copy.whenToUseItems.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <h3>{copy.cautionTitle}</h3>
            <p>{copy.cautionBody}</p>
          </section>
        </section>
      </div>
    </section>
  );
}

export default IpCheckerPage;
