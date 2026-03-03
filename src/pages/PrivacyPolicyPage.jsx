import { useLanguage } from '../lib/language';

const CONTACT_EMAIL = 'iam.boinkim@gmail.com';
const EFFECTIVE_DATE = '2026-02-22';

function PrivacyPolicyPage() {
  const { language } = useLanguage();
  const copy =
    language === 'ko'
      ? {
          kicker: '개인정보처리방침',
          title: 'Privacy Policy',
          description: 'kimboin.github.io에서 사용하는 데이터 및 외부 서비스 정보를 안내합니다.',
          sections: [
            {
              title: '1. 서비스 사용 시 생성될 수 있는 정보',
              items: [
                '방문 시 브라우저/기기 정보, 접속 로그, 쿠키 등 정보가 생성될 수 있습니다.',
                '일부 도구는 입력값 또는 설정값을 브라우저 localStorage에 저장할 수 있습니다.'
              ]
            },
            {
              title: '2. 외부 서비스 사용',
              items: [
                'Google Analytics (GA4)를 사용합니다.',
                'Google AdSense를 사용합니다.',
                '일부 기능에서 외부 CDN 스크립트를 로드합니다.'
              ]
            },
            {
              title: '3. 문의',
              items: [
                `개인정보 관련 문의: ${CONTACT_EMAIL}`
              ]
            }
          ],
          effectiveDateLabel: '시행일'
        }
      : {
          kicker: 'Privacy Policy',
          title: 'Privacy Policy',
          description: 'This page describes data and third-party services used on kimboin.github.io.',
          sections: [
            {
              title: '1. Information that may be generated',
              items: [
                'When you visit, technical data such as browser/device info, logs, and cookies may be generated.',
                'Some tools may store inputs or settings in browser localStorage.'
              ]
            },
            {
              title: '2. Third-party services in use',
              items: [
                'Google Analytics (GA4) is used.',
                'Google AdSense is used.',
                'Some features load scripts from external CDNs.'
              ]
            },
            {
              title: '3. Contact',
              items: [`Privacy inquiries: ${CONTACT_EMAIL}`]
            }
          ],
          effectiveDateLabel: 'Effective date'
        };

  return (
    <>
      <section className="hero">
        <div className="container">
          <p className="kicker">{copy.kicker}</p>
          <h1>{copy.title}</h1>
          <p>{copy.description}</p>
        </div>
      </section>
      <section className="section">
        <div className="container privacy-layout">
          <article className="card privacy-card">
            {copy.sections.map((section) => (
              <section key={section.title} className="privacy-section">
                <h2>{section.title}</h2>
                <ul className="list">
                  {section.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </section>
            ))}
            <p className="privacy-date">
              {copy.effectiveDateLabel}: {EFFECTIVE_DATE}
            </p>
          </article>
        </div>
      </section>
    </>
  );
}

export default PrivacyPolicyPage;
