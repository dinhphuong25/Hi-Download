import Layout from '@/components/Layout';
import useTrans from '@/hooks/useTrans';
import { Box, Button, Text, VStack } from '@chakra-ui/react';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { MdArrowBack, MdSearchOff } from 'react-icons/md';

export default function Custom404() {
  const router = useRouter();
  const trans = useTrans();

  return (
    <Layout title="404 — Không Tìm Thấy Trang | Hi Download">
      <Box
        w="100%"
        flex="1"
        display="flex"
        alignItems="center"
        justifyContent="center"
        bg="#f8fafc"
        px={{ base: '16px', md: '24px' }}
        py={{ base: '60px', md: '100px' }}
        style={{
          backgroundImage:
            'radial-gradient(ellipse 80% 50% at 50% 0%, rgba(2, 132, 199, 0.07) 0%, rgba(248, 250, 252, 0) 70%)',
        }}
      >
        <VStack spacing="24px" textAlign="center" maxW="480px">
          {/* Icon */}
          <Box
            w="80px"
            h="80px"
            borderRadius="20px"
            bg="#f0f9ff"
            border="1px solid #bae6fd"
            display="flex"
            alignItems="center"
            justifyContent="center"
            color="#0284c7"
          >
            <MdSearchOff size="38px" />
          </Box>

          {/* Error code */}
          <Text
            fontSize={{ base: '72px', md: '96px' }}
            fontWeight="900"
            color="#0284c7"
            lineHeight="1"
            letterSpacing="-0.04em"
          >
            404
          </Text>

          {/* Title */}
          <Text
            fontSize={{ base: '20px', md: '26px' }}
            fontWeight="800"
            color="#0f172a"
            letterSpacing="-0.02em"
          >
            Trang không tồn tại
          </Text>

          {/* Description */}
          <Text
            fontSize={{ base: '14px', md: '15px' }}
            color="#64748b"
            lineHeight="1.7"
          >
            Trang bạn đang tìm không tồn tại hoặc đã bị di chuyển.{' '}
            Hãy quay lại trang chủ để tải video từ TikTok, YouTube, Instagram và nhiều nền tảng khác.
          </Text>

          {/* CTA */}
          <NextLink href="/" locale={router.locale}>
            <Button
              size="lg"
              bg="#0284c7"
              color="#ffffff"
              _hover={{ bg: '#0369a1', transform: 'translateY(-1px)' }}
              borderRadius="12px"
              fontWeight="700"
              fontSize="15px"
              leftIcon={<MdArrowBack size="18px" />}
              transition="all 0.2s ease"
              px="28px"
            >
              Về Trang Chủ
            </Button>
          </NextLink>
        </VStack>
      </Box>
    </Layout>
  );
}
