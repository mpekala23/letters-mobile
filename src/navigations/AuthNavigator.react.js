import { createStackNavigator } from 'react-navigation-stack';

import { LoginScreen } from 'views';

const AuthRouteConfigs = {
  Login: LoginScreen,
};

const AuthNavigatorConfig = {
  initialRouteName: 'Login',
  headerMode: 'none',
};

const AuthNavigator = createStackNavigator(AuthRouteConfigs, AuthNavigatorConfig);

export default AuthNavigator;
