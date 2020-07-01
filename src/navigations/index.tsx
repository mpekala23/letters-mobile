import React from 'react';
import { View } from 'react-native';
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
  ContactSelectorScreen,
  ExplainProblemScreen,
  FirstLetterScreen,
  FacilityDirectoryScreen,
  HomeScreen,
  IssuesScreen,
  LetterTrackingScreen,
  LoginScreen,
  ReferFriendsScreen,
  RegisterScreen,
  ReviewContactScreen,
  SingleContactScreen,
  SplashScreen,
  ThanksScreen,
} from '@views';
import { AppState } from '@store/types';
import { AuthInfo } from '@store/User/UserTypes';
import { navigationRef, navigate } from '@notifications';
import { Notif } from 'store/Notif/NotifTypes';
import { NullableFacility, Letter } from 'types';
import { Topbar } from '@components';
import { Contact } from '@store/Contact/ContactTypes';

export { navigationRef, navigate };

export type AuthStackParamList = {
  Splash: undefined;
  Login: undefined;
  Register: undefined;
};

export type AppStackParamList = {
  AddManually: undefined;
  Begin: undefined;
  ChooseOption: undefined;
  ContactInfo: { addFromSelector: boolean } | undefined;
  ContactSelector: undefined;
  ExplainProblem: undefined;
  FacilityDirectory: { newFacility: NullableFacility } | undefined;
  FirstLetter: undefined;
  Home: undefined;
  Issues: undefined;
  LetterTracking: undefined;
  ReferFriends: undefined;
  ReviewContact: undefined;
  SingleContact: { contact: Contact; letters?: Letter[] } | undefined;
  Splash: undefined;
  Thanks: undefined;
};

export type RootStackParamList = AuthStackParamList & AppStackParamList;

const Stack = createStackNavigator<RootStackParamList>();

export interface Props {
  authInfo: AuthInfo;
  currentNotif: Notif | null;
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
  let topSection = <View />;
  if (!props.authInfo.isLoadingToken) {
    topSection = <Topbar />;
  }
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
          name="Home"
          component={HomeScreen}
          options={{ cardStyleInterpolator: fadeTransition }}
        />
        <Stack.Screen
          name="ContactInfo"
          component={ContactInfoScreen}
          options={{ cardStyleInterpolator: fadeTransition }}
        />
        <Stack.Screen
          name="FacilityDirectory"
          component={FacilityDirectoryScreen}
          options={{ cardStyleInterpolator: fadeTransition }}
        />
        <Stack.Screen
          name="AddManually"
          component={AddManuallyScreen}
          options={{ cardStyleInterpolator: fadeTransition }}
        />
        <Stack.Screen
          name="ReferFriends"
          component={ReferFriendsScreen}
          options={{ cardStyleInterpolator: fadeTransition }}
        />
        <Stack.Screen
          name="ReviewContact"
          component={ReviewContactScreen}
          options={{ cardStyleInterpolator: fadeTransition }}
        />
        <Stack.Screen
          name="ExplainProblem"
          component={ExplainProblemScreen}
          options={{ cardStyleInterpolator: fadeTransition }}
        />
        <Stack.Screen
          name="FirstLetter"
          component={FirstLetterScreen}
          options={{ cardStyleInterpolator: fadeTransition }}
        />
        <Stack.Screen
          name="Issues"
          component={IssuesScreen}
          options={{ cardStyleInterpolator: fadeTransition }}
        />
        <Stack.Screen
          name="Thanks"
          component={ThanksScreen}
          options={{ cardStyleInterpolator: fadeTransition }}
        />
        <Stack.Screen
          name="ContactSelector"
          component={ContactSelectorScreen}
          options={{ cardStyleInterpolator: fadeTransition }}
        />
        <Stack.Screen
          name="SingleContact"
          component={SingleContactScreen}
          options={{ cardStyleInterpolator: fadeTransition }}
        />
        <Stack.Screen
          name="LetterTracking"
          component={LetterTrackingScreen}
          options={{ cardStyleInterpolator: fadeTransition }}
        />
        <Stack.Screen
          name="ChooseOption"
          component={ChooseOptionScreen}
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
          name="Register"
          component={RegisterScreen}
          options={{ cardStyleInterpolator: fadeTransition }}
        />
      </>
    );
  }
  return (
    <>
      {topSection}
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        {screens}
      </Stack.Navigator>
    </>
  );
};

const mapStateToProps = (state: AppState) => ({
  authInfo: state.user.authInfo,
  currentNotif: state.notif.currentNotif,
});
const Navigator = connect(mapStateToProps)(NavigatorBase);

export default Navigator;
