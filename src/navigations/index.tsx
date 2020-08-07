import React from 'react';
import { connect } from 'react-redux';
import {
  createStackNavigator,
  StackCardInterpolationProps,
  StackCardInterpolatedStyle,
} from '@react-navigation/stack';
import {
  AddManuallyScreen,
  BeginScreen,
  ChooseOptionScreen,
  ContactInfoScreen,
  ComposeLetterScreen,
  ComposePostcardScreen,
  ContactSelectorScreen,
  ExplainProblemScreen,
  FirstLetterScreen,
  FacilityDirectoryScreen,
  HomeScreen,
  IssuesScreen,
  IssuesDetailScreen,
  IssuesDetailSecondaryScreen,
  LetterPreviewScreen,
  LetterTrackingScreen,
  MemoryLaneScreen,
  LetterDetailsScreen,
  LoginScreen,
  PostcardPreviewScreen,
  PrivacyScreen,
  ReferFriendsScreen,
  RegisterScreen,
  ReviewContactScreen,
  SetupScreen,
  SingleContactScreen,
  SplashScreen,
  SupportFAQScreen,
  SupportFAQDetailScreen,
  TermsScreen,
  ThanksScreen,
  UpdateContactScreen,
  UpdateProfileScreen,
} from '@views';
import { AppState } from '@store/types';
import { AuthInfo, UserState } from '@store/User/UserTypes';
import { navigationRef, navigate } from '@notifications';
import { Notif } from '@store/Notif/NotifTypes';
import { SupportFAQTypes, DeliveryReportTypes } from 'types';
import Topbar, {
  setTitle,
  topbarRef,
  setProfile,
  setShown,
} from '@components/Topbar/Topbar.react';
import { NavigationContainer } from '@react-navigation/native';
import { Platform } from 'react-native';
import { WINDOW_WIDTH, WINDOW_HEIGHT } from '@utils';
import i18n from '@i18n';

export { navigationRef, navigate };

export type AuthStackParamList = {
  Splash: undefined;
  Begin: undefined;
  Login: undefined;
  Terms: undefined;
  Privacy: undefined;
  Register: undefined;
};

