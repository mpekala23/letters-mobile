import { AdjustableText, Icon } from '@components';
import { TextStyle, View, ViewStyle } from 'react-native';
import GoldBird from '@assets/views/Premium/GoldenBirdCoin';
import { Typography } from '@styles';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import React from 'react';

interface Props {
  containerStyle?: ViewStyle | ViewStyle[];
  textStyle?: TextStyle;
  iconStyle?: ViewStyle | ViewStyle[];
  price: number;
  hasLabel?: boolean;
}
const PriceTag: React.FC<Props> = ({
  containerStyle,
  textStyle,
  iconStyle,
  price,
  hasLabel,
}: Props) => {
  return (
    <View
      style={[
        {
          flexDirection: 'row',
          alignItems: 'center',
        },
        containerStyle,
      ]}
    >
      <View style={[{ width: 12, height: 12, marginRight: 3 }, iconStyle]}>
        <Icon svg={GoldBird} />
      </View>
      <AdjustableText
        numberOfLines={1}
        style={[
          Typography.FONT_REGULAR,
          { fontSize: 14, color: Colors.GRAY_400 },
          textStyle || {},
        ]}
      >
        {price}
      </AdjustableText>
      {hasLabel && (
        <AdjustableText
          numberOfLines={1}
          style={[
            Typography.FONT_REGULAR,
            { fontSize: 14, color: Colors.GRAY_500, marginLeft: 4 },
          ]}
        >
          Ameelio+
        </AdjustableText>
      )}
    </View>
  );
};

PriceTag.defaultProps = {
  containerStyle: {},
  textStyle: {},
  iconStyle: {},
  hasLabel: false,
};

export default PriceTag;
