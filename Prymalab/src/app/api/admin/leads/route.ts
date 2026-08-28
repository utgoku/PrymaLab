import { NextResponse } from 'next/server';
import { addLead, updateLead } from '@/lib/db';
import { hasAdminSession } from '@/lib/admin-session';
import { allowRequest, requestIp } from '@/lib/rate-limit';
import { analyticsContextFromBody, recordGrowthEvent } from '@/lib/growth-analytics';

export async function POST(request: Request) {
  try {
    if (!allowRequest(`lead:${requestIp(request)}`, 5, 10 * 60_000)) {
      return NextResponse.json({ error: 'Vui lòng thử lại sau ít phút.' }, { status: 429 });
    }
    const data = await request.json();

    const name = typeof data.name === 'string' ? data.name.trim().replace(/\s+/g, ' ').slice(0, 100) : '';
    const emailOrPhone = typeof data.emailOrPhone === 'string' ? data.emailOrPhone.trim().slice(0, 160) : '';
    const phoneDigits = emailOrPhone.replace(/\D/g, '');
    const validContact = /^\S+@\S+\.\S+$/.test(emailOrPhone) || (phoneDigits.length >= 9 && phoneDigits.length <= 12);
    if (name.length < 2 || !validContact || data.consent !== true) {
      return NextResponse.json({ error: 'Thông tin liên hệ hoặc xác nhận dữ liệu chưa hợp lệ.' }, { status: 400 });
    }

    const bmi = Number(data.bmi);
    const tdee = Number(data.tdee);
    const sleepScore = Number(data.sleepScore);
    if (bmi < 10 || bmi > 80 || tdee < 500 || tdee > 8000 || sleepScore < 0 || sleepScore > 100) {
      return NextResponse.json({ error: 'Kết quả đánh giá nằm ngoài phạm vi hỗ trợ.' }, { status: 400 });
    }

    const lead = await addLead({
      name,
      emailOrPhone,
      bmi,
      bmiCategory: typeof data.bmiCategory === 'string' ? data.bmiCategory.slice(0, 80) : '',
      tdee,
      sleepScore,
      sleepCategory: typeof data.sleepCategory === 'string' ? data.sleepCategory.slice(0, 100) : '',
      goals: typeof data.goals === 'string' ? data.goals.slice(0, 120) : '',
    });

    await recordGrowthEvent({ eventName: 'lead_submitted', path: '/quiz', ...analyticsContextFromBody(data._analytics), metadata: { goal: typeof data.goals === 'string' ? data.goals.slice(0, 120) : '' } }).catch(() => undefined);

    return NextResponse.json({ success: true, lead }, { status: 201 });
  } catch (error) {
    console.error('Failed to submit lead:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  if (!(await hasAdminSession())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const data = await request.json();
    if (typeof data.id !== 'string' || typeof data.status !== 'string') {
      return NextResponse.json({ error: 'Dữ liệu cập nhật không hợp lệ.' }, { status: 400 });
    }
    await updateLead(data.id, data.status, typeof data.adminNote === 'string' ? data.adminNote : '');
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to update lead:', error);
    return NextResponse.json({ error: 'Không thể cập nhật lead.' }, { status: 500 });
  }
}
