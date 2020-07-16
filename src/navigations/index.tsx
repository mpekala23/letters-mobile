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
import { NullableFacility, SupportFAQTypes, DeliveryReportTypes } from 'types';
import Topbar, {
  setTitle,
  topbarRef,
  setProfile,
  setShown,
} from '@components/Topbar/Topbar.react';
import { NavigationContainer } from '@react-navigation/native';

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
  FacilityDirectory: { newFacility?: NullableFacility; phyState: string };
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
  Splash: { title: 'Splash', profile: false },
  Login: { title: 'Login', profile: false },
  Terms: { title: 'Terms of Service', profile: false },
  Privacy: { title: 'Privacy Policy', profile: false },
  Register: { title: 'Register', profile: false },
  AddManually: { title: 'Add Manually', profile: false },
  ChooseOption: { title: 'Compose', profile: false },
  ComposeLetter: { title: 'Compose', profile: false },
  ComposePostcard: { title: 'Compose', profile: false },
  ContactInfo: { title: 'Contact Info', profile: false },
  ContactSelector: { title: 'Contacts', profile: true },
  ExplainProblem: { title: 'Explain Problem', profile: false },
  FacilityDirectory: { title: '', profile: false },
  FirstLetter: { title: 'First Letter', profile: false },
  Home: { title: 'Home', profile: true },
  Issues: { title: 'Issues', profile: false },
  LetterDetails: { title: 'Letter Details', profile: true },
  LetterPreview: { title: 'Last Step', profile: false },
  LetterTracking: { title: 'Tracking', profile: true },
  MemoryLane: { title: 'Memory Lane', profile: true },
  PostcardPreview: { title: 'Postcard Preview', profile: false },
  ReferFriends: { title: 'Refer Friends', profile: false },
  ReviewContact: { title: 'Review Contact', profile: false },
  Setup: { title: '', profile: false },
  SingleContact: { title: 'Single Contact', profile: true },
  Thanks: { title: 'Thanks', profile: false },
  UpdateContact: { title: 'Update Contact', profile: false },
  UpdateProfile: { title: 'Update Profile', profile: false },
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
  if (props.authInfo.isLoadingToken) {
    screens = (
      <Stack.Screen
        name="Splash"
        component={SplashScreen}
        options={{ cardStyleInterpolator: fadeTransition }}
      />
    );
  } else if (props.authInfo.isLoggedIn) {
    screens = (
      <>
        <Stack.Screen
          name="Setup"
          component={SetupScreen}
          options={{
            cardStyleInterpolator: fadeTransition,
          }}
        />
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ cardStyleInterpolator: fadeTransition }}
        />
        <Stack.Screen
          name="ChooseOption"
          component={ChooseOptionScreen}
          options={{ cardStyleInterpolator: fadeTransition }}
        />
        <Stack.Screen
          name="ComposeLetter"
          component={ComposeLetterScreen}
          options={{ cardStyleInterpolator: fadeTransition }}
        />
        <Stack.Screen
          name="ComposePostcard"
          component={ComposePostcardScreen}
          options={{ cardStyleInterpolator: fadeTransition }}
        />
        <Stack.Screen
          name="LetterPreview"
          component={LetterPreviewScreen}
          options={{ cardStyleInterpolator: fadeTransition }}
        />
        <Stack.Screen
          name="PostcardPreview"
          component={PostcardPreviewScreen}
          options={{ cardStyleInterpolator: fadeTransition }}
        />
        <Stack.Screen
          name="ContactInfo"
          component={ContactInfoScreen}
          options={{
            cardStyleInterpolator: fadeTransition,
          }}
        />
        <Stack.Screen
          name="FacilityDirectory"
          component={FacilityDirectoryScreen}
          options={{
            cardStyleInterpolator: fadeTransition,
          }}
        />
        <Stack.Screen
          name="AddManually"
          component={AddManuallyScreen}
          options={{
            cardStyleInterpolator: fadeTransition,
          }}
        />
        <Stack.Screen
          name="ReferFriends"
          component={ReferFriendsScreen}
          options={{
            cardStyleInterpolator: fadeTransition,
          }}
        />
        <Stack.Screen
          name="ReviewContact"
          component={ReviewContactScreen}
          options={{
            cardStyleInterpolator: fadeTransition,
          }}
        />
        <Stack.Screen
          name="ExplainProblem"
          component={ExplainProblemScreen}
          options={{
            cardStyleInterpolator: fadeTransition,
          }}
        />
        <Stack.Screen
          name="FirstLetter"
          component={FirstLetterScreen}
          options={{
            cardStyleInterpolator: fadeTransition,
          }}
        />
        <Stack.Screen
          name="Issues"
          component={IssuesScreen}
          options={{
            cardStyleInterpolator: fadeTransition,
          }}
        />
        <Stack.Screen
          name="IssuesDetail"
          component={IssuesDetailScreen}
          options={{ cardStyleInterpolator: fadeTransition }}
        />
        <Stack.Screen
          name="IssuesDetailSecondary"
          component={IssuesDetailSecondaryScreen}
          options={{ cardStyleInterpolator: fadeTransition }}
        />
        <Stack.Screen
          name="Thanks"
          component={ThanksScreen}
          options={{
            cardStyleInterpolator: fadeTransition,
          }}
        />
        <Stack.Screen
          name="ContactSelector"
          component={ContactSelectorScreen}
          options={{
            cardStyleInterpolator: fadeTransition,
          }}
        />
        <Stack.Screen
          name="SingleContact"
          component={SingleContactScreen}
          options={{
            cardStyleInterpolator: fadeTransition,
          }}
        />
        <Stack.Screen
          name="LetterTracking"
          component={LetterTrackingScreen}
          options={{
            cardStyleInterpolator: fadeTransition,
          }}
        />
        <Stack.Screen
          name="MemoryLane"
          component={MemoryLaneScreen}
          options={{
            cardStyleInterpolator: fadeTransition,
          }}
        />
        <Stack.Screen
          name="LetterDetails"
          component={LetterDetailsScreen}
          options={{
            cardStyleInterpolator: fadeTransition,
          }}
        />
        <Stack.Screen
          name="SupportFAQ"
          component={SupportFAQScreen}
          options={{ cardStyleInterpolator: fadeTransition }}
        />
        <Stack.Screen
          name="SupportFAQDetail"
          component={SupportFAQDetailScreen}
          options={{ cardStyleInterpolator: fadeTransition }}
        />
        <Stack.Screen
          name="UpdateContact"
          component={UpdateContactScreen}
          options={{
            cardStyleInterpolator: fadeTransition,
          }}
        />
        <Stack.Screen
          name="UpdateProfile"
          component={UpdateProfileScreen}
          options={{ cardStyleInterpolator: fadeTransition }}
        />
      </>
    );
  } else {
    screens = (
      <>
        <Stack.Screen
          name="Begin"
          component={BeginScreen}
          options={{ cardStyleInterpolator: fadeTransition }}
        />
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ cardStyleInterpolator: fadeTransition }}
        />
        <Stack.Screen
          name="Terms"
          component={TermsScreen}
          options={{ cardStyleInterpolator: fadeTransition }}
        />
        <Stack.Screen
          name="Privacy"
          component={PrivacyScreen}
          options={{ cardStyleInterpolator: fadeTransition }}
        />
        <Stack.Screen
          name="Register"
          component={RegisterScreen}
          options={{ cardStyleInterpolator: fadeTransition }}
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
      <Stack.Navigator screenOptions={{ headerShown: false }}>
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
