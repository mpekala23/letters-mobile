import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { Colors, Typography } from '@styles';
import { PremiumTransaction } from 'types';
import Icon from '@components/Icon/Icon.react';
import GoldenBirdCoin from '@assets/views/Premium/GoldenBirdCoin';
import { format } from 'date-fns';
import AsyncImage from '@components/AsyncImage/AsyncImage.react';
import CardStyles from './Card.styles';

interface Props {
  transaction: PremiumTransaction;
  onPress: () => void | Promise<void>;
}

const PremiumTransactionHistoryCard: React.FC<Props> = ({
  onPress,
  transaction,
}: Props) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        CardStyles.cardBase,
        CardStyles.shadow,
        CardStyles.transactionHistoryBackground,
      ]}
    >
      <View style={{ flex: 1, flexDirection: 'row' }}>
        <AsyncImage
          source={transaction.thumbnail}
          viewStyle={CardStyles.transactionHistoryThumbnail}
          download
        />
        <View style={{ justifyContent: 'center' }}>
          <Text
            style={[
              Typography.FONT_SEMIBOLD,
              { color: Colors.GRAY_700, fontSize: 18 },
            ]}
          >
            {transaction.productName}
          </Text>
          <Text
            style={[
              Typography.FONT_LIGHT,
              { color: Colors.GRAY_500, fontSize: 18 },
            ]}
          >
            {format(new Date(transaction.date), 'M/d')}{' '}
            {transaction.contactFullName}
          </Text>
        </View>
      </View>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <View
          style={{ width: 24, height: 24, paddingRight: 4, paddingBottom: 4 }}
        >
          <Icon svg={GoldenBirdCoin} />
        </View>
        <Text
          style={[
            Typography.FONT_MEDIUM,
            { fontSize: 18, color: Colors.GRAY_400 },
          ]}
        >
          {transaction.price.toString()}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default PremiumTransactionHistoryCard;
