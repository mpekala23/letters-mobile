import i18n from '@i18n';
import { AppState } from '@store/types';
import { Typography } from '@styles';
import React, { useEffect } from 'react';
import { FlatList, Text, View } from 'react-native';
import { connect } from 'react-redux';
import { getPremiumTransactions } from '@api';
import { TransactionHistoryCard } from '@components';
import TransactionPlaceholder from '@components/Loaders/TransactionPlaceholder';
import { EntityTypes, Transaction } from 'types';
import { checkIfLoading } from '@store/selectors';
import Styles from './TransactionHistory.styles';

interface Props {
  familiesHelped: number;
  transactions: Transaction[];
  isLoadingTransactions: boolean;
}

const TransactionHistoryBase: React.FC<Props> = ({
  familiesHelped,
  transactions,
  isLoadingTransactions,
}: Props) => {
  useEffect(() => {
    if (!transactions.length) getPremiumTransactions();
  }, []);
  return (
    <View style={Styles.trueBackground}>
      <View style={Styles.helpedContainer}>
        <Text style={[Typography.FONT_MEDIUM, Styles.familiesHelpedText]}>
          {i18n.t('Premium.familiesHelped')}
        </Text>
        <Text style={[Typography.FONT_MEDIUM, Styles.familiesHelpedNumber]}>
          {familiesHelped.toString()}
        </Text>
      </View>
      {!isLoadingTransactions ? (
        <FlatList
          contentContainerStyle={{ paddingHorizontal: 16 }}
          data={transactions}
          renderItem={({ item }) => {
            return (
              <TransactionHistoryCard
                transaction={item}
                onPress={() => {
                  /* do nothing */
                }}
              />
            );
          }}
        />
      ) : (
        <FlatList
          contentContainerStyle={{ paddingHorizontal: 16 }}
          data={['dummy1', 'dummy2', 'dummy3']}
          renderItem={() => {
            return <TransactionPlaceholder />;
          }}
          keyExtractor={(item) => item}
        />
      )}
    </View>
  );
};

const mapStateToProps = (state: AppState) => ({
  familiesHelped: 10,
  transactions: state.premium.transactions,
  isLoadingTransactions: checkIfLoading(state, EntityTypes.Transactions),
});

const TransactionHistory = connect(mapStateToProps)(TransactionHistoryBase);

export default TransactionHistory;
