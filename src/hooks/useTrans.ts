import { useRouter } from 'next/router';
import en from '../../public/lang/en';
import vi from '../../public/lang/vi';
import { useMemo } from 'react';

const langs: Record<string, typeof vi> = {
  vi,
  en,
};

const useTrans = () => {
  const { locale } = useRouter();

  const trans = useMemo(() => langs[locale ?? 'vi'] || langs.vi, [locale]);

  return trans;
};

export default useTrans;
