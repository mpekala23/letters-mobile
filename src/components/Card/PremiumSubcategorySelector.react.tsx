import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import AsyncImage from '@components/AsyncImage/AsyncImage.react';
import AdjustableText from '@components/Text/AdjustableText.react';
import Icon from '@components/Icon/Icon.react';
import i18n from '@i18n';
import { Colors, Typography } from '@styles';
import { capitalize } from '@utils';
import GoldBird from '@assets/views/Premium/GoldenBirdCoin';
import CardStyles from './Card.styles';

interface Props {
  subcategoryName: string;
  subcategoryLength: number;
}

const PremiumSubcategorySelector: React.FC<Props> = ({
  subcategoryName,
  subcategoryLength,
}: Props) => {
  return (
    <TouchableOpacity style={{ width: 142, height: 180 }}>
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
          source={{
            uri:
              'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f8/HarvardUniversity_WidenerLibrary_Reading_c1915_cropped.jpg/330px-HarvardUniversity_WidenerLibrary_Reading_c1915_cropped.jpg',
          }}
          viewStyle={{ height: 84 }}
        />
        <View style={{ padding: 8, flex: 1 }}>
          <AdjustableText
            numberOfLines={1}
            style={[Typography.FONT_BOLD, { fontSize: 14 }]}
          >
            {capitalize(subcategoryName)}
          </AdjustableText>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <AdjustableText
              numberOfLines={1}
              style={[
                Typography.FONT_REGULAR,
                { fontSize: 14, color: Colors.GRAY_400, flex: 1 },
              ]}
            >
              {subcategoryLength}{' '}
              {subcategoryLength === 1
                ? i18n.t('Premium.page')
                : i18n.t('Premium.pages')}
            </AdjustableText>
            <View style={{ width: 16, height: 16 }}>
              <Icon svg={GoldBird} />
            </View>
            <AdjustableText
              numberOfLines={1}
              style={[
                Typography.FONT_REGULAR,
                { fontSize: 14, color: Colors.GRAY_400 },
              ]}
            >
              30
            </AdjustableText>
          </View>
        </View>
      </View>
      <View
        style={[
          CardStyles.shadow,
          CardStyles.premiumCardBox,
          { elevation: 5, backgroundColor: Colors.GRAY_100, top: 12, left: 12 },
        ]}
      />
      <View
        style={[
          CardStyles.shadow,
          CardStyles.premiumCardBox,
          { elevation: 4, backgroundColor: Colors.GRAY_200, top: 16, left: 16 },
        ]}
      />
    </TouchableOpacity>
  );
};

export default PremiumSubcategorySelector;
