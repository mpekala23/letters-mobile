import React from 'react';
import i18n from '@i18n';
import { Colors, Typography } from '@styles';
import { BOTTOM_HEIGHT } from '@utils/Constants';
import { Animated, FlatList, Text, TouchableOpacity, View } from 'react-native';
import { CustomFontFamilies, TextBottomDetails } from 'types';
import { TriangleColorPicker } from 'react-native-color-picker';
import { hsvToHex } from '@utils';
import { FONT_OPTIONS } from '@utils/Fonts';
import Styles from './TextBottom.styles';
import AdjustableText from '../../Text/AdjustableText.react';

interface Props {
  bottomSlide: Animated.Value;
  details: TextBottomDetails | null;
  onClose: () => void;
  setColor: (color: string) => void;
  setFont: (font: CustomFontFamilies) => void;
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

function FontSelector({
  setFont,
}: {
  setFont: (font: CustomFontFamilies) => void;
}) {
  return (
    <View style={{ flex: 1, paddingTop: 32, paddingHorizontal: 16 }}>
      <FlatList
        data={FONT_OPTIONS}
        renderItem={({ item }) => {
          return (
            <TouchableOpacity
              style={{
                width: '100%',
                justifyContent: 'center',
                paddingVertical: 8,
              }}
              onPress={() => setFont(item)}
            >
              <Text
                style={[
                  Typography.FONT_REGULAR,
                  { color: Colors.GRAY_MEDIUM, fontSize: 18 },
                ]}
              >
                {item.split('-')[0]}
              </Text>
              <Text
                style={{
                  flex: 1,
                  height: '100%',
                  fontFamily: item,
                  color: 'white',
                  fontSize: 24,
                }}
              >
                The quick brown fox jumped over the lazy dog.
              </Text>
            </TouchableOpacity>
          );
        }}
        keyExtractor={(item) => item}
      />
    </View>
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
