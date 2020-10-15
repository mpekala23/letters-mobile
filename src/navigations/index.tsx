import React, { useState } from 'react';
import { connect } from 'react-redux';
import {
  StackCardInterpolationProps,
  StackCardInterpolatedStyle,
} from '@react-navigation/stack';
import { AppState } from '@store/types';
import { AuthInfo, UserState } from '@store/User/UserTypes';
import { navigationRef, navigate, WINDOW_WIDTH, WINDOW_HEIGHT } from '@utils';
import Topbar, {
  setTitle,
  topbarRef,
  setProfile,
  setShown,
} from '@components/Topbar/Topbar.react';
import { NavigationContainer } from '@react-navigation/native';

import i18n from '@i18n';
import { Screens, AuthStackParamList, AppStackParamList } from '@utils/Screens';
import { SplashScreen } from '@views';
import { RootTab } from './Navigators';

import Auth from './Auth';
import Home from './Home';
import Store from './Store';

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
  ChooseCategory: { title: i18n.t('Screens.compose'), profile: false },
  ChooseOption: { title: i18n.t('Screens.compose'), profile: false },
  ComposeLetter: { title: i18n.t('Screens.compose'), profile: false },
  ComposePersonal: { title: i18n.t('Screens.compose'), profile: false },
  ComposePostcard: { title: i18n.t('Screens.compose'), profile: false },
  ContactInfo: { title: i18n.t('Screens.contactInfo'), profile: false },
  ContactSelector: { title: i18n.t('Screens.contacts'), profile: true },
  FacilityDirectory: { title: '', profile: false },
  ContactInmateInfo: {
    title: i18n.t('Screens.contactInmateInfo'),
    profile: false,
  },
  IntroContact: { title: i18n.t('Screens.introContact'), profile: false },
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

export interface Props {
  authInfo: AuthInfo;
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
    screens = <RootTab.Screen name="Splash" component={SplashScreen} />;
  } else if (!props.authInfo.isLoggedIn) {
    screens = <RootTab.Screen name="Auth" component={Auth} />;
  } else {
    screens = (
      <>
        <RootTab.Screen name="Home" component={Home} />
        <RootTab.Screen name="Store" component={Store} />
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
      <RootTab.Navigator
        screenOptions={({ route }) => ({
          tabBarVisible: route.name !== 'Auth',
        })}
      >
        {screens}
      </RootTab.Navigator>
    </NavigationContainer>
  );
};

const mapStateToProps = (state: AppState) => ({
  authInfo: state.user.authInfo,
  userState: state.user,
});
const Navigator = connect(mapStateToProps)(NavigatorBase);

export default Navigator;
