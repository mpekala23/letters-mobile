import React from 'react';
import { Text, View, TextStyle, ViewStyle } from 'react-native';
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
      return i18n.t('IssuesDetailScreen.weWillCheckInTwoDays');
    case DeliveryReportTypes.haveNotReceived:
      return i18n.t('IssuesDetailScreen.wantToCheckWithFacility');
    default:
      return '';
  }
}

function mapIssueToDetailsDescription(type: DeliveryReportTypes) {
  switch (type) {
    case DeliveryReportTypes.haveNotAsked:
      return i18n.t('IssuesDetailScreen.yourLetterIsOnItsWay');
    case DeliveryReportTypes.haveNotReceived:
      return i18n.t('IssuesDetailScreen.waitCoupleDays');
    default:
      return '';
  }
}

function defaultCTAButton(
  onPress: () => void,
  buttonText: string,
  textStyle: TextStyle,
  containerStyle: ViewStyle
) {
  return (
    <Button
      onPress={onPress}
      buttonText={buttonText}
      textStyle={[Typography.FONT_MEDIUM, textStyle]}
      containerStyle={containerStyle}
    />
  );
}

function mapIssueToDetailsPrimaryCTA(props: Props, type: DeliveryReportTypes) {
  switch (type) {
    case DeliveryReportTypes.haveNotAsked:
      return defaultCTAButton(
        () => {
          props.navigation.reset({
            index: 0,
            routes: [{ name: 'ContactSelector' }],
          });
        },
        i18n.t('IssuesDetailScreen.returnHome'),
        ReportStyles.buttonText,
        ReportStyles.buttonReverse
      );
    case DeliveryReportTypes.haveNotReceived:
      return defaultCTAButton(
        () => {
          /* TO-DO: Navigate to call facility phone number */
        },
        i18n.t('IssuesDetailScreen.callFacility'),
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
        () => {
          props.navigation.reset({
            index: 0,
            routes: [{ name: 'ContactSelector' }],
          });
        },
        i18n.t('IssuesDetailScreen.IllWait'),
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
