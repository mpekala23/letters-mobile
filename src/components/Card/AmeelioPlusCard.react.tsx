import React from 'react';
import { Text, TouchableOpacity, View, ViewStyle } from 'react-native';
import { Colors, Typography } from '@styles';
import i18n from '@i18n';
import GoldBird from '@assets/common/GoldBird';
import RedArrowForward from '@assets/components/Card/RedArrowForward';
import Icon from '@components/Icon/Icon.react';
import CardStyles from './Card.styles';

interface Props {
  tokensLeft: number;
  onPress: () => void | Promise<void>;
  style?: ViewStyle;
}

const AmeelioPlusCard: React.FC<Props> = ({
  onPress,
  tokensLeft,
  style,
}: Props) => {
  return (
    <TouchableOpacity
      style={[
        CardStyles.cardBase,
        CardStyles.ameelioPlusBackground,
        CardStyles.shadow,
        style,
      ]}
      onPress={onPress}
    >
      <Text
        style={[Typography.FONT_BOLD, { fontSize: 18, color: Colors.GRAY_400 }]}
      >
        {i18n.t('Premium.yourAmeelioPlus')}
      </Text>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'flex-start',
        }}
      >
        <View style={{ width: 40, height: 40 }}>
          <Icon svg={GoldBird} />
        </View>
        <Text
          style={[
            Typography.FONT_REGULAR,
            {
              fontSize: 36,
              color: Colors.AMEELIO_BLACK,
              height: 52,
              paddingLeft: 8,
              justifyContent: 'center',
            },
          ]}
        >
          {tokensLeft}
        </Text>
      </View>
      <View
        style={{
          position: 'absolute',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'row',
          right: 16,
        }}
      >
        <Text style={[Typography.FONT_REGULAR, { color: 'red', fontSize: 16 }]}>
          Buy here
        </Text>
        <View style={{ width: 10, height: 40, marginLeft: 4 }}>
          <Icon svg={RedArrowForward} />
        </View>
      </View>
    </TouchableOpacity>
  );
};

AmeelioPlusCard.defaultProps = {
  style: {},
};

export default AmeelioPlusCard;
