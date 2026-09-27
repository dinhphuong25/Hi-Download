import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { ChakraProvider } from '@chakra-ui/react';
import { theme } from '@/theme/theme';
import { useEffect } from 'react';

export default function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
    if (typeof window !== 'undefined' && process.env.NODE_ENV === 'production') {
      // Security Shield & Copyright Integrity Protection
      console.log(
        '%c🛡️ Hi Download Security Shield Active',
        'color: #0284c7; font-size: 13px; font-weight: 800; padding: 4px 8px; border-radius: 4px; background: #f0f9ff;',
      );
    }
  }, []);

  return (
    <ChakraProvider theme={theme}>
      <Component {...pageProps} />
    </ChakraProvider>
  );
}
