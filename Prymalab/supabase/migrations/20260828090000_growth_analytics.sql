-- Privacy-conscious first-party growth analytics for PrymaLab.
-- No IP address, full referrer URL, user-agent, email or phone is stored.

CREATE TABLE IF NOT EXISTS analytics_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  event_name TEXT NOT NULL,
  path TEXT NOT NULL DEFAULT '/',
  session_id TEXT,
  source TEXT,
  medium TEXT,
  campaign TEXT,
  referrer_host TEXT,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  CONSTRAINT analytics_events_name_check CHECK (
    event_name IN (
      'page_view',
      'cta_click',
      'quiz_started',
      'lead_submitted',
      'contact_submitted',
      'order_created',
      'payment_submitted',
      'web_vital'
    )
  )
);

CREATE INDEX IF NOT EXISTS analytics_events_created_at_idx
  ON analytics_events (created_at DESC);
CREATE INDEX IF NOT EXISTS analytics_events_name_created_at_idx
  ON analytics_events (event_name, created_at DESC);
CREATE INDEX IF NOT EXISTS analytics_events_path_created_at_idx
  ON analytics_events (path, created_at DESC);

ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Service role full access analytics events" ON analytics_events;
CREATE POLICY "Service role full access analytics events"
  ON analytics_events FOR ALL TO service_role
  USING (true) WITH CHECK (true);

COMMENT ON TABLE analytics_events IS
  'Anonymous, first-party website events. Do not add direct personal identifiers.';
