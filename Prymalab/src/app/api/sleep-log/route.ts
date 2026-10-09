import { NextRequest, NextResponse } from 'next/server';
import { AppError, ErrorCode, createApiErrorResponse } from '@/lib/errors';
import { SleepLog, ApiResponse } from '@/types';
import crypto from 'crypto';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const daysParam = searchParams.get('days');
    const days = daysParam ? parseInt(daysParam, 10) : 7;
    const userId = searchParams.get('userId') || 'demo-user';

    const logs: SleepLog[] = [];
    const today = new Date();

    for (let i = 0; i < days; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      
      const bedTime = new Date(date);
      bedTime.setHours(22, 30, 0, 0);
      const wakeTime = new Date(date);
      wakeTime.setDate(wakeTime.getDate() + 1);
      wakeTime.setHours(6, 30, 0, 0);

      logs.push({
        id: crypto.randomUUID(),
        userId,
        logDate: date,
        bedTime,
        wakeTime,
        qualityRating: Math.floor(Math.random() * 3) + 3, // 3 to 5
        notes: 'Ngủ ngon',
      });
    }

    const response: ApiResponse<SleepLog[]> = {
      success: true,
      data: logs,
    };

    return NextResponse.json(response);
  } catch (error) {
    if (error instanceof AppError) {
      return createApiErrorResponse(error);
    }
    return createApiErrorResponse(new AppError('Lỗi tải dữ liệu giấc ngủ', ErrorCode.ERR_INTERNAL_SERVER, 500));
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { logDate, bedTime, wakeTime, qualityRating, notes } = body;

    if (!logDate || !bedTime || !wakeTime || typeof qualityRating !== 'number') {
      throw new AppError('Dữ liệu không đầy đủ', ErrorCode.ERR_VALIDATION_FAILED, 400);
    }

    if (qualityRating < 1 || qualityRating > 5) {
      throw new AppError('Chất lượng giấc ngủ phải từ 1 đến 5', ErrorCode.ERR_VALIDATION_FAILED, 400);
    }

    // Calculate duration in minutes accounting for overnight
    const [bedHour, bedMin] = bedTime.split(':').map(Number);
    const [wakeHour, wakeMin] = wakeTime.split(':').map(Number);
    const bedMinutes = bedHour * 60 + bedMin;
    const wakeMinutes = wakeHour * 60 + wakeMin;
    const overnight = wakeMinutes < bedMinutes;

    const logDateObj = new Date(logDate as string);
    const bedDate = new Date(logDateObj);
    bedDate.setHours(bedHour, bedMin, 0, 0);
    const wakeDate = new Date(logDateObj);
    wakeDate.setHours(wakeHour, wakeMin, 0, 0);
    if (overnight) {
      wakeDate.setDate(wakeDate.getDate() + 1); // Next day
    }

    const newLog: SleepLog = {
      id: crypto.randomUUID(),
      userId: 'demo-user',
      logDate: logDateObj,
      bedTime: bedDate,
      wakeTime: wakeDate,
      qualityRating,
      notes,
    };

    const response: ApiResponse<SleepLog> = {
      success: true,
      data: newLog,
    };

    return NextResponse.json(response);
  } catch (error) {
    if (error instanceof AppError) {
      return createApiErrorResponse(error);
    }
    return createApiErrorResponse(new AppError('Lỗi tạo dữ liệu giấc ngủ', ErrorCode.ERR_INTERNAL_SERVER, 500));
  }
}
