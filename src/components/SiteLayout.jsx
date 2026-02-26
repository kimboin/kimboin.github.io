import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import AnalyticsTracker from './AnalyticsTracker';
import SeoMeta from './SeoMeta';
import { LanguageProvider, useLanguage } from '../lib/language';

function SiteLayoutBody({ children }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const { language, setLanguage } = useLanguage();
  const copy =
    language === 'ko'
      ? {
          mainNav: '주요 메뉴',
          home: '홈',
          tools: '도구',
          products: '사이트',
          now: '현재',
          languageSwitch: '언어 변경: 영어로 전환',
          mobileMenuOpen: '모바일 메뉴 열기',
          mobileNav: '모바일 메뉴',
          langButton: '한국어'
        }
      : {
          mainNav: 'Main navigation',
          home: 'Home',
          tools: 'Tools',
          products: 'Sites',
          now: 'Now',
          languageSwitch: 'Language switch: change to Korean',
          mobileMenuOpen: 'Open mobile menu',
          mobileNav: 'Mobile navigation',
          langButton: 'English'
        };

  useEffect(() => {
    function onKeyDown(event) {
      if (event.key === 'Escape') {
        setMenuOpen(false);
      }
    }

    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, []);

  return (
    <div className="site-shell">
      <AnalyticsTracker />
      <SeoMeta />
      <header className="site-header">
        <div className="container header-inner">
          <Link className="brand" to="/">
            kimboin.github.io
          </Link>
          <nav className="desktop-nav" aria-label={copy.mainNav}>
            <NavLink to="/">{copy.home}</NavLink>
            <NavLink to="/tools">{copy.tools}</NavLink>
            <NavLink to="/sites">{copy.products}</NavLink>
            <NavLink to="/now">{copy.now}</NavLink>
          </nav>
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
            <NavLink to="/" onClick={() => setMenuOpen(false)}>
              {copy.home}
            </NavLink>
            <NavLink to="/tools" onClick={() => setMenuOpen(false)}>
              {copy.tools}
            </NavLink>
            <NavLink to="/sites" onClick={() => setMenuOpen(false)}>
              {copy.products}
            </NavLink>
            <NavLink to="/now" onClick={() => setMenuOpen(false)}>
              {copy.now}
            </NavLink>
          </div>
        </nav>
      </header>
      <main className={`page-view page-${resolvePageTheme(location.pathname)}`}>{children}</main>
      <footer className="site-footer">
        <div className="container footer-inner">
          <small>© 2026 kimboin. All rights reserved.</small>
          <small>
            <a href="https://github.com/kimboin" target="_blank" rel="noreferrer">
              GitHub
            </a>
          </small>
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
  if (pathname.startsWith('/sites') || pathname.startsWith('/products')) {
    return 'sites';
  }
  if (pathname.startsWith('/now')) {
    return 'now';
  }
  return 'home';
}

function SiteLayout({ children }) {
  return (
    <LanguageProvider>
      <SiteLayoutBody>{children}</SiteLayoutBody>
    </LanguageProvider>
  );
}

export default SiteLayout;
