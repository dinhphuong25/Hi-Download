import { keywords } from '@/contants';
import useTrans from '@/hooks/useTrans';
import Head from 'next/head';
import { useRouter } from 'next/router';

type Props = {
  title?: string;
};

const Header = ({ title }: Props) => {
  const trans = useTrans();
  const router = useRouter();
  const metaTitle = title ?? trans.meta.title;
  const metaDesc = trans.meta.description;
  const domain = process.env.NEXT_PUBLIC_DOMAIN || 'https://hidownload.app';

  // Build canonical URL based on locale + path
  const localePath = router.locale === 'vi' ? '' : `/${router.locale}`;
  const pagePath = router.pathname === '/' ? '' : router.pathname;
  const canonicalUrl = `${domain}${localePath}${pagePath}/`.replace(/\/+$/, '/').replace(/([^:]\/)\/+/g, '$1');
  const ogImageUrl = `${domain}/banner.png`;

  return (
    <>
    <Head>
      <title>{metaTitle}</title>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta charSet="UTF-8" />
      <meta httpEquiv="X-UA-Compatible" content="IE=edge,chrome=1" />
      <meta name="robots" content="index, follow" />
      <meta name="revisit-after" content="7 days" />
      <meta name="color-scheme" content="light" />
      <meta name="description" content={metaDesc} />
      <meta name="keywords" content={keywords.join(', ')} />
      <meta name="author" content="Kim Đình Phương" />
      <meta name="theme-color" content="#0284c7" />

      {/* Open Graph */}
      <meta property="og:locale" content={router.locale === 'vi' ? 'vi_VN' : 'en_US'} />
      <meta property="og:title" content={metaTitle} />
      <meta property="og:description" content={metaDesc} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content={ogImageUrl} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={metaTitle} />
      <meta property="og:site_name" content="Hi Download" />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={metaTitle} />
      <meta name="twitter:description" content={metaDesc} />
      <meta name="twitter:image" content={ogImageUrl} />
      <meta name="twitter:image:alt" content={metaTitle} />

      {/* Canonical & hreflang */}
      <link rel="canonical" href={canonicalUrl} />
      <link rel="alternate" hrefLang="vi" href={`${domain}/`} />
      <link rel="alternate" hrefLang="en" href={`${domain}/en/`} />
      <link rel="alternate" hrefLang="x-default" href={`${domain}/`} />

      {/* Favicon Suite */}
      <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
      <link rel="shortcut icon" href="/favicon.ico" />
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
      <meta name="google" content="notranslate" />
    </Head>
  </>
  );
};


export default Header;
