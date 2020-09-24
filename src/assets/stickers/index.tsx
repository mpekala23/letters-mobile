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

const HeartsComponent = (
  <ImageComponent source={Hearts} style={{ width: '100%', height: '100%' }} />
);

const LoveYouComponent = (
  <ImageComponent source={LoveYou} style={{ width: '100%', height: '100%' }} />
);

const MissYouComponent = (
  <ImageComponent source={MissYou} style={{ width: '100%', height: '100%' }} />
);

const StarsComponent = (
  <ImageComponent source={Stars} style={{ width: '100%', height: '100%' }} />
);

const SunshineComponent = (
  <ImageComponent source={Sunshine} style={{ width: '100%', height: '100%' }} />
);

const TwoPeasComponent = (
  <ImageComponent source={TwoPeas} style={{ width: '100%', height: '100%' }} />
);

const STICKERS: Sticker[] = [
  {
    component: AmeelioComponent,
    name: 'Sent by Ameelio',
  },
  {
    component: BestDadComponent,
    name: '#1 Dad',
  },
  {
    component: EggcelentComponent,
    name: 'Eggcelent',
  },
  {
    component: HappyBirthdayComponent,
    name: 'Happy Birthday',
  },
  {
    component: HeartsComponent,
    name: 'Hearts',
  },
  {
    component: LoveYouComponent,
    name: 'Love You',
  },
  {
    component: MissYouComponent,
    name: 'Miss You',
  },
  {
    component: StarsComponent,
    name: 'Stars',
  },
  {
    component: SunshineComponent,
    name: 'Sunshine',
  },
  {
    component: TwoPeasComponent,
    name: 'Two Peas',
  },
];

export default STICKERS;
