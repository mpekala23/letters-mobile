import React, { useState } from 'react';
import i18n from '@i18n';
import { Typography } from '@styles';
import { BOTTOM_HEIGHT } from '@utils/Constants';
import { Animated, Text, TouchableOpacity, View } from 'react-native';
import { TextBottomDetails } from 'types';
import { ColorPicker } from 'react-native-color-picker';
import { hsvToHex } from '@utils';
import Styles from './TextBottom.styles';

interface Props {
  bottomSlide: Animated.Value;
  details: TextBottomDetails | null;
  onClose: () => void;
}

function ColorSelector() {
  const [color, setColor] = useState('#000000');
  return (
    <>
      <View style={{ width: 100, height: 100, backgroundColor: color }} />
      <ColorPicker
        onColorChange={(selectedColor) => {
          setColor(
            hsvToHex(selectedColor.h / 360, selectedColor.s, selectedColor.v)
          );
        }}
        style={{ flex: 1 }}
      />
    </>
  );
}

const TextBottom: React.FC<Props> = ({
  bottomSlide,
  details,
  onClose,
}: Props) => {
  let content;
  if (details === 'color') {
    content = <ColorSelector />;
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
