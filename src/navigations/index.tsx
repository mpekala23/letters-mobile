import React, { useState } from 'react';
import { connect } from 'react-redux';
import {
  createStackNavigator,
  StackCardInterpolationProps,
  StackCardInterpolatedStyle,
} from '@react-navigation/stack';
import {
  AddManuallyScreen,
  BeginScreen,
  ChooseCategoryScreen,
  ChooseOptionScreen,
  ContactInfoScreen,
  ComposeLetterScreen,
  ComposePersonalScreen,
  ComposePostcardScreen,
  ContactSelectorScreen,
  FacilityDirectoryScreen,
  InmateLocatorScreen,
  IssuesScreen,
  IssuesDetailScreen,
  IssuesDetailSecondaryScreen,
  LoginScreen,
  MailTrackingScreen,
  MemoryLaneScreen,
  MailDetailsScreen,
  PrivacyScreen,
  ReferralDashboardScreen,
  ReferFriendsScreen,
  RegisterCredsScreen,
  RegisterPersonalScreen,
  RegisterAddressScreen,
  ReviewLetterScreen,
  ReviewPostcardScreen,
  ReviewContactScreen,
  SingleContactScreen,
  SplashScreen,
  SupportFAQScreen,
  SupportFAQDetailScreen,
  TermsScreen,
  UpdateContactScreen,
  UpdateProfileScreen,
} from '@views';
import { AppState } from '@store/types';
import { AuthInfo, UserState } from '@store/User/UserTypes';
import { navigationRef, navigate, WINDOW_WIDTH, WINDOW_HEIGHT } from '@utils';
import { Notif } from '@store/Notif/NotifTypes';
import Topbar, {
  setTitle,
  topbarRef,
  setProfile,
  setShown,
} from '@components/Topbar/Topbar.react';
import { NavigationContainer } from '@react-navigation/native';
import { Platform } from 'react-native';

import i18n from '@i18n';
import { Screens, AuthStackParamList, AppStackParamList } from '@utils/Screens';

export { navigationRef, navigate };

interface RouteDetails {
  title: string;
  profile: boolean;
  shown?: boolean;
}

const mapRouteNameToDetails: Record<string, RouteDetails> = {
  Begin: { title: '', profile: false, shown: false },
  Splash: { title: '', profile: false, shown: false },
  Login: { title: i18n.t('Screens.login'), profile: false },
  Terms: { title: i18n.t('Screens.termsOfService'), profile: false },
  Privacy: { title: i18n.t('Screens.privacyPolicy'), profile: false },
  RegisterCreds: { title: i18n.t('Screens.register'), profile: false },
  RegisterPersonal: { title: i18n.t('Screens.register'), profile: false },
  RegisterAddress: { title: i18n.t('Screens.register'), profile: false },
  AddManually: { title: i18n.t('Screens.addManually'), profile: false },
  ChooseCategory: { title: i18n.t('Screens.compose'), profile: false },
  ChooseOption: { title: i18n.t('Screens.compose'), profile: false },
  ComposeLetter: { title: i18n.t('Screens.compose'), profile: false },
  ComposePersonal: { title: i18n.t('Screens.compose'), profile: false },
  ComposePostcard: { title: i18n.t('Screens.compose'), profile: false },
  ContactInfo: { title: i18n.t('Screens.contactInfo'), profile: false },
  ContactSelector: { title: i18n.t('Screens.contacts'), profile: true },
  FacilityDirectory: { title: '', profile: false },
  InmateLocator: { title: i18n.t('Screens.inmateLocator'), profile: false },
  Issues: { title: i18n.t('Screens.issues'), profile: false },
  MailDetails: { title: i18n.t('Screens.letterDetails'), profile: true },
  MailTracking: { title: i18n.t('Screens.tracking'), profile: true },
  MemoryLane: { title: i18n.t('Screens.memoryLane'), profile: true },
  ReferralDashboardScreen: {
    title: i18n.t('Screens.referralDashboard'),
    profile: true,
  },
  ReferFriends: { title: i18n.t('Screens.spreadTheWord'), profile: false },
  ReviewLetter: { title: i18n.t('Screens.lastStep'), profile: false },
  ReviewPostcard: {
    title: i18n.t('Screens.reviewPostcard'),
    profile: false,
  },
  ReviewContact: { title: i18n.t('Screens.reviewContact'), profile: false },
  Setup: { title: '', profile: false },
  SingleContact: { title: i18n.t('Screens.home'), profile: true },
  UpdateContact: { title: i18n.t('Screens.updateContact'), profile: false },
  UpdateProfile: { title: i18n.t('Screens.updateProfile'), profile: false },
};

