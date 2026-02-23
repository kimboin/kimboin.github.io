import { Link } from 'react-router-dom';
import { products } from '../data/content';

function badgeClass(status) {
  if (status === 'Live') return 'badge live';
  if (status === 'Beta') return 'badge beta';
  return 'badge paused';
}

function ProductsPage() {
  return (
    <>
      <section className="hero">
        <div className="container">
          <p className="kicker">Products</p>
          <h1>필요와 아이디어에서 시작한 서비스</h1>
          <p>직접 필요하거나 좋은 아이디어라고 판단한 것들을 서비스로 만들고, 여기서 링크로 연결합니다.</p>
        </div>
      </section>
      <section className="section">
        <div className="container grid three">
          {products.map((product) => (
            <article className="card" key={product.slug}>
              <span className={badgeClass(product.status)}>{product.status.toUpperCase()}</span>
              <h2>{product.name}</h2>
              <p>{product.value}</p>
              <p>
                <strong>주요 대상:</strong> {product.target}
              </p>
              <div className="actions">
                <a className="button primary" href={product.visitUrl} target="_blank" rel="noreferrer">
                  Visit
                </a>
                <Link className="button ghost" to={`/stories/${product.storySlug}`}>
                  Story
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}

export default ProductsPage;
