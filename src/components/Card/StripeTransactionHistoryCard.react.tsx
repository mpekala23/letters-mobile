import React from 'react';
import { Text, View } from 'react-native';
import { Colors, Typography } from '@styles';
import { StripeTransaction } from 'types';
import Icon from '@components/Icon/Icon.react';
import GoldenBirdCoin from '@assets/views/Premium/GoldenBirdCoin';
import { format } from 'date-fns';
import AsyncImage from '@components/AsyncImage/AsyncImage.react';
import CardStyles from './Card.styles';

interface Props {
  transaction: StripeTransaction;
}

const StripeTransactionHistoryCard: React.FC<Props> = ({
  transaction,
}: Props) => {
  return (
    <View
      style={[CardStyles.cardBase, CardStyles.transactionHistoryBackground]}
    >
      <View style={{ flex: 1, flexDirection: 'row' }}>
        <AsyncImage
          source={transaction.pack.image}
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
            {transaction.pack.name}
          </Text>
          <Text
            style={[
              Typography.FONT_LIGHT,
              { color: Colors.GRAY_500, fontSize: 18 },
            ]}
          >
            {format(new Date(transaction.date), 'M/d')}{' '}
          </Text>
        </View>
      </View>
      <View style={{ justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <Text
          style={[
            Typography.FONT_MEDIUM,
            { fontSize: 18, color: Colors.GRAY_400 },
          ]}
        >
          -${transaction.pack.price.toString()}
        </Text>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text
            style={[
              Typography.FONT_MEDIUM,
              { fontSize: 18, color: Colors.GRAY_400, paddingRight: 4 },
            ]}
          >
            +
          </Text>
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
            {transaction.pack.coins.toString()}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default StripeTransactionHistoryCard;