export type AppStackParamList = {
  AddManually: { phyState: string };
  ChooseOption: undefined;
  ComposeLetter: undefined;
  ComposePostcard: undefined;
  ContactInfo: { addFromSelector?: boolean; phyState?: string };
  ContactSelector: undefined;
  ExplainProblem: undefined;
  FacilityDirectory: { phyState: string };
  FirstLetter: undefined;
  Home: undefined;
  Issues: undefined;
  IssuesDetail: { issue: DeliveryReportTypes } | undefined;
  IssuesDetailSecondary: { issue: DeliveryReportTypes } | undefined;
  LetterPreview: undefined;
  PostcardPreview: undefined;
  LetterDetails: undefined;
  LetterTracking: undefined;
  MemoryLane: undefined;
  ReferFriends: undefined;
  ReviewContact: undefined;
  Setup: undefined;
  SingleContact: undefined;
  Splash: undefined;
  SupportFAQ: undefined;
  SupportFAQDetail: { issue: SupportFAQTypes } | undefined;
  Thanks: undefined;
  UpdateContact: { contactId: number } | undefined;
  UpdateProfile: undefined;
};

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
  Register: { title: i18n.t('Screens.register'), profile: false },
  AddManually: { title: i18n.t('Screens.addManually'), profile: false },
  ChooseOption: { title: i18n.t('Screens.compose'), profile: false },
  ComposeLetter: { title: i18n.t('Screens.compose'), profile: false },
  ComposePostcard: { title: i18n.t('Screens.compose'), profile: false },
  ContactInfo: { title: i18n.t('Screens.contactInfo'), profile: false },
  ContactSelector: { title: i18n.t('Screens.contacts'), profile: true },
  ExplainProblem: { title: i18n.t('Screens.explainProblem'), profile: false },
  FacilityDirectory: { title: '', profile: false },
  FirstLetter: { title: i18n.t('Screens.firstLetter'), profile: false },
  Home: { title: i18n.t('Screens.home'), profile: true },
  Issues: { title: i18n.t('Screens.issues'), profile: false },
  LetterDetails: { title: i18n.t('Screens.letterDetails'), profile: true },
  LetterPreview: { title: i18n.t('Screens.lastStep'), profile: false },
  LetterTracking: { title: i18n.t('Screens.tracking'), profile: true },
  MemoryLane: { title: i18n.t('Screens.memoryLane'), profile: true },
  PostcardPreview: { title: i18n.t('Screens.postcardPreview'), profile: false },
  ReferFriends: { title: i18n.t('Screens.spreadTheWord'), profile: false },
  ReviewContact: { title: i18n.t('Screens.reviewContact'), profile: false },
  Setup: { title: '', profile: false },
  SingleContact: { title: i18n.t('Screens.home'), profile: true },
  Thanks: { title: i18n.t('Screens.thanks'), profile: false },
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
  const topbar = (
    <Topbar
      userState={props.userState}
      navigation={navigationRef.current}
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
        name="Splash"
        component={SplashScreen}
        options={{ cardStyleInterpolator: fadeTransition }}
      />
    );
  } else if (!props.authInfo.isLoggedIn) {
    screens = (
      <>
        <Stack.Screen name="Begin" component={BeginScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Terms" component={TermsScreen} />
        <Stack.Screen name="Privacy" component={PrivacyScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
      </>
    );
  } else {
    screens = (
      <>
        <Stack.Screen
          name="ContactSelector"
          component={ContactSelectorScreen}
          options={{ cardStyleInterpolator: fadeTransition }}
        />
        <Stack.Screen name="ChooseOption" component={ChooseOptionScreen} />
        <Stack.Screen name="ComposeLetter" component={ComposeLetterScreen} />
        <Stack.Screen
          name="ComposePostcard"
          component={ComposePostcardScreen}
        />
        <Stack.Screen name="LetterPreview" component={LetterPreviewScreen} />
        <Stack.Screen
          name="PostcardPreview"
          component={PostcardPreviewScreen}
        />
        <Stack.Screen
          name="ContactInfo"
          component={ContactInfoScreen}
          options={{
            cardStyleInterpolator:
              Platform.OS === 'ios' ? fadeTransition : bottomTopTransition,
          }}
        />
        <Stack.Screen
          name="FacilityDirectory"
          component={FacilityDirectoryScreen}
        />
        <Stack.Screen name="AddManually" component={AddManuallyScreen} />
        <Stack.Screen name="ReferFriends" component={ReferFriendsScreen} />
        <Stack.Screen name="ReviewContact" component={ReviewContactScreen} />
        <Stack.Screen name="ExplainProblem" component={ExplainProblemScreen} />
        <Stack.Screen name="FirstLetter" component={FirstLetterScreen} />
        <Stack.Screen name="Issues" component={IssuesScreen} />
        <Stack.Screen name="IssuesDetail" component={IssuesDetailScreen} />
        <Stack.Screen
          name="IssuesDetailSecondary"
          component={IssuesDetailSecondaryScreen}
        />
        <Stack.Screen name="Thanks" component={ThanksScreen} />
        <Stack.Screen name="SingleContact" component={SingleContactScreen} />
        <Stack.Screen name="LetterTracking" component={LetterTrackingScreen} />
        <Stack.Screen name="MemoryLane" component={MemoryLaneScreen} />
        <Stack.Screen name="LetterDetails" component={LetterDetailsScreen} />
        <Stack.Screen name="SupportFAQ" component={SupportFAQScreen} />
        <Stack.Screen
          name="SupportFAQDetail"
          component={SupportFAQDetailScreen}
        />
        <Stack.Screen
          name="UpdateContact"
          component={UpdateContactScreen}
          options={{
            cardStyleInterpolator:
              Platform.OS === 'ios' ? fadeTransition : topBottomTransition,
          }}
        />
        <Stack.Screen
          name="UpdateProfile"
          component={UpdateProfileScreen}
          options={{
            cardStyleInterpolator:
              Platform.OS === 'ios' ? fadeTransition : topBottomTransition,
          }}
        />
      </>
    );
  }
  return (
    <NavigationContainer
      ref={navigationRef}
      onStateChange={() => {
        const name = navigationRef.current?.getCurrentRoute()?.name;
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
