import { NextResponse } from 'next/server';
import { addContact } from '@/lib/db';
import { allowRequest, requestIp } from '@/lib/rate-limit';
import { analyticsContextFromBody, recordGrowthEvent } from '@/lib/growth-analytics';

function clean(value: unknown, max: number) {
  return typeof value === 'string' ? value.trim().slice(0, max) : '';
}

export async function POST(request: Request) {
  if (!allowRequest(`public-contact:${requestIp(request)}`, 5, 10 * 60_000)) {
    return NextResponse.json({ error: 'Bạn đã gửi nhiều yêu cầu. Vui lòng thử lại sau ít phút.' }, { status: 429 });
  }
  try {
    const body = await request.json();
    if (body.website) return NextResponse.json({ success: true }, { status: 201 });
    const name = clean(body.name, 100);
    const email = clean(body.email, 160).toLowerCase();
    const phone = clean(body.phone, 24);
    const subject = clean(body.subject, 120);
    const message = clean(body.message, 2000);
    if (name.length < 2 || !/^\S+@\S+\.\S+$/.test(email) || message.length < 10) {
      return NextResponse.json({ error: 'Vui lòng kiểm tra họ tên, email và nội dung.' }, { status: 400 });
    }
    await addContact({ name, email, phone, subject: subject || 'Liên hệ từ website', message });
    await recordGrowthEvent({ eventName: 'contact_submitted', path: '/contact', ...analyticsContextFromBody(body._analytics), metadata: { subject: subject || 'Liên hệ từ website' } }).catch(() => undefined);
    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    console.error('Public contact submission failed:', error);
    return NextResponse.json({ error: 'Chưa thể gửi yêu cầu lúc này.' }, { status: 500 });
  }
}
