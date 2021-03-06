import React from 'react';
import { Image as ImageComponent } from 'react-native';
import { Sticker } from 'types';

import Ameelio from './Ameelio.png';
import BestDad from './BestDad.png';
import Eggcelent from './Eggcelent.png';
import HappyBirthday from './HappyBirthday.png';
import Hearts from './Hearts.png';
import LoveYou from './LoveYou.png';
import MissYou from './MissYou.png';
import Stars from './Stars.png';
import Sunshine from './Sunshine.png';
import TwoPeas from './TwoPeas.png';

const AmeelioComponent = (
  <ImageComponent source={Ameelio} style={{ width: '100%', height: '100%' }} />
);

const BestDadComponent = (
  <ImageComponent source={BestDad} style={{ width: '100%', height: '100%' }} />
);

const EggcelentComponent = (
  <ImageComponent
    source={Eggcelent}
    style={{ width: '100%', height: '100%' }}
  />
);

const HappyBirthdayComponent = (
  <ImageComponent
    source={HappyBirthday}
    style={{ width: '100%', height: '100%' }}
  />
);

const STICKERS: Sticker[] = [
  {
    image: Ameelio,
    name: 'Sent by Ameelio',
  },
  {
    image: BestDad,
    name: '#1 Dad',
  },
  {
    image: Eggcelent,
    name: 'Eggcelent',
  },
  {
    image: HappyBirthday,
    name: 'Happy Birthday',
  },
  {
    image: Hearts,
    name: 'Hearts',
  },
  {
    image: LoveYou,
    name: 'Love You',
  },
  {
    image: MissYou,
    name: 'Miss You',
  },
  {
    image: Stars,
    name: 'Stars',
  },
  {
    image: Sunshine,
    name: 'Sunshine',
  },
  {
    image: TwoPeas,
    name: 'Two Peas',
  },
];

export default STICKERS;
