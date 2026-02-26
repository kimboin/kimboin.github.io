import { Link, useSearchParams } from 'react-router-dom';
import { blogPosts } from '../data/blog';
import { useLanguage } from '../lib/language';

function formatDate(dateText) {
  const parsed = new Date(`${dateText}T00:00:00`);
  if (Number.isNaN(parsed.getTime())) {
    return dateText;
  }
  return parsed.toISOString().slice(0, 10);
}

function BlogPage() {
  const { language } = useLanguage();
  const [searchParams] = useSearchParams();
  const activeCategory = searchParams.get('category') || 'all';
  const copy =
    language === 'ko'
      ? {
          kicker: '블로그',
          title: '개발 노트와 기록',
          description: '도구를 만들고 운영하면서 남긴 짧은 기록입니다.',
          open: '읽기',
          pendingTitle: '업데이트 예정',
          pendingDescription: '곧 개발/영화 카테고리 글을 순차적으로 올릴 예정입니다.',
          all: '전체',
          dev: '개발',
          movie: '영화'
        }
      : {
          kicker: 'Blog',
          title: 'Build Notes and Logs',
          description: 'Short notes from building and running tools.',
          open: 'Read',
          pendingTitle: 'Updates Coming Soon',
          pendingDescription: 'Posts for Development and Movie categories will be added soon.',
          all: 'All',
          dev: 'Development',
          movie: 'Movie'
        };

  const filteredPosts =
    activeCategory === 'all'
      ? blogPosts
      : blogPosts.filter((post) => post.category === activeCategory);

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
        <div className="container">
          <div className="blog-submenu">
            <Link className={`button ghost ${activeCategory === 'all' ? 'is-active' : ''}`} to="/blog">
              {copy.all}
            </Link>
            <Link
              className={`button ghost ${activeCategory === 'dev' ? 'is-active' : ''}`}
              to="/blog?category=dev"
            >
              {copy.dev}
            </Link>
            <Link
              className={`button ghost ${activeCategory === 'movie' ? 'is-active' : ''}`}
              to="/blog?category=movie"
            >
              {copy.movie}
            </Link>
          </div>
          <div className="grid two">
            {filteredPosts.length === 0 ? (
              <article className="card blog-card">
                <h2>{copy.pendingTitle}</h2>
                <p>{copy.pendingDescription}</p>
              </article>
            ) : (
              filteredPosts.map((post) => (
                <article className="card blog-card" key={post.slug}>
                  <p className="blog-date">{formatDate(post.date)}</p>
                  <h2>{language === 'ko' ? post.titleKo : post.titleEn}</h2>
                  <p>{language === 'ko' ? post.excerptKo : post.excerptEn}</p>
                  <div className="actions">
                    <Link className="button primary" to={`/blog/${post.slug}`}>
                      {copy.open}
                    </Link>
                  </div>
                </article>
              ))
            )}
          </div>
        </div>
      </section>
    </>
  );
}

export default BlogPage;
