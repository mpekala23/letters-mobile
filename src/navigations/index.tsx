import React, { createRef } from "react";
import { View } from "react-native";
import { connect } from "react-redux";
import {
  createStackNavigator,
  StackCardInterpolationProps,
  StackCardInterpolatedStyle,
} from "@react-navigation/stack";
import {
  ExplainProblemScreen,
  FirstLetterScreen,
  HomeScreen,
  IssuesScreen,
  LoginScreen,
  RegisterScreen,
  SplashScreen,
  ThanksScreen,
} from "@views";
import { AppState } from "@store/types";
import { AuthInfo } from "@store/User/UserTypes";
import { Topbar } from "@components";
import { NavigationContainerRef } from "@react-navigation/native";
import { Notif } from "store/Notif/NotifTypes";
import { navigationRef, navigate } from "@notifications";

export { navigationRef, navigate };

export type AuthStackParamList = {
  Splash: undefined;
  Login: undefined;
  Register: undefined;
};

export type AppStackParamList = {
  ExplainProblem: undefined;
  FirstLetter: undefined;
  Home: undefined;
  Issues: undefined;
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

const NavigatorBase: React.FC<Props> = (props) => {
  let topSection = <View />;
  if (!props.authInfo.isLoadingToken) {
    topSection = <Topbar />;
  }
  // Determine which views should be accessible
  const screens = props.authInfo.isLoadingToken ? (
    <Stack.Screen
      name="Splash"
      component={SplashScreen}
      options={{ cardStyleInterpolator: fadeTransition }}
    />
  ) : props.authInfo.isLoggedIn ? (
    <>
      <Stack.Screen
        name="Home"
        component={HomeScreen}
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
    </>
  ) : (
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
  return (
    <>
      {topSection}
      <Stack.Navigator
        initialRouteName={"Home"}
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
