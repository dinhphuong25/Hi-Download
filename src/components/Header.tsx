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

  return (
    <>
    <Head>
      <title>{metaTitle}</title>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta charSet="UTF-8" />
      <meta httpEquiv="X-UA-Compatible" content="IE=edge,chrome=1" />
      <meta name="robots" content="index, follow" />
      <meta name="revisit-after" content="1 days" />
      <meta name="color-scheme" content="dark light" />
      <meta itemProp="name" content={metaTitle} />
      <meta name="description" content={metaDesc} />
      <meta name="keywords" content={keywords.join(', ')} />
      <meta name="author" content="Hi Download Team" />
      <meta property="og:locale" content={router.locale} />
      <meta itemProp="image" content={`${process.env.NEXT_PUBLIC_DOMAIN}/thumb.png`} />
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:title" content={metaTitle} />
      <meta name="twitter:description" content={metaDesc} />
      <meta name="twitter:image:src" content={`${process.env.NEXT_PUBLIC_DOMAIN}/thumb.png`} />
      <meta property="og:title" content={metaTitle} />
      <meta property="og:type" content="website" />
      <meta property="og:image" content={`${process.env.NEXT_PUBLIC_DOMAIN}/thumb.png`} />
      <meta property="og:description" content={metaDesc} />
      <meta property="og:site_name" content="Hi Download" />
      {/* Official Hi Download Favicon Suite */}
      <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
      <link rel="shortcut icon" href="/favicon.ico" />
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
      <meta name="google" content="notranslate" />
      <link rel="alternate" hrefLang="x-default" href={process.env.NEXT_PUBLIC_DOMAIN} />
      <link rel="alternate" hrefLang="vi" href={`${process.env.NEXT_PUBLIC_DOMAIN}`} />
      <link rel="alternate" hrefLang="en" href={`${process.env.NEXT_PUBLIC_DOMAIN}/en`} />
      <link rel="canonical" href={`${process.env.NEXT_PUBLIC_DOMAIN}/${router.locale === 'vi' ? '' : router.locale}`} />
    </Head>
  </>
  );
};


export default Header;
