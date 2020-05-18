import { createBottomTabNavigator } from 'react-navigation-tabs';
import { createAppContainer } from 'react-navigation';

import { HomeScreen } from 'views';

const RootNavigator = createBottomTabNavigator(
  {
    Home: HomeScreen,
  },
  {
    initialRouteName: 'Home',
    animationEnabled: false,
    tabBarOptions: {
      showLabel: false,
      showIcon: false,
      style: { height: 0 },
    },
  }
);

/**
The root navigator that ties everything together
*/
export default createAppContainer(RootNavigator);
