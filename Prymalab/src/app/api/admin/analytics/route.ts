import { NextResponse } from 'next/server';
import { hasAdminSession } from '@/lib/admin-session';
import { getGrowthAnalyticsSummary } from '@/lib/growth-analytics';

export async function GET(request: Request) {
  if (!(await hasAdminSession())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const days = Number(new URL(request.url).searchParams.get('days') || 30);
    return NextResponse.json(await getGrowthAnalyticsSummary(days));
  } catch (error) {
    console.error('Admin analytics query failed:', error);
    return NextResponse.json({ error: 'Chưa thể tải dữ liệu tăng trưởng.' }, { status: 500 });
  }
}
