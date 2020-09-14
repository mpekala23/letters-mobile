import { Layout } from 'types';
import Layout1 from '@assets/views/Compose/Layouts/Layout1';
import Layout2 from '@assets/views/Compose/Layouts/Layout2';
import Layout3 from '@assets/views/Compose/Layouts/Layout3';
import Layout4 from '@assets/views/Compose/Layouts/Layout4';

export const LAYOUTS: Layout[] = [
  {
    id: 1,
    positions: {
      1: undefined,
    },
    svg: Layout1,
  },
  {
    id: 2,
    positions: {
      1: undefined,
      2: undefined,
    },
    svg: Layout2,
  },
  {
    id: 3,
    positions: {
      1: undefined,
      2: undefined,
      3: undefined,
    },
    svg: Layout3,
  },
  {
    id: 4,
    positions: {
      1: undefined,
      2: undefined,
      3: undefined,
      4: undefined,
    },
    svg: Layout4,
  },
];

// a layout with a union of all possible properties, used during the compose process in case a user wants to click through layouts without losing images
export const COMMON_LAYOUT: Layout = {
  id: -1,
  positions: {
    1: undefined,
    2: undefined,
    3: undefined,
    4: undefined,
  },
  svg: '',
};
