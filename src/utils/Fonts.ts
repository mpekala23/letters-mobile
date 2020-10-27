import { CustomFontFamilies } from 'types';

const MAP_FONT_TO_SOURCE: Record<CustomFontFamilies, string> = {
  'BebasNeue-Regular': 'https://fonts.google.com/specimen/Bebas+Neue',
  'KumbhSans-Regular': 'https://fonts.google.com/specimen/Kumbh+Sans',
  'Lobster-Regular': 'https://fonts.google.com/specimen/Lobster',
  'Montserrat-Regular': 'https://fonts.google.com/specimen/Montserrat',
  'NotoSerifJP-Regular': 'https://fonts.google.com/specimen/Noto+Serif+JP',
  'ReenieBeanie-Regular': 'https://fonts.google.com/specimen/Reenie+Beanie',
  'Satisfy-Regular': 'https://fonts.google.com/specimen/Satisfy',
};

export function mapNameToFont(name: string): CustomFontFamilies {
  switch (name) {
    case 'BabasNeue':
    case 'BebasNeue-Regular':
      return CustomFontFamilies.BebasNeue;
    case 'KumbhSans':
    case 'KumbhSans-Regular':
      return CustomFontFamilies.KumbhSans;
    case 'Lobster':
    case 'Lobster-Regular':
      return CustomFontFamilies.Lobster;
    case 'Montserrat':
    case 'Montserrat-Regular':
      return CustomFontFamilies.Montserrat;
    case 'NotoSerifJP':
    case 'NotoSerifJP-Regular':
      return CustomFontFamilies.NotoSerifJP;
    case 'ReenieBeanie':
    case 'ReenieBeanie-Regular':
      return CustomFontFamilies.ReenieBeanie;
    case 'Satisfy':
    case 'Satisfy-Regular':
      return CustomFontFamilies.Satisfy;
    default:
      return CustomFontFamilies.Montserrat;
  }
}

const FONT_OPTIONS: CustomFontFamilies[] = [
  CustomFontFamilies.BebasNeue,
  CustomFontFamilies.KumbhSans,
  CustomFontFamilies.Lobster,
  CustomFontFamilies.Montserrat,
  CustomFontFamilies.NotoSerifJP,
  CustomFontFamilies.ReenieBeanie,
  CustomFontFamilies.Satisfy,
];

export { MAP_FONT_TO_SOURCE, FONT_OPTIONS };
