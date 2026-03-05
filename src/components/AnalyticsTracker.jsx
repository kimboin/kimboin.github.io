import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { trackEvent, trackPageView } from '../lib/analytics';

const TOOL_NAME_BY_PATH = {
  '/birthday-gift-picker': 'birthday-gift-picker',
  '/food-menu-picker': 'food-menu-picker',
  '/lotto-random-generator': 'lotto-random-generator',
  '/text-counter': 'text-counter',
  '/image-format-converter': 'image-format-converter',
  '/date-anniversary-calculator': 'date-anniversary-calculator',
  '/team-splitter': 'team-splitter',
  '/winner-picker': 'winner-picker',
  '/lunar-solar-converter': 'lunar-solar-converter',
  '/ip-checker': 'ip-checker',
  '/balance-game': 'balance-game'
};

const CONTENT_NAME_BY_PATH = {
  '/kana-trace': 'kana-trace',
  '/travel-japanese': 'travel-japanese'
};

function AnalyticsTracker() {
  const location = useLocation();

  useEffect(() => {
    trackPageView(location.pathname, location.search);
    const toolName = TOOL_NAME_BY_PATH[location.pathname];
    const contentName = CONTENT_NAME_BY_PATH[location.pathname];
    if (toolName) {
      trackEvent('tool_open', { tool_name: toolName });
    }
    if (contentName) {
      trackEvent('content_open', { content_name: contentName });
    }
  }, [location.pathname, location.search]);

  return null;
}

export default AnalyticsTracker;