export type RootStackParamList = AuthStackParamList & AppStackParamList;

const Stack = createStackNavigator<RootStackParamList>();

export interface Props {
  authInfo: AuthInfo;
  currentNotif: Notif | null;
  userState: UserState;
}

const fadeTransition = (
  data: StackCardInterpolationProps
): StackCardInterpolatedStyle => {
  return {
    cardStyle: {
      opacity: data.current.progress,
    },
  };
};

const leftRightTransition = (
  data: StackCardInterpolationProps
): StackCardInterpolatedStyle => {
  return {
    cardStyle: {
      transform: [
        {
          translateX: data.current.progress.interpolate({
            inputRange: [0, 1],
            outputRange: [WINDOW_WIDTH, 0],
          }),
        },
      ],
    },
  };
};

const topBottomTransition = (
  data: StackCardInterpolationProps
): StackCardInterpolatedStyle => {
  return {
    cardStyle: {
      transform: [
        {
          translateY: data.current.progress.interpolate({
            inputRange: [0, 1],
            outputRange: [-WINDOW_HEIGHT, 0],
          }),
        },
      ],
    },
  };
};

const bottomTopTransition = (
  data: StackCardInterpolationProps
): StackCardInterpolatedStyle => {
  return {
    cardStyle: {
      transform: [
        {
          translateY: data.current.progress.interpolate({
            inputRange: [0, 1],
            outputRange: [WINDOW_HEIGHT, 0],
          }),
        },
      ],
    },
  };
};

