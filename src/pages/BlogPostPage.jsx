import { Link, Navigate, useParams } from 'react-router-dom';
import { blogPosts } from '../data/blog';
import { useLanguage } from '../lib/language';

function formatDate(dateText) {
  const parsed = new Date(`${dateText}T00:00:00`);
  if (Number.isNaN(parsed.getTime())) {
    return dateText;
  }
  return parsed.toISOString().slice(0, 10);
}

function BlogPostPage() {
  const { slug } = useParams();
  const { language } = useLanguage();
  const post = blogPosts.find((item) => item.slug === slug);

  if (!post) {
    return <Navigate to="/blog" replace />;
  }

  const content = language === 'ko' ? post.contentKo : post.contentEn;
  const title = language === 'ko' ? post.titleKo : post.titleEn;
  const copy = language === 'ko' ? { back: '목록으로' } : { back: 'Back to list' };

  return (
    <>
      <section className="hero">
        <div className="container">
          <p className="kicker">BLOG</p>
          <h1>{title}</h1>
          <p>{formatDate(post.date)}</p>
        </div>
      </section>
      <section className="section">
        <div className="container">
          <article className="card blog-post">
            {content.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
            <div className="actions">
              <Link className="button ghost" to="/blog">
                {copy.back}
              </Link>
            </div>
          </article>
        </div>
      </section>
    </>
  );
}

export default BlogPostPage;
