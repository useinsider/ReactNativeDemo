/**
 * Insider brand palette, mirrored from the native Android demo's
 * app/src/main/res/values/colors.xml. This file is the only place in the app
 * that may declare a colour literal.
 */
export const colors = {
  navy: '#1B1F3B',
  navyDark: '#0E1027',
  orange: '#FF5C35',
  orangeDark: '#E5491F',
  surface: '#F7F8FC',
  surfaceVariant: '#EDEFF7',
  onSurface: '#1B1F3B',
  onSurfaceVariant: '#5B6075',
  outline: '#D6DAE8',
  white: '#FFFFFF',
  black: '#000000',
} as const;

export type ColorToken = keyof typeof colors;
