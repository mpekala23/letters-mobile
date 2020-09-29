import React, { useState } from 'react';
import { View, Text, RefreshControl } from 'react-native';
import { AppState } from '@store/types';
import { connect } from 'react-redux';
import { FamilyConnection, ProfilePicTypes, UserReferralsInfo } from 'types';
import { LinearGradient } from 'expo-linear-gradient';
import { User } from '@store/User/UserTypes';
import { Button, Icon, ProfilePic } from '@components';
import { Colors, Typography } from '@styles';
import ReferralCardBackground from '@assets/views/Referrals/ReferralCardBackground';
import LetterBox from '@assets/views/Referrals/Letterbox';

import { onNativeShare } from '@utils';
import i18n from '@i18n';
import ReferralConnectionCard from '@components/Card/ReferralConnectionCard.react';

import { Screens } from '@utils/Screens';
import { getUserReferrals } from '@api';
import { dropdownError } from '@components/Dropdown/Dropdown.react';
import { ScrollView } from 'react-native-gesture-handler';
import Styles from './ReferralDashboard.style';

interface Props {
  userReferrals: UserReferralsInfo;
  userState: User;
}

const ReferralDashboardScreenBase: React.FC<Props> = ({
  userReferrals,
  userState,
}: Props) => {
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const renderItem = (item: FamilyConnection, index: number) => {
    return (
      <View
        style={{ marginTop: 16 }}
        key={`${item.userFirstName}-${item.contactFirstName}-${item.state}-${index}`}
      >
        <ReferralConnectionCard familyConnection={item} />
      </View>
    );
  };

  const doRefresh = async () => {
    setRefreshing(true);
    try {
      await getUserReferrals();
    } catch (e) {
      dropdownError({
        message: i18n.t('Error.cantRefreshContacts'),
      });
    }
    setRefreshing(false);
  };

  return (
    <ScrollView
      style={Styles.trueBackground}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={doRefresh} />
      }
    >
      <View style={Styles.headerWrapper}>
        <LinearGradient
          style={Styles.gradientBackground}
          colors={['#032658', '#0748A6']}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
        />
        <Icon svg={ReferralCardBackground} style={Styles.starsBackground} />
        <ProfilePic
          firstName={userState.firstName}
          lastName={userState.lastName}
          imageUri={userState.photo?.uri}
          type={ProfilePicTypes.ReferralDashboard}
        />
        <View style={Styles.impactRowWrapper}>
          <View style={Styles.impactContainer}>
            <Text style={[Styles.impactMetric, Typography.FONT_BOLD]}>
              {userReferrals.numLivesImpacted}
            </Text>
            <Text style={[Styles.impactLabel]}>
              {i18n.t('ReferralDashboardScreen.familesHelped')}
            </Text>
          </View>
          <View style={Styles.impactContainer}>
            <Text style={[Styles.impactMetric, Typography.FONT_BOLD]}>
              {userReferrals.numMailSent}
            </Text>
            <Text style={[Styles.impactLabel]}>
              {i18n.t('ReferralDashboardScreen.mailSent')}
            </Text>
          </View>
          <View style={Styles.impactContainer}>
            <Text style={[Styles.impactMetric, Typography.FONT_BOLD]}>
              ${(userReferrals.numMailSent * 0.6).toFixed(2)}
            </Text>
            <Text style={[Styles.impactLabel]}>
              {i18n.t('ReferralDashboardScreen.moneySaved')}
            </Text>
          </View>
        </View>
      </View>

      <View style={Styles.descWrapper}>
        <Icon svg={LetterBox} />
        <View style={Styles.descContainer}>
          <Text style={[Typography.FONT_BOLD, Styles.descHeader]}>
            {i18n.t('ReferralDashboardScreen.helpNowHeader')}
          </Text>
          <Text style={[{ color: Colors.GRAY_500 }]}>
            {i18n.t('ReferralDashboardScreen.helpNowBody')}
          </Text>
        </View>
      </View>

      <Button
        buttonText={i18n.t('ReferralDashboardScreen.shareCta')}
        onPress={() => {
          onNativeShare(
            Screens.ReferralDashboard,
            i18n.t('ReferralDashboardScreen.shareCta'),
            userState.referralCode
          );
        }}
        containerStyle={{ width: '100%' }}
      />

      {userReferrals.families.length > 0 && (
        <View style={Styles.thanksToYouWrapper}>
          <Text style={[Typography.FONT_BOLD]}>
            {i18n.t('ReferralDashboardScreen.thankYou')}
          </Text>
          <View
            style={{ flex: 1, justifyContent: 'center', paddingBottom: 24 }}
          >
            {userReferrals.families.map((family, index) =>
              renderItem(family, index)
            )}
          </View>
        </View>
      )}
    </ScrollView>
  );
};

const mapStateToProps = (state: AppState) => ({
  userReferrals: state.user.userReferrals,
  userState: state.user.user,
});

const ReferralDashboardScreen = connect(mapStateToProps)(
  ReferralDashboardScreenBase
);

export default ReferralDashboardScreen;
