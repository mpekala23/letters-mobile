import React, { useEffect } from 'react';
import { Text, View, Platform, ScrollView } from 'react-native';
import { Button, KeyboardAvoider } from '@components';
import { Typography } from '@styles';
import { StackNavigationProp } from '@react-navigation/stack';
import { AppStackParamList, Screens } from '@utils/Screens';
import i18n from '@i18n';
import { connect } from 'react-redux';
import { AppState } from '@store/types';
import LottieView from 'lottie-react-native';
import LetterLottie from '@assets/views/ReferFriends/Mailbox.json';
import PostcardLottie from '@assets/views/ReferFriends/Postcard.json';

import Icon from '@components/Icon/Icon.react';
import Truck from '@assets/views/ReferFriends/Truck';
import { differenceInBusinessDays, format } from 'date-fns';
import { Contact, MailTypes } from 'types';
import { onNativeShare, estimateDelivery, requestReview } from '@utils';

import { setProfileOverride } from '@components/Topbar/Topbar.react';
import Styles from './ReferFriends.style';

type ReferFriendsScreenNavigationProp = StackNavigationProp<
  AppStackParamList,
  'ReferFriends'
>;

export interface Props {
  navigation: ReferFriendsScreenNavigationProp;
  contact: Contact;
  referralCode: string;
  numMailSent: number;
  joined: Date;
  route: {
    params: { mailType: MailTypes };
  };
}

const ReferFriendsScreenBase: React.FC<Props> = (props: Props) => {
  useEffect(() => {
    if (
      props.numMailSent >= 6 &&
      props.numMailSent % 3 === 0 &&
      Math.abs(differenceInBusinessDays(props.joined, new Date())) > 7
    ) {
      requestReview();
    }
    setProfileOverride(undefined);
  }, []);

  const genLottieView = () => {
    const LottieAsset =
      props.route.params.mailType === MailTypes.Postcard
        ? PostcardLottie
        : LetterLottie;
    return (
      <LottieView
        source={LottieAsset}
        style={{ maxHeight: 150 }}
        loop
        autoPlay
      />
    );
  };

  const { contact } = props;
  const sixDaysFromNow = estimateDelivery(new Date());
  const { mailType } = props.route.params;
  return (
    <KeyboardAvoider style={Styles.trueBackground}>
      <ScrollView
        style={{
          flex: 1,
        }}
        contentContainerStyle={{
          flexGrow: 1,
          alignItems: 'center',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: 16,
        }}
      >
        <View
          style={{
            flexDirection: 'column',
            width: '100%',
            marginTop: Platform.OS === 'ios' ? 0 : 16,
          }}
        >
          <View
            style={{
              width: '100%',
              height: 150,
              alignItems: 'center',
              marginBottom: 16,
            }}
          >
            {Platform.OS === 'ios' ? genLottieView() : <Icon svg={Truck} />}
          </View>
          <Text
            style={[
              Typography.FONT_SEMIBOLD,
              { fontSize: 20, textAlign: 'center' },
            ]}
          >
            {i18n.t('Common.possessivePronoun')} {mailType}{' '}
            {i18n.t('Common.prepositionTo')} {contact.firstName}
            {i18n.t('ReferFriendsScreen.yourLetterIsOnTheWaySuffix')}
          </Text>
          <Text style={[Typography.FONT_REGULAR, Styles.baseText]}>
            {i18n.t('ReferFriendsScreen.weEstimateYourLetterToArriveOn')}:{' '}
            <Text style={Typography.FONT_SEMIBOLD}>
              {format(sixDaysFromNow, 'MMM dd')}
            </Text>
            .{'\n\n'} {i18n.t('ReferFriendsScreen.thanksAgain')}
          </Text>
        </View>
        <View style={{ marginTop: 16, width: '100%' }}>
          <Button
            buttonText={i18n.t('ReferFriendsScreen.share')}
            onPress={() => {
              onNativeShare(
                Screens.ReferFriends,
                i18n.t('ReferFriendsScreen.share'),
                props.referralCode
              );
            }}
            containerStyle={{ width: '100%' }}
          />
          <Button
            buttonText={i18n.t('ReferFriendsScreen.done')}
            reverse
            onPress={() => {
              props.navigation.reset({
                index: 0,
                routes: [
                  { name: Screens.ContactSelector },
                  { name: Screens.SingleContact },
                ],
              });
            }}
            containerStyle={{ width: '100%' }}
          />
        </View>
      </ScrollView>
    </KeyboardAvoider>
  );
};

const mapStateToProps = (state: AppState) => {
  return {
    contact: state.contact.active,
    referralCode: state.user.user.referralCode,
    numMailSent: Object.keys(state.mail.existing)
      .map((key) => state.mail.existing[key].length)
      .reduce((acc, curr) => acc + curr, 0),
    joined: state.user.user.joined,
  };
};

const ReferFriendsScreen = connect(mapStateToProps)(ReferFriendsScreenBase);

export default ReferFriendsScreen;
