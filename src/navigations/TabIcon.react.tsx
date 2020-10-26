import { Icon } from '@components';
import { Typography } from '@styles';
import React from 'react';
import { GestureResponderEvent, Text, TouchableOpacity } from 'react-native';

interface Props {
  name: string;
  svg: string;
  onPress: (e: GestureResponderEvent) => void;
}

const TabIcon: React.FC<Props> = ({ name, svg, onPress }: Props) => {
  return (
    <TouchableOpacity
      activeOpacity={0.9}
      style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
      onPress={onPress}
    >
      <Icon svg={svg} />
      <Text style={Typography.FONT_REGULAR}>{name}</Text>
    </TouchableOpacity>
  );
};

export default TabIcon;
