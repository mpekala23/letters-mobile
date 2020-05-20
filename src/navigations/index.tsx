import React from "react";
import { connect } from "react-redux";
import { createStackNavigator } from "@react-navigation/stack";
import { HomeScreen, LoginScreen, SplashScreen } from "@views";
import { AppState } from "@store/types";
import { AuthInfo } from "@store/User/UserTypes";

const Stack = createStackNavigator();

export interface Props {
  authInfo: AuthInfo;
}

export interface InterTranstion {
  current: any;
  next?: any;
  index?: any;
  closing: any;
  layouts: any;
}

const fadeTransition = (data: InterTranstion) => ({
  cardStyle: {
    opacity: data.current.progress,
  },
});

const NavigatorBase: React.FC<Props> = (props) => {
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
    <Stack.Screen
      name="Login"
      component={LoginScreen}
      options={{ cardStyleInterpolator: fadeTransition }}
    />
  );
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      {screens}
    </Stack.Navigator>
  );
};

const mapStateToProps = (state: AppState) => ({
  authInfo: state.user.authInfo,
});
const Navigator = connect(mapStateToProps)(NavigatorBase);

export default Navigator;
