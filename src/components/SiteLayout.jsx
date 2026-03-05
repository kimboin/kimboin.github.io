import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import AnalyticsTracker from './AnalyticsTracker';
import SeoMeta from './SeoMeta';
import { LanguageProvider, useLanguage } from '../lib/language';
import { tools } from '../data/content';

function SiteLayoutBody({ children }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [shareMessage, setShareMessage] = useState('');
  const location = useLocation();
  const { language, setLanguage } = useLanguage();
  const copy =
    language === 'ko'
      ? {
          mainNav: '주요 메뉴',
          sidebarNav: '사이드 메뉴',
          home: '홈',
          tools: '도구',
          learn: '콘텐츠/학습',
          products: '사이트',
          now: '현재',
          blog: '블로그',
          about: '소개',
          privacy: '개인정보처리방침',
          contact: '문의',
          footerNav: '푸터 링크',
          copyright: '© 2026 kimboin. All rights reserved.',
          languageSwitch: '언어 변경: 영어로 전환',
          mobileMenuOpen: '모바일 메뉴 열기',
          sidebarMenuToggle: '사이드바 열기/닫기',
          mobileNav: '모바일 메뉴',
          langButton: '한국어',
          sidebarTitle: '메뉴',
          relatedToolsTitle: '같은 종류 도구',
          moreTools: '더 많은 도구 알아보기',
          whyTitle: '이 도구를 만든 이유',
          shareLink: '링크 공유',
          shareCopied: '링크를 복사했습니다.',
          shareDone: '공유가 완료되었습니다.',
          shareFailed: '링크 공유에 실패했습니다.'
        }
      : {
          mainNav: 'Main navigation',
          sidebarNav: 'Sidebar navigation',
          home: 'Home',
          tools: 'Tools',
          learn: 'Learn',
          products: 'Sites',
          now: 'Now',
          blog: 'Blog',
          about: 'About',
          privacy: 'Privacy Policy',
          contact: 'Contact',
          footerNav: 'Footer links',
          copyright: '© 2026 kimboin. All rights reserved.',
          languageSwitch: 'Language switch: change to Korean',
          mobileMenuOpen: 'Open mobile menu',
          sidebarMenuToggle: 'Toggle sidebar',
          mobileNav: 'Mobile navigation',
          langButton: 'English',
          sidebarTitle: 'Menu',
          relatedToolsTitle: 'Related Tools',
          moreTools: 'Explore More Tools',
          whyTitle: 'Why I built this tool',
          shareLink: 'Share Link',
          shareCopied: 'Link copied.',
          shareDone: 'Shared successfully.',
          shareFailed: 'Failed to share link.'
        };
  const primaryLinks = [
    { to: '/', label: copy.home },
    { to: '/tools', label: copy.tools },
    { to: '/learn', label: copy.learn },
    { to: '/sites', label: copy.products },
    { to: '/blog', label: copy.blog },
    { to: '/now', label: copy.now }
  ];
  const currentTool = findToolByPath(location.pathname);
  const relatedTools = currentTool
    ? tools.filter((tool) => tool.category === currentTool.category && tool.slug !== currentTool.slug)
    : [];

  useEffect(() => {
    function onKeyDown(event) {
      if (event.key === 'Escape') {
        setMenuOpen(false);
      }
    }

    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [location.pathname]);

  useEffect(() => {
    setShareMessage('');
  }, [location.pathname]);

  async function onShareTool() {
    const currentUrl = window.location.href;
    const title = language === 'ko' ? currentTool?.nameKo || currentTool?.name : currentTool?.name;

    if (!currentUrl || !title) {
      return;
    }

    if (navigator.share) {
      try {
        await navigator.share({ title, url: currentUrl });
        setShareMessage(copy.shareDone);
        return;
      } catch (error) {
        if (error?.name === 'AbortError') {
          return;
        }
      }
    }

    if (navigator?.clipboard?.writeText) {
      try {
        await navigator.clipboard.writeText(currentUrl);
        setShareMessage(copy.shareCopied);
        return;
      } catch (_error) {
        setShareMessage(copy.shareFailed);
        return;
      }
    }

    setShareMessage(copy.shareFailed);
  }

  return (
    <div className="site-shell">
      <AnalyticsTracker />
      <SeoMeta />
      <header className="site-header">
        <div className="container header-inner">
          <div className="header-left">
            <button
              type="button"
              className="sidebar-toggle"
              aria-label={copy.sidebarMenuToggle}
              aria-expanded={sidebarOpen}
              onClick={() => setSidebarOpen((prev) => !prev)}
            >
              <span className="menu-icon" />
            </button>
            <Link className="brand" to="/">
              kimboin.github.io
            </Link>
          </div>
          <div className="header-actions">
            <button
              type="button"
              className="lang-toggle"
              aria-label={copy.languageSwitch}
              onClick={() => setLanguage((prev) => (prev === 'ko' ? 'en' : 'ko'))}
            >
              <span className="lang-icon" aria-hidden="true">
                🌐
              </span>
              <span className="lang-text">{copy.langButton}</span>
            </button>
            <button
              type="button"
              className="menu-toggle"
              aria-label={copy.mobileMenuOpen}
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((prev) => !prev)}
            >
              <span className="menu-icon" />
            </button>
          </div>
        </div>
        <nav className="mobile-nav" data-open={menuOpen} aria-label={copy.mobileNav}>
          <div className="container">
            {primaryLinks.map((link) => (
              <NavLink key={link.to} to={link.to} onClick={() => setMenuOpen(false)}>
                {link.label}
              </NavLink>
            ))}
          </div>
        </nav>
      </header>
      <div className={`site-body ${sidebarOpen ? '' : 'sidebar-collapsed'}`}>
        <aside className="site-sidebar" aria-label={copy.sidebarNav}>
          <div className="site-sidebar-panel">
            <p className="site-sidebar-title">{copy.sidebarTitle}</p>
            <nav className="site-sidebar-nav" aria-label={copy.mainNav}>
              {primaryLinks.map((link) => (
                <NavLink key={link.to} to={link.to} end={link.to === '/'}>
                  {link.label}
                </NavLink>
              ))}
            </nav>
          </div>
        </aside>
        <main className={`site-main page-view page-${resolvePageTheme(location.pathname)}`}>
          {children}
          {currentTool ? (
            <section className="tool-share-section">
              <div className="container">
                <div className="tool-share-wrap">
                  <button type="button" className="button share" onClick={onShareTool}>
                    {copy.shareLink}
                  </button>
                  {shareMessage ? <p className="tool-share-feedback">{shareMessage}</p> : null}
                </div>
              </div>
            </section>
          ) : null}
          {currentTool ? (
            <section className="section related-tools-section">
              <div className="container">
                <article className="card">
                  <h2 className="related-tools-title">{copy.whyTitle}</h2>
                  <p>{language === 'ko' ? currentTool.why : currentTool.whyEn || currentTool.why}</p>
                </article>
              </div>
            </section>
          ) : null}
          {relatedTools.length > 0 ? (
            <section className="section related-tools-section">
              <div className="container">
                <div className="related-tools-head">
                  <h2 className="related-tools-title">{copy.relatedToolsTitle}</h2>
                  <Link className="button ghost" to="/tools">
                    {copy.moreTools}
                  </Link>
                </div>
                <div className="grid two">
                  {relatedTools.map((tool) => (
                    <Link className="card home-tool-card home-tool-link" key={tool.slug} to={tool.openUrl}>
                      <h3>{language === 'ko' ? tool.nameKo || tool.name : tool.name}</h3>
                      <p>{language === 'ko' ? tool.oneLiner : tool.oneLinerEn || tool.oneLiner}</p>
                    </Link>
                  ))}
                </div>
              </div>
            </section>
          ) : null}
        </main>
      </div>
      <footer className="site-footer">
        <div className="container footer-inner">
          <small>{copy.copyright}</small>
          <nav className="footer-links" aria-label={copy.footerNav}>
            <Link to="/about">{copy.about}</Link>
            <Link to="/privacy">{copy.privacy}</Link>
            <Link to="/contact">{copy.contact}</Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}

function resolvePageTheme(pathname) {
  if (pathname === '/') {
    return 'home';
  }
  if (pathname.startsWith('/tools')) {
    return 'tools';
  }
  if (pathname.startsWith('/learn') || pathname.startsWith('/contents')) {
    return 'tools';
  }
  if (pathname.startsWith('/sites') || pathname.startsWith('/products')) {
    return 'sites';
  }
  if (pathname.startsWith('/now')) {
    return 'now';
  }
  if (pathname.startsWith('/blog')) {
    return 'blog';
  }
  return 'home';
}

function normalizePath(path) {
  if (!path) {
    return '/';
  }
  return path.endsWith('/') && path !== '/' ? path.slice(0, -1) : path;
}

function findToolByPath(pathname) {
  const currentPath = normalizePath(pathname);
  return tools.find((tool) => normalizePath(tool.openUrl) === currentPath) || null;
}

function SiteLayout({ children }) {
  return (
    <LanguageProvider>
      <SiteLayoutBody>{children}</SiteLayoutBody>
    </LanguageProvider>
  );
}

export default SiteLayout;
