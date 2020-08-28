import React from 'react';
import { Linking, Text, View, TextStyle, ViewStyle } from 'react-native';
import { Typography } from '@styles';
import { Button, Icon } from '@components';
import { AppStackParamList } from '@navigations';
import { StackNavigationProp } from '@react-navigation/stack';
import i18n from '@i18n';
import { DeliveryReportTypes, Facility, Contact } from 'types';
import { connect } from 'react-redux';
import { AppState } from '@store/types';
import LetterBox from '@assets/views/Issues/LetterBox';
import * as Segment from 'expo-analytics-segment';
import ReportStyles from './Report.styles';

type IssuesDetailSecondaryScreenNavigationProp = StackNavigationProp<
  AppStackParamList,
  'IssuesDetailSecondary'
>;

interface Props {
  navigation: IssuesDetailSecondaryScreenNavigationProp;
  contact: Contact;
  route: {
    params: { issue: DeliveryReportTypes };
  };
}

function mapIssueToDetailsTitle(
  facility: Facility | null,
  type: DeliveryReportTypes
) {
  switch (type) {
    case DeliveryReportTypes.haveNotAsked:
      return i18n.t('IssuesDetailScreen.weWillCheckInTwoDays');
    case DeliveryReportTypes.haveNotReceived:
      if (facility && facility.phone)
        return `${i18n.t('IssuesDetailScreen.wantToCheckWithFacility')} ${
          facility.name
        }?`;
      return i18n.t('IssuesDetailScreen.talkToSomeoneAtAmeelio');
    default:
      return '';
  }
}

function mapIssueToDetailsDescription(
  facility: Facility | null,
  type: DeliveryReportTypes
) {
  switch (type) {
    case DeliveryReportTypes.haveNotAsked:
      return i18n.t('IssuesDetailScreen.yourLetterIsOnItsWay');
    case DeliveryReportTypes.haveNotReceived:
      if (facility && facility.phone)
        return i18n.t('IssuesDetailScreen.waitCoupleDays');
      return i18n.t('IssuesDetailScreen.tryMessagingUsOnFacebook');
    default:
      return '';
  }
}

const mapIssueToVisual = (type: DeliveryReportTypes): JSX.Element => {
  switch (type) {
    case DeliveryReportTypes.haveNotAsked:
      return <Icon svg={LetterBox} />;
    default:
      return <View />;
  }
};

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
          if (props.contact.facility && props.contact.facility.phone) {
            Segment.trackWithProperties('Delivery Reporting - Call Facility', {
              facility: props.contact.facility?.name,
              facilityState: props.contact.facility?.state,
              facilityCity: props.contact.facility?.city,
            });
            Linking.openURL(`tel:${props.contact.facility.phone}`);
          } else {
            Segment.trackWithProperties(
              'Delivery Reporting - Message Support',
              {
                facility: props.contact.facility?.name,
                facilityState: props.contact.facility?.state,
                facilityCity: props.contact.facility?.city,
              }
            );
            Segment.track('Delivery Reporting - Call Facility');
            Linking.openURL('https://m.me/teamameelio');
          }
        },
        props.contact.facility && props.contact.facility.phone
          ? i18n.t('IssuesDetailScreen.callFacility')
          : i18n.t('IssuesDetailScreen.talkToSomeone'),
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
      if (props.contact.facility && props.contact.facility.phone) {
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
      }
      return null;
    default:
      return null;
  }
}

const IssuesDetailSecondaryScreenBase: React.FC<Props> = (props: Props) => {
  const { issue } = props.route.params;
  return (
    <View
      style={[
        ReportStyles.background,
        { backgroundColor: props.navigation ? undefined : '' },
      ]}
    >
      <Text style={[Typography.FONT_SEMIBOLD, ReportStyles.title]}>
        {mapIssueToDetailsTitle(props.contact.facility, issue)}
      </Text>
      <Text
        style={[Typography.BASE_TEXT, { textAlign: 'center', padding: 16 }]}
      >
        {mapIssueToDetailsDescription(props.contact.facility, issue)}
      </Text>
      <View style={{ marginVertical: 32 }}>{mapIssueToVisual(issue)}</View>
      <View style={{ width: '100%' }} testID="callToActionButton">
        {mapIssueToDetailsPrimaryCTA(props, issue)}
        {mapIssueToDetailsSecondaryCTA(props, issue)}
      </View>
    </View>
  );
};

const mapStateToProps = (state: AppState) => ({
  contact: state.contact.active,
});
const IssuesDetailSecondaryScreen = connect(mapStateToProps)(
  IssuesDetailSecondaryScreenBase
);

export default IssuesDetailSecondaryScreen;
