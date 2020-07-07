import React from 'react';
import { Text, View } from 'react-native';
import { Typography } from '@styles';
import { Button } from '@components';
import { AppStackParamList } from '@navigations';
import { StackNavigationProp } from '@react-navigation/stack';
import i18n from '@i18n';
import { DeliveryReportTypes } from 'types';
import { facebookShare } from '@api';
import { dropdownError } from '@components/Dropdown/Dropdown.react';
import ReportStyles from './Report.styles';

type IssuesDetailScreenNavigationProp = StackNavigationProp<
  AppStackParamList,
  'IssuesDetail'
>;

interface Props {
  navigation: IssuesDetailScreenNavigationProp;
  route: {
    params: { issue: DeliveryReportTypes };
  };
}

function mapIssueToDetailsTitle(type: DeliveryReportTypes) {
  switch (type) {
    case DeliveryReportTypes.received:
      return 'Awesome! Thanks for using our service :)';
    case DeliveryReportTypes.unsure:
      return "We'll check in with you again in two days.";
    default:
      return "What's up?";
  }
}

function mapIssueToDetailsDescription(type: DeliveryReportTypes) {
  switch (type) {
    case DeliveryReportTypes.received:
      return "We hope you'll send another letter soon!";
    case DeliveryReportTypes.unsure:
      return 'Your letter is on its way to your loved one! If you have questions in the meantime, reach out to us at team@ameelio.org';
    default:
      return '';
  }
}

const onShare = async () => {
  const ameelioUrl = 'letters.ameelio.org';
  const sharingUrl = `https://www.facebook.com/sharer/sharer.php?u=${ameelioUrl}`;
  try {
    await facebookShare(sharingUrl);
  } catch (err) {
    dropdownError({ message: i18n.t('Error.requestIncomplete') });
  }
};

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
    case DeliveryReportTypes.received:
      return defaultCTAButton(
        onShare,
        'Share on Facebook',
        ReportStyles.buttonTextReverse,
        ReportStyles.button
      );
    case DeliveryReportTypes.unsure:
      return defaultCTAButton(
        () => props.navigation.navigate('Home'),
        'Return home',
        ReportStyles.buttonTextReverse,
        ReportStyles.button
      );
    case DeliveryReportTypes.notYetReceived:
      return defaultCTAButton(
        () =>
          props.navigation.navigate('IssuesDetailSecondary', {
            issue: DeliveryReportTypes.haveNotAsked,
          }),
        "I haven't asked my loved one!",
        { fontSize: 14, color: 'black' },
        ReportStyles.buttonReverseBlack
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
    case DeliveryReportTypes.received:
      return defaultCTAButton(
        () => props.navigation.navigate('Home'),
        'Return home',
        ReportStyles.buttonText,
        ReportStyles.buttonReverse
      );
    case DeliveryReportTypes.notYetReceived:
      return defaultCTAButton(
        () =>
          props.navigation.navigate('IssuesDetailSecondary', {
            issue: DeliveryReportTypes.haveNotReceived,
          }),
        "They haven't received the letter yet",
        { fontSize: 14, color: 'black' },
        ReportStyles.buttonReverseBlack
      );
    default:
      return null;
  }
}

const IssuesDetailScreen: React.FC<Props> = (props: Props) => {
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

export default IssuesDetailScreen;
