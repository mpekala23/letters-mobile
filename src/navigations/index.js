import { createStackNavigator } from 'react-navigation-stack';
import { createAppContainer } from 'react-navigation';

import AppNavigator from './AppNavigator.react';
import AuthNavigator from './AuthNavigator.react';

const RootNavigator = createStackNavigator(
  {
    App: AppNavigator,
    Auth: AuthNavigator,
  },
  {
    initialRouteName: 'Auth',
    animationEnabled: false,
    tabBarOptions: {
      showLabel: false,
      showIcon: false,
      style: { height: 0 },
    },
  }
);

export default createAppContainer(RootNavigator);
