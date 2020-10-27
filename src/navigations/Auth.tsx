import React from 'react';
import { HeaderLeft, HeaderRight, HeaderTitle } from '@components';
import { BAR_HEIGHT } from '@utils/Constants';
import { getDetailsFromRouteName, Screens } from '@utils/Screens';
import {
  BeginScreen,
  LoginScreen,
  TermsScreen,
  PrivacyScreen,
  RegisterCredsScreen,
  RegisterPersonalScreen,
  RegisterAddressScreen,
} from '@views';
import { AuthStack } from './Navigators';
import { leftRightTransition } from './Transitions';

const Auth: React.FC = () => {
  return (
    <AuthStack.Navigator
      screenOptions={({ route }) => ({
        headerShown: getDetailsFromRouteName(route.name).headerVisible,
        headerStyle: { height: BAR_HEIGHT },
        headerTitle: (titleProps) => {
          return (
            <HeaderTitle
              title={
                titleProps.children
                  ? getDetailsFromRouteName(titleProps.children).title
                  : ''
              }
            />
          );
        },
        headerLeft: (leftProps) => (
          <HeaderLeft
            canGoBack={!!leftProps.canGoBack}
            onPress={leftProps.onPress ? leftProps.onPress : () => null}
          />
        ),
        headerRight: () => {
          return <HeaderRight />;
        },
        cardStyleInterpolator: leftRightTransition,
      })}
    >
      <AuthStack.Screen name={Screens.Begin} component={BeginScreen} />
      <AuthStack.Screen name={Screens.Login} component={LoginScreen} />
      <AuthStack.Screen name={Screens.Terms} component={TermsScreen} />
      <AuthStack.Screen name={Screens.Privacy} component={PrivacyScreen} />
      <AuthStack.Screen
        name={Screens.RegisterCreds}
        component={RegisterCredsScreen}
      />
      <AuthStack.Screen
        name={Screens.RegisterPersonal}
        component={RegisterPersonalScreen}
      />
      <AuthStack.Screen
        name={Screens.RegisterAddress}
        component={RegisterAddressScreen}
      />
    </AuthStack.Navigator>
  );
};

export default Auth;
