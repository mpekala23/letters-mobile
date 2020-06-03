import React from "react";
import { View } from "react-native";
import { connect } from "react-redux";
import {
  createStackNavigator,
  StackCardInterpolationProps,
  StackCardInterpolatedStyle,
} from "@react-navigation/stack";
import { HomeScreen, LoginScreen, ReferFriendsScreen, RegisterScreen, SplashScreen } from "@views";
import { AppState } from "@store/types";
import { AuthInfo } from "@store/User/UserTypes";
import { Topbar } from "@components";

export type AuthStackParamList = {
  Login: LoginScreen;
  Register: RegisterScreen;
};

const Stack = createStackNavigator();

export interface Props {
  authInfo: AuthInfo;
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
    </>
  ) : (
    <>
      <Stack.Screen
        name="Refer Friends"
        component={ReferFriendsScreen}
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
});
const Navigator = connect(mapStateToProps)(NavigatorBase);

export default Navigator;
