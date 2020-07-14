import React from 'react';
import { Text, View } from 'react-native';
import { Typography } from '@styles';
import { Button } from '@components';
import { AppStackParamList } from '@navigations';
import { StackNavigationProp } from '@react-navigation/stack';
import i18n from '@i18n';
import { DeliveryReportTypes } from 'types';
import ReportStyles from './Report.styles';

type IssueScreenNavigationProp = StackNavigationProp<
  AppStackParamList,
  'Issues'
>;

interface Props {
  navigation: IssueScreenNavigationProp;
}

const IssuesScreen: React.FC<Props> = (props: Props) => {
  return (
    <View style={ReportStyles.background}>
      <Text
        style={[
          Typography.FONT_BOLD,
          ReportStyles.question,
          { marginBottom: 10 },
        ]}
      >
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
          props.navigation.navigate('IssuesDetail', {
            issue: DeliveryReportTypes.received,
          });
        }}
        containerStyle={ReportStyles.buttonReverse}
        textStyle={[Typography.FONT_MEDIUM, ReportStyles.buttonText]}
      />
      <Button
        buttonText={i18n.t('IssuesScreen.notSureYet')}
        onPress={() => {
          props.navigation.navigate('IssuesDetail', {
            issue: DeliveryReportTypes.unsure,
          });
        }}
        containerStyle={ReportStyles.buttonReverse}
        textStyle={[Typography.FONT_MEDIUM, ReportStyles.buttonText]}
      />
      <Button
        buttonText={i18n.t('IssuesScreen.notYetReceived')}
        onPress={() => {
          props.navigation.navigate('IssuesDetail', {
            issue: DeliveryReportTypes.notYetReceived,
          });
        }}
        containerStyle={ReportStyles.buttonReverse}
        textStyle={[Typography.FONT_MEDIUM, ReportStyles.buttonText]}
      />
    </View>
  );
};

export default IssuesScreen;
