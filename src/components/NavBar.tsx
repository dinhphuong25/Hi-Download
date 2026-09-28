import { LANGUAGES } from '@/contants';
import { Logo } from '@/components/Logo';
import {
  Box,
  Button,
  HStack,
  List,
  ListItem,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';
import { MdCheck, MdExpandMore } from 'react-icons/md';
import ReactCountryFlag from 'react-country-flag';

type Props = {};

const NavBar = (props: Props) => {
  const router = useRouter();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const currentLang = LANGUAGES.find((l) => l.alias === router.locale) || LANGUAGES[0];

  const handleSelectLang = (alias: string, href: string) => {
    onClose();
    // Navigate after closing — small delay to let popover animate out
    setTimeout(() => {
      router.push(href, href, { locale: alias, scroll: false });
    }, 80);
  };

  return (
    <Box
      as="nav"
      w="100%"
      position="sticky"
      top="0"
      zIndex={100}
      style={{
        background: '#ffffff',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '2px solid #e2e8f0',
        boxShadow: '0 1px 8px -2px rgba(15, 23, 42, 0.08)',
      }}
    >
      <HStack
        justifyContent="space-between"
        w="100%"
        px={{ base: '16px', lg: '32px' }}
        py="12px"
        maxW="1180px"
        mx="auto"
      >
        {/* Brand Logo */}
        <Link href="/">
          <Box cursor="pointer">
            <Logo size="md" />
          </Box>
        </Link>

        {/* Language selector */}
        <HStack spacing="8px">
          <Popover
            isOpen={isOpen}
            onOpen={onOpen}
            onClose={onClose}
            placement="bottom-end"
            isLazy
          >
            <PopoverTrigger>
              <Button
                variant="outline"
                size="sm"
                borderRadius="10px"
                borderColor="#d1d5db"
                borderWidth="1.5px"
                bg="#ffffff"
                _hover={{ bg: '#f1f5f9', borderColor: '#94a3b8' }}
                color="#0f172a"
                fontSize="13px"
                fontWeight="600"
                px="12px"
                h="36px"
                boxShadow="0 1px 2px rgba(0,0,0,0.03)"
                gap="6px"
              >
                {/* Flag SVG - works on all OS including Windows */}
                <ReactCountryFlag
                  countryCode={currentLang.countryCode}
                  svg
                  style={{ width: '18px', height: '14px', marginRight: '2px', borderRadius: '2px' }}
                />
                {currentLang.name}
                <Box
                  as={MdExpandMore}
                  size="16px"
                  color="#64748b"
                  ml="1px"
                  style={{
                    transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 0.2s ease',
                  }}
                />
              </Button>
            </PopoverTrigger>
            <PopoverContent
              w="165px"
              bg="#ffffff"
              border="1px solid #e2e8f0"
              borderRadius="12px"
              boxShadow="0 12px 28px -6px rgba(15, 23, 42, 0.12)"
              overflow="hidden"
              _focus={{ outline: 'none' }}
            >
              <PopoverBody p="6px">
                <List spacing="2px">
                  {LANGUAGES.map((item) => {
                    const isActive =
                      router.locale === item.alias ||
                      (!router.locale && item.alias === 'vi');
                    return (
                      <ListItem key={item.alias}>
                        <HStack
                          justify="space-between"
                          py="8px"
                          px="10px"
                          borderRadius="8px"
                          cursor="pointer"
                          bg={isActive ? '#f0f9ff' : 'transparent'}
                          color={isActive ? '#0284c7' : '#475569'}
                          fontWeight={isActive ? '700' : '500'}
                          fontSize="13px"
                          _hover={{ bg: '#f1f5f9', color: '#0f172a' }}
                          transition="all 0.15s ease"
                          onClick={() => handleSelectLang(item.alias, router.asPath)}
                        >
                          <HStack spacing="8px">
                            <ReactCountryFlag
                              countryCode={item.countryCode}
                              svg
                              style={{ width: '20px', height: '15px', borderRadius: '2px', flexShrink: 0 }}
                            />
                            <Text>{item.name}</Text>
                          </HStack>
                          {isActive && (
                            <MdCheck size="16px" color="#0284c7" />
                          )}
                        </HStack>
                      </ListItem>
                    );
                  })}
                </List>
              </PopoverBody>
            </PopoverContent>
          </Popover>
        </HStack>
      </HStack>
    </Box>
  );
};

export default NavBar;
