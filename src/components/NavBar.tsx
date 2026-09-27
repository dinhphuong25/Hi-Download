import { LANGUAGES } from '@/contants';
import { useThemeColor } from '@/hooks/useThemeColor';
import useTrans from '@/hooks/useTrans';
import { Logo } from '@/components/Logo';
import {
  Box,
  Button,
  Flex,
  HStack,
  IconButton,
  List,
  ListItem,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Text,
} from '@chakra-ui/react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';
import { MdLanguage, MdCheck } from 'react-icons/md';

type Props = {};

const NavBar = (props: Props) => {
  const router = useRouter();
  const trans = useTrans();

  const currentLangName =
    LANGUAGES.find((l) => l.alias === router.locale)?.name || 'Tiếng Việt';

  return (
    <Box
      as="nav"
      w="100%"
      position="sticky"
      top="0"
      zIndex={100}
      style={{
        background: 'rgba(255, 255, 255, 0.88)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderBottom: '1px solid #e2e8f0',
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

        {/* Language selector (Tiếng Việt & English only) */}
        <HStack spacing="8px">
          <Popover placement="bottom-end">
            <PopoverTrigger>
              <Button
                variant="outline"
                size="sm"
                borderRadius="10px"
                borderColor="#e2e8f0"
                bg="#ffffff"
                _hover={{ bg: '#f1f5f9', borderColor: '#cbd5e1' }}
                leftIcon={<MdLanguage size="15px" color="#0284c7" />}
                color="#0f172a"
                fontSize="13px"
                fontWeight="600"
                px="12px"
                h="36px"
                boxShadow="0 1px 2px rgba(0,0,0,0.03)"
              >
                {currentLangName}
              </Button>
            </PopoverTrigger>
            <PopoverContent
              w="150px"
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
                        <Link locale={item.alias} href={router.asPath}>
                          <HStack
                            justify="space-between"
                            py="7px"
                            px="10px"
                            borderRadius="8px"
                            cursor="pointer"
                            bg={isActive ? '#f1f5f9' : 'transparent'}
                            color={isActive ? '#0f172a' : '#475569'}
                            fontWeight={isActive ? '700' : '500'}
                            fontSize="13px"
                            _hover={{ bg: '#f1f5f9', color: '#0f172a' }}
                            transition="all 0.15s ease"
                          >
                            <Text>{item.name}</Text>
                            {isActive && <MdCheck size="16px" color="#0284c7" />}
                          </HStack>
                        </Link>
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
