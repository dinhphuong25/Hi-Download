import { Box, Flex, HStack, Text, VStack } from '@chakra-ui/react';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';
import { Logo } from '@/components/Logo';
import useTrans from '@/hooks/useTrans';
import { MdGavel, MdMailOutline, MdShield } from 'react-icons/md';

const Footer: React.FC = () => {
  const router = useRouter();
  const trans = useTrans();

  return (
    <Box
      as="footer"
      w="100%"
      bg="#f8fafc"
      borderTop="1px solid #e2e8f0"
      pt={{ base: '24px', md: '32px' }}
      pb={{ base: '24px', md: '32px' }}
      px={{ base: '16px', md: '28px', lg: '36px' }}
    >
      <Box maxW="1000px" mx="auto">
        {/* Outer border card */}
        <Box
          border="1.5px solid #cbd5e1"
          borderRadius="20px"
          bg="#ffffff"
          boxShadow="0 4px 16px -4px rgba(15, 23, 42, 0.08)"
          px={{ base: '20px', md: '36px' }}
          pt={{ base: '24px', md: '28px' }}
          pb={{ base: '20px', md: '24px' }}
        >
        <Flex
          justify="space-between"
          align="center"
          direction={{ base: 'column', md: 'row' }}
          gap={{ base: '20px', md: '24px' }}
          textAlign={{ base: 'center', md: 'left' }}
        >
          {/* Brand Info */}
          <VStack
            align={{ base: 'center', md: 'flex-start' }}
            spacing="8px"
            maxW={{ base: '100%', md: '500px' }}
          >
            <NextLink href="/" locale={router.locale}>
              <Box cursor="pointer" transition="opacity 0.15s" _hover={{ opacity: 0.9 }}>
                <Logo size="sm" />
              </Box>
            </NextLink>
            <Text
              fontSize={{ base: '13px', md: '13.5px' }}
              color="#334155"
              fontWeight="500"
              lineHeight="1.6"
              textAlign={{ base: 'center', md: 'left' }}
            >
              {trans.footer.slogan}
            </Text>
          </VStack>

          {/* Quick Legal & Contact Links */}
          <HStack
            spacing={{ base: '14px', sm: '18px' }}
            align="center"
            justify="center"
            flexWrap="wrap"
          >
            <NextLink href="/contact" locale={router.locale}>
              <HStack
                spacing="6px"
                cursor="pointer"
                color="#0f172a"
                fontSize="13.5px"
                fontWeight="700"
                transition="all 0.15s ease"
                _hover={{ color: '#0284c7' }}
              >
                <MdMailOutline size="16px" />
                <Text>{trans.footer.contact}</Text>
              </HStack>
            </NextLink>

            <Box w="1.5px" h="14px" bg="#cbd5e1" />

            <NextLink href="/terms-of-service" locale={router.locale}>
              <HStack
                spacing="6px"
                cursor="pointer"
                color="#0f172a"
                fontSize="13.5px"
                fontWeight="700"
                transition="all 0.15s ease"
                _hover={{ color: '#0284c7' }}
              >
                <MdGavel size="16px" />
                <Text>{trans.footer.terms}</Text>
              </HStack>
            </NextLink>

            <Box w="1.5px" h="14px" bg="#cbd5e1" />

            <NextLink href="/privacy-policy" locale={router.locale}>
              <HStack
                spacing="6px"
                cursor="pointer"
                color="#0f172a"
                fontSize="13.5px"
                fontWeight="700"
                transition="all 0.15s ease"
                _hover={{ color: '#0284c7' }}
              >
                <MdShield size="16px" />
                <Text>{trans.footer.privacy}</Text>
              </HStack>
            </NextLink>
          </HStack>
        </Flex>

        {/* Divider */}
        <Box h="1px" bg="#e2e8f0" my={{ base: '18px', md: '22px' }} />

        {/* Bottom Bar: Copyright + Founder */}
        <Box textAlign="center">
          <Text fontSize="13px" color="#1e293b" fontWeight="600">
            {trans.footer.copyright}
          </Text>
          <Text fontSize="12.5px" color="#475569" fontWeight="500" mt="4px">
            {trans.footer.foundedByPrefix}{' '}
            <Text
              as="a"
              href="https://www.facebook.com/dinhphuong205/"
              target="_blank"
              rel="noopener noreferrer"
              color="#0284c7"
              fontWeight="700"
              _hover={{ color: '#0369a1', textDecoration: 'underline' }}
              cursor="pointer"
              transition="color 0.15s ease"
            >
              {trans.footer.foundedByName}
            </Text>
          </Text>
        </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Footer;
