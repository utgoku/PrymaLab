import type { Metadata } from 'next';
import HomeExperience, { faqs } from '@/components/home/HomeExperience';
import { getPublicHomeData } from '@/lib/db';
import { getPublishedArticles } from '@/lib/articles';
import { SITE_ALTERNATE_NAMES, SITE_NAME, SITE_URL } from '@/lib/seo';

export const metadata: Metadata = {
  title: { absolute: `${SITE_NAME} | Dinh dưỡng & giấc ngủ cá nhân hóa` },
  description: 'PrymaLab Việt Nam kết nối dinh dưỡng, giấc ngủ và dữ liệu thói quen để tạo lộ trình cá nhân hóa rõ ràng, dễ thực hiện và dễ duy trì.',
  alternates: {
    canonical: '/',
  },
};

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const [{ packages, settings }, articles] = await Promise.all([getPublicHomeData(), getPublishedArticles().catch(() => [])]);
  const telephone = settings.phone.replace(/\s+/g, '').replace(/^0/, '+84');

  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': `${SITE_URL}/#organization`,
        name: SITE_NAME,
        alternateName: SITE_ALTERNATE_NAMES,
        url: `${SITE_URL}/`,
        description: 'Nền tảng tại Việt Nam về giáo dục dinh dưỡng, chất lượng giấc ngủ và xây dựng thói quen theo nhịp sống cá nhân. Không kinh doanh peptide hoặc hóa chất nghiên cứu.',
        disambiguatingDescription: 'PrymaLab Việt Nam tại prymalab.com là một dự án độc lập về dinh dưỡng, giấc ngủ và thói quen; không liên kết, không được ủy quyền và không cùng chủ sở hữu với prymalab.net.',
        slogan: 'Ăn đúng nhịp. Ngủ sâu hơn. Sống sáng hơn.',
        logo: {
          '@type': 'ImageObject',
          url: `${SITE_URL}/icon`,
          contentUrl: `${SITE_URL}/icon`,
          width: 512,
          height: 512,
          caption: `Biểu tượng ${SITE_NAME}`,
        },
        image: `${SITE_URL}/og.png`,
        telephone,
        email: settings.email,
        address: {
          '@type': 'PostalAddress',
          streetAddress: settings.address,
          addressLocality: 'Đà Nẵng',
          addressCountry: 'VN',
        },
        areaServed: { '@type': 'Country', name: 'Việt Nam' },
        contactPoint: {
          '@type': 'ContactPoint',
          contactType: 'customer support',
          telephone,
          email: settings.email,
          availableLanguage: ['vi'],
          areaServed: 'VN',
        },
        knowsAbout: ['Dinh dưỡng cá nhân hóa', 'Chất lượng giấc ngủ', 'Sleep hygiene', 'Nhịp sinh học', 'Thói quen sống lành mạnh'],
      },
      {
        '@type': 'WebSite',
        '@id': `${SITE_URL}/#website`,
        url: `${SITE_URL}/`,
        name: SITE_NAME,
        alternateName: SITE_ALTERNATE_NAMES,
        inLanguage: 'vi-VN',
        publisher: { '@id': `${SITE_URL}/#organization` },
      },
      {
        '@type': 'WebPage',
        '@id': `${SITE_URL}/#webpage`,
        url: `${SITE_URL}/`,
        name: `${SITE_NAME} | Dinh dưỡng & giấc ngủ cá nhân hóa`,
        description: 'PrymaLab Việt Nam kết nối dinh dưỡng, chất lượng giấc ngủ và dữ liệu thói quen thành lộ trình cá nhân hóa.',
        inLanguage: 'vi-VN',
        isPartOf: { '@id': `${SITE_URL}/#website` },
        about: { '@id': `${SITE_URL}/#organization` },
      },
      {
        '@type': 'FAQPage',
        '@id': `${SITE_URL}/#faq`,
        mainEntity: faqs.map((faq) => ({
          '@type': 'Question',
          name: faq.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: faq.answer,
          },
        })),
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData).replace(/</g, '\\u003c'),
        }}
      />
      <HomeExperience articles={articles} packages={packages} settings={settings} />
    </>
  );
}
