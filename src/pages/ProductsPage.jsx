import { products } from '../data/content';
import { useLanguage } from '../lib/language';

function badgeClass(status) {
  if (status === 'Live') return 'badge live';
  if (status === 'Beta') return 'badge beta';
  return 'badge paused';
}

function ProductsPage() {
  const { language } = useLanguage();
  const copy =
    language === 'ko'
      ? {
          kicker: '사이트',
          title: '내가 직접 만든 사이트',
          description: '단순하지만 실제로 운영해보는 사이트를 모아두었습니다.',
          reason: '만들게 된 계기',
          target: '주요 대상',
          visit: '방문하기',
        }
      : {
          kicker: 'Sites',
          title: 'Sites I build and run',
          description: 'A collection of simple sites I actively run.',
          reason: 'Why I made this',
          target: 'Target',
          visit: 'Visit',
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
        <div className="container products-list">
          {products.map((product) => (
            <article className="card" key={product.slug}>
              <span className={badgeClass(product.status)}>{product.status.toUpperCase()}</span>
              <h2>{product.name}</h2>
              <p>{language === 'ko' ? product.value : product.valueEn || product.value}</p>
              <p>
                <strong>{copy.target}:</strong> {language === 'ko' ? product.target : product.targetEn || product.target}
              </p>
              <p>
                <strong>{copy.reason}:</strong> {language === 'ko' ? product.reason : product.reasonEn || product.reason}
              </p>
              <div className="actions">
                <a className="button primary" href={product.visitUrl} target="_blank" rel="noreferrer">
                  {copy.visit}
                </a>
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}

export default ProductsPage;
