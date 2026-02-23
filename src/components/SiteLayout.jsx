import { useEffect, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import AnalyticsTracker from './AnalyticsTracker';
import SeoMeta from './SeoMeta';

function SiteLayout({ children }) {
  const [menuOpen, setMenuOpen] = useState(false);

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
    <>
      <AnalyticsTracker />
      <SeoMeta />
      <header className="site-header">
        <div className="container header-inner">
          <Link className="brand" to="/">
            kimboin.github.io
          </Link>
          <nav className="desktop-nav" aria-label="주요 메뉴">
            <NavLink to="/">Home</NavLink>
            <NavLink to="/tools">Tools</NavLink>
            <NavLink to="/products">Products</NavLink>
            <NavLink to="/now">Now</NavLink>
          </nav>
          <button
            type="button"
            className="menu-toggle"
            aria-label="모바일 메뉴 열기"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((prev) => !prev)}
          >
            <span className="menu-icon" />
          </button>
        </div>
        <nav className="mobile-nav" data-open={menuOpen} aria-label="모바일 메뉴">
          <div className="container">
            <NavLink to="/" onClick={() => setMenuOpen(false)}>
              Home
            </NavLink>
            <NavLink to="/tools" onClick={() => setMenuOpen(false)}>
              Tools
            </NavLink>
            <NavLink to="/products" onClick={() => setMenuOpen(false)}>
              Products
            </NavLink>
            <NavLink to="/now" onClick={() => setMenuOpen(false)}>
              Now
            </NavLink>
          </div>
        </nav>
      </header>
      <main>{children}</main>
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
    </>
  );
}

export default SiteLayout;
