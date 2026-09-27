import { useThemeStore } from '@/stores/useThemeStore';
import { useTheme } from '@chakra-ui/react';
import { useMemo } from 'react';

export const useThemeColor = () => {
  const { isDarkMode, toggleDarkMode } = useThemeStore();

  const theme = useTheme();

  const textColor = useMemo(
    () => (isDarkMode ? '#f8fafc' : '#0f172a'),
    [isDarkMode],
  );

  // Nav/surface — clean light background
  const navBackgroundColor = useMemo(
    () => (isDarkMode ? '#0f172a' : '#f8fafc'),
    [isDarkMode],
  );

  // Hero section gradient — always dramatic dark
  const bgGradient = useMemo(
    () =>
      isDarkMode
        ? `linear(135deg, background.dark3 0%, brand.900 50%, brand.800 100%)`
        : `linear(135deg, #1a1a2e 0%, #0f0f14 60%, #16161f 100%)`,
    [isDarkMode],
  );

  return {
    isDarkMode,
    toggleDarkMode,
    textColor,
    navBackgroundColor,
    bgGradient,
  };
};
