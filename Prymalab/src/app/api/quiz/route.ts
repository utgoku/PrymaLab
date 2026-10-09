import { NextRequest, NextResponse } from 'next/server';
import { AppError, ErrorCode, createApiErrorResponse } from '@/lib/errors';
import { calculateBMI, calculateBMR, calculateTDEE, calculateSleepScore, QuizScoreResult } from '@/lib/quiz-scoring';
import { ApiResponse } from '@/types';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { answers } = body;

    if (!answers || typeof answers !== 'object') {
      throw new AppError('Invalid quiz answers provided', ErrorCode.ERR_VALIDATION_FAILED, 400);
    }

    const weight = answers.weight || 60;
    const height = answers.height || 170;
    const age = answers.age || 30;
    const gender = answers.gender === 'Nữ' ? 'FEMALE' : 'MALE';
    
    // Default values if not provided
    const bmi = calculateBMI(weight, height);
    const bmr = calculateBMR(weight, height, age, gender);
    const tdee = calculateTDEE(bmr, 'moderate'); // Simplification for API
    const sleepScore = calculateSleepScore({
      durationHours: answers.averageSleepHours || 7,
      latencyMinutes: 15,
      wakeupsPerNight: 1,
      feelsRested: true,
      usesScreensBeforeBed: false,
      caffeineAfternoon: false,
      consistentSchedule: true,
    });
    
    const result: QuizScoreResult = {
      bmi,
      tdee,
      sleepScore,
      bmiCategory: 'Bình thường',
      sleepCategory: 'Tốt',
      dailyCalories: tdee,
    };

    const response: ApiResponse<QuizScoreResult> = {
      success: true,
      data: result,
    };

    return NextResponse.json(response);
  } catch (error) {
    if (error instanceof AppError) {
      return createApiErrorResponse(error);
    }
    const unhandledError = new AppError(
      'An unexpected error occurred during quiz submission',
      ErrorCode.ERR_INTERNAL_SERVER,
      500
    );
    return createApiErrorResponse(unhandledError);
  }
}
