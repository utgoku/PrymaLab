import { NextResponse } from 'next/server';
import { SERVICE_PACKAGES } from '@/lib/constants';
import { addOrder, getPaymentSettings, markOrderPaymentSubmitted, type SiteSettings } from '@/lib/db';
import { allowRequest, requestIp } from '@/lib/rate-limit';
import { analyticsContextFromBody, recordGrowthEvent } from '@/lib/growth-analytics';

const PACKAGE_ALIASES: Record<string, string> = {
  starter: 'starter',
  pkg_starter: 'starter',
  transformation: 'transformation-30-days',
  pkg_transformation_30: 'transformation-30-days',
  elite: 'elite-care-90-days',
  pkg_elite_90: 'elite-care-90-days',
};

const PACKAGE_DB_IDS: Record<string, string> = {
  starter: 'starter',
  'transformation-30-days': 'transformation',
  'elite-care-90-days': 'elite',
};

function cleanText(value: unknown, maxLength: number) {
  return typeof value === 'string' ? value.trim().replace(/\s+/g, ' ').slice(0, maxLength) : '';
}

function publicPayment(settings: SiteSettings, amount: number, transferContent: string) {
  const accountNumber = settings.bankAccountNumber.replace(/\s/g, '');
  const accountName = settings.bankAccountName.trim();
  const bankBin = settings.bankBin.trim() || '970436';
  const ready = Boolean(accountNumber && accountName);
  const qrUrl = ready
    ? `https://img.vietqr.io/image/${encodeURIComponent(bankBin)}-${encodeURIComponent(accountNumber)}-compact2.png?${new URLSearchParams({
        amount: String(amount),
        addInfo: transferContent,
        accountName,
      }).toString()}`
    : '';

  return {
    ready,
    bankName: settings.bankName || 'Vietcombank',
    bankBin,
    accountNumber: ready ? accountNumber : '',
    accountName: ready ? accountName : '',
    branch: settings.bankBranch || '',
    qrUrl,
  };
}

export async function POST(request: Request) {
  if (!allowRequest(`checkout:${requestIp(request)}`, 6, 10 * 60_000)) {
    return NextResponse.json({ error: 'Bạn đã gửi nhiều yêu cầu. Vui lòng thử lại sau ít phút.' }, { status: 429 });
  }

  try {
    const body = await request.json();
    if (body.website) return NextResponse.json({ success: true }, { status: 201 });

    const requestedPackage = cleanText(body.packageId, 64);
    const normalizedSlug = PACKAGE_ALIASES[requestedPackage] || requestedPackage;
    const selectedPackage = SERVICE_PACKAGES.find((item) => item.slug === normalizedSlug);
    const customerName = cleanText(body.customerName, 100);
    const customerPhone = cleanText(body.customerPhone, 24);
    const customerEmail = cleanText(body.customerEmail, 160).toLowerCase();
    const customerNote = cleanText(body.customerNote, 1000);
    const phoneDigits = customerPhone.replace(/\D/g, '');

    if (!selectedPackage || !customerName || phoneDigits.length < 9 || phoneDigits.length > 12) {
      return NextResponse.json({ error: 'Vui lòng kiểm tra họ tên, số điện thoại và chương trình đã chọn.' }, { status: 400 });
    }
    if (!/^\S+@\S+\.\S+$/.test(customerEmail) || body.consent !== true) {
      return NextResponse.json({ error: 'Vui lòng nhập email hợp lệ và xác nhận chính sách dữ liệu.' }, { status: 400 });
    }

    const settings = await getPaymentSettings();
    if (!settings.bankAccountNumber.trim() || !settings.bankAccountName.trim()) {
      return NextResponse.json({ error: 'Thanh toán chuyển khoản đang được cấu hình. Vui lòng liên hệ PrymaLab.' }, { status: 503 });
    }

    const order = await addOrder({
      packageId: PACKAGE_DB_IDS[selectedPackage.slug],
      packageName: selectedPackage.name,
      customerName,
      customerPhone,
      customerEmail,
      customerNote,
      amount: selectedPackage.price,
    });
    await recordGrowthEvent({ eventName: 'order_created', path: '/checkout', ...analyticsContextFromBody(body._analytics), metadata: { package: selectedPackage.slug, amount: selectedPackage.price } }).catch(() => undefined);
    return NextResponse.json({
      success: true,
      order: {
        orderCode: order.orderCode,
        packageName: order.packageName,
        amount: order.amount,
        transferContent: order.transferContent,
        customerPhone: order.customerPhone,
      },
      payment: publicPayment(settings, order.amount, order.transferContent),
    }, { status: 201 });
  } catch (error) {
    console.error('Checkout submission failed:', error);
    return NextResponse.json({ error: 'Hệ thống chưa tạo được đơn. Vui lòng thử lại hoặc liên hệ PrymaLab.' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  if (!allowRequest(`payment-review:${requestIp(request)}`, 10, 10 * 60_000)) {
    return NextResponse.json({ error: 'Vui lòng thử lại sau ít phút.' }, { status: 429 });
  }
  try {
    const body = await request.json();
    const orderCode = cleanText(body.orderCode, 32).toUpperCase();
    const phone = cleanText(body.phone, 24);
    if (!orderCode || !phone) return NextResponse.json({ error: 'Thiếu thông tin xác nhận.' }, { status: 400 });
    const matched = await markOrderPaymentSubmitted(orderCode, phone);
    if (!matched) return NextResponse.json({ error: 'Không thể xác minh đơn. Vui lòng kiểm tra mã đơn.' }, { status: 404 });
    await recordGrowthEvent({ eventName: 'payment_submitted', path: '/checkout', ...analyticsContextFromBody(body._analytics) }).catch(() => undefined);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Payment review submission failed:', error);
    return NextResponse.json({ error: 'Chưa thể gửi xác nhận lúc này.' }, { status: 500 });
  }
}
