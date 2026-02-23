import { Link, Navigate, useParams } from 'react-router-dom';
import { tools } from '../data/content';

function ToolDetailPage() {
  const { toolSlug } = useParams();
  const tool = tools.find((item) => item.slug === toolSlug);

  if (!tool) {
    return <Navigate to="/tools" replace />;
  }

  return (
    <>
      <section className="hero">
        <div className="container">
          <p className="kicker">Tool Detail</p>
          <h1>{tool.name}</h1>
          <p>{tool.oneLiner}</p>
          <p style={{ marginTop: 16 }}>
            <Link className="button primary" to={tool.openUrl}>
              바로 사용하기
            </Link>
          </p>
        </div>
      </section>

      <section className="section" id="why-i-built-this">
        <div className="container card">
          <h2>Why I built this</h2>
          <p>{tool.why}</p>
        </div>
      </section>

      <section className="section" id="how-it-works">
        <div className="container card">
          <h2>How it works</h2>
          <ul className="list">
            {tool.how.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section" id="what-i-learned">
        <div className="container card">
          <h2>What I learned</h2>
          <p>{tool.learned}</p>
        </div>
      </section>
    </>
  );
}

export default ToolDetailPage;
