import React from 'react';
import { Animated } from 'react-native';
import i18n from '@i18n';
import { DESIGN_BUTTONS_HEIGHT } from '@utils/Constants';
import DesignTools from '../DesignTools/DesignTools.react';
import Button from '../../Button/Button.react';
import Styles from './DesignButtons.styles';

interface Props {
  onAddLayout: () => void;
  onAddPhoto: () => void;
  onAddStickers: () => void;
  startWriting: () => void;
  flip: Animated.Value;
}

const DesignButtons: React.FC<Props> = ({
  onAddLayout,
  onAddPhoto,
  onAddStickers,
  startWriting,
  flip,
}: Props) => {
  return (
    <Animated.View
      style={[
        Styles.designButtons,
        {
          bottom: flip.interpolate({
            inputRange: [0, 1],
            outputRange: [0, -2 * DESIGN_BUTTONS_HEIGHT],
          }),
          overflow: 'hidden',
        },
      ]}
    >
      <>
        <DesignTools
          onAddLayout={onAddLayout}
          onAddPhoto={onAddPhoto}
          onAddStickers={onAddStickers}
          style={{ paddingBottom: 16 }}
        />
        <Button onPress={startWriting} buttonText={i18n.t('Compose.next')} />
      </>
    </Animated.View>
  );
};

export default DesignButtons;
