import React from 'react';
import { connect } from 'react-redux';
import {
  createStackNavigator,
  StackCardInterpolationProps,
  StackCardInterpolatedStyle,
  StackHeaderProps,
} from '@react-navigation/stack';
import {
  AddManuallyScreen,
  ChooseOptionScreen,
  ContactInfoScreen,
  ContactSelectorScreen,
  ExplainProblemScreen,
  FirstLetterScreen,
  FacilityDirectoryScreen,
  HomeScreen,
  IssuesScreen,
  LetterTrackingScreen,
  MemoryLaneScreen,
  LetterDetailsScreen,
  LoginScreen,
  ReferFriendsScreen,
  RegisterScreen,
  ReviewContactScreen,
  SingleContactScreen,
  SplashScreen,
  ThanksScreen,
  UpdateContactScreen,
} from '@views';
import { AppState } from '@store/types';
import { AuthInfo } from '@store/User/UserTypes';
import { navigationRef, navigate } from '@notifications';
import { Notif } from 'store/Notif/NotifTypes';
import { NullableFacility, Letter } from 'types';
import { Topbar } from '@components';
import { Contact } from '@store/Contact/ContactTypes';
import { NavigationContainer } from '@react-navigation/native';

export { navigationRef, navigate };

export type AuthStackParamList = {
  Splash: undefined;
  Login: undefined;
  Register: undefined;
};

export type TopbarRouteAction = {
  enabled: boolean;
  text: string;
  action: () => void;
};

