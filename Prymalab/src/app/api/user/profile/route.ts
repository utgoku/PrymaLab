import { NextRequest, NextResponse } from 'next/server';
import { AppError, ErrorCode, createApiErrorResponse } from '@/lib/errors';
import { UserProfile, ApiResponse, TargetGoal } from '@/types';

export async function GET() {
  try {
    const mockProfile: UserProfile = {
      id: 'demo-user-id',
      userId: 'demo-user-id',
      fullName: 'Nguyễn Văn A',
      age: 30,
      weightKg: 70,
      heightCm: 175,
      gender: 'MALE',
      targetGoal: TargetGoal.FAT_LOSS,
    };

    const response: ApiResponse<UserProfile> = {
      success: true,
      data: mockProfile,
    };

    return NextResponse.json(response);
  } catch (error) {
    if (error instanceof AppError) {
      return createApiErrorResponse(error);
    }
    return createApiErrorResponse(new AppError('Lỗi tải thông tin cá nhân', ErrorCode.ERR_INTERNAL_SERVER, 500));
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body: Partial<UserProfile> = await req.json();
    const { age, weightKg, heightCm } = body;

    if (age !== undefined && age <= 0) {
      throw new AppError('Tuổi phải lớn hơn 0', ErrorCode.ERR_VALIDATION_FAILED, 400);
    }
    if (weightKg !== undefined && weightKg <= 0) {
      throw new AppError('Cân nặng phải lớn hơn 0', ErrorCode.ERR_VALIDATION_FAILED, 400);
    }
    if (heightCm !== undefined && heightCm <= 0) {
      throw new AppError('Chiều cao phải lớn hơn 0', ErrorCode.ERR_VALIDATION_FAILED, 400);
    }

    const updatedProfile: UserProfile = {
      id: 'demo-user-id',
      userId: 'demo-user-id',
      fullName: body.fullName || 'Nguyễn Văn A',
      age: age || 30,
      weightKg: weightKg || 70,
      heightCm: heightCm || 175,
      gender: body.gender || 'MALE',
      targetGoal: body.targetGoal || TargetGoal.FAT_LOSS,
    };

    const response: ApiResponse<UserProfile> = {
      success: true,
      data: updatedProfile,
    };

    return NextResponse.json(response);
  } catch (error) {
    if (error instanceof AppError) {
      return createApiErrorResponse(error);
    }
    return createApiErrorResponse(new AppError('Lỗi cập nhật thông tin cá nhân', ErrorCode.ERR_INTERNAL_SERVER, 500));
  }
}
