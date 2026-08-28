import { NextResponse } from 'next/server';
import {
  GROWTH_EVENT_NAMES,
  analyticsContextFromBody,
  recordGrowthEvent,
  type GrowthEventName,
} from '@/lib/growth-analytics';
import { allowRequest, requestIp } from '@/lib/rate-limit';

export async function POST(request: Request) {
  if (!allowRequest(`analytics:${requestIp(request)}`, 90, 60_000)) {
    return new NextResponse(null, { status: 204 });
  }

  try {
    const body = await request.json();
    const eventName = typeof body.eventName === 'string' ? body.eventName : '';
    if (!GROWTH_EVENT_NAMES.includes(eventName as GrowthEventName)) {
      return NextResponse.json({ error: 'Unsupported event.' }, { status: 400 });
    }

    await recordGrowthEvent({
      eventName: eventName as GrowthEventName,
      path: body.path,
      ...analyticsContextFromBody(body),
      metadata: body.metadata,
    });
    return new NextResponse(null, { status: 204 });
  } catch {
    // Analytics is best-effort and should remain invisible to visitors.
    return new NextResponse(null, { status: 204 });
  }
}
