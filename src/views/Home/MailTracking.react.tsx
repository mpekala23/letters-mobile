import React, { Dispatch } from 'react';
import { Linking, Text, ScrollView, View, Image } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { AppStackParamList } from '@navigations';
import { Button, LetterTracker, GrayBar, Icon } from '@components';
import { connect } from 'react-redux';
import { Colors, Typography } from '@styles';
import { AppState } from '@store/types';
import { TrackingEvent, MailStatus, Mail, MailTypes, Contact } from 'types';
import { format, addBusinessDays, differenceInBusinessDays } from 'date-fns';
import i18n from '@i18n';
import { NotifActionTypes, Notif } from '@store/Notif/NotifTypes';
import { handleNotif } from '@store/Notif/NotifiActions';
import ReturnedToSender from '@assets/views/LetterTracking/ReturnedToSender';

import * as Segment from 'expo-analytics-segment';

import Styles from './MailTracking.styles';

type MailTrackingScreenNavigationProp = StackNavigationProp<
  AppStackParamList,
  'MailTracking'
>;

interface Props {
  navigation: MailTrackingScreenNavigationProp;
  mail: Mail | null;
  contact: Contact;
  currentNotif: Notif | null;
  handleNotif: () => void;
}

function mapStatusToTrackerBarHeight(type?: string) {
  switch (type) {
    case MailStatus.InTransit:
      return '45%';
    case MailStatus.ProcessedForDelivery:
      return '65%';
    case MailStatus.Delivered:
      return '75%';
    default:
      return 0;
  }
}

class MailTrackingScreenBase extends React.Component<Props> {
  componentDidMount() {
    if (this.props.currentNotif) this.props.handleNotif();
  }

