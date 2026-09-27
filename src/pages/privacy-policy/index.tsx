import Layout from '@/components/Layout';
import useTrans from '@/hooks/useTrans';
import {
  Badge,
  Box,
  Button,
  Flex,
  Grid,
  HStack,
  Icon,
  Text,
  VStack,
} from '@chakra-ui/react';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';
import {
  MdArrowBack,
  MdCheckCircleOutline,
  MdLockOutline,
  MdMailOutline,
  MdSecurity,
  MdVisibilityOff,
} from 'react-icons/md';

const getHighlightIcon = (idx: number) => {
  switch (idx) {
    case 0:
      return MdVisibilityOff;
    case 1:
      return MdCheckCircleOutline;
    case 2:
      return MdSecurity;
    default:
      return MdLockOutline;
  }
};

export default function PrivacyPolicyPage() {
  const trans = useTrans();
  const router = useRouter();

  return (
    <Layout title={trans.privacy.title}>
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
              {trans.privacy.backHome}
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
                {trans.privacy.badge}
              </Badge>
              <Text fontSize="12.5px" color="#94a3b8" fontWeight="500">
                {trans.privacy.lastUpdated}
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
              {trans.privacy.title}
            </Text>
            <Text fontSize={{ base: '14px', md: '16px' }} color="#64748b" maxW="820px" lineHeight="1.6">
              {trans.privacy.subtitle}
            </Text>
          </VStack>

          {/* Key Privacy Highlights Grid */}
          <Grid templateColumns={{ base: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }} gap={{ base: '14px', md: '18px' }} mb={{ base: '26px', md: '32px' }}>
            {trans.privacy.highlights.map((item, idx) => (
              <Box
                key={idx}
                p={{ base: '18px', md: '22px' }}
                borderRadius="18px"
                bg="#ffffff"
                border="1px solid #e2e8f0"
                boxShadow="0 2px 6px -2px rgba(15, 23, 42, 0.04)"
                transition="all 0.15s ease"
                _hover={{ borderColor: '#cbd5e1' }}
              >
                <Flex
                  w={{ base: '36px', md: '42px' }}
                  h={{ base: '36px', md: '42px' }}
                  borderRadius="10px"
                  bg="#f0f9ff"
                  color="#0284c7"
                  align="center"
                  justify="center"
                  mb="12px"
                >
                  <Icon as={getHighlightIcon(idx)} boxSize={{ base: '20px', md: '22px' }} />
                </Flex>
                <Text fontSize={{ base: '13.5px', md: '14.5px' }} fontWeight="700" color="#0f172a" mb="6px">
                  {item.title}
                </Text>
                <Text fontSize={{ base: '12px', md: '13px' }} color="#64748b" lineHeight="1.6">
                  {item.desc}
                </Text>
              </Box>
            ))}
          </Grid>

          {/* Structured Privacy Sections */}
          <VStack spacing="18px" align="stretch">
            {trans.privacy.sections.map((section, idx) => (
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

          {/* Bottom Privacy Assurance Card */}
          <Box
            mt={{ base: '28px', md: '36px' }}
            p={{ base: '22px', md: '28px' }}
            borderRadius="20px"
            bg="#f1f5f9"
            border="1px dashed #cbd5e1"
            display="flex"
            justifyContent="space-between"
            alignItems={{ base: 'flex-start', sm: 'center' }}
            flexDirection={{ base: 'column', sm: 'row' }}
            gap="16px"
          >
            <HStack spacing="14px">
              <Flex
                w="42px"
                h="42px"
                borderRadius="10px"
                bg="#ffffff"
                color="#0f172a"
                align="center"
                justify="center"
                flexShrink={0}
              >
                <MdLockOutline size="22px" />
              </Flex>
              <Box>
                <Text fontSize={{ base: '13.5px', md: '14.5px' }} fontWeight="700" color="#0f172a">
                  {trans.privacy.bottomNoticeTitle}
                </Text>
                <Text fontSize={{ base: '12.5px', md: '13.5px' }} color="#64748b" mt="2px">
                  {trans.privacy.bottomNoticeDesc}
                </Text>
              </Box>
            </HStack>

            <NextLink href="/contact" locale={router.locale}>
              <Button
                size="md"
                bg="#0f172a"
                color="#ffffff"
                _hover={{ bg: '#1e293b' }}
                borderRadius="10px"
                fontSize="13.5px"
                fontWeight="600"
                leftIcon={<MdMailOutline size="16px" />}
                flexShrink={0}
              >
                {trans.privacy.bottomNoticeBtn}
              </Button>
            </NextLink>
          </Box>
        </Box>
      </Box>
    </Layout>
  );
}
