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
  keyboardOpacity: Animated.Value;
  flip: Animated.Value;
  textSubscreenFocused: boolean;
}

const TextButtons: React.FC<Props> = ({
  onAddText,
  onAddColor,
  onAddFont,
  finishWriting,
  keyboardOpacity,
  flip,
  textSubscreenFocused,
}: Props) => {
  return (
    <Animated.View
      style={[
        Styles.textButtons,
        {
          bottom: textSubscreenFocused
            ? flip.interpolate({
                inputRange: [0, 1],
                outputRange: [-2 * DESIGN_BUTTONS_HEIGHT, 0],
              })
            : keyboardOpacity.interpolate({
                inputRange: [0, 1],
                outputRange: [0, -2 * DESIGN_BUTTONS_HEIGHT],
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
