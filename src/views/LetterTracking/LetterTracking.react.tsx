import React from 'react';
import { Text, ScrollView, View } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { AppStackParamList } from 'navigations';
import { Button, LetterTracker, LetterStatusCard } from '@components';
import { connect } from 'react-redux';
import { Colors, Typography } from '@styles';
import { AppState } from '@store/types';
import { Letter } from '@store/Letter/LetterTypes';
import { LetterTrackingEvent, LetterStatus } from 'types';
import moment from 'moment';
import Styles from './LetterTracking.styles';

type LetterTrackingScreenNavigationProp = StackNavigationProp<
  AppStackParamList,
  'LetterTracking'
>;

interface Props {
  navigation: LetterTrackingScreenNavigationProp;
  letter: Letter;
}

function mapStatusToTrackerBar(type: LetterStatus) {
  switch (type) {
    case LetterStatus.InTransit:
      return Styles.inTransitBar;
    case LetterStatus.InLocalArea:
      return Styles.localAreaBar;
    case LetterStatus.OutForDelivery:
      return Styles.outForDeliveryBar;
    default:
      return {};
  }
}

const LetterTrackingScreenBase: React.FC<Props> = (props: Props) => {
  const deliveryDate = moment(
    props.letter.trackingEvents.expectedDeliveryDate
  ).format('MMM DD');
  const chronologicalEvents = [...props.letter.trackingEvents].reverse();
  const letterTracker = chronologicalEvents.map(
    (trackingEvent: LetterTrackingEvent) => {
      return (
        <LetterTracker trackingEvent={trackingEvent} key={trackingEvent.id} />
      );
    }
  );
  return (
    <View style={Styles.trueBackground}>
      <View style={{ alignItems: 'center' }}>
        <Text
          style={[
            Typography.FONT_BOLD,
            {
              color: Colors.AMEELIO_BLACK,
              fontSize: 20,
              paddingBottom: 4,
            },
          ]}
        >
          Letter tracking
        </Text>
        <Text
          style={[
            Typography.FONT_BOLD,
            {
              color: Colors.AMEELIO_BLACK,
              fontSize: 14,
            },
          ]}
        >
          Your letter is estimated to arrive on {deliveryDate}
        </Text>
      </View>
      <View style={{ paddingTop: 56 }}>
        <View
          style={mapStatusToTrackerBar(props.letter.trackingEvents[0].name)}
        />
        {letterTracker}
      </View>
      <Button
        onPress={() => {
          /* To-do: Navigate to in-app reporting flow */
        }}
        buttonText="I need help"
        textStyle={{ fontSize: 14 }}
        containerStyle={Styles.needHelpButton}
      />
      <Text
        style={[
          Typography.FONT_BOLD,
          {
            color: Colors.AMEELIO_BLACK,
            fontSize: 22,
            paddingBottom: 4,
          },
        ]}
      >
        Letter Content
      </Text>
      <ScrollView keyboardShouldPersistTaps="handled">
        <Text style={{ fontSize: 15 }}>{props.letter.message}</Text>
      </ScrollView>
    </View>
  );
};

const mapStateToProps = (state: AppState) => ({
  letter: state.letter.active,
});

const LetterTrackingScreen = connect(mapStateToProps)(LetterTrackingScreenBase);

export default LetterTrackingScreen;
