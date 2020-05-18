import { createStackNavigator } from 'react-navigation-stack';

import { HomeScreen } from 'views';

const AppRouteConfigs = {
  Home: HomeScreen,
};

const AppNavigatorConfig = {
  initialRouteName: 'Home',
  headerMode: 'none',
};

const AppNavigator = createStackNavigator(AppRouteConfigs, AppNavigatorConfig);

export default AppNavigator;
