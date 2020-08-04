import React, { Dispatch } from 'react';
import { Linking, Text, ScrollView, View, Image } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { AppStackParamList } from '@navigations';
import { Button, LetterTracker, GrayBar, Icon } from '@components';
import { connect } from 'react-redux';
import { Colors, Typography } from '@styles';
import { AppState } from '@store/types';
import { LetterTrackingEvent, LetterStatus, Letter } from 'types';
import { format, addBusinessDays, differenceInBusinessDays } from 'date-fns';
import i18n from '@i18n';
import { NotifActionTypes, Notif } from '@store/Notif/NotifTypes';
import { handleNotif } from '@store/Notif/NotifiActions';
import { Contact } from '@store/Contact/ContactTypes';
import ReturnedToSender from '@assets/views/LetterTracking/ReturnedToSender';

import * as Segment from 'expo-analytics-segment';

import Styles from './LetterTracking.styles';

type LetterTrackingScreenNavigationProp = StackNavigationProp<
  AppStackParamList,
  'LetterTracking'
>;

interface Props {
  navigation: LetterTrackingScreenNavigationProp;
  letter: Letter | null;
  contact: Contact;
  currentNotif: Notif | null;
  handleNotif: () => void;
}

function mapStatusToTrackerBarHeight(type?: string) {
  switch (type) {
    case LetterStatus.InTransit:
      return '30%';
    case LetterStatus.ProcessedForDelivery:
      return '65%';
    case LetterStatus.Delivered:
      return '75%';
    default:
      return 0;
  }
}

class LetterTrackingScreenBase extends React.Component<Props> {
  componentDidMount() {
    if (this.props.currentNotif) this.props.handleNotif();
  }

  render() {
    if (!this.props.letter) {
      this.props.navigation.navigate('SingleContact');
      return <View />;
    }
    const deliveryDate = format(
      this.props.letter.expectedDeliveryDate
        ? this.props.letter.expectedDeliveryDate
        : addBusinessDays(new Date(), 6),
      'MMM dd'
    );
    const chronologicalEvents = this.props.letter.trackingEvents;
    let returnedToSender = false;
    if (chronologicalEvents) {
      for (let ix = 0; ix < chronologicalEvents.length; ix += 1) {
        // Append 'Delivered' to list of tracking events if processed + 3 days
        if (
          chronologicalEvents[ix].name === LetterStatus.ProcessedForDelivery &&
          differenceInBusinessDays(new Date(), chronologicalEvents[ix].date) > 3
        ) {
          const trackingEvent: LetterTrackingEvent = {
            id: -1,
            name: LetterStatus.Delivered,
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
            date: addBusinessDays(new Date(chronologicalEvents[ix].date), 3),
          };
          chronologicalEvents.push(trackingEvent);
        }
        if (chronologicalEvents[ix].name === LetterStatus.ReturnedToSender) {
          returnedToSender = true;
        }
      }
    }
    const letterTracker =
      !returnedToSender &&
      chronologicalEvents?.map((trackingEvent: LetterTrackingEvent) => {
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
                this.props.letter.trackingEvents &&
                  this.props.letter.trackingEvents.length > 0
                  ? this.props.letter.trackingEvents[
                      this.props.letter.trackingEvents.length - 1
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
        <Text style={{ fontSize: 15 }}>{this.props.letter.content}</Text>
        {this.props.letter.photo?.uri ? (
          <Image
            style={[
              Styles.trackingPhoto,
              {
                height: 275,
                width:
                  this.props.letter.photo.width &&
                  this.props.letter.photo.height
                    ? (this.props.letter.photo.width /
                        this.props.letter.photo.height) *
                      275
                    : 275,
              },
            ]}
            source={this.props.letter.photo}
            testID="memoryLaneImage"
          />
        ) : null}
        <View style={{ height: 40 }} />
      </ScrollView>
    );
  }
}

const mapStateToProps = (state: AppState) => ({
  contact: state.contact.active,
  letter: state.letter.active,
  currentNotif: state.notif.currentNotif,
});
const mapDispatchToProps = (dispatch: Dispatch<NotifActionTypes>) => ({
  handleNotif: () => dispatch(handleNotif()),
});
const LetterTrackingScreen = connect(
  mapStateToProps,
  mapDispatchToProps
)(LetterTrackingScreenBase);

export default LetterTrackingScreen;
