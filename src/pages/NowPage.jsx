import { useLanguage } from '../lib/language';

function NowPage() {
  const { language } = useLanguage();
  const copy =
    language === 'ko'
      ? {
          kicker: '현재',
          title: '현재 관심사',
          description: '최근에 집중하고 있는 개발 주제입니다.',
          productOps: '제품 운영',
          productOpsItems: ['작은 도구의 SEO/성능 개선', 'UX 가설을 빠르게 검증하는 배포 루프', '콘텐츠와 기능의 우선순위 조정'],
          techExplore: '기술 탐색',
          techItems: ['Supabase 조회 구조 설계', '환경 변수 보안 관리', '정적 사이트의 라우팅 안정성']
        }
      : {
          kicker: 'Now',
          title: 'Current Focus',
          description: 'Topics I am focusing on recently.',
          productOps: 'Product Operations',
          productOpsItems: ['SEO and performance improvements for small tools', 'Fast deployment loops for UX hypothesis validation', 'Prioritizing content and features'],
          techExplore: 'Technical Exploration',
          techItems: ['Supabase query architecture design', 'Environment variable security management', 'Routing stability for static sites']
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
        <div className="container grid two">
          <article className="card">
            <h2>{copy.productOps}</h2>
            <ul className="list">
              {copy.productOpsItems.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
          <article className="card">
            <h2>{copy.techExplore}</h2>
            <ul className="list">
              {copy.techItems.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
        </div>
      </section>
    </>
  );
}

export default NowPage;
