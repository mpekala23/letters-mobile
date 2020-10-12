import React from 'react';
import { View, Text, TouchableOpacity, ViewStyle } from 'react-native';
import LayoutButton from '@assets/components/PostcardTools/LayoutButton';
import PhotoButton from '@assets/components/PostcardTools/PhotoButton';
import StickerButton from '@assets/components/PostcardTools/StickerButton';
import Styles from './DesignTools.styles';
import Icon from '../../Icon/Icon.react';

interface Props {
  onAddLayout?: () => void;
  onAddPhoto?: () => void;
  onAddStickers?: () => void;
  style?: ViewStyle;
}

const DesignTools: React.FC<Props> = (props: Props) => {
  return (
    <View style={[Styles.toolsBackground, props.style]}>
      {props.onAddLayout && (
        <TouchableOpacity style={Styles.toolButton} onPress={props.onAddLayout}>
          <Icon svg={LayoutButton} />
          <Text>Add layout</Text>
        </TouchableOpacity>
      )}
      {props.onAddPhoto && (
        <TouchableOpacity style={Styles.toolButton} onPress={props.onAddPhoto}>
          <Icon svg={PhotoButton} />
          <Text>Add photo</Text>
        </TouchableOpacity>
      )}
      {props.onAddStickers && (
        <TouchableOpacity
          style={Styles.toolButton}
          onPress={props.onAddStickers}
        >
          <Icon svg={StickerButton} />
          <Text>Add stickers</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

DesignTools.defaultProps = {
  onAddLayout: undefined,
  onAddPhoto: undefined,
  onAddStickers: undefined,
  style: {},
};

export default DesignTools;
