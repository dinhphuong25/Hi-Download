import React from 'react';
import Header from './Header';
import { Box } from '@chakra-ui/react';
import Footer from './Footer';
import NavBar from './NavBar';

import { useRouter } from 'next/router';

type Props = {
  children: any;
  title?: string;
  showFooter?: boolean;
};

const Layout = ({ children, title, showFooter }: Props) => {
  const router = useRouter();
  const isHome = router.pathname === '/' || router.pathname === '';
  const shouldShowFooter = showFooter !== undefined ? showFooter : isHome;

  return (
    <Box minH="100vh" w="100%" display="flex" flexDirection="column" bg="var(--bg-base)" overflowX="hidden">
      <Header title={title} />
      <NavBar />
      <Box as="main" flex="1" w="100%" display="flex" flexDirection="column">
        {children}
      </Box>
      {shouldShowFooter && <Footer />}
    </Box>
  );
};

export default Layout;
