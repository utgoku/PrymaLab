import 'server-only';
import { getAdminSupabase } from '@/lib/supabase-admin';

export const GROWTH_EVENT_NAMES = [
  'page_view',
  'cta_click',
  'quiz_started',
  'lead_submitted',
  'contact_submitted',
  'order_created',
  'payment_submitted',
  'web_vital',
] as const;

export type GrowthEventName = (typeof GROWTH_EVENT_NAMES)[number];

export interface AnalyticsContext {
  sessionId?: string;
  source?: string;
  medium?: string;
  campaign?: string;
  referrerHost?: string;
}

interface GrowthEventInput extends AnalyticsContext {
  eventName: GrowthEventName;
  path: string;
  metadata?: Record<string, string | number | boolean | null>;
}

function cleanText(value: unknown, max: number) {
  return typeof value === 'string' ? value.trim().replace(/\s+/g, ' ').slice(0, max) : '';
}

function cleanPath(value: unknown) {
  const path = cleanText(value, 240);
  if (!path.startsWith('/') || path.startsWith('//')) return '/';
  return path.split('?')[0].split('#')[0] || '/';
}

function cleanMetadata(value: unknown) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return {};
  return Object.fromEntries(
    Object.entries(value as Record<string, unknown>)
      .slice(0, 12)
      .map(([key, item]) => {
        const safeKey = cleanText(key, 40);
        if (typeof item === 'number') return [safeKey, Number.isFinite(item) ? item : 0];
        if (typeof item === 'boolean' || item === null) return [safeKey, item];
        return [safeKey, cleanText(item, 160)];
      })
      .filter(([key]) => Boolean(key)),
  );
}

export function analyticsContextFromBody(value: unknown): AnalyticsContext {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return {};
  const input = value as Record<string, unknown>;
  return {
    sessionId: cleanText(input.sessionId, 64),
    source: cleanText(input.source, 80),
    medium: cleanText(input.medium, 80),
    campaign: cleanText(input.campaign, 100),
    referrerHost: cleanText(input.referrerHost, 120),
  };
}

export async function recordGrowthEvent(input: GrowthEventInput) {
  const eventName = GROWTH_EVENT_NAMES.includes(input.eventName) ? input.eventName : null;
  if (!eventName) return;

  const context = analyticsContextFromBody(input);
  const { error } = await getAdminSupabase().from('analytics_events').insert({
    event_name: eventName,
    path: cleanPath(input.path),
    session_id: context.sessionId || null,
    source: context.source || null,
    medium: context.medium || null,
    campaign: context.campaign || null,
    referrer_host: context.referrerHost || null,
    metadata: cleanMetadata(input.metadata),
  });

  // Analytics must never interrupt the visitor's primary action.
  if (error && !/analytics_events/i.test(error.message)) {
    console.error('Growth analytics insert failed:', error.message);
  }
}

type AnalyticsRow = {
  event_name: GrowthEventName;
  path: string;
  session_id: string | null;
  source: string | null;
  referrer_host: string | null;
  created_at: string;
  metadata: Record<string, unknown> | null;
};

function percentile(values: number[], value: number) {
  if (!values.length) return null;
  const sorted = [...values].sort((a, b) => a - b);
  return sorted[Math.min(sorted.length - 1, Math.ceil(sorted.length * value) - 1)];
}

export async function getGrowthAnalyticsSummary(days = 30) {
  const safeDays = Math.min(Math.max(Math.round(days), 7), 180);
  const since = new Date(Date.now() - safeDays * 86_400_000).toISOString();
  const { data, error } = await getAdminSupabase()
    .from('analytics_events')
    .select('event_name, path, session_id, source, referrer_host, created_at, metadata')
    .gte('created_at', since)
    .order('created_at', { ascending: false })
    .limit(10_000);
  if (error) throw error;

  const rows = (data || []) as AnalyticsRow[];
  const count = (name: GrowthEventName) => rows.filter((row) => row.event_name === name).length;
  const sessions = new Set(rows.map((row) => row.session_id).filter(Boolean));
  const pageCounts = new Map<string, number>();
  const sourceCounts = new Map<string, number>();
  const vitalValues = new Map<string, number[]>();

  rows.forEach((row) => {
    if (row.event_name === 'page_view') {
      pageCounts.set(row.path, (pageCounts.get(row.path) || 0) + 1);
      const source = row.source || (row.referrer_host ? row.referrer_host : 'direct');
      sourceCounts.set(source, (sourceCounts.get(source) || 0) + 1);
    }
    if (row.event_name === 'web_vital') {
      const name = typeof row.metadata?.name === 'string' ? row.metadata.name : '';
      const value = Number(row.metadata?.value);
      if (name && Number.isFinite(value)) vitalValues.set(name, [...(vitalValues.get(name) || []), value]);
    }
  });

  const uniqueSessions = sessions.size;
  const leads = count('lead_submitted');
  const orders = count('order_created');
  const payments = count('payment_submitted');

  return {
    days: safeDays,
    updatedAt: new Date().toISOString(),
    totals: {
      pageViews: count('page_view'),
      uniqueSessions,
      quizStarts: count('quiz_started'),
      leads,
      contacts: count('contact_submitted'),
      orders,
      payments,
      leadConversionRate: uniqueSessions ? Number(((leads / uniqueSessions) * 100).toFixed(1)) : 0,
      orderConversionRate: uniqueSessions ? Number(((orders / uniqueSessions) * 100).toFixed(1)) : 0,
    },
    topPages: [...pageCounts.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([path, views]) => ({ path, views })),
    topSources: [...sourceCounts.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([source, views]) => ({ source, views })),
    webVitals: ['LCP', 'INP', 'CLS'].map((name) => ({
      name,
      p75: percentile(vitalValues.get(name) || [], 0.75),
      samples: vitalValues.get(name)?.length || 0,
    })),
  };
}
