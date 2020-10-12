import React from 'react';
import { View, Text, TouchableOpacity, ViewStyle } from 'react-native';
import LayoutButton from '@assets/components/PostcardTools/LayoutButton';
import PhotoButton from '@assets/components/PostcardTools/PhotoButton';
import StickerButton from '@assets/components/PostcardTools/StickerButton';
import Styles from './TextTools.styles';
import Icon from '../../Icon/Icon.react';

interface Props {
  onAddText: () => void;
  onAddColor: () => void;
  onAddFont: () => void;
  style?: ViewStyle;
}

const TextTools: React.FC<Props> = (props: Props) => {
  return (
    <View style={[Styles.toolsBackground, props.style]}>
      <TouchableOpacity style={Styles.toolButton} onPress={props.onAddText}>
        <Icon svg={LayoutButton} />
        <Text>Add layout</Text>
      </TouchableOpacity>
      <TouchableOpacity style={Styles.toolButton} onPress={props.onAddColor}>
        <Icon svg={PhotoButton} />
        <Text>Add photo</Text>
      </TouchableOpacity>
      <TouchableOpacity style={Styles.toolButton} onPress={props.onAddFont}>
        <Icon svg={StickerButton} />
        <Text>Add stickers</Text>
      </TouchableOpacity>
    </View>
  );
};

TextTools.defaultProps = {
  style: {},
};

export default TextTools;
