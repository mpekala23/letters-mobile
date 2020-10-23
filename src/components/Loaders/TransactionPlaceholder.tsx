import React, { ReactElement } from 'react';
import ContentLoader, { Rect } from 'react-content-loader/native';
import { FlatList, View } from 'react-native';
import CardStyles from '@components/Card/Card.styles';

const TransactionPlaceholderItem = (): ReactElement => (
  <View
    style={[
      CardStyles.cardBase,
      CardStyles.shadow,
      CardStyles.transactionHistoryBackground,
    ]}
  >
    <View style={{ flex: 1, flexDirection: 'row' }}>
      <ContentLoader height={64} width={80} foregroundColor="#dbdbdb">
        <Rect x="0" y="0" rx="3" ry="3" width="64" height="64" />
      </ContentLoader>
      <View style={{ justifyContent: 'center' }}>
        <ContentLoader height={24} width={120} foregroundColor="#dbdbdb">
          <Rect x="0" y="6" rx="3" ry="3" width="120" height="24" />
        </ContentLoader>
        <ContentLoader height={24} width={120} foregroundColor="#dbdbdb">
          <Rect x="0" y="6" rx="3" ry="3" width="120" height="24" />
        </ContentLoader>
      </View>
    </View>
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      <ContentLoader height={36} width={72} foregroundColor="#dbdbdb">
        <Rect x="0" y="6" rx="3" ry="3" width="72" height="36" />
      </ContentLoader>
    </View>
  </View>
);

const TransactionPlaceholder = (): ReactElement => (
  <FlatList
    contentContainerStyle={{ paddingHorizontal: 16 }}
    data={['dummy1', 'dummy2', 'dummy3']}
    renderItem={() => {
      return <TransactionPlaceholderItem />;
    }}
    keyExtractor={(item) => item}
  />
);

export default TransactionPlaceholder;
