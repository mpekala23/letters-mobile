import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import AsyncImage from '@components/AsyncImage/AsyncImage.react';
import AdjustableText from '@components/Text/AdjustableText.react';
import Icon from '@components/Icon/Icon.react';
import { Colors, Typography } from '@styles';
import { capitalize } from '@utils';
import { PremadeDesign } from 'types';
import GoldBird from '@assets/views/Premium/GoldenBirdCoin';
import CardStyles from './Card.styles';

interface Props {
  design: PremadeDesign;
  handlePress: () => void;
}

const PremiumSubcategorySelector: React.FC<Props> = ({
  design,
  handlePress,
}: Props) => {
  return (
    <TouchableOpacity style={{ width: 142, height: 180 }} onPress={handlePress}>
      <View
        style={[
          CardStyles.shadow,
          CardStyles.premiumCardBox,
          {
            elevation: 6,
            backgroundColor: 'white',
            top: 8,
            left: 8,
            overflow: 'hidden',
          },
        ]}
      >
        <AsyncImage
          download
          source={design.thumbnail}
          viewStyle={{ height: 84 }}
        />
        <View style={{ padding: 8, flex: 1 }}>
          <AdjustableText
            numberOfLines={1}
            style={[Typography.FONT_BOLD, { fontSize: 14 }]}
          >
            {capitalize(design.name)}
          </AdjustableText>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginTop: 2,
            }}
          >
            <View style={{ width: 12, height: 12, marginRight: 3 }}>
              <Icon svg={GoldBird} />
            </View>
            <AdjustableText
              numberOfLines={1}
              style={[
                Typography.FONT_REGULAR,
                { fontSize: 14, color: Colors.GRAY_400 },
              ]}
            >
              {design.price}
            </AdjustableText>
          </View>
        </View>
      </View>
      <View
        style={[
          CardStyles.shadow,
          CardStyles.premiumCardBox,
          CardStyles.premiumCardBox2,
        ]}
      />
      <View
        style={[
          CardStyles.shadow,
          CardStyles.premiumCardBox,
          CardStyles.premiumCardBox3,
        ]}
      />
    </TouchableOpacity>
  );
};

export default PremiumSubcategorySelector;
