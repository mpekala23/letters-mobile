import React from 'react';
import { Text, View, Linking } from 'react-native';
import { Typography } from '@styles';
import { Button } from '@components';
import { AppStackParamList } from '@navigations';
import { StackNavigationProp } from '@react-navigation/stack';
import i18n from '@i18n';
import { DeliveryReportTypes } from 'types';
import ReportStyles from './Report.styles';
import Styles from './SupportFAQ.styles';

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
      return "What's up?";
  }
}

// function mapIssueToFAQDetails(type: SupportFAQTypes) {
//   switch (type) {
//     case SupportFAQTypes.DeleteLetter:
//       return (
//         <Text>
//           {i18n.t('SupportFAQDetailScreen.cancelMyLetter1')}{' '}
//           <Emoji name="pensive" />.{' '}
//           {i18n.t('SupportFAQDetailScreen.cancelMyLetter2')}
//         </Text>
//       );
//     case SupportFAQTypes.NotArrived:
//       return i18n.t('SupportFAQDetailScreen.notYetArrived');
//     case SupportFAQTypes.WrongMailingAddress:
//       return i18n.t('SupportFAQDetailScreen.wrongMailingAddress');
//     case SupportFAQTypes.WrongReturnAddress:
//       return i18n.t('SupportFAQDetailScreen.wrongReturnAddress');
//     case SupportFAQTypes.TrackingNumber:
//       return (
//         <Text>
//           {i18n.t('SupportFAQDetailScreen.trackingNumber')}{' '}
//           <Emoji name="pensive" />
//         </Text>
//       );
//     case SupportFAQTypes.TrackingError:
//       return i18n.t('SupportFAQDetailScreen.trackingError');
//     default:
//       return i18n.t('SupportFAQDetailScreen.talkToAmeelio');
//   }
// }

// function defaultCTAButton(onPress: () => void, buttonText: string) {
//   return (
//     <Button
//       onPress={onPress}
//       buttonText={buttonText}
//       textStyle={{ fontSize: 18 }}
//       containerStyle={Styles.needHelpButton}
//     />
//   );
// }

// function mapIssueToFAQCTA(props: Props, type: SupportFAQTypes) {
//   switch (type) {
//     case SupportFAQTypes.DeleteLetter:
//       return null;
//     case SupportFAQTypes.NotArrived:
//       return null;
//     case SupportFAQTypes.WrongMailingAddress:
//       return defaultCTAButton(
//         () => props.navigation.navigate('UpdateContact'),
//         i18n.t('SupportFAQDetailScreen.updateAddress')
//       );
//     case SupportFAQTypes.WrongReturnAddress:
//       return defaultCTAButton(() => {
//         /* TO-DO: Navigate to update user profile screen */
//       }, i18n.t('SupportFAQDetailScreen.updateProfile'));
//     case SupportFAQTypes.TrackingNumber:
//       return null;
//     default:
//       return defaultCTAButton(async () => {
//         await Linking.openURL('https://m.me/teamameelio');
//       }, i18n.t('SupportFAQDetailScreen.reachOutToSupport'));
//   }
// }

const IssuesDetailScreen: React.FC<Props> = (props: Props) => {
  const { issue } = props.route.params;
  // console.log(issue);
  return (
    <View style={ReportStyles.background}>
      <Text style={[Typography.FONT_BOLD, ReportStyles.title]}>
        {/* {i18n.t('SupportFAQDetailScreen.talkToSomeoneAtAmeelio')} */}
        {mapIssueToDetailsTitle(issue)}
      </Text>
      <Text style={Styles.baseText}>{mapIssueToDetailsDescription(issue)}</Text>
      <View style={{ width: '100%' }} testID="callToActionButton">
        {/* {mapIssueToFAQCTA(props, issue)} */}
      </View>
    </View>
  );
};

export default IssuesDetailScreen;
