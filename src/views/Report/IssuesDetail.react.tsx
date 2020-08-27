import React from 'react';
import { Text, View, TextStyle, ViewStyle } from 'react-native';
import { Typography } from '@styles';
import { Button, Icon } from '@components';
import { AppStackParamList } from '@navigations';
import { StackNavigationProp } from '@react-navigation/stack';
import i18n from '@i18n';
import { DeliveryReportTypes, Screen } from 'types';
import LetterWithHeart from '@assets/views/Issues/LetterWithHeart';
import { onNativeShare } from '@utils';
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
      return i18n.t('IssuesDetailScreen.awesomeThanksForUsingOurService');
    case DeliveryReportTypes.unsure:
      return i18n.t('IssuesDetailScreen.weWillCheckInTwoDays');
    default:
      return i18n.t('IssuesDetailScreen.whatsUp');
  }
}

function mapIssueToDetailsDescription(type: DeliveryReportTypes) {
  switch (type) {
    case DeliveryReportTypes.received:
      return i18n.t('IssuesDetailScreen.weHopeYoullSendAnotherLetter');
    case DeliveryReportTypes.unsure:
      return i18n.t('IssuesDetailScreen.yourLetterIsOnItsWay');
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
    case DeliveryReportTypes.received:
      return defaultCTAButton(
        () =>
          onNativeShare(Screen.Delivery, i18n.t('IssuesDetailScreen.share')),
        i18n.t('IssuesDetailScreen.share'),
        ReportStyles.buttonTextReverse,
        ReportStyles.button
      );
    case DeliveryReportTypes.unsure:
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
    case DeliveryReportTypes.notYetReceived:
      return defaultCTAButton(
        () =>
          props.navigation.navigate('IssuesDetailSecondary', {
            issue: DeliveryReportTypes.haveNotAsked,
          }),
        i18n.t('IssuesDetailScreen.IHaventAskedMyLovedOne'),
        { fontSize: 15, color: 'black' },
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
    case DeliveryReportTypes.notYetReceived:
      return defaultCTAButton(
        () =>
          props.navigation.navigate('IssuesDetailSecondary', {
            issue: DeliveryReportTypes.haveNotReceived,
          }),
        i18n.t('IssuesDetailScreen.theyHaventReceivedLetter'),
        { fontSize: 15, color: 'black' },
        ReportStyles.buttonReverseBlack
      );
    default:
      return null;
  }
}

const mapIssueToVisual = (type: DeliveryReportTypes): JSX.Element => {
  switch (type) {
    case DeliveryReportTypes.received:
      return <Icon svg={LetterWithHeart} />;
    default:
      return <View />;
  }
};

const IssuesDetailScreen: React.FC<Props> = (props: Props) => {
  const { issue } = props.route.params;
  return (
    <View
      style={[
        ReportStyles.background,
        { backgroundColor: props.navigation ? undefined : '' },
      ]}
    >
      <Text style={[Typography.FONT_BOLD, ReportStyles.title]}>
        {mapIssueToDetailsTitle(issue)}
      </Text>
      <View style={{ marginTop: 32 }}>{mapIssueToVisual(issue)}</View>
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
