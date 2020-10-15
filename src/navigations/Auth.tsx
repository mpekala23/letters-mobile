import { Screens } from '@utils/Screens';
import {
  BeginScreen,
  LoginScreen,
  TermsScreen,
  PrivacyScreen,
  RegisterCredsScreen,
  RegisterPersonalScreen,
  RegisterAddressScreen,
} from '@views';
import React from 'react';
import { AuthStack } from './Navigators';

const Auth: React.FC = () => {
  return (
    <AuthStack.Navigator
      screenOptions={() => ({
        headerShown: false,
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
