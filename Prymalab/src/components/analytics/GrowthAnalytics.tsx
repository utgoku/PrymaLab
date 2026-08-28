'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useReportWebVitals } from 'next/web-vitals';

type PublicEventName = 'page_view' | 'cta_click' | 'quiz_started' | 'web_vital';

export type BrowserAnalyticsContext = {
  sessionId: string;
  source: string;
  medium: string;
  campaign: string;
  referrerHost: string;
};

const SESSION_KEY = 'prymalab_analytics_session';
const ATTRIBUTION_KEY = 'prymalab_analytics_attribution';

function safeStorageGet(key: string) {
  try { return sessionStorage.getItem(key); } catch { return null; }
}

function safeStorageSet(key: string, value: string) {
  try { sessionStorage.setItem(key, value); } catch { /* Storage may be disabled. */ }
}

function getReferrerHost() {
  try { return document.referrer ? new URL(document.referrer).hostname.slice(0, 120) : ''; } catch { return ''; }
}

export function getBrowserAnalyticsContext(): BrowserAnalyticsContext {
  let sessionId = safeStorageGet(SESSION_KEY) || '';
  if (!sessionId) {
    sessionId = crypto.randomUUID();
    safeStorageSet(SESSION_KEY, sessionId);
  }

  const stored = safeStorageGet(ATTRIBUTION_KEY);
  if (stored) {
    try { return { sessionId, ...JSON.parse(stored) } as BrowserAnalyticsContext; } catch { /* Rebuild below. */ }
  }

  const params = new URLSearchParams(window.location.search);
  const referrerHost = getReferrerHost();
  const attribution = {
    source: (params.get('utm_source') || (referrerHost ? 'referral' : 'direct')).slice(0, 80),
    medium: (params.get('utm_medium') || (referrerHost ? 'referral' : 'none')).slice(0, 80),
    campaign: (params.get('utm_campaign') || '').slice(0, 100),
    referrerHost,
  };
  safeStorageSet(ATTRIBUTION_KEY, JSON.stringify(attribution));
  return { sessionId, ...attribution };
}

export function trackGrowthEvent(eventName: PublicEventName, metadata: Record<string, string | number | boolean> = {}) {
  if (typeof window === 'undefined') return;
  const body = JSON.stringify({
    eventName,
    path: window.location.pathname,
    ...getBrowserAnalyticsContext(),
    metadata,
  });
  if (navigator.sendBeacon) {
    navigator.sendBeacon('/api/analytics', new Blob([body], { type: 'application/json' }));
    return;
  }
  void fetch('/api/analytics', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body, keepalive: true });
}

function reportWebVital(metric: { name: string; value: number; rating: string }) {
  if (!['LCP', 'INP', 'CLS'].includes(metric.name)) return;
  trackGrowthEvent('web_vital', {
    name: metric.name,
    value: metric.value,
    rating: metric.rating,
  });
}

export default function GrowthAnalytics() {
  const pathname = usePathname();

  useEffect(() => {
    trackGrowthEvent('page_view');
  }, [pathname]);

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const target = event.target instanceof Element ? event.target.closest<HTMLElement>('[data-analytics]') : null;
      if (!target) return;
      trackGrowthEvent('cta_click', {
        action: target.dataset.analytics || 'cta',
        label: (target.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 100),
      });
    };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, []);

  useReportWebVitals(reportWebVital);

  return null;
}
