import React from 'react';
import { Image as ImageComponent } from 'react-native';

import { AsyncImage } from '@components';
import { Sticker } from 'types';

import Ameelio from './Ameelio.png';
import BestDad from './BestDad.png';
import Eggcelent from './Eggcelent.png';
import HappyBirthday from './HappyBirthday.png';
import Hearts from './Hearts.png';
import LoveYou from './LoveYou.png';
import MissYou from './MissYou.png';
import Peas from './Peas.png';
import Stars from './Stars.png';
import Sunshine from './Sunshine.png';
import TrashCan from './TrashCan.png';
import TwoPeas from './TwoPeas.png';

/*
import Dad from './Dad.pn';
import Eggcelent from './Eggcelent';
import HappyBirthday from './HappyBirthday';
import Hearts from './Hearts';
import LoveYou from './LoveYou';
import MissYou from './MissYou';
import SentByAmeelio from './SentByAmeelio';
import Stars from './Stars';
import Sunshine from './Sunshine';
import TwoPeas from './TwoPeas';

const STICKERS_SVG: Sticker[] = [
  {
    svg: Dad,
    name: '#1 Dad',
  },
  {
    svg: Eggcelent,
    name: 'Egg',
  },
  {
    svg: HappyBirthday,
    name: 'Happy Birthday',
  },
  {
    svg: Hearts,
    name: 'Hearts',
  },
  {
    svg: LoveYou,
    name: 'Love You',
  },
  {
    svg: MissYou,
    name: 'Miss You',
  },
  {
    svg: SentByAmeelio,
    name: 'Sent By Ameelio',
  },
  {
    svg: Stars,
    name: 'Stars',
  },
  {
    svg: Sunshine,
    name: 'Sunshine',
  },
  {
    svg: TwoPeas,
    name: 'Two Peas in a Pod',
  },
]; */

const BestDadComponent = (
  <ImageComponent source={BestDad} style={{ width: '100%', height: '100%' }} />
);

const STICKERS: Sticker[] = [
  {
    component: BestDadComponent,
    name: '#1 Dad',
  },
  {
    component: BestDadComponent,
    name: '#1 Dad',
  },
  {
    component: BestDadComponent,
    name: '#1 Dad',
  },
  {
    component: BestDadComponent,
    name: '#1 Dad',
  },
  {
    component: BestDadComponent,
    name: '#1 Dad',
  },
  {
    component: BestDadComponent,
    name: '#1 Dad',
  },
  {
    component: BestDadComponent,
    name: '#1 Dad',
  },
  {
    component: BestDadComponent,
    name: '#1 Dad',
  },
];

export default STICKERS;