  render() {
    if (!this.props.mail) {
      this.props.navigation.navigate('SingleContact');
      return <View />;
    }
    const deliveryDate = format(
      this.props.mail.expectedDelivery
        ? this.props.mail.expectedDelivery
        : addBusinessDays(new Date(), 6),
      'MMM dd'
    );
    const chronologicalEvents = this.props.mail.trackingEvents
      ? this.props.mail.trackingEvents
      : [];
    let returnedToSender = false;
    const processedEvents = chronologicalEvents.filter(
      (event: TrackingEvent) =>
        event.name === MailStatus.ProcessedForDelivery &&
        differenceInBusinessDays(new Date(), event.date) > 3
    );
    if (processedEvents.length > 0) {
      // the mail has been processed for deliver for >= 3 days
      const trackingEvent: TrackingEvent = {
        id: -1,
        name: MailStatus.Delivered,
        location: {
          city: this.props.contact.facility
            ? this.props.contact.facility.city
            : '',
          state: this.props.contact.facility
            ? this.props.contact.facility.state
            : '',
          zip: this.props.contact.facility
            ? this.props.contact.facility.postal
            : '',
        },
        date: addBusinessDays(new Date(processedEvents[0].date), 3),
      };
      chronologicalEvents.push(trackingEvent);
    }
    const returnedEvents = chronologicalEvents.filter(
      (event: TrackingEvent) => event.name === MailStatus.ReturnedToSender
    );
    returnedToSender = returnedEvents.length > 0;

    const letterTracker =
      !returnedToSender &&
      chronologicalEvents?.map((trackingEvent: TrackingEvent) => {
        return (
          <LetterTracker trackingEvent={trackingEvent} key={trackingEvent.id} />
        );
      });

    const body = returnedToSender ? (
      <View style={{ alignItems: 'center', paddingTop: 24 }}>
        <Text
          style={[
            Typography.FONT_BOLD,
            Styles.headerText,
            { textAlign: 'center' },
          ]}
        >
          {i18n.t('LetterTrackingScreen.yourLetterWasReturnedToSender')}
        </Text>
        <Text style={[Typography.FONT_REGULAR, { color: Colors.GRAY_DARK }]}>
          {i18n.t('LetterTrackingScreen.possibleReason')}
        </Text>
        <Icon svg={ReturnedToSender} style={{ paddingTop: 240 }} />
        <Button
          reverse
          onPress={() => {
            Linking.openURL('https://m.me/teamameelio');
            Segment.track('In-App Reporting - Click on Contact Support');
          }}
          buttonText={i18n.t('LetterTrackingScreen.contactSupport')}
          textStyle={[Typography.FONT_BOLD, { fontSize: 14 }]}
          containerStyle={Styles.needHelpButton}
        />
        <GrayBar />
      </View>
    ) : (
      <View>
        <View style={{ paddingBottom: 12 }}>
          <Text style={[Typography.FONT_BOLD, Styles.headerText]}>
            {i18n.t('LetterTrackingScreen.letterTracking')}
          </Text>
          <Text style={[Typography.FONT_BOLD, Styles.baseText]}>
            {i18n.t('LetterTrackingScreen.estimatedArrival')}
          </Text>
          <Text
            style={[Typography.FONT_BOLD, Styles.baseText]}
            testID="deliveryDate"
          >
            {deliveryDate}
          </Text>
        </View>
        <GrayBar />
        <View style={{ paddingTop: 24 }}>
          <View
            style={{
              marginTop: 40,
              marginLeft: 14,
              height: mapStatusToTrackerBarHeight(
                this.props.mail.trackingEvents &&
                  this.props.mail.trackingEvents.length > 0
                  ? this.props.mail.trackingEvents[
                      this.props.mail.trackingEvents.length - 1
                    ].name
                  : undefined
              ),
              width: 7,
              backgroundColor: Colors.GRAY_LIGHT,
              position: 'absolute',
            }}
          />
          {letterTracker}
        </View>
        <Button
          reverse
          onPress={() => {
            this.props.navigation.navigate('SupportFAQ');
            Segment.track('In-App Reporting - Click on I Need Help');
          }}
          buttonText={i18n.t('LetterTrackingScreen.needHelp')}
          textStyle={[Typography.FONT_BOLD, { fontSize: 14 }]}
          containerStyle={Styles.needHelpButton}
        />
      </View>
    );
    return (
      <ScrollView
        keyboardShouldPersistTaps="handled"
        style={Styles.trueBackground}
      >
        {body}
        <Text style={[Typography.FONT_BOLD, Styles.headerText]}>
          {i18n.t('LetterTrackingScreen.letterContent')}
        </Text>
        <Text style={{ fontSize: 15 }}>{this.props.mail.content}</Text>
        {this.props.mail.type === MailTypes.Letter &&
        this.props.mail.image?.uri ? (
          <Image
            style={[
              Styles.trackingPhoto,
              {
                height: 275,
                width:
                  this.props.mail.image.width && this.props.mail.image.height
                    ? (this.props.mail.image.width /
                        this.props.mail.image.height) *
                      275
                    : 275,
              },
            ]}
            source={this.props.mail.image}
            testID="memoryLaneImage"
          />
        ) : null}
        {this.props.mail.type === MailTypes.Postcard && (
          <Image
            style={[
              Styles.trackingPhoto,
              {
                height: 275,
                width:
                  this.props.mail.design.image.width &&
                  this.props.mail.design.image.height
                    ? (this.props.mail.design.image.width /
                        this.props.mail.design.image.height) *
                      275
                    : 275,
              },
            ]}
            source={this.props.mail.design.image}
            testID="memoryLaneImage"
          />
        )}
        <View style={{ height: 40 }} />
      </ScrollView>
    );
  }
}

const mapStateToProps = (state: AppState) => ({
  contact: state.contact.active,
  mail: state.mail.active,
  currentNotif: state.notif.currentNotif,
});
const mapDispatchToProps = (dispatch: Dispatch<NotifActionTypes>) => ({
  handleNotif: () => dispatch(handleNotif()),
});
const MailTrackingScreen = connect(
  mapStateToProps,
  mapDispatchToProps
)(MailTrackingScreenBase);

export default MailTrackingScreen;
