import { Icon } from '@components';
import { Colors, Typography } from '@styles';
import React from 'react';
import { GestureResponderEvent, Text, TouchableOpacity } from 'react-native';

interface Props {
  name: string;
  svg: string;
  onPress: (e: GestureResponderEvent) => void;
  active: boolean;
}

const TabIcon: React.FC<Props> = ({ name, svg, onPress, active }: Props) => {
  return (
    <TouchableOpacity
      activeOpacity={0.9}
      style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
      onPress={onPress}
    >
      <Icon svg={svg} />
      <Text
        style={[
          active ? Typography.FONT_SEMIBOLD : Typography.FONT_REGULAR,
          { color: active ? Colors.AMEELIO_BLACK : Colors.GRAY_400 },
        ]}
      >
        {name}
      </Text>
    </TouchableOpacity>
  );
};

export default TabIcon;
