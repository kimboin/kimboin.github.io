import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { trackEvent, trackPageView } from '../lib/analytics';

const TOOL_NAME_BY_PATH = {
  '/food-menu-picker': 'food-menu-picker',
  '/lotto-random-generator': 'lotto-random-generator',
  '/text-counter': 'text-counter',
  '/kana-trace': 'kana-trace',
  '/travel-japanese': 'travel-japanese',
  '/image-format-converter': 'image-format-converter',
  '/date-anniversary-calculator': 'date-anniversary-calculator'
};

function AnalyticsTracker() {
  const location = useLocation();

  useEffect(() => {
    trackPageView(location.pathname, location.search);
    const toolName = TOOL_NAME_BY_PATH[location.pathname];
    if (toolName) {
      trackEvent('tool_open', { tool_name: toolName });
    }
  }, [location.pathname, location.search]);

  return null;
}

export default AnalyticsTracker;
