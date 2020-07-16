import React, { Dispatch } from 'react';
import { Text, ScrollView, View } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { AppStackParamList } from '@navigations';
import { Button, LetterTracker, GrayBar } from '@components';
import { connect } from 'react-redux';
import { Colors, Typography } from '@styles';
import { AppState } from '@store/types';
import { LetterTrackingEvent, LetterStatus, Letter } from 'types';
import moment from 'moment';
import i18n from '@i18n';
import { NotifActionTypes, Notif } from '@store/Notif/NotifTypes';
import { handleNotif } from '@store/Notif/NotifiActions';
import Styles from './LetterTracking.styles';

type LetterTrackingScreenNavigationProp = StackNavigationProp<
  AppStackParamList,
  'LetterTracking'
>;

interface Props {
  navigation: LetterTrackingScreenNavigationProp;
  letter: Letter | null;
  currentNotif: Notif | null;
  handleNotif: () => void;
}

function mapStatusToTrackerBarHeight(type?: string) {
  switch (type) {
    case LetterStatus.InTransit:
      return 70;
    case LetterStatus.InLocalArea:
      return 120;
    case LetterStatus.OutForDelivery:
      return 200;
    default:
      return 0;
  }
}

class LetterTrackingScreenBase extends React.Component<Props> {
  componentDidMount() {
    if (
      this.props.currentNotif &&
      this.props.currentNotif.screen === 'LetterTracking'
    )
      this.props.handleNotif();
  }

  render() {
    if (!this.props.letter) {
      this.props.navigation.navigate('SingleContact');
      return <View />;
    }
    const deliveryDate = moment(this.props.letter.expectedDeliveryDate).format(
      'MMM DD'
    );
    const chronologicalEvents = this.props.letter.trackingEvents
      ?.slice()
      .reverse();
    const letterTracker = chronologicalEvents?.map(
      (trackingEvent: LetterTrackingEvent) => {
        return (
          <LetterTracker trackingEvent={trackingEvent} key={trackingEvent.id} />
        );
      }
    );
    return (
      <View style={Styles.trueBackground}>
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
                  ? this.props.letter.trackingEvents[0].name
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
          }}
          buttonText={i18n.t('LetterTrackingScreen.needHelp')}
          textStyle={[Typography.FONT_BOLD, { fontSize: 14 }]}
          containerStyle={Styles.needHelpButton}
        />
        <Text style={[Typography.FONT_BOLD, Styles.headerText]}>
          {i18n.t('LetterTrackingScreen.letterContent')}
        </Text>
        <ScrollView keyboardShouldPersistTaps="handled">
          <Text style={{ fontSize: 15 }}>{this.props.letter.content}</Text>
        </ScrollView>
      </View>
    );
  }
}

const mapStateToProps = (state: AppState) => ({
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