const NavigatorBase: React.FC<Props> = (props: Props) => {
  const [currentRoute, setCurrentRoute] = useState(Screens.Splash);
  const topbar = (
    <Topbar
      userState={props.userState}
      navigation={navigationRef.current}
      currentRoute={currentRoute}
      ref={topbarRef}
    />
  );

  // Determine which views should be accessible
  let screens;
  if (
    props.authInfo.isLoadingToken ||
    (props.authInfo.isLoggedIn && !props.authInfo.isLoaded)
  ) {
    screens = (
      <Stack.Screen
        name={Screens.Splash}
        component={SplashScreen}
        options={{ cardStyleInterpolator: fadeTransition }}
      />
    );
  } else if (!props.authInfo.isLoggedIn) {
    screens = (
      <>
        <Stack.Screen name={Screens.Begin} component={BeginScreen} />
        <Stack.Screen name={Screens.Login} component={LoginScreen} />
        <Stack.Screen name={Screens.Terms} component={TermsScreen} />
        <Stack.Screen name={Screens.Privacy} component={PrivacyScreen} />
        <Stack.Screen
          name={Screens.RegisterCreds}
          component={RegisterCredsScreen}
        />
        <Stack.Screen
          name={Screens.RegisterPersonal}
          component={RegisterPersonalScreen}
        />
        <Stack.Screen
          name={Screens.RegisterAddress}
          component={RegisterAddressScreen}
        />
      </>
    );
  } else {
    screens = (
      <>
        <Stack.Screen
          name={Screens.ContactSelector}
          component={ContactSelectorScreen}
          options={{ cardStyleInterpolator: fadeTransition }}
        />
        <Stack.Screen
          name={Screens.ChooseCategory}
          component={ChooseCategoryScreen}
        />
        <Stack.Screen
          name={Screens.ChooseOption}
          component={ChooseOptionScreen}
        />
        <Stack.Screen
          name={Screens.ComposeLetter}
          component={ComposeLetterScreen}
        />
        <Stack.Screen
          name={Screens.ComposePersonal}
          component={ComposePersonalScreen}
        />
        <Stack.Screen
          name={Screens.ComposePostcard}
          component={ComposePostcardScreen}
        />
        <Stack.Screen
          name={Screens.ReviewLetter}
          component={ReviewLetterScreen}
        />
        <Stack.Screen
          name={Screens.ReviewPostcard}
          component={ReviewPostcardScreen}
        />
        <Stack.Screen
          name={Screens.ContactInfo}
          component={ContactInfoScreen}
          options={{
            cardStyleInterpolator:
              Platform.OS === 'ios' ? fadeTransition : bottomTopTransition,
          }}
        />
        <Stack.Screen
          name={Screens.FacilityDirectory}
          component={FacilityDirectoryScreen}
        />
        <Stack.Screen
          name={Screens.AddManually}
          component={AddManuallyScreen}
        />
        <Stack.Screen
          name={Screens.ReferFriends}
          component={ReferFriendsScreen}
        />
        <Stack.Screen
          name={Screens.ReferralDashboard}
          component={ReferralDashboardScreen}
        />
        <Stack.Screen
          name={Screens.ReviewContact}
          component={ReviewContactScreen}
        />
        <Stack.Screen name={Screens.Issues} component={IssuesScreen} />
        <Stack.Screen
          name={Screens.IssuesDetail}
          component={IssuesDetailScreen}
        />
        <Stack.Screen
          name={Screens.IssuesDetailSecondary}
          component={IssuesDetailSecondaryScreen}
        />
        <Stack.Screen
          name={Screens.SingleContact}
          component={SingleContactScreen}
        />
        <Stack.Screen
          name={Screens.MailTracking}
          component={MailTrackingScreen}
        />
        <Stack.Screen name={Screens.MemoryLane} component={MemoryLaneScreen} />
        <Stack.Screen
          name={Screens.MailDetails}
          component={MailDetailsScreen}
        />
        <Stack.Screen name={Screens.SupportFAQ} component={SupportFAQScreen} />
        <Stack.Screen
          name={Screens.SupportFAQDetail}
          component={SupportFAQDetailScreen}
        />
        <Stack.Screen
          name={Screens.UpdateContact}
          component={UpdateContactScreen}
          options={{
            cardStyleInterpolator:
              Platform.OS === 'ios' ? fadeTransition : topBottomTransition,
          }}
        />
        <Stack.Screen
          name={Screens.UpdateProfile}
          component={UpdateProfileScreen}
          options={{
            cardStyleInterpolator:
              Platform.OS === 'ios' ? fadeTransition : topBottomTransition,
          }}
        />
        <Stack.Screen name="InmateLocator" component={InmateLocatorScreen} />
      </>
    );
  }
  return (
    <NavigationContainer
      ref={navigationRef}
      onStateChange={() => {
        const name = navigationRef.current?.getCurrentRoute()?.name as Screens;
        if (name) setCurrentRoute(name);
        if (name && name in mapRouteNameToDetails) {
          setTitle(mapRouteNameToDetails[name].title);
          setProfile(mapRouteNameToDetails[name].profile);
          if (
            mapRouteNameToDetails[name].shown === undefined ||
            mapRouteNameToDetails[name].shown === true
          )
            setShown(true);
          else setShown(false);
        } else {
          setTitle('');
          setProfile(true);
          setShown(true);
        }
      }}
    >
      {topbar}
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          cardStyleInterpolator:
            Platform.OS === 'ios' ? fadeTransition : leftRightTransition,
        }}
      >
        {screens}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const mapStateToProps = (state: AppState) => ({
  authInfo: state.user.authInfo,
  currentNotif: state.notif.currentNotif,
  userState: state.user,
});
const Navigator = connect(mapStateToProps)(NavigatorBase);

export default Navigator;