export type AppStackParamList = {
  AddManually: undefined;
  ChooseOption: undefined;
  ContactInfo: { addFromSelector: boolean } | undefined;
  ContactSelector: undefined;
  ExplainProblem: undefined;
  FacilityDirectory: { newFacility: NullableFacility } | undefined;
  FirstLetter: undefined;
  Home: { topbar: TopbarRouteAction };
  Issues: undefined;
  LetterDetails: undefined;
  LetterTracking: undefined;
  MemoryLane: undefined;
  ReferFriends: undefined;
  ReviewContact: undefined;
  SingleContact: { contact: Contact; letters?: Letter[] } | undefined;
  Splash: undefined;
  Thanks: undefined;
  UpdateContact: { contactId: number; topbar: TopbarRouteAction } | undefined;
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
          options={{
            cardStyleInterpolator: fadeTransition,
            header: (screenProps) => {
              return (
                <Topbar
                  label="Home"
                  profile
                  backEnabled={screenProps.navigation.canGoBack()}
                  back={screenProps.navigation.goBack}
                />
              );
            },
          }}
        />
        <Stack.Screen
          name="ContactInfo"
          component={ContactInfoScreen}
          options={{
            cardStyleInterpolator: fadeTransition,
            header: (screenProps) => {
              return (
                <Topbar
                  label=""
                  profile={false}
                  backEnabled={screenProps.navigation.canGoBack()}
                  back={screenProps.navigation.goBack}
                />
              );
            },
          }}
        />
        <Stack.Screen
          name="FacilityDirectory"
          component={FacilityDirectoryScreen}
          options={{
            cardStyleInterpolator: fadeTransition,
            header: (screenProps) => {
              return (
                <Topbar
                  label=""
                  profile={false}
                  backEnabled={screenProps.navigation.canGoBack()}
                  back={screenProps.navigation.goBack}
                />
              );
            },
          }}
        />
        <Stack.Screen
          name="AddManually"
          component={AddManuallyScreen}
          options={{
            cardStyleInterpolator: fadeTransition,
            header: (screenProps) => {
              return (
                <Topbar
                  label=""
                  profile={false}
                  backEnabled={screenProps.navigation.canGoBack()}
                  back={screenProps.navigation.goBack}
                />
              );
            },
          }}
        />
        <Stack.Screen
          name="ReferFriends"
          component={ReferFriendsScreen}
          options={{
            cardStyleInterpolator: fadeTransition,
            header: (screenProps) => {
              return (
                <Topbar
                  label=""
                  profile={false}
                  backEnabled={screenProps.navigation.canGoBack()}
                  back={screenProps.navigation.goBack}
                />
              );
            },
          }}
        />
        <Stack.Screen
          name="ReviewContact"
          component={ReviewContactScreen}
          options={{
            cardStyleInterpolator: fadeTransition,
            header: (screenProps) => {
              return (
                <Topbar
                  label=""
                  profile={false}
                  backEnabled={screenProps.navigation.canGoBack()}
                  back={screenProps.navigation.goBack}
                />
              );
            },
          }}
        />
        <Stack.Screen
          name="ExplainProblem"
          component={ExplainProblemScreen}
          options={{
            cardStyleInterpolator: fadeTransition,
            header: (screenProps) => {
              return (
                <Topbar
                  label=""
                  profile={false}
                  backEnabled={screenProps.navigation.canGoBack()}
                  back={screenProps.navigation.goBack}
                />
              );
            },
          }}
        />
        <Stack.Screen
          name="FirstLetter"
          component={FirstLetterScreen}
          options={{
            cardStyleInterpolator: fadeTransition,
            header: (screenProps) => {
              return (
                <Topbar
                  label=""
                  profile={false}
                  backEnabled={screenProps.navigation.canGoBack()}
                  back={screenProps.navigation.goBack}
                />
              );
            },
          }}
        />
        <Stack.Screen
          name="Issues"
          component={IssuesScreen}
          options={{
            cardStyleInterpolator: fadeTransition,
            header: (screenProps) => {
              return (
                <Topbar
                  label=""
                  profile={false}
                  backEnabled={screenProps.navigation.canGoBack()}
                  back={screenProps.navigation.goBack}
                />
              );
            },
          }}
        />
        <Stack.Screen
          name="Thanks"
          component={ThanksScreen}
          options={{
            cardStyleInterpolator: fadeTransition,
            header: (screenProps) => {
              return (
                <Topbar
                  label=""
                  profile={false}
                  backEnabled={screenProps.navigation.canGoBack()}
                  back={screenProps.navigation.goBack}
                />
              );
            },
          }}
        />
        <Stack.Screen
          name="ContactSelector"
          component={ContactSelectorScreen}
          options={{
            cardStyleInterpolator: fadeTransition,
            header: (screenProps) => {
              return (
                <Topbar
                  label=""
                  profile
                  backEnabled={screenProps.navigation.canGoBack()}
                  back={screenProps.navigation.goBack}
                />
              );
            },
          }}
        />
        <Stack.Screen
          name="SingleContact"
          component={SingleContactScreen}
          options={{
            cardStyleInterpolator: fadeTransition,
            header: (screenProps) => {
              return (
                <Topbar
                  label="Home"
                  profile
                  backEnabled={screenProps.navigation.canGoBack()}
                  back={screenProps.navigation.goBack}
                />
              );
            },
          }}
        />
        <Stack.Screen
          name="LetterTracking"
          component={LetterTrackingScreen}
          options={{
            cardStyleInterpolator: fadeTransition,
            header: (screenProps) => {
              return (
                <Topbar
                  label="Tracking"
                  profile
                  backEnabled={screenProps.navigation.canGoBack()}
                  back={screenProps.navigation.goBack}
                />
              );
            },
          }}
        />
        <Stack.Screen
          name="MemoryLane"
          component={MemoryLaneScreen}
          options={{
            cardStyleInterpolator: fadeTransition,
            header: (screenProps) => {
              return (
                <Topbar
                  label="Memory Lane"
                  profile
                  backEnabled={screenProps.navigation.canGoBack()}
                  back={screenProps.navigation.goBack}
                />
              );
            },
          }}
        />
        <Stack.Screen
          name="LetterDetails"
          component={LetterDetailsScreen}
          options={{
            cardStyleInterpolator: fadeTransition,
            header: (screenProps) => {
              return (
                <Topbar
                  label="Home"
                  profile={false}
                  backEnabled={screenProps.navigation.canGoBack()}
                  back={screenProps.navigation.goBack}
                />
              );
            },
          }}
        />
        <Stack.Screen
          name="ChooseOption"
          component={ChooseOptionScreen}
          options={{
            cardStyleInterpolator: fadeTransition,
            header: (screenProps) => {
              return (
                <Topbar
                  label="Compose"
                  profile
                  backEnabled={screenProps.navigation.canGoBack()}
                  back={screenProps.navigation.goBack}
                />
              );
            },
          }}
        />
        <Stack.Screen
          name="UpdateContact"
          component={UpdateContactScreen}
          options={{
            cardStyleInterpolator: fadeTransition,
            header: (screenProps: StackHeaderProps) => {
              const params = screenProps.scene.route.params as {
                topbar: TopbarRouteAction;
              };
              return (
                <Topbar
                  label="Profile"
                  profile={false}
                  profileOverride={params ? params.topbar : undefined}
                  backEnabled={screenProps.navigation.canGoBack()}
                  back={screenProps.navigation.goBack}
                />
              );
            },
          }}
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
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator
        screenOptions={{
          headerShown: true,
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
});
const Navigator = connect(mapStateToProps)(NavigatorBase);

export default Navigator;
