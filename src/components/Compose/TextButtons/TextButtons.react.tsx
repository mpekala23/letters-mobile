import React from 'react';
import { Animated } from 'react-native';
import i18n from '@i18n';
import { DESIGN_BUTTONS_HEIGHT } from '@utils/Constants';
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
        <TextTools
          onAddText={onAddText}
          onAddColor={onAddColor}
          onAddFont={onAddFont}
          style={{ paddingBottom: 16 }}
        />
        <Button onPress={finishWriting} buttonText={i18n.t('Compose.next')} />
      </>
    </Animated.View>
  );
};

export default TextButtons;
