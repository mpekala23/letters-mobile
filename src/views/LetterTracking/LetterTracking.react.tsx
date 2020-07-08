import React from 'react';
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
import Styles from './LetterTracking.styles';

type LetterTrackingScreenNavigationProp = StackNavigationProp<
  AppStackParamList,
  'LetterTracking'
>;

interface Props {
  navigation: LetterTrackingScreenNavigationProp;
  letter: Letter | null;
}

function mapStatusToTrackerBarHeight(type?: LetterStatus) {
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

const LetterTrackingScreenBase: React.FC<Props> = (props: Props) => {
  if (!props.letter) {
    props.navigation.navigate('SingleContact');
    return <View />;
  }
  const deliveryDate = moment(props.letter.expectedDeliveryDate).format(
    'MMM DD'
  );
  const chronologicalEvents = props.letter.trackingEvents?.slice().reverse();
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
              props.letter.trackingEvents
                ? props.letter.trackingEvents[0].name
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
        onPress={() => {
          props.navigation.navigate('SupportFAQ');
        }}
        buttonText={i18n.t('LetterTrackingScreen.needHelp')}
        textStyle={(Typography.FONT_BOLD, { fontSize: 14 })}
        containerStyle={Styles.needHelpButton}
      />
      <Text style={[Typography.FONT_BOLD, Styles.headerText]}>
        {i18n.t('LetterTrackingScreen.letterContent')}
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
