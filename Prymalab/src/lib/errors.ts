export const ErrorCode = {
  ERR_AUTH_UNAUTHORIZED: 'ERR_AUTH_UNAUTHORIZED',
  ERR_AUTH_FORBIDDEN: 'ERR_AUTH_FORBIDDEN',
  ERR_AUTH_INVALID_CREDENTIALS: 'ERR_AUTH_INVALID_CREDENTIALS',
  ERR_AUTH_TOKEN_EXPIRED: 'ERR_AUTH_TOKEN_EXPIRED',
  ERR_QUIZ_INVALID_PAYLOAD: 'ERR_QUIZ_INVALID_PAYLOAD',
  ERR_QUIZ_SCORE_CALCULATION_FAILED: 'ERR_QUIZ_SCORE_CALCULATION_FAILED',
  ERR_QUIZ_NOT_FOUND: 'ERR_QUIZ_NOT_FOUND',
  ERR_MEAL_PLAN_NOT_FOUND: 'ERR_MEAL_PLAN_NOT_FOUND',
  ERR_MEAL_PLAN_DUPLICATE_DAY: 'ERR_MEAL_PLAN_DUPLICATE_DAY',
  ERR_MEAL_ITEM_NOT_FOUND: 'ERR_MEAL_ITEM_NOT_FOUND',
  ERR_SLEEP_LOG_NOT_FOUND: 'ERR_SLEEP_LOG_NOT_FOUND',
  ERR_SLEEP_LOG_DUPLICATE_DAY: 'ERR_SLEEP_LOG_DUPLICATE_DAY',
  ERR_SLEEP_LOG_INVALID_TIMES: 'ERR_SLEEP_LOG_INVALID_TIMES',
  ERR_ORDER_NOT_FOUND: 'ERR_ORDER_NOT_FOUND',
  ERR_ORDER_PAYMENT_FAILED: 'ERR_ORDER_PAYMENT_FAILED',
  ERR_ORDER_WEBHOOK_INVALID: 'ERR_ORDER_WEBHOOK_INVALID',
  ERR_USER_NOT_FOUND: 'ERR_USER_NOT_FOUND',
  ERR_USER_PROFILE_NOT_FOUND: 'ERR_USER_PROFILE_NOT_FOUND',
  ERR_USER_EMAIL_EXISTS: 'ERR_USER_EMAIL_EXISTS',
  ERR_VALIDATION_FAILED: 'ERR_VALIDATION_FAILED',
  ERR_INTERNAL_SERVER: 'ERR_INTERNAL_SERVER',
  ERR_RATE_LIMITED: 'ERR_RATE_LIMITED',
} as const;

export type ErrorCodeType = typeof ErrorCode[keyof typeof ErrorCode];

export class AppError extends Error {
  public code: ErrorCodeType;
  public statusCode: number;
  public details?: unknown;

  constructor(message: string, code: ErrorCodeType, statusCode: number = 500, details?: unknown) {
    super(message);
    this.name = 'AppError';
    this.code = code;
    this.statusCode = statusCode;
    this.details = details;
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

export function createApiErrorResponse(error: unknown) {
  if (isAppError(error)) {
    return Response.json(
      {
        success: false,
        error: {
          code: error.code,
          message: error.message,
          statusCode: error.statusCode,
          details: error.details,
        },
      },
      { status: error.statusCode }
    );
  }

  console.error('Unhandled Error:', error);

  return Response.json(
    {
      success: false,
      error: {
        code: ErrorCode.ERR_INTERNAL_SERVER,
        message: 'Lỗi máy chủ nội bộ. Vui lòng thử lại sau.',
        statusCode: 500,
      },
    },
    { status: 500 }
  );
}

export function isAppError(error: unknown): error is AppError {
  return error instanceof AppError;
}
