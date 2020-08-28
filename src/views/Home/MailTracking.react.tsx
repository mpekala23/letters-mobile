import React, { Dispatch } from 'react';
import { Linking, Text, ScrollView, View, Image, Animated } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { AppStackParamList } from '@navigations';
import { Button, LetterTracker, GrayBar, Icon, ProfilePic } from '@components';
import { connect } from 'react-redux';
import { Colors, Typography } from '@styles';
import { AppState } from '@store/types';
import {
  TrackingEvent,
  MailStatus,
  Mail,
  MailTypes,
  Contact,
  ProfilePicTypes,
} from 'types';
import { format, addBusinessDays } from 'date-fns';
import i18n from '@i18n';
import { NotifActionTypes, Notif } from '@store/Notif/NotifTypes';
import { handleNotif } from '@store/Notif/NotifiActions';
import ReturnedToSender from '@assets/views/MailTracking/ReturnedToSender';
import DeliveryTruck from '@assets/views/MailTracking/DeliveryTruck';

import * as Segment from 'expo-analytics-segment';

import { User } from '@store/User/UserTypes';
import { WINDOW_WIDTH } from '@utils';
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
  user: User;
}

interface State {
  animation: Animated.Value;
}

class MailTrackingScreenBase extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      animation: new Animated.Value(0),
    };
  }

  componentDidMount() {
    if (this.props.currentNotif) this.props.handleNotif();
  }

  render() {
    const { mail, user, contact } = this.props;

    const getTruckStoppingPoint = (): number => {
      switch (mail?.status) {
        case MailStatus.Created:
          return 0;
        case MailStatus.Mailed:
          return (WINDOW_WIDTH / 8) * 1;
        case MailStatus.InTransit:
          return (WINDOW_WIDTH / 8) * 2;
        case MailStatus.ProcessedForDelivery:
          return (WINDOW_WIDTH / 8) * 3.5;
        case MailStatus.Delivered:
          return (WINDOW_WIDTH / 8) * 5.5;
        default:
          return 0;
      }
    };

    const startAnimation = () => {
      Animated.timing(this.state.animation, {
        toValue: getTruckStoppingPoint(),
        duration: 2000,
        useNativeDriver: true,
      }).start();
    };

    const transformStyle = {
      transform: [
        {
          translateX: this.state.animation,
        },
      ],
    };

    if (!mail) {
      this.props.navigation.navigate('SingleContact');
      return <View />;
    }
    const deliveryDate = format(
      mail.expectedDelivery
        ? mail.expectedDelivery
        : addBusinessDays(new Date(), 6),
      'MMM dd'
    );

    const genDeliveryTruckCard = (): JSX.Element => {
      startAnimation();
      return (
        <View style={[Styles.cardBackground]}>
          <Text style={[Typography.FONT_BOLD, { fontSize: 18 }]}>
            <Text>Status: </Text>
            {mail.status}
          </Text>
          {mail.status !== MailStatus.Delivered && (
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginVertical: 8,
              }}
            >
              <View style={Styles.uspsCircleBackground}>
                <Text
                  style={[
                    {
                      color: Colors.AMEELIO_WHITE,
                    },
                    Typography.FONT_BOLD,
                  ]}
                >
                  USPS
                </Text>
              </View>
              <View>
                <Text style={[Styles.estimatedDeliveryLabel]}>
                  {i18n.t('MailTrackingScreen.estimatedArrival')}
                </Text>
                <Text
                  style={[Typography.FONT_BOLD, { fontSize: 16 }]}
                  testID="deliveryDate"
                >
                  {deliveryDate}
                </Text>
              </View>
            </View>
          )}
          <View style={[Styles.endpointsContainer]}>
            <View>
              <Text style={[Typography.FONT_BOLD, Styles.endpointCityLabel]}>
                {user.city}
              </Text>
              <Text style={[Styles.endpointDate]}>
                {format(mail.dateCreated, 'MM/dd')}
              </Text>
            </View>

            <View>
              <Text style={[Typography.FONT_BOLD, Styles.endpointCityLabel]}>
                {contact.facility.name}
              </Text>
              <Text style={[{ textAlign: 'right' }, Styles.endpointDate]}>
                {format(mail.expectedDelivery, 'MM/dd')}
              </Text>
            </View>
          </View>
          <View
            style={{
              marginTop: 16,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <ProfilePic
              firstName={user.firstName}
              lastName={user.lastName}
              imageUri={user.photo?.uri}
              type={ProfilePicTypes.Avatar}
            />

            <Animated.View style={[Styles.animatedTruck, transformStyle]}>
              <Icon svg={DeliveryTruck} style={{ margin: 12 }} />
            </Animated.View>
            <View
              style={{
                marginHorizontal: 8,
                width: '75%',
                height: 4,
                backgroundColor: Colors.BLACK_200,
              }}
            />
            <ProfilePic
              firstName={contact.firstName}
              lastName={contact.lastName}
              imageUri={contact.image?.uri}
              type={ProfilePicTypes.Avatar}
            />
          </View>
        </View>
      );
    };

    const chronologicalEvents = mail.trackingEvents ? mail.trackingEvents : [];
    const returnedTrack = chronologicalEvents.find(
      (e: TrackingEvent) => e.name === MailStatus.ReturnedToSender
    );

    const genTimelineComponent = (): JSX.Element => {
      if (returnedTrack) return <View />;

      const createdTrack: TrackingEvent = {
        id: -1,
        name: 'Created',
        location: { city: user.city, zip: user.postal, state: user.state },
        date: mail.dateCreated,
      };

      const mailedTrack = chronologicalEvents.find(
        (e: TrackingEvent) => e.name === MailStatus.Mailed
      );
      const inTransitTrack = chronologicalEvents.find(
        (e: TrackingEvent) => e.name === MailStatus.InTransit
      );
      const processedTrack = chronologicalEvents.find(
        (e: TrackingEvent) => e.name === MailStatus.ProcessedForDelivery
      );

      return (
        <View style={[Styles.cardBackground]}>
          <LetterTracker
            trackingEvent={createdTrack}
            type={MailStatus.Created}
          />
          <LetterTracker trackingEvent={mailedTrack} type={MailStatus.Mailed} />
          <LetterTracker
            trackingEvent={inTransitTrack}
            type={MailStatus.InTransit}
          />
          <LetterTracker
            trackingEvent={processedTrack}
            type={MailStatus.ProcessedForDelivery}
          />
          <LetterTracker
            trackingEvent={processedTrack}
            type={MailStatus.Delivered}
          />
        </View>
      );
    };

    const body = returnedTrack ? (
      <View style={{ alignItems: 'center', paddingTop: 24 }}>
        <Text
          style={[
            Typography.FONT_BOLD,
            Styles.headerText,
            { textAlign: 'center' },
          ]}
        >
          {i18n.t('MailTrackingScreen.yourLetterWasReturnedToSender')}
        </Text>
        <Text style={[Typography.FONT_REGULAR, { color: Colors.GRAY_500 }]}>
          {i18n.t('MailTrackingScreen.possibleReason')}
        </Text>
        <Icon svg={ReturnedToSender} style={{ paddingTop: 240 }} />
        <Button
          reverse
          onPress={() => {
            Linking.openURL('https://m.me/teamameelio');
            Segment.track('In-App Reporting - Click on Contact Support');
          }}
          buttonText={i18n.t('MailTrackingScreen.contactSupport')}
          textStyle={[Typography.FONT_BOLD, { fontSize: 14 }]}
          containerStyle={Styles.needHelpButton}
        />
        <GrayBar />
      </View>
    ) : (
      <View>
        <View style={{ paddingBottom: 12 }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Text style={[Typography.FONT_BOLD, Styles.headerText]}>
              {i18n.t('MailTrackingScreen.letterTracking')}
            </Text>
            <Button
              reverse
              onPress={() => {
                this.props.navigation.navigate('SupportFAQ');
                Segment.track('In-App Reporting - Click on I Need Help');
              }}
              buttonText={i18n.t('MailTrackingScreen.needHelp')}
              textStyle={[Typography.FONT_BOLD, { fontSize: 14 }]}
              containerStyle={Styles.needHelpButton}
            />
          </View>
        </View>
        {genDeliveryTruckCard()}
        <GrayBar />
        {genTimelineComponent()}
      </View>
    );
    return (
      <ScrollView
        keyboardShouldPersistTaps="handled"
        style={Styles.trueBackground}
      >
        {body}
        <View style={[Styles.cardBackground, { marginTop: 16 }]}>
          <Text style={[Typography.FONT_BOLD, Styles.headerText]}>
            {i18n.t('MailTrackingScreen.letterContent')}
          </Text>
          <Text style={{ fontSize: 15 }}>{mail.content}</Text>
          {mail.type === MailTypes.Letter && mail.image?.uri ? (
            <Image
              style={[
                Styles.trackingPhoto,
                {
                  height: 275,
                  width:
                    mail.image.width && mail.image.height
                      ? (mail.image.width / mail.image.height) * 275
                      : 275,
                },
              ]}
              source={mail.image}
              testID="memoryLaneImage"
            />
          ) : null}
          {mail.type === MailTypes.Postcard && (
            <Image
              style={[
                Styles.trackingPhoto,
                {
                  height: 275,
                  width:
                    mail.design.image.width && mail.design.image.height
                      ? (mail.design.image.width / mail.design.image.height) *
                        275
                      : 275,
                },
              ]}
              source={mail.design.image}
              testID="memoryLaneImage"
            />
          )}
          <View style={{ height: 40 }} />
        </View>
      </ScrollView>
    );
  }
}

const mapStateToProps = (state: AppState) => ({
  contact: state.contact.active,
  mail: state.mail.active,
  currentNotif: state.notif.currentNotif,
  user: state.user.user,
});
const mapDispatchToProps = (dispatch: Dispatch<NotifActionTypes>) => ({
  handleNotif: () => dispatch(handleNotif()),
});
const MailTrackingScreen = connect(
  mapStateToProps,
  mapDispatchToProps
)(MailTrackingScreenBase);

export default MailTrackingScreen;
