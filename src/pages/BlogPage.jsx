import { Link, useSearchParams } from 'react-router-dom';
import { blogPosts } from '../data/blog';
import { useLanguage } from '../lib/language';

function getYoutubeThumbnail(url) {
  try {
    const parsed = new URL(url);
    if (parsed.hostname.includes('youtu.be')) {
      const id = parsed.pathname.replace('/', '');
      return id ? `https://i.ytimg.com/vi/${id}/hqdefault.jpg` : '';
    }
    if (parsed.hostname.includes('youtube.com')) {
      const id = parsed.searchParams.get('v');
      return id ? `https://i.ytimg.com/vi/${id}/hqdefault.jpg` : '';
    }
    return '';
  } catch (_error) {
    return '';
  }
}

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
  const activePlatform = searchParams.get('platform') || 'all';
  const copy =
    language === 'ko'
      ? {
          kicker: '블로그',
          title: '시청 기록',
          description: 'OTT, 유튜브, 방송에서 재밌게 보거나 인상 깊었던 콘텐츠를 기록해두는 공간입니다.',
          pendingTitle: '업데이트 예정',
          pendingDescription: '곧 새로운 시청 기록을 순차적으로 올릴 예정입니다.',
          submenu: '플랫폼',
          all: '전체',
          netflix: '넷플릭스',
          disney: '디즈니',
          youtube: '유튜브'
        }
      : {
          kicker: 'Blog',
          title: 'Watch Log',
          description: 'A place to log OTT, YouTube, and TV content that felt especially fun or memorable.',
          pendingTitle: 'Updates Coming Soon',
          pendingDescription: 'New watch logs will be added soon.',
          submenu: 'Platform',
          all: 'All',
          netflix: 'Netflix',
          disney: 'Disney+',
          youtube: 'YouTube'
        };

  const filteredPosts =
    activePlatform === 'all' ? blogPosts : blogPosts.filter((post) => post.platform === activePlatform);

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
          <nav className="blog-submenu" aria-label={copy.submenu}>
            <Link className={`blog-submenu-link ${activePlatform === 'all' ? 'is-active' : ''}`} to="/blog">
              {copy.all}
            </Link>
            <Link
              className={`blog-submenu-link ${activePlatform === 'netflix' ? 'is-active' : ''}`}
              to="/blog?platform=netflix"
            >
              {copy.netflix}
            </Link>
            <Link
              className={`blog-submenu-link ${activePlatform === 'disney' ? 'is-active' : ''}`}
              to="/blog?platform=disney"
            >
              {copy.disney}
            </Link>
            <Link
              className={`blog-submenu-link ${activePlatform === 'youtube' ? 'is-active' : ''}`}
              to="/blog?platform=youtube"
            >
              {copy.youtube}
            </Link>
          </nav>
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
                  {post.youtubeUrl ? (
                    <a className="blog-video-link" href={post.youtubeUrl} target="_blank" rel="noreferrer">
                      {getYoutubeThumbnail(post.youtubeUrl) ? (
                        <img
                          className="blog-video-thumb"
                          src={getYoutubeThumbnail(post.youtubeUrl)}
                          alt={`${language === 'ko' ? post.titleKo : post.titleEn} thumbnail`}
                          loading="lazy"
                        />
                      ) : null}
                    </a>
                  ) : null}
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
