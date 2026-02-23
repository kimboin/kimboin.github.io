import { Link } from 'react-router-dom';
import { tools } from '../data/content';

function ToolsPage() {
  return (
    <>
      <section className="hero">
        <div className="container">
          <p className="kicker">Tools</p>
          <h1>결정을 가볍게 만드는 작은 도구들</h1>
          <p>바로 써볼 수 있는 도구 모음입니다.</p>
        </div>
      </section>
      <section className="section">
        <div className="container grid two">
          {tools.map((tool) => (
            <article className="card" key={tool.slug}>
              <h2>{tool.name}</h2>
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
      </section>
    </>
  );
}

export default ToolsPage;
