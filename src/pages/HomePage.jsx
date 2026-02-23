import { Link } from 'react-router-dom';
import { tools } from '../data/content';

function HomePage() {
  return (
    <>
      <section className="hero">
        <div className="container">
          <p className="kicker">Home</p>
          <h1>결정을 가볍게, 실행은 빠르게.</h1>
          <p>실사용 중심의 작은 도구와 운영 가능한 제품을 만드는 개발자 kimboin의 허브입니다.</p>
        </div>
      </section>

      <section className="section">
        <div className="container grid two">
          <article className="card">
            <h2>About</h2>
            <p>복잡한 문제를 작은 인터랙션으로 정리하고, 빠르게 배포해 개선하는 방식으로 개발합니다.</p>
          </article>
          <article className="card">
            <h2>Now</h2>
            <ul className="list">
              <li>툴 상세 문서화 템플릿 정리</li>
              <li>GitHub Pages 배포 자동화</li>
              <li>Supabase 기반 데이터 조회 준비</li>
            </ul>
            <p />
            <Link className="text-link" to="/now">
              Now 전체 보기
            </Link>
          </article>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <p className="kicker">Recent Tools</p>
          <div className="grid two">
            {tools.slice(0, 2).map((tool) => (
              <article className="card" key={tool.slug}>
                <h3>{tool.name}</h3>
                <p>{tool.oneLiner}</p>
                <div className="actions">
                  <Link className="button ghost" to={`/tools/${tool.slug}`}>
                    Story
                  </Link>
                  <Link className="button primary" to={tool.openUrl}>
                    열기
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

export default HomePage;
