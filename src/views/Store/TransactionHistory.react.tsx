import i18n from '@i18n';
import { AppState } from '@store/types';
import { Typography } from '@styles';
import React, { Dispatch, useEffect } from 'react';
import { FlatList, Text, View } from 'react-native';
import { connect } from 'react-redux';
import { getPremiumTransactions, getStripeTransactions } from '@api';
import {
  PremiumTransactionHistoryCard,
  StripeTransactionHistoryCard,
} from '@components';
import TransactionPlaceholder from '@components/Loaders/TransactionPlaceholder';
import { EntityTypes, PremiumTransaction, StripeTransaction } from 'types';
import { checkIfLoading } from '@store/selectors';
import { StackNavigationProp } from '@react-navigation/stack';
import { AppStackParamList, Screens } from '@utils/Screens';
import { setActiveById as setActiveContactById } from '@store/Contact/ContactActions';
import { setActiveById as setActiveMailById } from '@store/Mail/MailActions';
import { MailActionTypes } from '@store/Mail/MailTypes';
import { ContactActionTypes } from '@store/Contact/ContactTypes';
import Sentry from 'sentry-expo';
import Styles from './TransactionHistory.styles';

type TransactionHistoryScreenNavigationProp = StackNavigationProp<
  AppStackParamList,
  Screens.TransactionHistory
>;

interface Props {
  premiumTransactions: PremiumTransaction[];
  stripeTransactions: StripeTransaction[];
  isLoadingPremiumTransactions: boolean;
  isLoadingStripeTransactions: boolean;
  navigation: TransactionHistoryScreenNavigationProp;
  setActiveContact: (id: number) => void;
  setActiveMail: (contactId: number, mailId: number) => void;
}

const TransactionHistoryBase: React.FC<Props> = ({
  premiumTransactions,
  stripeTransactions,
  isLoadingPremiumTransactions,
  isLoadingStripeTransactions,
  navigation,
  setActiveContact,
  setActiveMail,
}: Props) => {
  useEffect(() => {
    if (!isLoadingPremiumTransactions && !premiumTransactions.length)
      getPremiumTransactions().catch((err) => {
        Sentry.captureException(err);
      });
    if (!isLoadingStripeTransactions && !stripeTransactions.length)
      getStripeTransactions().catch((err) => {
        Sentry.captureException(err);
      });
  }, []);

  const calculateFamiliesHelped = () => {
    // TODO refactor this after stripe transactions are incorporated
    const PROFIT_PER_COIN = 0.05;
    const FAMILY_WEEKLY_COST = 0.9;
    const totalSpent = premiumTransactions
      .map((transaction) => transaction.price)
      .reduce((prev, curr) => prev + curr);
    return Math.round((totalSpent * PROFIT_PER_COIN) / FAMILY_WEEKLY_COST);
  };

  return (
    <View style={Styles.trueBackground}>
      <View style={Styles.helpedContainer}>
        <Text style={[Typography.FONT_SEMIBOLD, Styles.familiesHelpedText]}>
          {i18n.t('Premium.familiesHelped')}
        </Text>
        <Text style={[Typography.FONT_MEDIUM, Styles.familiesHelpedNumber]}>
          {calculateFamiliesHelped()}
        </Text>
      </View>
      <Text style={[Typography.FONT_SEMIBOLD, Styles.sectionHeadingText]}>
        {i18n.t('Premium.purchases')}
      </Text>
      {!isLoadingPremiumTransactions ? (
        <FlatList
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingHorizontal: 16 }}
          data={premiumTransactions}
          renderItem={({ item }) => {
            return (
              <PremiumTransactionHistoryCard
                transaction={item}
                onPress={() => {
                  setActiveContact(item.contactId);
                  setActiveMail(item.contactId, item.mailId);
                  navigation.navigate(Screens.MailTrackingStore);
                }}
              />
            );
          }}
        />
      ) : (
        <TransactionPlaceholder />
      )}
      <Text style={[Typography.FONT_SEMIBOLD, Styles.sectionHeadingText]}>
        {i18n.t('Premium.transactions')}
      </Text>
      {!isLoadingStripeTransactions ? (
        <FlatList
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingHorizontal: 16 }}
          data={stripeTransactions}
          renderItem={({ item }) => {
            return <StripeTransactionHistoryCard transaction={item} />;
          }}
        />
      ) : (
        <TransactionPlaceholder />
      )}
    </View>
  );
};

const mapStateToProps = (state: AppState) => ({
  premiumTransactions: state.premium.premiumTransactions,
  stripeTransactions: state.premium.stripeTransactions,
  isLoadingPremiumTransactions: checkIfLoading(
    state,
    EntityTypes.PremiumTransactions
  ),
  isLoadingStripeTransactions: checkIfLoading(
    state,
    EntityTypes.StripeTransactions
  ),
});

const mapDispatchToProps = (
  dispatch: Dispatch<ContactActionTypes | MailActionTypes>
) => ({
  setActiveContact: (id: number) => dispatch(setActiveContactById(id)),
  setActiveMail: (contactId: number, mailId: number) =>
    dispatch(setActiveMailById(contactId, mailId)),
});

const TransactionHistory = connect(
  mapStateToProps,
  mapDispatchToProps
)(TransactionHistoryBase);

export default TransactionHistory;
