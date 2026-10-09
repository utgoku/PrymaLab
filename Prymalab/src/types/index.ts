export enum UserRole {
  GUEST = 'GUEST',
  CUSTOMER = 'CUSTOMER',
  SPECIALIST = 'SPECIALIST',
  CONTENT_MGR = 'CONTENT_MGR',
  SUPER_ADMIN = 'SUPER_ADMIN'
}

export enum TargetGoal {
  FAT_LOSS = 'FAT_LOSS',
  MUSCLE_GAIN = 'MUSCLE_GAIN',
  SLEEP_RECOVERY = 'SLEEP_RECOVERY',
  GENERAL_WELLNESS = 'GENERAL_WELLNESS',
  WEIGHT_MAINTAIN = 'WEIGHT_MAINTAIN'
}

export enum MealType {
  BREAKFAST = 'BREAKFAST',
  LUNCH = 'LUNCH',
  DINNER = 'DINNER',
  SNACK = 'SNACK'
}

export enum PackageType {
  STARTER = 'STARTER',
  TRANSFORMATION_30 = 'TRANSFORMATION_30',
  ELITE_90 = 'ELITE_90'
}

export enum OrderStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED'
}

export enum OutboxEventStatus {
  PENDING = 'PENDING',
  PROCESSED = 'PROCESSED',
  FAILED = 'FAILED'
}

export enum PaymentGateway {
  BANK_TRANSFER = 'BANK_TRANSFER',
  VIETQR = 'VIETQR'
}

export type QuizStep = {
  id: string;
  question: string;
  options: { label: string; value: string | number; score?: number }[];
  type: 'single' | 'multiple' | 'number';
};

export interface User {
  id: string;
  email: string;
  role: UserRole;
  createdAt: Date;
}

export interface UserProfile {
  id: string;
  userId: string;
  fullName: string;
  age: number;
  gender: 'MALE' | 'FEMALE' | 'OTHER';
  weightKg: number;
  heightCm: number;
  targetGoal: TargetGoal;
  specialistId?: string | null;
}

export interface QuizResult {
  id: string;
  userId?: string | null;
  sleepScore: number;
  tdeeScore: number;
  bmiScore: number;
  rawAnswers: QuizAnswer;
  createdAt: Date;
}

export interface QuizAnswer {
  [questionId: string]: string | number | string[] | number[];
}

export interface MealPlan {
  id: string;
  userId: string;
  title: string;
  dayDate: Date;
  totalCalories: number;
  items: MealItem[];
  createdAt: Date;
}

export interface MealItem {
  id: string;
  mealPlanId: string;
  mealType: MealType;
  name: string;
  calories: number;
  affiliateUrl?: string | null;
  isCompleted: boolean;
}

export interface SleepLog {
  id: string;
  userId: string;
  logDate: Date;
  bedTime: Date;
  wakeTime: Date;
  qualityRating: number;
  notes?: string | null;
}

export interface Order {
  id: string;
  userId: string;
  packageType: PackageType;
  amount: number;
  status: OrderStatus;
  paymentGateway?: PaymentGateway | null;
  transactionId?: string | null;
  createdAt: Date;
}

export interface ServicePackage {
  id: string;
  name: string;
  slug: string;
  price: number;
  currency: string;
  durationDays: number;
  features: string[];
  badge?: string;
  isPopular?: boolean;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  author: string;
  category: string;
  publishedAt: Date;
  readingTime: number;
}

export interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: ApiError;
}

export interface ApiError {
  code: string;
  message: string;
  statusCode: number;
}

export interface NavigationItem {
  label: string;
  href: string;
  children?: NavigationItem[];
}
