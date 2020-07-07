import React from 'react';
import { Text, View } from 'react-native';
import { Typography } from '@styles';
import { Button } from '@components';
import { AppStackParamList } from '@navigations';
import { StackNavigationProp } from '@react-navigation/stack';
import i18n from '@i18n';
import { DeliveryReportTypes } from 'types';
import ReportStyles from './Report.styles';

type IssuesDetailSecondaryScreenNavigationProp = StackNavigationProp<
  AppStackParamList,
  'IssuesDetailSecondary'
>;

interface Props {
  navigation: IssuesDetailSecondaryScreenNavigationProp;
  route: {
    params: { issue: DeliveryReportTypes };
  };
}

function mapIssueToDetailsTitle(type: DeliveryReportTypes) {
  switch (type) {
    case DeliveryReportTypes.haveNotAsked:
      return "We'll check in again in two days.";
    case DeliveryReportTypes.haveNotReceived:
      return 'Want to check with the facility?';
    default:
      return '';
  }
}

function mapIssueToDetailsDescription(type: DeliveryReportTypes) {
  switch (type) {
    case DeliveryReportTypes.haveNotAsked:
      return 'Your letter is on its way to your loved one! If you have questions in the meantime, reach out to us at team@ameelio.org';
    case DeliveryReportTypes.haveNotReceived:
      return 'Sometimes letters will be delayed at the facility. Click below to call and check in on your letter, or wait a couple more days.';
    default:
      return '';
  }
}

function defaultCTAButton(
  onPress: () => void,
  buttonText: string,
  textStyle: Record<string, unknown>,
  containerStyle: Record<string, unknown>
) {
  return (
    <Button
      onPress={onPress}
      buttonText={buttonText}
      textStyle={textStyle}
      containerStyle={containerStyle}
    />
  );
}

function mapIssueToDetailsPrimaryCTA(props: Props, type: DeliveryReportTypes) {
  switch (type) {
    case DeliveryReportTypes.haveNotAsked:
      return defaultCTAButton(
        () => props.navigation.navigate('Home'),
        'Return home',
        ReportStyles.buttonTextReverse,
        ReportStyles.button
      );
    case DeliveryReportTypes.haveNotReceived:
      return defaultCTAButton(
        () => {
          /* TO-DO: Navigate to call facility phone number */
        },
        'Call facility',
        ReportStyles.buttonTextReverse,
        ReportStyles.button
      );
    default:
      return null;
  }
}

function mapIssueToDetailsSecondaryCTA(
  props: Props,
  type: DeliveryReportTypes
) {
  switch (type) {
    case DeliveryReportTypes.haveNotReceived:
      return defaultCTAButton(
        () => props.navigation.navigate('Home'),
        "I'll wait",
        ReportStyles.buttonText,
        ReportStyles.buttonReverse
      );
    default:
      return null;
  }
}

const IssuesDetailSecondaryScreen: React.FC<Props> = (props: Props) => {
  const { issue } = props.route.params;
  return (
    <View style={ReportStyles.background}>
      <Text style={[Typography.FONT_BOLD, ReportStyles.title]}>
        {mapIssueToDetailsTitle(issue)}
      </Text>
      <Text
        style={[Typography.BASE_TEXT, { textAlign: 'center', padding: 16 }]}
      >
        {mapIssueToDetailsDescription(issue)}
      </Text>
      <View style={{ width: '100%' }} testID="callToActionButton">
        {mapIssueToDetailsPrimaryCTA(props, issue)}
        {mapIssueToDetailsSecondaryCTA(props, issue)}
      </View>
    </View>
  );
};

export default IssuesDetailSecondaryScreen;
