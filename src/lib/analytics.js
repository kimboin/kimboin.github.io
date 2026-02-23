export function trackEvent(eventName, params = {}) {
  if (typeof window === 'undefined' || typeof window.gtag !== 'function') {
    return;
  }

  window.gtag('event', eventName, params);
}

export function trackPageView(pathname, search = '') {
  if (typeof window === 'undefined' || typeof window.gtag !== 'function') {
    return;
  }

  const pagePath = `${pathname}${search}`;
  window.gtag('event', 'page_view', {
    page_path: pagePath,
    page_location: window.location.href,
    page_title: document.title
  });
}
