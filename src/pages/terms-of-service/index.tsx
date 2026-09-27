import Layout from '@/components/Layout';
import useTrans from '@/hooks/useTrans';
import {
  Badge,
  Box,
  Button,
  Flex,
  HStack,
  Text,
  VStack,
} from '@chakra-ui/react';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';
import { MdArrowBack, MdGavel, MdMailOutline } from 'react-icons/md';

export default function TermsOfServicePage() {
  const trans = useTrans();
  const router = useRouter();

  return (
    <Layout title={trans.terms.title}>
      <Box
        w="100%"
        flex="1"
        pt={{ base: '28px', md: '44px' }}
        pb={{ base: '48px', md: '64px' }}
        px={{ base: '16px', md: '24px' }}
        bg="#f8fafc"
        style={{
          backgroundImage:
            'radial-gradient(ellipse 90% 55% at 50% -12%, rgba(2, 132, 199, 0.08) 0%, rgba(248, 250, 252, 0) 75%)',
        }}
      >
        <Box maxW="1180px" mx="auto">
          {/* Back button */}
          <NextLink href="/" locale={router.locale}>
            <Button
              size="xs"
              variant="ghost"
              color="#64748b"
              _hover={{ color: '#0f172a', bg: '#f1f5f9' }}
              leftIcon={<MdArrowBack size="14px" />}
              mb="20px"
              fontWeight="600"
            >
              {trans.terms.backHome}
            </Button>
          </NextLink>

          {/* Heading */}
          <VStack align="flex-start" spacing="10px" mb={{ base: '28px', md: '38px' }}>
            <HStack spacing="10px">
              <Badge
                bg="#f0f9ff"
                color="#0284c7"
                border="1px solid #bae6fd"
                fontSize="11.5px"
                fontWeight="700"
                px="10px"
                py="4px"
                borderRadius="6px"
                letterSpacing="0.04em"
              >
                {trans.terms.badge}
              </Badge>
              <Text fontSize="12.5px" color="#94a3b8" fontWeight="500">
                {trans.terms.lastUpdated}
              </Text>
            </HStack>

            <Text
              as="h1"
              fontSize={{ base: '26px', sm: '32px', md: '38px', lg: '42px' }}
              fontWeight="800"
              color="#0f172a"
              letterSpacing="-0.03em"
              lineHeight="1.2"
            >
              {trans.terms.title}
            </Text>
            <Text fontSize={{ base: '14px', md: '16px' }} color="#64748b" maxW="820px" lineHeight="1.6">
              {trans.terms.subtitle}
            </Text>
          </VStack>

          {/* Structured Terms Sections */}
          <VStack spacing="18px" align="stretch">
            {trans.terms.sections.map((section, idx) => (
              <Box
                key={idx}
                p={{ base: '20px', md: '28px' }}
                borderRadius="20px"
                bg="#ffffff"
                border="1px solid #e2e8f0"
                boxShadow="0 2px 8px -2px rgba(15, 23, 42, 0.04)"
                transition="all 0.15s ease"
                _hover={{ borderColor: '#cbd5e1' }}
              >
                <HStack spacing="14px" mb="12px" align="center">
                  <Flex
                    w="36px"
                    h="36px"
                    borderRadius="10px"
                    bg="#f1f5f9"
                    color="#0284c7"
                    fontSize="14px"
                    fontWeight="800"
                    align="center"
                    justify="center"
                    flexShrink={0}
                  >
                    {section.num}
                  </Flex>
                  <Text fontSize="16px" fontWeight="700" color="#0f172a">
                    {section.title}
                  </Text>
                </HStack>

                <Text fontSize={{ base: '13.5px', md: '14.5px' }} color="#475569" lineHeight="1.8" pl={{ base: '0', md: '50px' }}>
                  {section.content}
                </Text>
              </Box>
            ))}
          </VStack>

          {/* Contact Inquiry Card at Bottom */}
          <Box
            mt="28px"
            p="20px"
            borderRadius="18px"
            bg="#f1f5f9"
            border="1px dashed #cbd5e1"
            display="flex"
            justifyContent="space-between"
            alignItems={{ base: 'flex-start', sm: 'center' }}
            flexDirection={{ base: 'column', sm: 'row' }}
            gap="14px"
          >
            <HStack spacing="12px">
              <Flex
                w="36px"
                h="36px"
                borderRadius="10px"
                bg="#ffffff"
                color="#0f172a"
                align="center"
                justify="center"
                flexShrink={0}
              >
                <MdGavel size="18px" />
              </Flex>
              <Box>
                <Text fontSize="13px" fontWeight="700" color="#0f172a">
                  {trans.terms.bottomNoticeTitle}
                </Text>
                <Text fontSize="12px" color="#64748b">
                  {trans.terms.bottomNoticeDesc}
                </Text>
              </Box>
            </HStack>

            <NextLink href="/contact" locale={router.locale}>
              <Button
                size="sm"
                bg="#0f172a"
                color="#ffffff"
                _hover={{ bg: '#1e293b' }}
                borderRadius="8px"
                fontSize="12.5px"
                fontWeight="600"
                leftIcon={<MdMailOutline size="15px" />}
              >
                {trans.terms.bottomNoticeBtn}
              </Button>
            </NextLink>
          </Box>
        </Box>
      </Box>
    </Layout>
  );
}
