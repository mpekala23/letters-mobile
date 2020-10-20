import React from 'react';
import { Animated, Text, View } from 'react-native';
import i18n from '@i18n';
import { DESIGN_BUTTONS_HEIGHT } from '@utils/Constants';
import Slider from '@react-native-community/slider';
import { Colors } from '@styles';
import TextTools from '../TextTools/TextTools.react';
import Button from '../../Button/Button.react';
import Styles from './TextButtons.styles';

interface Props {
  onAddText: () => void;
  onAddColor: () => void;
  onAddFont: () => void;
  finishWriting: () => void;
  slide: Animated.Value;
}

const TextButtons: React.FC<Props> = ({
  onAddText,
  onAddColor,
  onAddFont,
  finishWriting,
  slide,
}: Props) => {
  return (
    <Animated.View
      style={[
        Styles.textButtons,
        {
          bottom: slide.interpolate({
            inputRange: [0, 1],
            outputRange: [-2 * DESIGN_BUTTONS_HEIGHT, 0],
          }),
          overflow: 'hidden',
        },
      ]}
    >
      <>
        <View
          style={{
            marginVertical: 16,
            width: '100%',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Text>Font size</Text>
          <Slider
            style={{ width: '80%', height: 40, marginTop: 8 }}
            minimumValue={12}
            maximumValue={24}
            onValueChange={() => null}
            step={1}
            value={14}
            minimumTrackTintColor={Colors.GREEN_600}
            maximumTrackTintColor={Colors.PINK_600}
          />
        </View>
        <TextTools
          onAddText={onAddText}
          onAddColor={onAddColor}
          onAddFont={onAddFont}
          style={{ paddingBottom: 16 }}
        />
        <Button
          onPress={finishWriting}
          buttonText={i18n.t('Compose.next')}
          containerStyle={{ width: '100%' }}
        />
      </>
    </Animated.View>
  );
};

export default TextButtons;
