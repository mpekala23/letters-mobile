import React from 'react';
import { View, Text, TouchableOpacity, ViewStyle } from 'react-native';
import ColorIcon from '@assets/components/TextTools/AddColor';
import FontIcon from '@assets/components/TextTools/AddFont';
import TextIcon from '@assets/components/TextTools/AddText';
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
        <Icon svg={TextIcon} />
        <Text>Add text</Text>
      </TouchableOpacity>
      <TouchableOpacity style={Styles.toolButton} onPress={props.onAddColor}>
        <Icon svg={ColorIcon} style={{ top: -4 }} />
        <Text>Pick color</Text>
      </TouchableOpacity>
      <TouchableOpacity style={Styles.toolButton} onPress={props.onAddFont}>
        <Icon svg={FontIcon} />
        <Text>Pick font</Text>
      </TouchableOpacity>
    </View>
  );
};

TextTools.defaultProps = {
  style: {},
};

export default TextTools;
