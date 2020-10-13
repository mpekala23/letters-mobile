import React, { useState } from 'react';
import i18n from '@i18n';
import { Typography } from '@styles';
import { BOTTOM_HEIGHT } from '@utils/Constants';
import { Animated, FlatList, Text, TouchableOpacity, View } from 'react-native';
import { TextBottomDetails } from 'types';
import { TriangleColorPicker } from 'react-native-color-picker';
import { hsvToHex } from '@utils';
import Styles from './TextBottom.styles';

interface Props {
  bottomSlide: Animated.Value;
  details: TextBottomDetails | null;
  onClose: () => void;
  setColor: (color: string) => void;
  setFont: (font: string) => void;
}

function ColorSelector({ setColor }: { setColor: (color: string) => void }) {
  return (
    <TriangleColorPicker
      defaultColor="#000000"
      onColorChange={(selectedColor) => {
        setColor(
          hsvToHex(selectedColor.h / 360, selectedColor.s, selectedColor.v)
        );
      }}
      style={{ flex: 1 }}
      hideControls
    />
  );
}

const FONT_OPTIONS = [
  'BebasNeue-Regular',
  'KumbhSans-Regular',
  'NotoSerifJP-Regular',
];

function FontSelector({ setFont }: { setFont: (font: string) => void }) {
  return (
    <FlatList
      data={FONT_OPTIONS}
      renderItem={({ item }) => {
        return (
          <Text style={{ fontFamily: item, color: 'white' }}>
            The quick brown fox jumped over the lazy dog.
          </Text>
        );
      }}
    />
  );
}

const TextBottom: React.FC<Props> = ({
  bottomSlide,
  details,
  onClose,
  setColor,
  setFont,
}: Props) => {
  let content;
  if (details === 'color') {
    content = <ColorSelector setColor={setColor} />;
  } else if (details === 'font') {
    content = <FontSelector setFont={setFont} />;
  }

  return (
    <Animated.View
      style={[
        Styles.bottom,
        {
          bottom: bottomSlide.interpolate({
            inputRange: [0, 1],
            outputRange: [-BOTTOM_HEIGHT, 0],
          }),
        },
      ]}
    >
      {content}
      <TouchableOpacity
        style={{ position: 'absolute', top: 4, right: 8 }}
        onPress={onClose}
      >
        <Text
          style={[
            Typography.FONT_REGULAR,
            {
              color: 'white',
              fontSize: 18,
            },
          ]}
        >
          {i18n.t('Compose.done')}
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

export default TextBottom;
