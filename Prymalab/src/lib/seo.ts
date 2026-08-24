export const SITE_URL = 'https://prymalab.com';
export const BRAND_NAME = 'PrymaLab';
export const SITE_NAME = 'PrymaLab Việt Nam';
export const SITE_ALTERNATE_NAMES = ['PrymaLab Việt Nam', 'prymalab.com'];
export const SITE_DESCRIPTION =
  'PrymaLab Việt Nam kết nối dinh dưỡng, chất lượng giấc ngủ và dữ liệu thói quen thành lộ trình cá nhân hóa rõ ràng, thực tế và dễ duy trì.';

export function absoluteUrl(path = '/') {
  return new URL(path, SITE_URL).toString();
}
