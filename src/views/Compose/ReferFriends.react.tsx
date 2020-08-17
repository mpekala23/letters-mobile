import React from 'react';
import { KeyboardAvoidingView, Text, View, Platform } from 'react-native';
import { Button } from '@components';
import { facebookShare } from '@api';
import { dropdownError } from '@components/Dropdown/Dropdown.react';
import { Typography } from '@styles';
import { StackNavigationProp } from '@react-navigation/stack';
import { AppStackParamList } from '@navigations';
import i18n from '@i18n';
import { connect } from 'react-redux';
import { AppState } from '@store/types';
import LottieView from 'lottie-react-native';
import DeliveryMan from '@assets/views/ReferFriends/DeliveryMan.json';
import Icon from '@components/Icon/Icon.react';
import Truck from '@assets/views/ReferFriends/Truck';
import { format, addBusinessDays } from 'date-fns';
import * as Segment from 'expo-analytics-segment';
import { Contact } from 'types';
import Styles from './ReferFriends.style';

type ReferFriendsScreenNavigationProp = StackNavigationProp<
  AppStackParamList,
  'ReferFriends'
>;

export interface Props {
  navigation: ReferFriendsScreenNavigationProp;
  contact: Contact;
}

const onShare = async () => {
  const ameelioUrl = 'letters.ameelio.org';
  const sharingUrl = `https://www.facebook.com/sharer/sharer.php?u=${ameelioUrl}`;
  try {
    Segment.track('Review - Share on Facebook');
    await facebookShare(sharingUrl);
  } catch (err) {
    dropdownError({ message: i18n.t('Error.requestIncomplete') });
  }
};

const ReferFriendsScreenBase: React.FC<Props> = (props: Props) => {
  const { contact } = props;
  const sixDaysFromNow = addBusinessDays(new Date(), 6);
  return (
    <KeyboardAvoidingView
      style={Styles.trueBackground}
      behavior="padding"
      enabled
    >
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          flexDirection: 'column',
          justifyContent: 'space-around',
        }}
      >
        {Platform.OS === 'ios' ? (
          <LottieView
            source={DeliveryMan}
            style={{ maxHeight: 150 }}
            loop
            autoPlay
          />
        ) : (
          <Icon svg={Truck} />
        )}

        <View
          style={{
            flex: 0,
            flexDirection: 'column',
            marginTop: Platform.OS === 'ios' ? 150 : 16,
          }}
        >
          <Text
            style={[
              Typography.FONT_BOLD,
              { fontSize: 20, textAlign: 'center' },
            ]}
          >
            {i18n.t('ReferFriendsScreen.yourLetterIsOnTheWayPrefix')}
            {contact.firstName}
            {i18n.t('ReferFriendsScreen.yourLetterIsOnTheWaySuffix')}
          </Text>
          <Text style={[Typography.FONT_REGULAR, Styles.baseText]}>
            {i18n.t('ReferFriendsScreen.weEstimateYourLetterToArriveOn')}:{' '}
            <Text style={Typography.FONT_BOLD}>
              {format(sixDaysFromNow, 'MMM dd')}
            </Text>
            .{'\n\n'} {i18n.t('ReferFriendsScreen.thanksAgain')}
          </Text>
        </View>
        <View style={{ marginTop: 16, width: '100%' }}>
          <Button
            buttonText={i18n.t('ReferFriendsScreen.shareOnFacebook')}
            onPress={() => onShare()}
            containerStyle={{ width: '100%' }}
          />
          <Button
            buttonText={i18n.t('ReferFriendsScreen.done')}
            reverse
            onPress={() => {
              props.navigation.reset({
                index: 0,
                routes: [
                  { name: 'ContactSelector' },
                  { name: 'SingleContact' },
                ],
              });
            }}
            containerStyle={{ width: '100%' }}
          />
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const mapStateToProps = (state: AppState) => {
  return {
    contact: state.contact.active,
  };
};

const ReferFriendsScreen = connect(mapStateToProps)(ReferFriendsScreenBase);

export default ReferFriendsScreen;
