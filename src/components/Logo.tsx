import React from 'react';
import { Box, HStack, Text } from '@chakra-ui/react';
import { MdVerified } from 'react-icons/md';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showBadge?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ size = 'md', showBadge = false }) => {
  const isSm = size === 'sm';
  const isLg = size === 'lg';

  const iconDim = isSm ? '28px' : isLg ? '42px' : '34px';
  const fontSize = isSm ? '16px' : isLg ? '22px' : '18px';
  const badgeSize = isSm ? '14px' : isLg ? '19px' : '16px';
  const rx = isSm ? '8' : isLg ? '12' : '10';

  return (
    <HStack spacing={isSm ? '8px' : '10px'} align="center" userSelect="none">
      {/* Premium Vector Brand Mark */}
      <Box
        w={iconDim}
        h={iconDim}
        flexShrink={0}
        position="relative"
        transition="transform 0.2s ease, box-shadow 0.2s ease"
        _hover={{ transform: 'translateY(-1px) scale(1.02)' }}
      >
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 36 36"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{
            filter: 'drop-shadow(0 3px 8px rgba(15, 23, 42, 0.18))',
            borderRadius: isSm ? '8px' : '10px',
            display: 'block',
          }}
        >
          <defs>
            {/* Deep Obsidian Gradient */}
            <linearGradient id="hiBgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0f172a" />
              <stop offset="100%" stopColor="#1e293b" />
            </linearGradient>

            {/* Vibrant Cyan Accent Gradient */}
            <linearGradient id="hiCyanGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#38bdf8" />
              <stop offset="100%" stopColor="#0284c7" />
            </linearGradient>

            {/* Inner top bezel shine */}
            <linearGradient id="hiShine" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="rgba(255, 255, 255, 0.25)" />
              <stop offset="100%" stopColor="rgba(255, 255, 255, 0)" />
            </linearGradient>
          </defs>

          {/* Squircle Badge Background */}
          <rect
            width="36"
            height="36"
            rx={rx}
            fill="url(#hiBgGrad)"
          />

          {/* Top highlight shine border */}
          <rect
            x="0.75"
            y="0.75"
            width="34.5"
            height="34.5"
            rx={Number(rx) - 1}
            stroke="url(#hiShine)"
            strokeWidth="1.5"
            fill="none"
          />

          {/* Active signal spark dot */}
          <circle cx="28.5" cy="7.5" r="2" fill="#38bdf8" />

          {/* Vector Download Arrow: Sharp & Dynamic */}
          <path
            d="M18 8V20.5"
            stroke="#ffffff"
            strokeWidth="2.6"
            strokeLinecap="round"
          />
          <path
            d="M13 16L18 21L23 16"
            stroke="#ffffff"
            strokeWidth="2.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Precision Capture Cradle / Tray with Cyan Gradient */}
          <path
            d="M10.5 22.5V25C10.5 26.38 11.62 27.5 13 27.5H23C24.38 27.5 25.5 26.38 25.5 25V22.5"
            stroke="url(#hiCyanGrad)"
            strokeWidth="2.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </Box>

      {/* Brand Typography */}
      <HStack spacing="5px" align="center">
        <Text
          fontSize={fontSize}
          fontWeight="800"
          color="#0f172a"
          letterSpacing="-0.03em"
          lineHeight="1"
        >
          Hi Download
        </Text>
        {showBadge && (
          <Box color="#0ea5e9" display="flex" alignItems="center">
            <MdVerified size={badgeSize} />
          </Box>
        )}
      </HStack>
    </HStack>
  );
};

export default Logo;
