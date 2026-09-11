export const fonts = {
  medium: 'Kufam-Medium',
  semiBold: 'Kufam-SemiBold',
} as const;

export const typography = {
  title: { fontFamily: fonts.semiBold, fontSize: 24 },
  body: { fontFamily: fonts.medium, fontSize: 15 },
  button: { fontFamily: fonts.semiBold, fontSize: 14 },
  caption: { fontFamily: fonts.medium, fontSize: 12 },
} as const;
