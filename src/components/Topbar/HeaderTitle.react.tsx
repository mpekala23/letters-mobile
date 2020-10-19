import { Colors, Typography } from '@styles';
import React from 'react';
import { Text } from 'react-native';

const HeaderTitle: React.FC<{ title: string }> = ({
  title,
}: {
  title: string;
}) => {
  return (
    <Text
      style={[
        Typography.FONT_MEDIUM,
        { fontSize: 16, color: Colors.GRAY_500, alignSelf: 'center' },
      ]}
    >
      {title}
    </Text>
  );
};

export default HeaderTitle;
