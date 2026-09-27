import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Badge,
  Box,
  Flex,
  Grid,
  HStack,
  Text,
  VStack,
} from '@chakra-ui/react';
import Layout from '@/components/Layout';
import Board from '@/components/Board';
import React from 'react';
import useTrans from '@/hooks/useTrans';
import {
  FaFacebook,
  FaInstagram,
  FaTiktok,
  FaTwitter,
  FaYoutube,
} from 'react-icons/fa';
import { MdMovie, MdVideoLibrary } from 'react-icons/md';

const getPlatformIcon = (id: string) => {
  switch (id) {
    case 'tiktok':
      return <FaTiktok size={18} color="#0f172a" />;
    case 'youtube':
      return <FaYoutube size={18} color="#0f172a" />;
    case 'facebook':
      return <FaFacebook size={18} color="#0f172a" />;
    case 'instagram':
      return <FaInstagram size={18} color="#0f172a" />;
    case 'capcut':
      return <MdMovie size={18} color="#0f172a" />;
    case 'twitter':
      return <FaTwitter size={18} color="#0f172a" />;
    default:
      return <MdVideoLibrary size={18} color="#0f172a" />;
  }
};

export default function Home() {
  const trans = useTrans();

  return (
    <Layout>
      {/* Centered Single-Column Container (No Sidebar, Atmospheric Lighting, Modern Aesthetic) */}
      <Box
        w="100%"
        py={{ base: '24px', md: '38px' }}
        px={{ base: '16px', md: '24px', lg: '32px' }}
        bg="#f8fafc"
        position="relative"
        style={{
          backgroundImage:
            'radial-gradient(ellipse 90% 55% at 50% -12%, rgba(2, 132, 199, 0.08) 0%, rgba(248, 250, 252, 0) 75%)',
        }}
      >
        <Box maxW="1100px" mx="auto">
          {/* Main Downloader Component */}
          <Board />

          <Box h="1px" bg="#e2e8f0" my={{ base: '40px', md: '56px' }} />

          {/* Section: Supported Platforms */}
          <Box id="nen-tang">
            <VStack align="flex-start" spacing="6px" mb={{ base: '20px', md: '26px' }}>
              <HStack spacing="8px">
                <Box w="3px" h="18px" bg="#0284c7" borderRadius="2px" />
                <Text
                  fontSize={{ base: '12.5px', md: '13px' }}
                  fontWeight="800"
                  letterSpacing="0.06em"
                  color="#0f172a"
                  textTransform="uppercase"
                >
                  {trans.platforms.heading}
                </Text>
              </HStack>
              <Text fontSize={{ base: '13.5px', md: '15px' }} color="#64748b">
                {trans.platforms.subtitle}
              </Text>
            </VStack>

            <Grid
              templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }}
              gap={{ base: '14px', md: '18px' }}
            >
              {trans.platforms.items.map((item, idx) => (
                <Box
                  key={idx}
                  p={{ base: '18px', md: '22px' }}
                  borderRadius="18px"
                  bg="#ffffff"
                  border="1px solid #e2e8f0"
                  boxShadow="0 1px 3px rgba(15, 23, 42, 0.04)"
                  transition="all 0.2s cubic-bezier(0.16, 1, 0.3, 1)"
                  _hover={{
                    borderColor: '#0ea5e9',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 8px 20px -4px rgba(15, 23, 42, 0.08)',
                  }}
                >
                  <HStack justify="space-between" mb={{ base: '8px', md: '10px' }}>
                    <HStack spacing="12px">
                      <Box
                        w={{ base: '34px', md: '40px' }}
                        h={{ base: '34px', md: '40px' }}
                        borderRadius="12px"
                        bg="#f1f5f9"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        color="#0f172a"
                      >
                        {getPlatformIcon(item.id)}
                      </Box>
                      <Text fontSize={{ base: '14px', md: '15.5px' }} fontWeight="700" color="#0f172a" letterSpacing="-0.01em">
                        {item.name}
                      </Text>
                    </HStack>
                    <Badge
                      bg="#f0f9ff"
                      color="#0284c7"
                      border="1px solid #bae6fd"
                      fontSize={{ base: '10.5px', md: '11.5px' }}
                      fontWeight="600"
                      px={{ base: '7px', md: '9px' }}
                      py={{ base: '2px', md: '3px' }}
                      borderRadius="6px"
                    >
                      {item.badge}
                    </Badge>
                  </HStack>
                  <Text fontSize={{ base: '12.5px', md: '13.5px' }} color="#64748b" lineHeight="1.65">
                    {item.desc}
                  </Text>
                </Box>
              ))}
            </Grid>
          </Box>

          <Box h="1px" bg="#e2e8f0" my={{ base: '40px', md: '56px' }} />

          {/* Section: 3-Step Guide */}
          <Box id="huong-dan">
            <VStack align="flex-start" spacing="6px" mb={{ base: '20px', md: '26px' }}>
              <HStack spacing="8px">
                <Box w="3px" h="18px" bg="#0284c7" borderRadius="2px" />
                <Text
                  fontSize={{ base: '12.5px', md: '13px' }}
                  fontWeight="800"
                  letterSpacing="0.06em"
                  color="#0f172a"
                  textTransform="uppercase"
                >
                  {trans.steps.heading}
                </Text>
              </HStack>
              <Text fontSize={{ base: '13.5px', md: '15px' }} color="#64748b">
                {trans.steps.subtitle}
              </Text>
            </VStack>

            <Grid
              templateColumns={{ base: '1fr', md: 'repeat(3, 1fr)' }}
              gap={{ base: '14px', md: '18px' }}
            >
              {trans.steps.items.map((st, i) => (
                <Box
                  key={i}
                  p={{ base: '20px', md: '26px' }}
                  borderRadius="18px"
                  bg="#ffffff"
                  border="1px solid #e2e8f0"
                  boxShadow="0 1px 3px rgba(15, 23, 42, 0.04)"
                  transition="all 0.2s cubic-bezier(0.16, 1, 0.3, 1)"
                  _hover={{
                    borderColor: '#cbd5e1',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 8px 20px -4px rgba(15, 23, 42, 0.06)',
                  }}
                >
                  <Text
                    fontSize={{ base: '24px', md: '30px' }}
                    fontWeight="900"
                    color="#0284c7"
                    mb={{ base: '8px', md: '10px' }}
                    letterSpacing="-0.03em"
                    lineHeight="1"
                  >
                    {st.num}
                  </Text>
                  <Text fontSize={{ base: '14px', md: '15.5px' }} fontWeight="700" color="#0f172a" mb="8px">
                    {st.title}
                  </Text>
                  <Text fontSize={{ base: '12.5px', md: '13.5px' }} color="#64748b" lineHeight="1.65">
                    {st.desc}
                  </Text>
                </Box>
              ))}
            </Grid>
          </Box>

          <Box h="1px" bg="#e2e8f0" my={{ base: '40px', md: '56px' }} />

          {/* Section: FAQ Accordion */}
          <Box id="faq">
            <VStack align="flex-start" spacing="6px" mb={{ base: '18px', md: '24px' }}>
              <HStack spacing="8px">
                <Box w="3px" h="18px" bg="#0284c7" borderRadius="2px" />
                <Text
                  fontSize={{ base: '12.5px', md: '13px' }}
                  fontWeight="800"
                  letterSpacing="0.06em"
                  color="#0f172a"
                  textTransform="uppercase"
                >
                  {trans.faqs.heading}
                </Text>
              </HStack>
              <Text fontSize={{ base: '13.5px', md: '15px' }} color="#64748b">
                {trans.faqs.subtitle}
              </Text>
            </VStack>

            <Accordion allowMultiple>
              {trans.faqs.items.map((item, i) => (
                <AccordionItem
                  key={i}
                  border="none"
                  borderBottom="1px solid #f1f5f9"
                >
                  <AccordionButton py={{ base: '15px', md: '18px' }} px="4px" _hover={{ bg: 'transparent' }}>
                    <Box flex="1" textAlign="left">
                      <Text
                        fontSize={{ base: '13.5px', md: '15px' }}
                        fontWeight="650"
                        color="#0f172a"
                      >
                        {item.q}
                      </Text>
                    </Box>
                    <AccordionIcon color="#64748b" />
                  </AccordionButton>
                  <AccordionPanel pb={{ base: '16px', md: '20px' }} px="4px">
                    <Text fontSize={{ base: '13px', md: '14px' }} color="#475569" lineHeight="1.75">
                      {item.a}
                    </Text>
                  </AccordionPanel>
                </AccordionItem>
              ))}
            </Accordion>
          </Box>


        </Box>
      </Box>
    </Layout>
  );
}


