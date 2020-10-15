import React, { Dispatch } from 'react';
import { Linking, Text, ScrollView, View, Animated } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { AppStackParamList, Screens } from '@utils/Screens';
import {
  Button,
  LetterTracker,
  GrayBar,
  Icon,
  ProfilePic,
  DisplayImage,
} from '@components';
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
  EntityTypes,
  Image,
} from 'types';
import { format } from 'date-fns';
import i18n from '@i18n';
import ReturnedToSender from '@assets/views/MailTracking/ReturnedToSender';
import DeliveryTruck from '@assets/views/MailTracking/DeliveryTruck';
import * as Segment from 'expo-analytics-segment';
import { User } from '@store/User/UserTypes';
import { WINDOW_WIDTH, ETA_PROCESSED_TO_DELIVERED } from '@utils';
import { differenceInBusinessDays } from 'date-fns/esm';
import { checkIfLoading } from '@store/selectors';
import TrackingEventsPlaceholder from '@components/Loaders/TrackingEventsPlaceholder';
import { MailActionTypes } from '@store/Mail/MailTypes';
import { setMailImages } from '@store/Mail/MailActions';
import Styles from './MailTracking.styles';

type MailTrackingScreenNavigationProp = StackNavigationProp<
  AppStackParamList,
  'MailTracking'
>;

interface Props {
  navigation: MailTrackingScreenNavigationProp;
  mail: Mail | null;
  contact: Contact;
  user: User;
  isLoadingMailDetail: boolean;
  updateMailImages: (
    images: Image[],
    contactId: number,
    mailId: number
  ) => void;
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

  componentDidUpdate() {
    if (!this.props.mail) this.props.navigation.pop();
  }

  render() {
    const { mail, user, contact, isLoadingMailDetail } = this.props;
    const getTruckStoppingPoint = (): number => {
      switch (mail?.status) {
        case MailStatus.Created:
          return 0;
        case MailStatus.Mailed:
          return (WINDOW_WIDTH / 8) * 1;
        case MailStatus.InTransit:
          return (WINDOW_WIDTH / 8) * 2;
        case MailStatus.InLocalArea:
          return (WINDOW_WIDTH / 8) * 2.75;
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
      return <View />;
    }

    const genDeliveryTruckCard = (): JSX.Element => {
      startAnimation();
      return (
        <View style={[Styles.cardBackground]}>
          <Text style={[Typography.FONT_SEMIBOLD, { fontSize: 18 }]}>
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
                    Typography.FONT_SEMIBOLD,
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
                  style={[Typography.FONT_SEMIBOLD, { fontSize: 16 }]}
                  testID="deliveryDate"
                >
                  {format(new Date(mail.expectedDelivery), 'MM/dd')}
                </Text>
              </View>
            </View>
          )}
          <View style={[Styles.endpointsContainer]}>
            <View>
              <Text
                style={[Typography.FONT_SEMIBOLD, Styles.endpointCityLabel]}
              >
                {user.city}
              </Text>
              <Text style={[Styles.endpointDate]}>
                {format(new Date(mail.dateCreated), 'MM/dd')}
              </Text>
            </View>

            <View>
              <Text
                style={[Typography.FONT_SEMIBOLD, Styles.endpointCityLabel]}
              >
                {contact.facility.name}
              </Text>
              <Text style={[{ textAlign: 'right' }, Styles.endpointDate]}>
                {format(new Date(mail.expectedDelivery), 'MM/dd')}
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

      if (isLoadingMailDetail)
        return (
          <View style={[Styles.cardBackground]}>
            <TrackingEventsPlaceholder />
          </View>
        );

      const createdTrack: TrackingEvent = {
        id: -1,
        name: 'Created',
        location: { city: user.city, zip: user.postal, state: user.state },
        date: new Date(mail.dateCreated),
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

      const deliveredTrack =
        processedTrack &&
        Math.abs(differenceInBusinessDays(processedTrack.date, new Date())) >=
          ETA_PROCESSED_TO_DELIVERED
          ? {
              id: -2,
              name: MailStatus.Delivered,
              location: {
                city: this.props.contact.facility.name,
                zip: this.props.contact.facility.postal,
                state: this.props.contact.facility.state,
              },
              date: processedTrack.date,
            }
          : undefined;

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
            trackingEvent={deliveredTrack}
            type={MailStatus.Delivered}
          />
        </View>
      );
    };

    const body = returnedTrack ? (
      <View style={{ alignItems: 'center', paddingTop: 24 }}>
        <Text
          style={[
            Typography.FONT_SEMIBOLD,
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
          textStyle={[Typography.FONT_SEMIBOLD, { fontSize: 14 }]}
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
            <Text style={[Typography.FONT_SEMIBOLD, Styles.headerText]}>
              {i18n.t('MailTrackingScreen.letterTracking')}
            </Text>
            <Button
              reverse
              onPress={() => {
                this.props.navigation.navigate(Screens.SupportFAQ);
                Segment.track('In-App Reporting - Click on I Need Help');
              }}
              buttonText={i18n.t('MailTrackingScreen.needHelp')}
              textStyle={[Typography.FONT_SEMIBOLD, { fontSize: 14 }]}
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
          <Text style={[Typography.FONT_SEMIBOLD, Styles.headerText]}>
            {i18n.t('MailTrackingScreen.letterContent')}
          </Text>
          <Text style={{ fontSize: 15 }}>{mail.content}</Text>
          {mail.type === MailTypes.Letter && (
            <DisplayImage
              images={mail.images}
              heightLetter={160}
              updateImages={(images) => {
                this.props.updateMailImages(images, contact.id, mail.id);
              }}
            />
          )}
          {mail.type === MailTypes.Postcard && (
            <DisplayImage
              images={[mail.design.image]}
              isPostcard
              paddingPostcard={20}
              updateImages={(images) => {
                this.props.updateMailImages(images, contact.id, mail.id);
              }}
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
  user: state.user.user,
  isLoadingMailDetail: checkIfLoading(state, EntityTypes.MailDetail),
});

const mapDispatchToProps = (dispatch: Dispatch<MailActionTypes>) => ({
  updateMailImages: (images: Image[], contactId: number, mailId: number) =>
    dispatch(setMailImages(images, contactId, mailId)),
});

const MailTrackingScreen = connect(
  mapStateToProps,
  mapDispatchToProps
)(MailTrackingScreenBase);

export default MailTrackingScreen;
