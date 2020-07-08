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
  LetterPreviewScreen,
  LetterTrackingScreen,
  MemoryLaneScreen,
  LetterDetailsScreen,
  LoginScreen,
  PostcardPreviewScreen,
  ReferFriendsScreen,
  RegisterScreen,
  ReviewContactScreen,
  SingleContactScreen,
  SplashScreen,
  ThanksScreen,
  UpdateContactScreen,
} from '@views';
import { AuthInfo } from '@store/User/UserTypes';
import { navigationRef, navigate } from '@notifications';
import { Notif } from '@store/Notif/NotifTypes';
import { Topbar } from '@components';
import { AppState } from '@store/types';
import { NullableFacility, Letter } from 'types';
import { Contact } from '@store/Contact/ContactTypes';

export { navigationRef, navigate };

export type AuthStackParamList = {
  Splash: undefined;
  Login: undefined;
  Register: undefined;
};

export type AppStackParamList = {
  AddManually: undefined;
  ChooseOption: undefined;
  ComposeLetter: undefined;
  ComposePostcard: undefined;
  ContactInfo: { addFromSelector: boolean } | undefined;
  ContactSelector: undefined;
  ExplainProblem: undefined;
  FacilityDirectory: { newFacility: NullableFacility } | undefined;
  FirstLetter: undefined;
  Home: undefined;
  Issues: undefined;
  LetterPreview: undefined;
  PostcardPreview: undefined;
  LetterDetails: undefined;
  LetterTracking: undefined;
  MemoryLane: undefined;
  ReferFriends: undefined;
  ReviewContact: undefined;
  SingleContact: { contact: Contact; letters?: Letter[] } | undefined;
  Splash: undefined;
  Thanks: undefined;
  UpdateContact: { contactId: number } | undefined;
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
          name="MemoryLane"
          component={MemoryLaneScreen}
          options={{ cardStyleInterpolator: fadeTransition }}
        />
        <Stack.Screen
          name="LetterDetails"
          component={LetterDetailsScreen}
          options={{ cardStyleInterpolator: fadeTransition }}
        />
        <Stack.Screen
          name="ChooseOption"
          component={ChooseOptionScreen}
          options={{ cardStyleInterpolator: fadeTransition }}
        />
        <Stack.Screen
          name="UpdateContact"
          component={UpdateContactScreen}
          options={{ cardStyleInterpolator: fadeTransition }}
        />
      </>
    );
  } else {
    screens = (
      <>
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
