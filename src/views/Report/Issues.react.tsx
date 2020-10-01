import React, { Dispatch } from 'react';
import { Text, View } from 'react-native';
import { Typography } from '@styles';
import { Button } from '@components';
import { AppStackParamList, Screens } from '@utils/Screens';
import { StackNavigationProp } from '@react-navigation/stack';
import i18n from '@i18n';
import { DeliveryReportTypes, Contact } from 'types';
import { AppState } from '@store/types';
import { connect } from 'react-redux';
import * as Segment from 'expo-analytics-segment';
import ReportStyles from './Report.styles';

type IssueScreenNavigationProp = StackNavigationProp<
  AppStackParamList,
  'Issues'
>;

interface Props {
  contact: Contact;
  navigation: IssueScreenNavigationProp;
}

const IssuesScreenBase: React.FC<Props> = (props: Props) => {
  return (
    <View style={ReportStyles.background}>
      <Text
        style={[
          Typography.FONT_SEMIBOLD,
          ReportStyles.question,
          { marginBottom: 10 },
        ]}
      >
        {i18n.t('IssuesScreen.hasYourLovedOneReceivedLetterPrefix')}
        {props.contact.firstName}
        {i18n.t('IssuesScreen.hasYourLovedOneReceivedLetter')}
      </Text>
      <Text
        style={[
          Typography.FONT_REGULAR,
          ReportStyles.description,
          { marginBottom: 50 },
        ]}
      >
        {i18n.t('IssuesScreen.letUsKnowIfThereIsAProblem')}
      </Text>
      <Button
        buttonText={i18n.t('IssuesScreen.yepTheyReceivedIt')}
        onPress={() => {
          props.navigation.navigate(Screens.IssuesDetail, {
            issue: DeliveryReportTypes.received,
          });
          Segment.track('Delivery Reporting - Received');
        }}
        containerStyle={ReportStyles.buttonReverseBlack}
        textStyle={[Typography.FONT_MEDIUM, { color: 'black' }]}
      />
      <Button
        buttonText={i18n.t('IssuesScreen.notSureYet')}
        onPress={() => {
          props.navigation.navigate(Screens.IssuesDetail, {
            issue: DeliveryReportTypes.unsure,
          });
          Segment.track('Delivery Reporting - Unknown');
        }}
        containerStyle={ReportStyles.buttonReverseBlack}
        textStyle={[Typography.FONT_MEDIUM, { color: 'black' }]}
      />
      <Button
        buttonText={i18n.t('IssuesScreen.notYetReceived')}
        onPress={() => {
          props.navigation.navigate(Screens.IssuesDetail, {
            issue: DeliveryReportTypes.notYetReceived,
          });
          Segment.track('Delivery Reporting - Not Received');
        }}
        containerStyle={ReportStyles.buttonReverseBlack}
        textStyle={[Typography.FONT_MEDIUM, { color: 'black' }]}
      />
    </View>
  );
};

const mapStateToProps = (state: AppState) => ({
  contact: state.contact.active,
});
const IssuesScreen = connect(mapStateToProps)(IssuesScreenBase);

export default IssuesScreen;
