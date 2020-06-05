import React from "react";
import { View } from "react-native";
import { connect } from "react-redux";
import {
  createStackNavigator,
  StackCardInterpolationProps,
  StackCardInterpolatedStyle,
} from "@react-navigation/stack";
import {
  AddManuallyScreen,
  ContactInfoScreen,
  FacilityDirectoryScreen,
  HomeScreen,
  LoginScreen,
  RegisterScreen,
  SplashScreen,
  ReviewContactScreen,
} from "@views";
import { AppState } from "@store/types";
import { AuthInfo } from "@store/User/UserTypes";
import { Topbar } from "@components";
import { NullableFacility } from "types";

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

export type AppStackParamList = {
  AddManually: undefined;
  ContactInfo: undefined;
  FacilityDirectory: { newFacility: NullableFacility } | undefined;
  ReviewContact: undefined;
};

const Stack = createStackNavigator<AuthStackParamList & AppStackParamList>();

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
        name="ReviewContact"
        component={ReviewContactScreen}
        options={{ cardStyleInterpolator: fadeTransition }}
      />
      <Stack.Screen
        name="Home"
        component={HomeScreen}
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
