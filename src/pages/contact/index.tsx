import Layout from '@/components/Layout';
import useTrans from '@/hooks/useTrans';
import {
  Badge,
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Grid,
  HStack,
  Icon,
  Input,
  Select,
  Text,
  Textarea,
  useToast,
  VStack,
} from '@chakra-ui/react';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import {
  MdAccessTime,
  MdArrowBack,
  MdCheckCircle,
  MdContentCopy,
  MdEmail,
  MdSend,
  MdShield,
} from 'react-icons/md';

export default function ContactPage() {
  const trans = useTrans();
  const router = useRouter();
  const toast = useToast();

  const [copied, setCopied] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('bug');
  const [message, setMessage] = useState('');

  const handleCopyEmail = () => {
    navigator.clipboard
      .writeText(trans.contact.email)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        toast({
          title: trans.contact.copiedEmail,
          status: 'success',
          duration: 2200,
          position: 'bottom-right',
          isClosable: true,
        });
      })
      .catch(() => {});
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) {
      toast({
        title: trans.contact.validationError,
        status: 'warning',
        duration: 2500,
        position: 'bottom-right',
        isClosable: true,
      });
      return;
    }

    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setName('');
      setEmail('');
      setMessage('');
      toast({
        title: trans.contact.sentSuccessTitle,
        description: trans.contact.sentSuccessDesc,
        status: 'success',
        duration: 3500,
        position: 'bottom-right',
        isClosable: true,
      });
    }, 600);
  };

  return (
    <Layout title={trans.contact.title}>
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
              {trans.contact.backHome}
            </Button>
          </NextLink>

          {/* Page Heading */}
          <VStack align="flex-start" spacing="10px" mb={{ base: '28px', md: '38px' }}>
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
              {trans.contact.badge}
            </Badge>
            <Text
              as="h1"
              fontSize={{ base: '26px', sm: '32px', md: '38px', lg: '42px' }}
              fontWeight="800"
              color="#0f172a"
              letterSpacing="-0.03em"
              lineHeight="1.2"
            >
              {trans.contact.title}
            </Text>
            <Text fontSize={{ base: '14px', md: '16px' }} color="#64748b" maxW="780px" lineHeight="1.6">
              {trans.contact.subtitle}
            </Text>
          </VStack>

          {/* 2-Column Info & Form Layout */}
          <Grid templateColumns={{ base: '1fr', lg: '440px 1fr' }} gap={{ base: '20px', md: '32px' }}>
            {/* Left: Contact Info Channels */}
            <VStack spacing="18px" align="stretch">
              {/* Email Card */}
              <Box
                p={{ base: '20px', md: '24px' }}
                borderRadius="20px"
                bg="#ffffff"
                border="1px solid #e2e8f0"
                boxShadow="0 2px 8px -2px rgba(15, 23, 42, 0.05)"
              >
                <HStack spacing="12px" mb="10px">
                  <Flex
                    w="38px"
                    h="38px"
                    borderRadius="10px"
                    bg="#f0f9ff"
                    color="#0284c7"
                    align="center"
                    justify="center"
                  >
                    <Icon as={MdEmail} boxSize="20px" />
                  </Flex>
                  <Box>
                    <Text fontSize="14px" fontWeight="700" color="#0f172a">
                      {trans.contact.emailCardTitle}
                    </Text>
                    <Text fontSize="12px" color="#64748b">
                      {trans.contact.emailCardDesc}
                    </Text>
                  </Box>
                </HStack>

                <HStack
                  p="10px 14px"
                  bg="#f8fafc"
                  borderRadius="10px"
                  border="1px solid #e2e8f0"
                  justify="space-between"
                  mt="12px"
                >
                  <Text fontSize="13px" fontWeight="600" color="#0284c7">
                    {trans.contact.email}
                  </Text>
                  <Button
                    size="xs"
                    variant="outline"
                    borderColor="#cbd5e1"
                    bg="#ffffff"
                    color="#0f172a"
                    _hover={{ bg: '#f1f5f9' }}
                    onClick={handleCopyEmail}
                    leftIcon={copied ? <MdCheckCircle color="#10b981" /> : <MdContentCopy />}
                    fontSize="11.5px"
                  >
                    {copied ? trans.contact.copiedEmail : trans.contact.copyEmail}
                  </Button>
                </HStack>
              </Box>

              {/* DMCA & Copyright Card */}
              <Box
                p={{ base: '20px', md: '24px' }}
                borderRadius="20px"
                bg="#ffffff"
                border="1px solid #e2e8f0"
                boxShadow="0 2px 8px -2px rgba(15, 23, 42, 0.05)"
              >
                <HStack spacing="12px" mb="10px">
                  <Flex
                    w="40px"
                    h="40px"
                    borderRadius="10px"
                    bg="#fef2f2"
                    color="#ef4444"
                    align="center"
                    justify="center"
                  >
                    <Icon as={MdShield} boxSize="22px" />
                  </Flex>
                  <Text fontSize="15px" fontWeight="700" color="#0f172a">
                    {trans.contact.dmcaTitle}
                  </Text>
                </HStack>
                <Text fontSize="13px" color="#64748b" lineHeight="1.65">
                  {trans.contact.dmcaDesc}
                </Text>
              </Box>

              {/* Hours Card */}
              <Box
                p={{ base: '20px', md: '24px' }}
                borderRadius="20px"
                bg="#ffffff"
                border="1px solid #e2e8f0"
                boxShadow="0 2px 8px -2px rgba(15, 23, 42, 0.05)"
              >
                <HStack spacing="12px" mb="10px">
                  <Flex
                    w="40px"
                    h="40px"
                    borderRadius="10px"
                    bg="#ecfdf5"
                    color="#059669"
                    align="center"
                    justify="center"
                  >
                    <Icon as={MdAccessTime} boxSize="22px" />
                  </Flex>
                  <Text fontSize="15px" fontWeight="700" color="#0f172a">
                    {trans.contact.hoursTitle}
                  </Text>
                </HStack>
                <Text fontSize="13px" color="#64748b" lineHeight="1.65">
                  {trans.contact.hoursDesc}
                </Text>
              </Box>
            </VStack>

            {/* Right: Interactive Direct Message Form */}
            <Box
              p={{ base: '22px', md: '34px' }}
              borderRadius="22px"
              bg="#ffffff"
              border="1px solid #cbd5e1"
              boxShadow="0 8px 24px -4px rgba(15, 23, 42, 0.06)"
            >
              <VStack align="flex-start" spacing="4px" mb="22px">
                <Text fontSize={{ base: '18px', md: '20px' }} fontWeight="800" color="#0f172a">
                  {trans.contact.formTitle}
                </Text>
                <Text fontSize={{ base: '13px', md: '14px' }} color="#64748b">
                  {trans.contact.formSubtitle}
                </Text>
              </VStack>

              <form onSubmit={handleSubmit}>
                <VStack spacing="16px" align="stretch">
                  <FormControl isRequired>
                    <FormLabel fontSize="13px" fontWeight="600" color="#334155" mb="5px">
                      {trans.contact.nameLabel}
                    </FormLabel>
                    <Input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder={trans.contact.namePlaceholder}
                      fontSize="14px"
                      borderRadius="12px"
                      borderColor="#cbd5e1"
                      _hover={{ borderColor: '#94a3b8' }}
                      _focus={{ borderColor: '#0284c7', boxShadow: '0 0 0 3px rgba(2, 132, 199, 0.15)' }}
                      h="46px"
                    />
                  </FormControl>

                  <FormControl isRequired>
                    <FormLabel fontSize="13px" fontWeight="600" color="#334155" mb="5px">
                      {trans.contact.emailLabel}
                    </FormLabel>
                    <Input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder={trans.contact.emailPlaceholder}
                      fontSize="14px"
                      borderRadius="12px"
                      borderColor="#cbd5e1"
                      _hover={{ borderColor: '#94a3b8' }}
                      _focus={{ borderColor: '#0284c7', boxShadow: '0 0 0 3px rgba(2, 132, 199, 0.15)' }}
                      h="46px"
                    />
                  </FormControl>

                  <FormControl>
                    <FormLabel fontSize="13px" fontWeight="600" color="#334155" mb="5px">
                      {trans.contact.subjectLabel}
                    </FormLabel>
                    <Select
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      fontSize="14px"
                      borderRadius="12px"
                      borderColor="#cbd5e1"
                      _hover={{ borderColor: '#94a3b8' }}
                      _focus={{ borderColor: '#0284c7', boxShadow: '0 0 0 3px rgba(2, 132, 199, 0.15)' }}
                      h="46px"
                    >
                      <option value="bug">{trans.contact.subjects.bug}</option>
                      <option value="feature">{trans.contact.subjects.feature}</option>
                      <option value="dmca">{trans.contact.subjects.dmca}</option>
                      <option value="feedback">{trans.contact.subjects.feedback}</option>
                      <option value="other">{trans.contact.subjects.other}</option>
                    </Select>
                  </FormControl>

                  <FormControl isRequired>
                    <FormLabel fontSize="13px" fontWeight="600" color="#334155" mb="5px">
                      {trans.contact.messageLabel}
                    </FormLabel>
                    <Textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder={trans.contact.messagePlaceholder}
                      fontSize="14px"
                      borderRadius="12px"
                      borderColor="#cbd5e1"
                      _hover={{ borderColor: '#94a3b8' }}
                      _focus={{ borderColor: '#0284c7', boxShadow: '0 0 0 3px rgba(2, 132, 199, 0.15)' }}
                      rows={5}
                      resize="none"
                    />
                  </FormControl>

                  <Button
                    type="submit"
                    isLoading={submitting}
                    loadingText={trans.contact.sendingBtn}
                    bg="linear-gradient(180deg, #1e293b 0%, #0f172a 100%)"
                    color="#ffffff"
                    fontSize="14.5px"
                    fontWeight="700"
                    h="48px"
                    borderRadius="12px"
                    _hover={{ bg: '#1e293b', transform: 'translateY(-1px)' }}
                    _active={{ transform: 'translateY(0)' }}
                    leftIcon={<MdSend size="16px" />}
                    mt="8px"
                  >
                    {trans.contact.sendBtn}
                  </Button>
                </VStack>
              </form>
            </Box>
          </Grid>
        </Box>
      </Box>
    </Layout>
  );
}
