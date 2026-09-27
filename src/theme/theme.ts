import { extendTheme } from '@chakra-ui/react';

const colors = {
  brand: {
    900: '#0f0f14',
    800: '#16161f',
    700: '#1e1e2a',
  },
  primary: {
    main: '#ff4d2e',    // hot coral — the identity accent
    dark: '#0d0d11',    // near-black background
    light: '#f5f0ea',   // warm off-white text
  },
  accent: {
    coral: '#ff4d2e',
    amber: '#ffb547',
    muted: '#8a8a9a',
  },
  background: {
    main: '#ffffff',
    dark: '#0d0d11',
    dark2: '#13131a',
    dark3: '#0a0a0e',
    surface: '#1a1a24',
    border: '#2a2a38',
  },
};

const breakpoints = {
  lg: '960px',
};

export const theme = extendTheme({ colors, breakpoints });
