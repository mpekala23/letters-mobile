import { AsyncImage } from '@components';
import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import SmallPostcard from '@assets/views/Compose/PostcardSizes/Small.png';
import MediumPostcard from '@assets/views/Compose/PostcardSizes/Medium.png';
import LargePostcard from '@assets/views/Compose/PostcardSizes/Large.png';

import CardStyles from '@components/Card/Card.styles';
import { Image } from 'types';
import i18n from '@i18n';
import { Typography } from '@styles';
import Styles from './SelectPostcardSize.styles';
// interface Props {}

interface PostcardSizeOption {
  key: string;
  image: Image;
  title: string;
  words: number;
  cost: number;
  isPremium: boolean;
}

const SelectPostcardSizeScreen = () => {
  const OPTIONS: PostcardSizeOption[] = [
    {
      key: '4x6',
      image: SmallPostcard,
      title: i18n.t('Compose.smallPostcardTitle'),
      words: 100,
      cost: 1,
      isPremium: false,
    },
    {
      key: '6x9',
      image: MediumPostcard,
      title: i18n.t('Compose.mediumPostcardTitle'),
      words: 200,
      cost: 10,
      isPremium: true,
    },
    {
      key: '6x11',
      image: LargePostcard,
      title: i18n.t('Compose.largePostcardTitle'),
      words: 300,
      cost: 15,
      isPremium: true,
    },
  ];

  const [selected, setSelected] = useState<PostcardSizeOption>(OPTIONS[0]);

  const renderItem = (option: PostcardSizeOption) => {
    const { image, title, words, cost, isPremium } = option;
    // const borderStyle =
    // selected.key === option.key
    //   ? Styles.cardSelectedBackground
    //   : Styles.cardRegularBackground;
    const costLabel = isPremium ? `${cost} Ameelio+` : `${cost} free Ameelio`;

    return (
      <TouchableOpacity
        style={[
          CardStyles.shadow,
          CardStyles.selectPostcardSizeBase,
          CardStyles.horizontalCardLayout,
          { height: 140 },
        ]}
        onPress={() => setSelected(option)}
      >
        <AsyncImage
          imageStyle={{ flex: 1, height: '100%', resizeMode: 'cover' }}
          download
          source={image}
          autorotate={false}
          local
        />
        <View style={{ flex: 1, marginLeft: 16 }}>
          <Text style={[Typography.FONT_BOLD]}>{title}</Text>
          <Text style={Styles.body}>
            {words} {i18n.t('Compose.words')}
          </Text>
          <View>
            <Text style={[Styles.body, { marginTop: 'auto' }]}>
              {costLabel}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={Styles.trueBackground}>
      {OPTIONS.map((option) => renderItem(option))}
    </View>
  );
};

export default SelectPostcardSizeScreen;
